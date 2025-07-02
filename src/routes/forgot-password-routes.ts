import express, { Router } from "express"; // Import Router type from express
import {
  checkUserEmail,
  resetPassword,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
} from "../controllers/forgot-password-controller";

const router: Router = express.Router(); // Explicitly type the router

router.post("/check-user-email", checkUserEmail);
router.post("/send-otp-email", sendForgotPasswordOtp);
router.post("/verify-otp", verifyForgotPasswordOtp);
router.post("/reset-password", resetPassword);

export default router;
