// config/rabbit-mq.ts
import amqp, { Channel, Connection } from "amqplib";

let connection;
let channel: Channel | null = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://127.0.0.1:5672";

// Connect to RabbitMQ
const connectRabbitMQ = async (): Promise<void> => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    console.log("✅ RabbitMQ connected");

    // Reconnect on close
    connection.on("close", () => {
      console.error("❌ RabbitMQ connection closed. Reconnecting...");
      reconnectRabbitMQ();
    });

    // Log errors
    connection.on("error", (err) => {
      console.error("❌ RabbitMQ error:", err.message);
    });
  } catch (err: any) {
    console.error("❌ Failed to connect to RabbitMQ:", err.message);
    setTimeout(connectRabbitMQ, 5000);
  }
};

// Retry connection
const reconnectRabbitMQ = () => {
  setTimeout(connectRabbitMQ, 5000);
};

// Get the current channel
const getChannel = (): Channel => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized.");
  }
  return channel;
};

export { connectRabbitMQ, getChannel };
