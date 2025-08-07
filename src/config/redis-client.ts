import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://127.0.0.1:6379", // default port for Redis
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export default redisClient;
