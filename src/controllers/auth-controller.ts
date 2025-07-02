import { Request, Response } from "express";
import { missingFieldError } from "../utils/missing-field-error";
import { STATUS_CODE } from "../constants/status-codes";
import ServerErrorResponse from "../utils/classes/server-error-response";
import { STATUS_MESSAGES } from "../constants/status-messages";
import { ERROR_MESSAGES } from "../constants/error-messages";
import ServerSuccessResponse from "../utils/classes/server-success-response";
import { SUCCESS_MESSAGES } from "../constants/success-messages";
import bcrypt from "bcrypt";
import User from "../models/user-model";
import Otp from "../models/otp-model";
import { regex } from "../utils/rejex";
import { generateAuthenticationToken } from "../utils/jwt-managment";
import { generateOtp } from "../utils/basic";
import { sendAccountVerificationOtpEmail } from "../utils/email";
import { UNAUTHORIZE_MESSAGES } from "../constants/unauthorize-messages";
import { checkUserActivation } from "../utils/check-user-activation";

const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { firstName, lastName, emailAddress, password, gender } = req.body;

    const missingFields = missingFieldError(
      ["firstName", "lastName", "emailAddress", "password", "gender"],
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

    const userExists = await User.findOne({ emailAddress: emailAddress });

    if (userExists) {
      return res
        .status(STATUS_CODE.CONFLICT)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.CONFLICT,
            STATUS_CODE.CONFLICT,
            ERROR_MESSAGES.ALREADY_EXISTS("User", "email address"),
            null
          )
        );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      firstName,
      lastName,
      emailAddress,
      password: hashedPassword,
      gender: gender,
    });

    const savedUser = await user.save();
    savedUser.password = null;

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.CREATED,
          SUCCESS_MESSAGES.CREATED,
          savedUser
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

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { emailAddress, password } = req.body;

    const missingFields = missingFieldError(
      ["emailAddress", "password"],
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

    const isValidEmail = regex.email.test(emailAddress);

    if (!isValidEmail) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_EMAIL));
    }

    const user = await User.findOne({ emailAddress: emailAddress });

    if (!user) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.FAILED,
            STATUS_CODE.NOT_FOUND,
            ERROR_MESSAGES.USER_CREDENTIALS_NOT_FOUND,
            null
          )
        );
    }

    const isPasswordValid = user.password
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!isPasswordValid) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.FAILED,
            STATUS_CODE.UNAUTHORIZED,
            ERROR_MESSAGES.INVALID_LOGIN_CREDENTIALS,
            null
          )
        );
    }

    if (!(await checkUserActivation(user.emailAddress))) {
      return res
        .status(STATUS_CODE.ACCESS_DENIED)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.USER_DEACTIVATED));
    }

    const tokenPayload = {
      userId: user._id,
      role: user.role,
    };

    const authToken = await generateAuthenticationToken(tokenPayload);
    user.password = null;
    const responseData = {
      user: user,
      authToken: authToken,
    };

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
          responseData
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

const sendAccountVerficationOtp = async (
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

          var emailSent = await sendAccountVerificationOtpEmail({
            email: emailAddress,
            otp: generatedOtpCode,
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

      var emailSent = await sendAccountVerificationOtpEmail({
        email: emailAddress,
        otp: generatedOtpCode,
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

const verifyAccountVerficationOtp = async (
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

      await User.updateOne({ emailAddress }, { isEmailVerified: true });

      return res
        .status(STATUS_CODE.OK)
        .json(
          ServerSuccessResponse.successResponse(
            true,
            STATUS_MESSAGES.SUCCESS,
            STATUS_CODE.OK,
            "OTP and Account Both Verified Successfully.",
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
export {
  signup,
  login,
  sendAccountVerficationOtp,
  verifyAccountVerficationOtp,
};
