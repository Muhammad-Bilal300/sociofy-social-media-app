import express, { Router } from "express"; // Import Router type from express
import { authenticateUser } from "../middlewares/middlewares";
import upload from "../middlewares/upload";
import {
  addPost,
  getAllPosts,
  searchPostLocation,
} from "../controllers/post-controller";

const router: Router = express.Router(); // Explicitly type the router

router.post("/add-post", authenticateUser, upload.array("files"), addPost);
router.get("/get-all-posts", authenticateUser, getAllPosts);
router.get("/search-location", authenticateUser, searchPostLocation);

export default router;
