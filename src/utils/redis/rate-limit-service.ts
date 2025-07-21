import RateLimitLog, {
  RateLimitLogType,
} from "../../models/rate-limit-log-model";

export const saveRateLimitLog = async (
  ip: string,
  requests: number
): Promise<RateLimitLogType | null> => {
  try {
    const log = await RateLimitLog.create({ ip, requests });
    return log;
  } catch (err) {
    console.error("Error saving rate limit log:", err);
    return null;
  }
};
