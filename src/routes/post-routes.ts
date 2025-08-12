import express, { Router } from "express"; // Import Router type from express
import { authenticateUser, validateIsUser } from "../middlewares/middlewares";
import upload from "../middlewares/upload";
import {
  addPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  reactOrDisreactPost,
  reportOrUnReportPost,
  saveOrUnsavePost,
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
router.get(
  "/get-single-post/:id",
  authenticateUser,
  validateIsUser,
  getSinglePost
);

router.patch(
  "/react-post/:id",
  authenticateUser,
  validateIsUser,
  reactOrDisreactPost
);

router.patch(
  "/bookmark-post/:id",
  authenticateUser,
  validateIsUser,
  saveOrUnsavePost
);

router.patch(
  "/report-post/:id",
  authenticateUser,
  validateIsUser,
  reportOrUnReportPost
);

router.delete("/delete-post/:id", authenticateUser, validateIsUser, deletePost);

export default router;
