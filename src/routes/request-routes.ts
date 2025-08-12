import express, { Router } from "express"; // Import Router type from express

import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  sendFriendRequest,
  unfriendExistingFriend,
} from "../controllers/request-controller";
import { authenticateUser, validateIsUser } from "../middlewares/middlewares";

const router: Router = express.Router(); // Explicitly type the router

router.patch(
  "/send-friend-request/:userId",
  authenticateUser,
  validateIsUser,
  sendFriendRequest
);
router.patch(
  "/cancel-friend-request/:userId",
  authenticateUser,
  validateIsUser,
  cancelFriendRequest
);
router.patch(
  "/accept-friend-request/:userId",
  authenticateUser,
  validateIsUser,
  acceptFriendRequest
);
router.patch(
  "/decline-friend-request/:userId",
  authenticateUser,
  validateIsUser,
  declineFriendRequest
);
router.patch(
  "/unfriend-existing-friend/:userId",
  authenticateUser,
  validateIsUser,
  unfriendExistingFriend
);

export default router;
