import { commentController } from "../controllers/comment.controller.js";
import { commentRouteValidator } from "../middlewares/validators/comment.route.validator.js";
import express from "express";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const commentRouter = express.Router();

commentRouter
  .route("/")
  .post(
    commentRouteValidator.post,
    validationCheck,
    commentController.postComment
  );

commentRouter
  .route("/reply/:commentId")
  .get(commentController.getCommentReplies);

commentRouter.route("/blog/:blogId").get(commentController.getBlogComments);

commentRouter
  .route("/:commentId")
  .get(commentController.getComment)
  .delete(commentController.deleteComment)
  .put(
    commentRouteValidator.update,
    validationCheck,
    commentController.updateComment
  );
