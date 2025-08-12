import { getChannel } from "../config/rabbit-mq";
import Post from "../models/post-model";

export async function startPostBookmarkedConsumer() {
  const channel = getChannel();
  if (!channel) {
    console.error("❌ RabbitMQ channel not initialized");
    return;
  }

  await channel.assertQueue("post_bookmarked");

  channel.consume("post_bookmarked", async (msg) => {
    if (msg) {
      try {
        const { userId, postId, isBookmarked } = JSON.parse(
          msg.content.toString()
        );

        if (isBookmarked) {
          // ✅ Add reaction + increment count
          await Post.findByIdAndUpdate(
            postId,
            {
              $inc: { noOfBookmarks: 1 },
              $addToSet: { bookmarkedUsers: userId },
            },
            { new: true }
          );
        } else {
          // ✅ Remove reaction + decrement count
          await Post.findByIdAndUpdate(
            postId,
            {
              $inc: { noOfBookmarks: -1 },
              $pull: { bookmarkedUsers: userId },
            },
            { new: true }
          );

          // Safety: prevent negative counts
          await Post.updateOne(
            { _id: postId, noOfBookmarks: { $lt: 0 } },
            { $set: { noOfBookmarks: 0 } }
          );
        }

        channel.ack(msg);
      } catch (err) {
        console.error("❌ Error processing post_reacted:", err);
        channel.nack(msg);
      }
    }
  });
}
