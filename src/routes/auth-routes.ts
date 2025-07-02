import express, { Router } from "express"; // Import Router type from express
import { login, sendAccountVerficationOtp, signup, verifyAccountVerficationOtp } from "../controllers/auth-controller";

const router: Router = express.Router(); // Explicitly type the router

router.post("/sign-up", signup);
router.post("/login", login);
router.post("/send-account-verification-otp", sendAccountVerficationOtp);
router.post("/verify-account-verification-otp", verifyAccountVerficationOtp);

export default router;
