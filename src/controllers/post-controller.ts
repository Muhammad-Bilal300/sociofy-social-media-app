import { Request, Response } from "express";
import { STATUS_CODE } from "../constants/status-codes";
import ServerErrorResponse from "../utils/classes/server-error-response";
import { STATUS_MESSAGES } from "../constants/status-messages";
import { UserTypes } from "../models/user-model";
import { ERROR_MESSAGES } from "../constants/error-messages";
import Post from "../models/post-model";
import ServerSuccessResponse from "../utils/classes/server-success-response";
import { SUCCESS_MESSAGES } from "../constants/success-messages";
import { getFileFormat } from "../utils/basic";
import { REDIS_KEYS } from "../constants/basic";
import redisClient from "../config/redis-client";
import { getChannel } from "../config/rabbit-mq";
import { missingFieldError } from "../utils/missing-field-error";
import { typeMismatchError } from "../utils/type-mismatch-error";

declare global {
  namespace Express {
    interface Request {
      user?: UserTypes;
    }
  }
}

const addPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUser = req.user;
    const userId = currentUser?._id;

    const { description, postStatus, feeling, location, locationCoords } =
      req.body;
    const files = req.files as
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    let filesArray: { url: string; format: string }[] = [];

    // Process the images
    if ((!files || files.length == 0) && (!description || description == "")) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.FAILED,
            STATUS_CODE.BAD_REQUEST,
            ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS_IN_POST,
            null
          )
        );
    }

    if (Array.isArray(files)) {
      filesArray = files.map((file) => ({
        url: `/uploads/files/${file.filename}`,
        format: getFileFormat(file.originalname),
      }));
    } else if (files && typeof files === "object") {
      // If it's a dictionary (e.g., from `upload.fields()`), flatten all file arrays
      for (const fieldName in files) {
        filesArray.push(
          ...files[fieldName].map((file) => ({
            url: `/uploads/files/${file.filename}`,
            format: getFileFormat(file.originalname),
          }))
        );
      }
    }

    // Create post object
    const post = new Post({
      description,
      postStatus,
      feeling,
      location,
      locationCoords,
      files: filesArray,
      user: userId, // Assuming you want to associate the post with the user
    });

    // Save post to database
    const savedPost = await post.save();

    const channel = getChannel();

    if (channel) {
      const msg = JSON.stringify({
        userId,
        postId: savedPost._id,
      });

      await channel.assertQueue("post_created");
      channel.sendToQueue("post_created", Buffer.from(msg));
    }

    // Return success response
    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.CREATED,
          SUCCESS_MESSAGES.CREATED,
          savedPost
        )
      );
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error
        )
      );
  }
};

const searchPostLocation = async (
  req: Request,
  res: Response
): Promise<any> => {
  const user = req.user;
  const CACHE_KEY = `KEY : ${REDIS_KEYS.POSTS_LIST} - USER : ${user?._id}`;

  try {
    // 1. Try getting posts from Redis List
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter `q`." });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();
    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          data
        )
      );
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error
        )
      );
  }
};

