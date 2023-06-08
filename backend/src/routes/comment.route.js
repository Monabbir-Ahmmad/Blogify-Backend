import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { commentController } from "../controllers/comment.controller.js";
import { commentRouteValidator } from "../validators/comment.route.validator.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { validationCheck } from "../middlewares/validation.middleware.js";
import { blogRouteValidator } from "../validators/blog.route.validator.js";

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
  .get(
    commentRouteValidator.routeParam,
    validationCheck,
    errorMiddleware.asyncHandler(commentController.getCommentReplies)
  );

commentRouter
  .route("/blog/:blogId")
  .get(
    blogRouteValidator.routeParam,
    validationCheck,
    errorMiddleware.asyncHandler(commentController.getBlogComments)
  );

commentRouter
  .route("/like/:commentId")
  .put(
    authMiddleware.verifyToken,
    commentRouteValidator.routeParam,
    validationCheck,
    errorMiddleware.asyncHandler(commentController.likeComment)
  );

commentRouter
  .route("/:commentId")
  .get(
    commentRouteValidator.routeParam,
    validationCheck,
    errorMiddleware.asyncHandler(commentController.getComment)
  )
  .delete(
    authMiddleware.verifyToken,
    commentRouteValidator.routeParam,
    validationCheck,
    errorMiddleware.asyncHandler(commentController.deleteComment)
  )
  .put(
    authMiddleware.verifyToken,
    commentRouteValidator.routeParam,
    commentRouteValidator.update,
    validationCheck,
    errorMiddleware.asyncHandler(commentController.updateComment)
  );
