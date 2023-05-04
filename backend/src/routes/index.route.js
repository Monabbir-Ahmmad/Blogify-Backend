import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authRouter } from "./auth.route.js";
import { blogRouter } from "./blog.route.js";
import { commentRouter } from "./comment.route.js";
import express from "express";
import { testRouter } from "./test.route.js";
import { userRouter } from "./user.route.js";

export const indexRouter = express.Router();

indexRouter.use("/test", testRouter);

indexRouter.use("/auth", authRouter);

indexRouter.use("/user", authMiddleware.verifyToken, userRouter);

indexRouter.use("/blog", authMiddleware.verifyToken, blogRouter);

indexRouter.use("/comment", authMiddleware.verifyToken, commentRouter);
