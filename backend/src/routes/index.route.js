import express from "express";
import { authRouter } from "./auth.route.js";
import { blogRouter } from "./blog.route.js";
import { commentRouter } from "./comment.route.js";
import { userRouter } from "./user.route.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const indexRouter = express.Router();

indexRouter.route("/auth", authRouter);

indexRouter.route("/user", authMiddleware.verifyToken, userRouter);

indexRouter.route("/blog", authMiddleware.verifyToken, blogRouter);

indexRouter.route("/comment", authMiddleware.verifyToken, commentRouter);
