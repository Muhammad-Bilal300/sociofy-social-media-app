import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../constants/error-messages";
import { STATUS_CODE } from "../constants/status-codes";
import ServerErrorResponse from "../utils/classes/server-error-response";
import { regex } from "../utils/rejex";
import ServerSuccessResponse from "../utils/classes/server-success-response";
import { STATUS_MESSAGES } from "../constants/status-messages";
import { generateOtp } from "../utils/basic";
import { sendForgotPasswordOtpEmail } from "../utils/email";
import { SUCCESS_MESSAGES } from "../constants/success-messages";
import { UNAUTHORIZE_MESSAGES } from "../constants/unauthorize-messages";
import bcrypt from "bcrypt";
import User from "../models/user-model";
import Otp from "../models/otp-model";
import { missingFieldError } from "../utils/missing-field-error";

const checkUserEmail = async (req: Request, res: Response): Promise<any> => {
  try {
    const { emailAddress } = req.body;

    const missingFields = missingFieldError(["emailAddress"], req.body);
    if (missingFields.length > 0) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            `${missingFields.join(", ")} is required`
          )
        );
    } else {
      var isValidEmail = regex.email.test(emailAddress);

      if (!isValidEmail) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_EMAIL));
      }

      const searchedUser = await User.findOne({
        emailAddress: emailAddress,
      }).select("emailAddress");

      if (!searchedUser) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json(
            ServerErrorResponse.notFound(
              ERROR_MESSAGES.USER_NOT_FOUND_WITH_EMAIL
            )
          );
      } else {
        return res
          .status(STATUS_CODE.OK)
          .json(
            ServerSuccessResponse.successResponse(
              true,
              STATUS_MESSAGES.SUCCESS,
              STATUS_CODE.OK,
              "User found with provided email address.",
              searchedUser
            )
          );
      }
    }
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

const sendForgotPasswordOtp = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    var { emailAddress, userId } = req.body;

    const missingFields = missingFieldError(
      ["emailAddress", "userId"],
      req.body
    );
    if (missingFields.length > 0) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            `${missingFields.join(", ")} is required`
          )
        );
    } else {
      var isValidEmail = regex.email.test(emailAddress);

      if (!isValidEmail) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_EMAIL));
      }

      const previousOtpAvailable = await Otp.findOne({
        user: userId,
        emailAddress: emailAddress,
      });

      if (previousOtpAvailable) {
        const currentTimestamp = new Date().getTime();
        if (previousOtpAvailable?.expiryAt.getTime() < currentTimestamp) {
          const deletedExpiredOtp = await Otp.findByIdAndDelete(
            previousOtpAvailable._id
          );
          const generatedOtpCode = generateOtp();

          var emailSent = await sendForgotPasswordOtpEmail({
            email: emailAddress,
            otp: generatedOtpCode,
            userType: "User",
          });

          if (!emailSent) {
            return res
              .status(STATUS_CODE.SERVER_ERROR)
              .json(
                ServerErrorResponse.customError(
                  STATUS_MESSAGES.FAILED,
                  STATUS_CODE.SERVER_ERROR,
                  STATUS_MESSAGES.SOMETHING_WENT_WRONG,
                  null
                )
              );
          }

          var otpObj = new Otp({
            otpCode: generatedOtpCode,
            emailAddress: emailAddress,
            user: userId,
          });

          const savedOtp = await otpObj.save();

          return res
            .status(STATUS_CODE.OK)
            .json(
              ServerSuccessResponse.successResponse(
                true,
                STATUS_MESSAGES.SUCCESS,
                STATUS_CODE.OK,
                SUCCESS_MESSAGES.OTP_SENT_SUCCESS,
                null
              )
            );
        } else {
          return res
            .status(STATUS_CODE.OK)
            .json(
              ServerSuccessResponse.successResponse(
                true,
                STATUS_MESSAGES.SUCCESS,
                STATUS_CODE.OK,
                "A previous OTP exists and is not expired yet.",
                null
              )
            );
        }
      }

      const generatedOtpCode = generateOtp();

      var emailSent = await sendForgotPasswordOtpEmail({
        email: emailAddress,
        otp: generatedOtpCode,
        userType: "User",
      });

      if (!emailSent) {
        return res
          .status(STATUS_CODE.SERVER_ERROR)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.FAILED,
              STATUS_CODE.SERVER_ERROR,
              STATUS_MESSAGES.SOMETHING_WENT_WRONG,
              null
            )
          );
      }

      var otpObj = new Otp({
        otpCode: generatedOtpCode,
        emailAddress: emailAddress,
        user: userId,
      });

      const savedOtp = await otpObj.save();

      return res
        .status(STATUS_CODE.OK)
        .json(
          ServerSuccessResponse.successResponse(
            true,
            STATUS_MESSAGES.SUCCESS,
            STATUS_CODE.OK,
            "OTP Sent Successfully!.",
            null
          )
        );
    }
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

const verifyForgotPasswordOtp = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { emailAddress, otpCode } = req.body;

    const missingFields = missingFieldError(
      ["emailAddress", "otpCode"],
      req.body
    );
    if (missingFields.length > 0) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            `${missingFields.join(", ")} is required`
          )
        );
    }

    var isValidEmail = regex.email.test(emailAddress);

    if (!isValidEmail) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_EMAIL));
    }

    const otpEntry = await Otp.findOne({
      emailAddress: emailAddress,
      otpCode: otpCode,
    });

    if (!otpEntry) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_OTP));
    }

    const currentTimestamp = new Date().getTime();
    if (otpEntry.expiryAt.getTime() < currentTimestamp) {
      await Otp.findByIdAndDelete(otpEntry._id);
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.ERROR,
            STATUS_CODE.UNAUTHORIZED,
            UNAUTHORIZE_MESSAGES.OTP_EXPIRED,
            null
          )
        );
    }

    const perfectOtp = await Otp.findById(otpEntry._id);

    if (
      perfectOtp?.emailAddress === emailAddress &&
      perfectOtp?.otpCode === otpCode
    ) {
      await Otp.findByIdAndDelete(perfectOtp?._id);

      return res
        .status(STATUS_CODE.OK)
        .json(
          ServerSuccessResponse.successResponse(
            true,
            STATUS_MESSAGES.SUCCESS,
            STATUS_CODE.OK,
            "OTP Verified Successfully.",
            null
          )
        );
    } else {
      console.log("notnotnotnotokokokok");
    }
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

const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const missingFields = missingFieldError(
      ["userId", "newPassword", "confirmNewPassword"],
      req.body
    );
    if (missingFields.length > 0) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            `${missingFields.join(", ")} is required`
          )
        );
    }

    var { userId, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            "New Password and Confirm New Password should be same!"
          )
        );
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.USER_NOT_FOUND_WITH_ID)
        );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const filter = {
      _id: user._id,
    };

    const updatedData = {
      password: hashedPassword,
    };

    const updatedUser = await User.findByIdAndUpdate(filter, updatedData, {
      new: true,
    });

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          "Password reset successfullY.",
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
  checkUserEmail,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
};
