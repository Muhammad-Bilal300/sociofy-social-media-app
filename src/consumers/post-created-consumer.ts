import redisClient from "../config/redisClient";
import { getChannel } from "../config/rabbit-mq";
import { REDIS_KEYS } from "../constants/basic";
import User from "../models/user-model";
import Post from "../models/post-model";
import { getSocket } from "../config/socket";

export async function startPostCreatedConsumer() {
  const channel = getChannel();
  if (!channel) {
    console.error("❌ RabbitMQ channel not initialized");
    return;
  }

  await channel.assertQueue("post_created");

  channel.consume("post_created", async (msg) => {
    if (msg) {
      try {
        const { userId, postId } = JSON.parse(msg.content.toString());

        const CACHE_KEY = `KEY : ${REDIS_KEYS.POSTS_LIST} - USER : ${userId}`;

        await User.findByIdAndUpdate(userId, {
          $addToSet: { posts: postId },
        });

        const post = await Post.findById(postId)
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

        await redisClient.lPush(CACHE_KEY, JSON.stringify(post));

        console.log("✅ New post pushed to Redis");

        const io = getSocket();
        io.to(userId.toString()).emit("post-created");

        channel.ack(msg);
      } catch (err) {
        console.error("❌ Failed to process post_created message:", err);
        channel.nack(msg);
      }
    }
  });
}
