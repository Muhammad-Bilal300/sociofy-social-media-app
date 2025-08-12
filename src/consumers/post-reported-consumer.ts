import { getChannel } from "../config/rabbit-mq";
import Post from "../models/post-model";

export async function startPostReportedConsumer() {
  const channel = getChannel();
  if (!channel) {
    console.error("❌ RabbitMQ channel not initialized");
    return;
  }

  await channel.assertQueue("post_reported");

  channel.consume("post_reported", async (msg) => {
    if (msg) {
      try {
        const { userId, postId, isReported } = JSON.parse(
          msg.content.toString()
        );

        if (isReported) {
          // ✅ Add reaction + increment count
          await Post.findByIdAndUpdate(
            postId,
            {
              $inc: { noOfReports: 1 },
              $addToSet: { reportedUsers: userId },
            },
            { new: true }
          );
        } else {
          // ✅ Remove reaction + decrement count
          await Post.findByIdAndUpdate(
            postId,
            {
              $inc: { noOfReports: -1 },
              $pull: { reportedUsers: userId },
            },
            { new: true }
          );

          // Safety: prevent negative counts
          await Post.updateOne(
            { _id: postId, noOfReports: { $lt: 0 } },
            { $set: { noOfReports: 0 } }
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
