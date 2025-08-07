import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis-client";
import { saveRateLimitLog } from "../utils/redis/rate-limit-service";
import ServerErrorResponse from "../utils/classes/server-error-response";
import { STATUS_MESSAGES } from "../constants/status-messages";

const MAX_REQUESTS = 100;
const WINDOW_SECONDS = 5 * 60; // 5 minutes
const BLOCK_DURATION = 3 * 60; // 3 minutes

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const ip = req.ip;
  // console.log("ip", ip);

  const blockKey = `block : ${ip}`;
  const requestKey = `req : ${ip}`;

  try {
    // Check if IP is blocked
    const isBlocked = await redisClient.exists(blockKey);
    if (isBlocked) {
      return next(
        res
          .status(429)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              429,
              "Too many requests. Try again later.",
              null
            )
          )
      );
    }

    // Increment request count
    const reqCount = await redisClient.incr(requestKey);

    if (reqCount === 1) {
      // Set 5-minute window if this is the first request
      await redisClient.expire(requestKey, WINDOW_SECONDS);
    }

    if (reqCount > MAX_REQUESTS) {
      // Block for 3 minutes
      await redisClient.setEx(blockKey, BLOCK_DURATION, "BLOCKED");

      // Log to MongoDB
      await saveRateLimitLog(ip!.toString(), reqCount);

      return next(
        res
          .status(429)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              429,
              "Too many requests. Try again later.",
              null
            )
          )
      );
    }

    next();
  } catch (err) {
    console.error("Rate limit error:", err);
    return next(
      res
        .status(500)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.SOMETHING_WENT_WRONG,
            500,
            "Server Erroor in Rate Limitter",
            null
          )
        )
    );
  }
};