const getAllPosts = async (req: Request, res: Response): Promise<any> => {
  const user = req.user;
  const userId = user?._id;

  // ✅ Get page & limit from query params with defaults
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);

  const CACHE_KEY = `KEY : ${REDIS_KEYS.POSTS_LIST} - USER : ${userId}`;

  try {
    // 1. Try getting posts from Redis List
    const listLength = await redisClient.lLen(CACHE_KEY);

    if (listLength > 0) {
      const cachedPosts = await redisClient.lRange(CACHE_KEY, 0, -1);
      const posts = cachedPosts.map((postString) => JSON.parse(postString));

      const data = {
        page,
        limit,
        total: listLength,
        posts,
      };

      return res
        .status(STATUS_CODE.OK)
        .json(
          ServerSuccessResponse.successResponse(
            true,
            STATUS_MESSAGES.SUCCESS,
            STATUS_CODE.OK,
            SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
            data
          )
        );
    }

    // 2. If not in Redis, fetch from MongoDB
    let posts = await Post.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .select(
        "description files isEdited postStatus noOfReacts noOfComments noOfShares noOfReports noOfBookmarks reactedUsers bookmarkedUsers reportedUsers sharedUsers createdAt updatedAt"
      )
      .populate("user", [
        "firstName",
        "lastName",
        "emailAddress",
        "profilePicture",
        "isEmailVerified",
        "isPhoneVerified",
      ])
      .lean(); // use lean for plain JS objects

    // 3. Filter the arrays for each post
    if (userId) {
      posts = posts.map((post) => ({
        ...post,
        reactedUsers:
          post.reactedUsers?.filter(
            (reaction) => reaction.user?.toString() === userId?.toString()
          ) || [],
        bookmarkedUsers:
          post.bookmarkedUsers?.filter(
            (id) => id?.toString() === userId?.toString()
          ) || [],
        reportedUsers:
          post.reportedUsers?.filter(
            (id) => id?.toString() === userId?.toString()
          ) || [],
        sharedUsers:
          post.sharedUsers?.filter(
            (id) => id?.toString() === userId?.toString()
          ) || [],
      }));
    } else {
      // If no user, empty out those arrays
      posts = posts.map((post) => ({
        ...post,
        reactedUsers: [],
        bookmarkedUsers: [],
        reportedUsers: [],
        sharedUsers: [],
      }));
    }

    // 4. Save to Redis List and set TTL
    const postList = posts.map((post) => JSON.stringify(post));
    if (postList.length > 0) {
      await redisClient.del(CACHE_KEY);
      await redisClient.rPush(CACHE_KEY, postList);
      await redisClient.expire(CACHE_KEY, 3600);
    }

    const data = {
      page,
      limit,
      total: await Post.countDocuments({}),
      posts,
    };

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          data
        )
      );
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error
        )
      );
  }
};

const getSinglePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const user = req.user;
    const userId = user?._id;

    const CACHE_KEY = `KEY : ${REDIS_KEYS.SINGLE_POST_DETAILS} - USER : ${userId} - POST : ${id}`;

    // 1. Check Redis Cache
    const cachedData = await redisClient.get(CACHE_KEY);
    if (cachedData) {
      const post = JSON.parse(cachedData);
      return res
        .status(STATUS_CODE.OK)
        .json(
          ServerSuccessResponse.successResponse(
            true,
            STATUS_MESSAGES.SUCCESS,
            STATUS_CODE.OK,
            SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
            post
          )
        );
    }

    // 2. If not in cache, fetch from DB
    let post: any = await Post.findById(id)
      .select(
        "description files isEdited postStatus noOfReacts noOfComments noOfShares noOfReports noOfBookmarks reactedUsers bookmarkedUsers reportedUsers sharedUsers createdAt updatedAt"
      )
      .populate("user", [
        "firstName",
        "lastName",
        "emailAddress",
        "profilePicture",
        "isEmailVerified",
        "isPhoneVerified",
      ])
      .lean();

    if (!post) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.POST_NOT_FOUND));
    }

    // 3. Filter arrays for the logged-in user
    if (userId) {
      post.reactedUsers =
        post.reactedUsers?.filter(
          (reaction: any) => reaction.user?.toString() === userId?.toString()
        ) || [];
      post.bookmarkedUsers =
        post.bookmarkedUsers?.filter(
          (id: any) => id?.toString() === userId?.toString()
        ) || [];
      post.reportedUsers =
        post.reportedUsers?.filter(
          (id: any) => id?.toString() === userId?.toString()
        ) || [];
      post.sharedUsers =
        post.sharedUsers?.filter(
          (id: any) => id?.toString() === userId?.toString()
        ) || [];
    } else {
      post.reactedUsers = [];
      post.bookmarkedUsers = [];
      post.reportedUsers = [];
      post.sharedUsers = [];
    }

    // 4. Save to Redis for 1 hour
    await redisClient.setEx(CACHE_KEY, 3600, JSON.stringify(post));

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          post
        )
      );
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error
        )
      );
  }
};

