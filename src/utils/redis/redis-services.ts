import redisClient from "../../config/redis-client";

// Set key with value
export const setKey = async (key: string, value: string) => {
  await redisClient.set(key, value);
};

// Set key with expiry (in seconds)
export const setWithExpiry = async (
  key: string,
  value: string,
  ttl: number
) => {
  await redisClient.setEx(key, ttl, value);
};

// Get value by key
export const getKey = async (key: string) => {
  return await redisClient.get(key);
};

// Delete a key
export const deleteKey = async (key: string) => {
  await redisClient.del(key);
};

// Check if key exists
export const existsKey = async (key: string) => {
  const exists = await redisClient.exists(key);
  return exists === 1;
};

// Get all keys (optionally by pattern)
export const getAllKeys = async (pattern = "*") => {
  return await redisClient.keys(pattern);
};

// Increment a key (numeric value)
export const incrementKey = async (key: string) => {
  return await redisClient.incr(key);
};

// Push to a list
export const pushToList = async (listKey: string, value: string) => {
  await redisClient.rPush(listKey, value);
};

// Get range of list items
export const getListRange = async (listKey: string, start = 0, end = -1) => {
  return await redisClient.lRange(listKey, start, end);
};

// Set a hash
export const setHash = async (key: string, data: Record<string, string>) => {
  await redisClient.hSet(key, data);
};

// Get a hash
export const getHash = async (key: string) => {
  return await redisClient.hGetAll(key);
};

// Delete a field from hash
export const deleteHashField = async (key: string, field: string) => {
  await redisClient.hDel(key, field);
};
