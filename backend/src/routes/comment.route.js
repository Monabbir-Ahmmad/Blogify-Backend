import express from "express";
import { commentController } from "../controllers/comment.controller.js";
import { commentRouteValidator } from "../validators/routeValidators/comment.route.validator.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const commentRouter = express.Router();

commentRouter
  .route("/create")
  .post(
    commentRouteValidator.post,
    validationCheck,
    commentController.postComment
  );

commentRouter.route("/:blogId").get(commentController.getBlogComments);

commentRouter
  .route("/update")
  .put(
    commentRouteValidator.update,
    validationCheck,
    commentController.updateComment
  );

commentRouter
  .route("/delete/:commentId")
  .delete(commentController.deleteComment);