const reactOrDisreactPost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const currentUser = req.user;
    const userId = currentUser?._id;
    const { id } = req.params;
    const { isReacted, type } = req.body;

    const requiredFields = [
      { field: "isReacted", type: "boolean" as const },
      { field: "type", type: "string" as const },
    ];

    const missingError = missingFieldError(requiredFields, req.body);
    if (missingError) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(missingError));
    }

    const typeError = typeMismatchError(requiredFields, req.body);
    if (typeError) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(typeError));
    }

    const CACHE_KEY = `KEY : ${REDIS_KEYS.POSTS_LIST} - USER : ${userId}`;
    const listLength = await redisClient.lLen(CACHE_KEY);

    if (listLength > 0) {
      const cachedPosts = await redisClient.lRange(CACHE_KEY, 0, -1);
      const index = cachedPosts.findIndex(
        (p) => JSON.parse(p)._id.toString() === id.toString()
      );

      if (index !== -1) {
        let postObj = JSON.parse(cachedPosts[index]);

        const existingReactionIndex = postObj.reactedUsers?.findIndex(
          (r: any) => r.user.toString() === userId?.toString()
        );

        if (isReacted) {
          if (existingReactionIndex === -1) {
            // Add new reaction
            postObj.noOfReacts = (postObj.noOfReacts || 0) + 1;
            postObj.reactedUsers.push({ user: userId, type });
          } else {
            // Update reaction type if different
            if (postObj.reactedUsers[existingReactionIndex].type !== type) {
              postObj.reactedUsers[existingReactionIndex].type = type;
            }
          }
        } else {
          // Remove reaction if exists
          if (existingReactionIndex !== -1) {
            postObj.noOfReacts = Math.max((postObj.noOfReacts || 0) - 1, 0);
            postObj.reactedUsers.splice(existingReactionIndex, 1);
          }
        }

        await redisClient.lSet(CACHE_KEY, index, JSON.stringify(postObj));
      }
    }

    // Publish to RabbitMQ
    const channel = getChannel();
    if (channel) {
      const msg = JSON.stringify({ userId, postId: id, isReacted, type });
      await channel.assertQueue("post_reacted");
      channel.sendToQueue("post_reacted", Buffer.from(msg));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          null
        )
      );
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error
        )
      );
  }
};

// const reactOrDisreactPost = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const currentUser = req.user;
//     const userId = currentUser?._id;

//     const { id } = req.params;

//     const { isReacted, type } = req.body;

//     const requiredFields = [
//       { field: "isReacted", type: "boolean" as const },
//       { field: "type", type: "string" as const },
//     ];

//     const missingError = missingFieldError(requiredFields, req.body);
//     if (missingError) {
//       return res
//         .status(STATUS_CODE.BAD_REQUEST)
//         .json(ServerErrorResponse.badRequest(missingError));
//     }

//     const typeError = typeMismatchError(requiredFields, req.body);
//     if (typeError) {
//       return res
//         .status(STATUS_CODE.BAD_REQUEST)
//         .json(ServerErrorResponse.badRequest(typeError));
//     }

//     // --- Redis Update ---
//     const CACHE_KEY = `KEY : ${REDIS_KEYS.POSTS_LIST} - USER : ${userId}`;
//     const listLength = await redisClient.lLen(CACHE_KEY);

//     if (listLength > 0) {
//       const cachedPosts = await redisClient.lRange(CACHE_KEY, 0, -1);

//       // Find index of the post in the list
//       const index = cachedPosts.findIndex((p) => {
//         const parsed = JSON.parse(p);
//         return parsed._id.toString() === id.toString();
//       });

