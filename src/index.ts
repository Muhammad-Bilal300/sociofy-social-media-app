import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect";
import mainRouter from "./routes/all-routes";
import path from "path";

dotenv.config();

const app = express();

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
app.use(mainRouter);

// ✅ Only add this AFTER all other routes
// app.use(express.static(path.join(__dirname, "..", "..", "client", "build")));

// app.get("*", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "..", "..", "client", "build", "index.html")
//   );
// });

const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  if (err) {
    console.log("Server is not connected due to this Error: ", err);
  } else {
    console.log("Server is Connected at :", PORT);
    dbConnect();
  }
});
