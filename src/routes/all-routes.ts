import express, { Router } from "express"; // Import Router type from express
import authRouter from "../routes/auth-routes";
import forgotPasswordRouter from "../routes/forgot-password-routes";

import postRouter from "../routes/post-routes";
import { AUTH, POST, USER } from "../constants/routes";

const router: Router = express.Router(); // Explicitly type the router

router.use(AUTH, authRouter);
router.use(USER, forgotPasswordRouter);
router.use(POST, postRouter);

export default router;