//       if (index !== -1) {
//         let postObj = JSON.parse(cachedPosts[index]);

//         // Adjust reactions count safely
//         postObj.noOfReacts = (postObj.noOfReacts || 0) + (isReacted ? 1 : -1);
//         if (postObj.noOfReacts < 0) postObj.noOfReacts = 0; // safety

//         // Update reactedUsers array in cache
//         if (isReacted) {
//           const alreadyReacted = postObj.reactedUsers?.some(
//             (r: any) => r.user.toString() === userId?.toString()
//           );
//           if (!alreadyReacted) {
//             postObj.reactedUsers.push({ user: userId, type });
//           }
//           if (alreadyReacted && alreadyReacted.type !== type) {
//             postObj.reactedUsers.push({ user: userId, type });
//           }
//         } else {
//           postObj.reactedUsers = postObj.reactedUsers.filter(
//             (r: any) => r.user.toString() !== userId?.toString()
//           );
//         }

//         // Replace in Redis list
//         await redisClient.lSet(CACHE_KEY, index, JSON.stringify(postObj));
//       }
//     }

//     const channel = getChannel();

//     if (channel) {
//       const msg = JSON.stringify({
//         userId,
//         postId: id,
//         isReacted,
//         type,
//       });

//       await channel.assertQueue("post_reacted");
//       channel.sendToQueue("post_reacted", Buffer.from(msg));
//     }

//     return res
//       .status(STATUS_CODE.OK)
//       .json(
//         ServerSuccessResponse.successResponse(
//           true,
//           STATUS_MESSAGES.SUCCESS,
//           STATUS_CODE.OK,
//           SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
//           null
//         )
//       );
//   } catch (error) {
//     return res
//       .status(STATUS_CODE.SERVER_ERROR)
//       .json(
//         ServerErrorResponse.customErrorWithStackTrace(
//           STATUS_CODE.SERVER_ERROR,
//           STATUS_MESSAGES.SERVER_ERROR,
//           error
//         )
//       );
//   }
// };

const saveOrUnsavePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUser = req.user;
    const userId = currentUser?._id;
    const { isBookmarked } = req.body;
    const { id } = req.params;

    const requiredFields = [
      { field: "isBookmarked", type: "boolean" as const },
    ];

    const missingError = missingFieldError(requiredFields, req.body);
    if (missingError) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(missingError));
    }

    const typeError = typeMismatchError(requiredFields, req.body);
    if (typeError) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(typeError));
    }

    // --- Redis Update ---
    const CACHE_KEY = `KEY : ${REDIS_KEYS.POSTS_LIST} - USER : ${userId}`;
    const listLength = await redisClient.lLen(CACHE_KEY);

    if (listLength > 0) {
      const cachedPosts = await redisClient.lRange(CACHE_KEY, 0, -1);

      // Find index of the post in the list
      const index = cachedPosts.findIndex((p) => {
        const parsed = JSON.parse(p);
        return parsed._id.toString() === id.toString();
      });

      if (index !== -1) {
        let postObj = JSON.parse(cachedPosts[index]);

        // Adjust reactions count safely
        postObj.noOfBookmarks =
          (postObj.noOfBookmarks || 0) + (isBookmarked ? 1 : -1);
        if (postObj.noOfBookmarks < 0) postObj.noOfBookmarks = 0; // safety

        // Update bookmarkedUsers array in cache
        if (isBookmarked) {
          const alreadyBookmarked = postObj.bookmarkedUsers?.some(
            (bookmarked: any) => bookmarked.toString() === userId?.toString()
          );
          if (!alreadyBookmarked) {
            postObj.bookmarkedUsers.push(userId);
          }
        } else {
          postObj.bookmarkedUsers = postObj.bookmarkedUsers.filter(
            (bookmarked: any) => bookmarked.toString() !== userId?.toString()
          );
        }

        // Replace in Redis list
        await redisClient.lSet(CACHE_KEY, index, JSON.stringify(postObj));
      }
    }

    const channel = getChannel();

    if (channel) {
      const msg = JSON.stringify({
        userId,
        postId: id,
        isBookmarked,
      });

      await channel.assertQueue("post_bookmarked");
      channel.sendToQueue("post_bookmarked", Buffer.from(msg));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          null
        )
      );
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error
        )
      );
  }
};

