import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./config/db-connect";
import mainRouter from "./routes/all-routes";
import path from "path";
import redisClient from "./config/redis-client";
import { rateLimiter } from "./middlewares/rateLimitter";
import { connectRabbitMQ } from "./config/rabbit-mq";
import { startPostCreatedConsumer } from "./consumers/post-created-consumer";
import { initSocket } from "./config/socket";
import http from "http";
import { startPostReactedConsumer } from "./consumers/post-reacted-consumer";
import { startPostBookmarkedConsumer } from "./consumers/post-bookmarked-consumer";
import { startPostReportedConsumer } from "./consumers/post-reported-consumer";
import { startPostDeletedConsumer } from "./consumers/post-deleted-consumer";

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = initSocket(server);

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId); // join room with userId
  }
});

app.use(
  cors({
    origin: "*",
  })
);
// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files from /uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Mount all API routes

app.use(rateLimiter);
app.use(mainRouter);

const PORT = process.env.PORT;

server.listen(PORT, async (err?: any) => {
  if (err) {
    console.error("Server failed to start:", err);
    return;
  }

  console.log("🚀 Server is running on port:", PORT);

  // 1. Connect DB
  dbConnect();

  // 2. Connect Redis
  try {
    await redisClient.connect();
    console.log("✅ Redis Connected");
  } catch (redisErr) {
    console.error("❌ Redis connection failed:", redisErr);
  }

  // 3. Connect RabbitMQ + Start Consumers
  try {
    await connectRabbitMQ();
    await startPostCreatedConsumer();
    await startPostReactedConsumer();
    await startPostBookmarkedConsumer();
    await startPostReportedConsumer();
    await startPostDeletedConsumer();
  } catch (err: any) {
    console.error("❌ RabbitMQ connection failed:", err.message);
  }
});
