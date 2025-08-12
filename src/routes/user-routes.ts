import express, { Router } from "express"; // Import Router type from express
import { authenticateUser, validateIsUser } from "../middlewares/middlewares";
import {
  getAllFriends,
  getMyAllFriends,
  getMyAllReceivedFriendRequests,
  getMyAllSentFriendRequests,
  getMyProfile,
  getUserProfile,
} from "../controllers/user-controller";

const router: Router = express.Router(); // Explicitly type the router

router.get("/get-my-profile", authenticateUser, validateIsUser, getMyProfile);
router.get(
  "/get-user-profile/:userId",
  authenticateUser,
  validateIsUser,
  getUserProfile
);
router.get(
  "/get-my-all-sent-friend-request",
  authenticateUser,
  validateIsUser,
  getMyAllSentFriendRequests
);
router.get(
  "/get-my-all-received-friend-request",
  authenticateUser,
  validateIsUser,
  getMyAllReceivedFriendRequests
);
router.get(
  "/get-my-all-friends",
  authenticateUser,
  validateIsUser,
  getMyAllFriends
);
router.get(
  "/get-all-friends/:userId",
  authenticateUser,
  validateIsUser,
  getAllFriends
);

export default router;
