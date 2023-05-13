import { Router } from "express";
import { authRouter } from "./auth.route.js";
import { blogRouter } from "./blog.route.js";
import { commentRouter } from "./comment.route.js";
import { searchRouter } from "./search.route.js";
import { testRouter } from "./test.route.js";
import { userRouter } from "./user.route.js";

export const indexRouter = Router();

indexRouter.use("/test", testRouter);

indexRouter.use("/auth", authRouter);

indexRouter.use("/user", userRouter);

indexRouter.use("/blog", blogRouter);

indexRouter.use("/comment", commentRouter);

indexRouter.use("/search", searchRouter);
