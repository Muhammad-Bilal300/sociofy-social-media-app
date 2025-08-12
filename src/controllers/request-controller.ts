import { Request, Response } from "express";
import { STATUS_CODE } from "../constants/status-codes";
import ServerErrorResponse from "../utils/classes/server-error-response";
import { STATUS_MESSAGES } from "../constants/status-messages";
import User from "../models/user-model";
import { ERROR_MESSAGES } from "../constants/error-messages";
import ServerSuccessResponse from "../utils/classes/server-success-response";
import { SUCCESS_MESSAGES } from "../constants/success-messages";

const sendFriendRequest = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUser = req.user;
    const { userId } = req.params;

    // Check if user exists (only 1 DB call)
    const user = await User.findById(userId).select("_id");
    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.FAILED,
            STATUS_CODE.NOT_FOUND,
            ERROR_MESSAGES.USER_NOT_FOUND,
            null
          )
        );
    }

    // Run updates in parallel
    await Promise.all([
      User.findByIdAndUpdate(
        currentUser?._id,
        { $push: { friendRequestsSent: userId } },
        { new: false }
      ),
      User.findByIdAndUpdate(
        userId,
        { $push: { friendRequestsReceived: currentUser?._id } },
        { new: false }
      ),
    ]);
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

const cancelFriendRequest = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const currentUser = req.user;
    const { userId } = req.params;

    // Check if user exists (only 1 DB call)
    const user = await User.findById(userId).select("_id");
    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.FAILED,
            STATUS_CODE.NOT_FOUND,
            ERROR_MESSAGES.USER_NOT_FOUND,
            null
          )
        );
    }

    // Run updates in parallel
    await Promise.all([
      User.findByIdAndUpdate(
        currentUser?._id,
        { $pull: { friendRequestsSent: userId } },
        { new: true } // This returns the updated document
      ),
      User.findByIdAndUpdate(
        userId,
        { $pull: { friendRequestsReceived: currentUser?._id } },
        { new: true } // This returns the updated document
      ),
    ]);

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

const acceptFriendRequest = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const currentUser = req.user;
    const { userId } = req.params;

    // Check if user exists (only 1 DB call)
    const user = await User.findById(userId).select("_id");
    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.FAILED,
            STATUS_CODE.NOT_FOUND,
            ERROR_MESSAGES.USER_NOT_FOUND,
            null
          )
        );
    }

    // Run updates in parallel
    await Promise.all([
      User.findByIdAndUpdate(
        currentUser?._id,
        {
          $pull: { friendRequestsReceived: userId },
        },
        { new: true } // This returns the updated document
      ),
      User.findByIdAndUpdate(
        userId,
        {
          $pull: { friendRequestsSent: currentUser?._id },
        },
        { new: true } // This returns the updated document
      ),

      User.findByIdAndUpdate(
        currentUser?._id,
        {
          $push: { friends: userId },
        },
        { new: true } // This returns the updated document
      ),
    ]);

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

const declineFriendRequest = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const currentUser = req.user;
    const { userId } = req.params;

    // Check if user exists (only 1 DB call)
    const user = await User.findById(userId).select("_id");
    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.FAILED,
            STATUS_CODE.NOT_FOUND,
            ERROR_MESSAGES.USER_NOT_FOUND,
            null
          )
        );
    }

    // Run updates in parallel
    await Promise.all([
      User.findByIdAndUpdate(
        currentUser?._id,
        {
          $pull: { friendRequestsReceived: userId },
        },
        { new: true } // This returns the updated document
      ),

      User.findByIdAndUpdate(
        userId,
        {
          $pull: { friendRequestsSent: currentUser?._id },
        },
        { new: true } // This returns the updated document
      ),
    ]);

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

const unfriendExistingFriend = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const currentUser = req.user;
    const { userId } = req.params;

    const user = await User.findById(userId).select("_id");

    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.FAILED,
            STATUS_CODE.NOT_FOUND,
            ERROR_MESSAGES.USER_NOT_FOUND,
            null
          )
        );
    }

    // Run updates in parallel
    await Promise.all([
      User.findByIdAndUpdate(
        currentUser?._id,
        {
          $pull: { friends: userId },
        },
        { new: true } // This returns the updated document
      ),

      User.findByIdAndUpdate(
        userId,
        {
          $pull: { friends: currentUser?._id },
        },
        { new: true } // This returns the updated document
      ),
    ]);

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
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  unfriendExistingFriend,
};
