import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserTypes } from "../models/user-model";
import { STATUS_CODE } from "../constants/status-codes";
import ServerErrorResponse from "../utils/classes/server-error-response";
import { STATUS_MESSAGES } from "../constants/status-messages";
import { UNAUTHORIZE_MESSAGES } from "../constants/unauthorize-messages";
import { ERROR_MESSAGES } from "../constants/error-messages";
import { ROLES } from "../constants/basic";
import User from "../models/user-model";
import { checkUserActivation } from "../utils/check-user-activation";

// Define type for decoded JWT payload
interface DecodedToken {
  userId: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: UserTypes;
      admin?: UserTypes;
    }
  }
}

// Authenticate user and verify JWT token
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Bearer token extraction
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.UNAUTHORIZED,
              UNAUTHORIZE_MESSAGES.NOT_LOGGED_IN,
              null
            )
          )
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as DecodedToken;
    const currentUser = await User.findById(decoded.userId);

    if (!currentUser) {
      return next(
        res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.UNAUTHORIZED,
              ERROR_MESSAGES.AUTHENTICATED_USER_NOT_FOUND,
              null
            )
          )
      );
    }

    if (!currentUser.isEmailVerified) {
      return next(
        res
          .status(STATUS_CODE.ACCESS_DENIED)
          .json(ServerErrorResponse.notFound(ERROR_MESSAGES.USER_NOT_VERIFEID))
      );
    }

    if (!(await checkUserActivation(currentUser.emailAddress))) {
      return next(
        res
          .status(STATUS_CODE.ACCESS_DENIED)
          .json(ServerErrorResponse.notFound(ERROR_MESSAGES.USER_DEACTIVATED))
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    const obj = { expired: true };
    return next(
      res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.ERROR,
            STATUS_CODE.UNAUTHORIZED,
            UNAUTHORIZE_MESSAGES.EXPIRED_JWT,
            obj
          )
        )
    );
  }
};

// Validate if user is a DRIVER
export const validateIsUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as UserTypes;

    if (currentUser && currentUser.role === ROLES.USER) {
      req.user = currentUser;
      next();
    } else {
      return next(
        res
          .status(STATUS_CODE.ACCESS_DENIED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.ACCESS_DENIED,
              ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED(ROLES.USER.toLowerCase()),
              null
            )
          )
      );
    }
  } catch (error) {
    return next(
      res
        .status(STATUS_CODE.ACCESS_DENIED)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.ERROR,
            STATUS_CODE.ACCESS_DENIED,
            ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED(ROLES.USER.toLowerCase()),
            { error }
          )
        )
    );
  }
};

// Validate if user is an ADMIN
export const validateIsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as UserTypes;

    if (currentUser && currentUser.role === ROLES.ADMIN) {
      req.admin = currentUser;
      next();
    } else {
      return next(
        res
          .status(STATUS_CODE.ACCESS_DENIED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.ACCESS_DENIED,
              ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED(ROLES.ADMIN.toLowerCase()),
              null
            )
          )
      );
    }
  } catch (error) {
    return next(
      res
        .status(STATUS_CODE.ACCESS_DENIED)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.ERROR,
            STATUS_CODE.ACCESS_DENIED,
            ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED(ROLES.ADMIN.toLowerCase()),
            { error }
          )
        )
    );
  }
};