const reportOrUnReportPost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const currentUser = req.user;
    const userId = currentUser?._id;

    const { id } = req.params;

    const { isReported } = req.body;

    const requiredFields = [{ field: "isReported", type: "boolean" as const }];

    const missingError = missingFieldError(requiredFields, req.body);
    if (missingError) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(missingError));
    }

    const typeError = typeMismatchError(requiredFields, req.body);
    if (typeError) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(typeError));
    }

    // --- Redis Update ---
    const CACHE_KEY = `KEY : ${REDIS_KEYS.POSTS_LIST} - USER : ${userId}`;
    const listLength = await redisClient.lLen(CACHE_KEY);

    if (listLength > 0) {
      const cachedPosts = await redisClient.lRange(CACHE_KEY, 0, -1);

      // Find index of the post in the list
      const index = cachedPosts.findIndex((p) => {
        const parsed = JSON.parse(p);
        return parsed._id.toString() === id.toString();
      });

      if (index !== -1) {
        let postObj = JSON.parse(cachedPosts[index]);

        // Adjust reactions count safely
        postObj.noOfReports =
          (postObj.noOfReports || 0) + (isReported ? 1 : -1);
        if (postObj.noOfReports < 0) postObj.noOfReports = 0; // safety

        // Update bookmarkedUsers array in cache
        if (isReported) {
          const alreadyReported = postObj.reportedUsers?.some(
            (reported: any) => reported.toString() === userId?.toString()
          );
          if (!alreadyReported) {
            postObj.reportedUsers.push(userId);
          }
        } else {
          postObj.reportedUsers = postObj.reportedUsers.filter(
            (reported: any) => reported.toString() !== userId?.toString()
          );
        }

        // Replace in Redis list
        await redisClient.lSet(CACHE_KEY, index, JSON.stringify(postObj));
      }
    }

    const channel = getChannel();

    if (channel) {
      const msg = JSON.stringify({
        userId,
        postId: id,
        isReported,
      });

      await channel.assertQueue("post_reported");
      channel.sendToQueue("post_reported", Buffer.from(msg));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          null
        )
      );
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error
        )
      );
  }
};

const deletePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUser = req.user;
    const userId = currentUser?._id;

    const { id } = req.params;

    const CACHE_KEY = `KEY : ${REDIS_KEYS.POSTS_LIST} - USER : ${userId}`;
    const listLength = await redisClient.lLen(CACHE_KEY);

    if (listLength > 0) {
      const cachedPosts = await redisClient.lRange(CACHE_KEY, 0, -1);

      // Find the exact serialized post string in the list
      const postToRemove = cachedPosts.find((p) => {
        const parsed = JSON.parse(p);
        return parsed._id.toString() === id.toString();
      });

      if (postToRemove) {
        // Remove from Redis list
        await redisClient.lRem(CACHE_KEY, 1, postToRemove);
      }
    }

    // Notify via RabbitMQ
    const channel = getChannel();
    if (channel) {
      const msg = JSON.stringify({
        userId,
        postId: id,
      });

      await channel.assertQueue("post_deleted");
      channel.sendToQueue("post_deleted", Buffer.from(msg));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          null
        )
      );
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error
        )
      );
  }
};

export {
  addPost,
  getAllPosts,
  searchPostLocation,
  getSinglePost,
  reactOrDisreactPost,
  saveOrUnsavePost,
  reportOrUnReportPost,
  deletePost,
};
