import express, { Router } from "express"; // Import Router type from express
import authRouter from "../routes/auth-routes";
import forgotPasswordRouter from "../routes/forgot-password-routes";
import { AUTH, USER } from "../constants/routes";

const router: Router = express.Router(); // Explicitly type the router

router.use(AUTH, authRouter);
router.use(USER, forgotPasswordRouter);

export default router;
