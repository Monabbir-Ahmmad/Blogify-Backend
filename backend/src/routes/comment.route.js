import express from "express";
import { commentController } from "../controllers/comment.controller.js";

export const commentRouter = express.Router();

commentRouter.route("/create").post(commentController.postComment);

commentRouter.route("/:blogId").get(commentController.getBlogComments);

commentRouter.route("/update").put(commentController.updateComment);

commentRouter
  .route("/delete/:commentId")
  .delete(commentController.deleteComment);
