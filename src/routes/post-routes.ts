import express, { Router } from "express"; // Import Router type from express
import { authenticateUser, validateIsUser } from "../middlewares/middlewares";
import upload from "../middlewares/upload";
import {
  addPost,
  getAllPosts,
  getSinglePost,
  searchPostLocation,
} from "../controllers/post-controller";

const router: Router = express.Router(); // Explicitly type the router

router.post(
  "/add-post",
  authenticateUser,
  validateIsUser,
  upload.array("files"),
  addPost
);
router.get("/get-all-posts", authenticateUser, validateIsUser, getAllPosts);
router.get(
  "/search-location",
  authenticateUser,
  validateIsUser,
  searchPostLocation
);
router.get("/get-single-post", authenticateUser, validateIsUser, getSinglePost);

export default router;
