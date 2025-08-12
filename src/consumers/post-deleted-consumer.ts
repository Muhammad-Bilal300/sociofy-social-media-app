import { getChannel } from "../config/rabbit-mq";
import Post from "../models/post-model";
import User from "../models/user-model";

export async function startPostDeletedConsumer() {
  const channel = getChannel();
  if (!channel) {
    console.error("❌ RabbitMQ channel not initialized");
    return;
  }

  await channel.assertQueue("post_deleted");

  channel.consume("post_deleted", async (msg) => {
    if (msg) {
      try {
        const { userId, postId } = JSON.parse(msg.content.toString());

        await User.findByIdAndUpdate(
          userId,
          {
            $pull: { posts: postId },
          },
          { new: true }
        );

        await Post.findByIdAndDelete(postId);

        channel.ack(msg);
      } catch (err) {
        console.error("❌ Error processing post_reacted:", err);
        channel.nack(msg);
      }
    }
  });
}
