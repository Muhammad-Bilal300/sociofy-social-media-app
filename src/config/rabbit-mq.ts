// config/rabbit-mq.ts
import amqp, { Channel } from "amqplib";

let channel: Channel | null = null;

async function connectRabbitMQ(): Promise<void> {
  try {
    const connection = await amqp.connect("amqp://127.0.0.1:5672");
    channel = await connection.createChannel();
    console.log("✅ RabbitMQ connected");
  } catch (err: any) {
    console.error("❌ Failed to connect to RabbitMQ:", err.message);
  }
}

function getChannel(): Channel | null {
  return channel;
}

export { connectRabbitMQ, getChannel };
