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

const getAllPosts = async (req: Request, res: Response): Promise<any> => {
  const user = req.user;
  const CACHE_KEY = `KEY : ${REDIS_KEYS.POSTS_LIST} - USER : ${user?._id}`;

  try {
    // 1. Try getting posts from Redis List
    const listLength = await redisClient.lLen(CACHE_KEY);

    if (listLength > 0) {
      const cachedPosts = await redisClient.lRange(CACHE_KEY, 0, -1); // get all list items
      const posts = cachedPosts.map((postString) => JSON.parse(postString));
      //  const posts = cachedPosts.map((postString) => JSON.parse(postString)).reverse();

      return res
        .status(STATUS_CODE.OK)
        .json(
          ServerSuccessResponse.successResponse(
            true,
            STATUS_MESSAGES.SUCCESS,
            STATUS_CODE.OK,
            SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
            posts
          )
        );
    }

    // 2. If not in Redis, fetch from MongoDB
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .select(
        "description feeling location locationCoords files isEdited postStatus noOfReacts noOfComments noOfShares noOfReports noOfBookmarks sharedPost sharedBy createdAt updatedAt"
      )
      .populate("user", [
        "firstName",
        "lastName",
        "emailAddress",
        "profilePicture",
        "isEmailVerified",
        "isPhoneVerified",
      ]);

    // 3. Save to Redis List and set TTL
    const postList = posts.map((post) => JSON.stringify(post));
    if (postList.length > 0) {
      await redisClient.del(CACHE_KEY); // Clear old key
      await redisClient.rPush(CACHE_KEY, postList); // Add all posts to Redis list
      await redisClient.expire(CACHE_KEY, 3600); // TTL of 1 hour
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          posts
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

const getSinglePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (post) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.POST_NOT_FOUND));
    }

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

    const post = await Post.findById(id);
    if (post) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.POST_NOT_FOUND));
    }

    const channel = getChannel();

    if (channel) {
      const msg = JSON.stringify({
        userId,
        postId: id,
      });

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

export {
  addPost,
  getAllPosts,
  searchPostLocation,
  getSinglePost,
  reactOrDisreactPost,
};
