import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { commentController } from "../controllers/comment.controller.js";
import { commentRouteValidator } from "../validators/comment.route.validator.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const commentRouter = Router();

commentRouter
  .route("/")
  .post(
    authMiddleware.verifyToken,
    commentRouteValidator.post,
    validationCheck,
    errorMiddleware.asyncHandler(commentController.postComment)
  );

commentRouter
  .route("/reply/:commentId")
  .get(errorMiddleware.asyncHandler(commentController.getCommentReplies));

commentRouter
  .route("/blog/:blogId")
  .get(errorMiddleware.asyncHandler(commentController.getBlogComments));

commentRouter
  .route("/like/:commentId")
  .put(
    authMiddleware.verifyToken,
    errorMiddleware.asyncHandler(commentController.likeComment)
  );

commentRouter
  .route("/:commentId")
  .get(errorMiddleware.asyncHandler(commentController.getComment))
  .delete(
    authMiddleware.verifyToken,
    errorMiddleware.asyncHandler(commentController.deleteComment)
  )
  .put(
    authMiddleware.verifyToken,
    commentRouteValidator.update,
    validationCheck,
    errorMiddleware.asyncHandler(commentController.updateComment)
  );
