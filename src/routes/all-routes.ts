import express, { Router } from "express"; // Import Router type from express
import authRouter from "../routes/auth-routes";
import forgotPasswordRouter from "../routes/forgot-password-routes";
import postRouter from "../routes/post-routes";
import requestRouter from "../routes/request-routes";
import { AUTH, POST, REQUEST, USER } from "../constants/routes";

const router: Router = express.Router(); // Explicitly type the router

router.use(AUTH, authRouter);
router.use(USER, forgotPasswordRouter);
router.use(POST, postRouter);
router.use(REQUEST, requestRouter);

export default router;
