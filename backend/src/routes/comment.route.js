import { authMiddleware } from "../middlewares/auth.middleware.js";
import { commentController } from "../controllers/comment.controller.js";
import { commentRouteValidator } from "../validators/comment.route.validator.js";
import express from "express";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const commentRouter = express.Router();

commentRouter
  .route("/")
  .post(
    authMiddleware.verifyToken,
    commentRouteValidator.post,
    validationCheck,
    commentController.postComment
  );

commentRouter
  .route("/reply/:commentId")
  .get(commentController.getCommentReplies);

commentRouter.route("/blog/:blogId").get(commentController.getBlogComments);

commentRouter
  .route("/like/:commentId")
  .put(authMiddleware.verifyToken, commentController.likeComment);

commentRouter
  .route("/:commentId")
  .get(commentController.getComment)
  .delete(authMiddleware.verifyToken, commentController.deleteComment)
  .put(
    authMiddleware.verifyToken,
    commentRouteValidator.update,
    validationCheck,
    commentController.updateComment
  );
