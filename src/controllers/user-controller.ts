import { Request, Response } from "express";
import User, { UserTypes } from "../models/user-model";
import { STATUS_CODE } from "../constants/status-codes";
import ServerErrorResponse from "../utils/classes/server-error-response";
import { ERROR_MESSAGES } from "../constants/error-messages";
import ServerSuccessResponse from "../utils/classes/server-success-response";
import { STATUS_MESSAGES } from "../constants/status-messages";
import { SUCCESS_MESSAGES } from "../constants/success-messages";

declare global {
  namespace Express {
    interface Request {
      user?: UserTypes;
    }
  }
}

const getMyProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUser = req.user;
    const userId = currentUser?._id;

    const user = await User.findById(userId).select(
      "-password -friendRequestsReceived -friendRequestsSent -posts -savedPosts"
    );

    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.USER_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          user
        )
      );
  } catch (error) {
    res
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

const getUserProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "-password -friendRequestsReceived -friendRequestsSent -posts -savedPosts"
    );

    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.USER_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          user
        )
      );
  } catch (error) {
    res
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

const getMyAllSentFriendRequests = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const currentUser = req.user;

    const user = await User.findById(currentUser?._id).populate(
      "friendRequestsSent",
      "_id firstName lastName emailAddress profilePicture gender"
    );
    const mySentfrientRequests = user?.friendRequestsSent;

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          mySentfrientRequests
        )
      );
  } catch (error) {
    res.status(STATUS_CODE.SERVER_ERROR).json(
      ServerErrorResponse.customErrorWithStackTrace(
        STATUS_CODE.SERVER_ERROR,
        STATUS_MESSAGES.SERVER_ERROR,
        {
          errors: error,
        }
      )
    );
  }
};

const getMyAllReceivedFriendRequests = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const currentUser = req.user;

    const user = await User.findById(currentUser?._id).populate(
      "friendRequestsReceived",
      "_id firstName lastName emailAddress profilePicture gender"
    );
    const mySentfrientRequests = user?.friendRequestsReceived;

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          mySentfrientRequests
        )
      );
  } catch (error) {
    res.status(STATUS_CODE.SERVER_ERROR).json(
      ServerErrorResponse.customErrorWithStackTrace(
        STATUS_CODE.SERVER_ERROR,
        STATUS_MESSAGES.SERVER_ERROR,
        {
          errors: error,
        }
      )
    );
  }
};

const getMyAllFriends = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUser = req.user;

    const user = await User.findById(currentUser?._id).populate(
      "friends",
      "_id firstName lastName emailAddress profilePicture gender"
    );
    const mySentfrientRequests = user?.friends;

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          mySentfrientRequests
        )
      );
  } catch (error) {
    res.status(STATUS_CODE.SERVER_ERROR).json(
      ServerErrorResponse.customErrorWithStackTrace(
        STATUS_CODE.SERVER_ERROR,
        STATUS_MESSAGES.SERVER_ERROR,
        {
          errors: error,
        }
      )
    );
  }
};

const getAllFriends = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate(
      "friends",
      "_id firstName lastName emailAddress profilePicture gender"
    );

    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.USER_NOT_FOUND));
    }

    const mySentfrientRequests = user?.friends;

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          mySentfrientRequests
        )
      );
  } catch (error) {
    res.status(STATUS_CODE.SERVER_ERROR).json(
      ServerErrorResponse.customErrorWithStackTrace(
        STATUS_CODE.SERVER_ERROR,
        STATUS_MESSAGES.SERVER_ERROR,
        {
          errors: error,
        }
      )
    );
  }
};

export {
  getMyProfile,
  getUserProfile,
  getMyAllSentFriendRequests,
  getMyAllReceivedFriendRequests,
  getAllFriends,
  getMyAllFriends,
};
