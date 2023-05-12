import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { blogController } from "../controllers/blog.controller.js";
import { blogRouteValidator } from "../validators/blog.route.validator.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { filesUpload } from "../middlewares/fileUpload.middleware.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const blogRouter = Router();

blogRouter
  .route("/")
  .get(errorMiddleware.asyncHandler(blogController.getBlogList))
  .post(
    authMiddleware.verifyToken,
    filesUpload.single("blogCoverImage"),
    blogRouteValidator.post,
    validationCheck,
    errorMiddleware.asyncHandler(blogController.createBlog)
  );

blogRouter
  .route("/user/:userId")
  .get(errorMiddleware.asyncHandler(blogController.getUserBlogList));

blogRouter
  .route("/like/:blogId")
  .put(
    authMiddleware.verifyToken,
    errorMiddleware.asyncHandler(blogController.likeBlog)
  );

blogRouter
  .route("/:blogId")
  .get(errorMiddleware.asyncHandler(blogController.getBlog))
  .delete(
    authMiddleware.verifyToken,
    errorMiddleware.asyncHandler(blogController.deleteBlog)
  )
  .put(
    authMiddleware.verifyToken,
    filesUpload.single("blogCoverImage"),
    blogRouteValidator.update,
    validationCheck,
    errorMiddleware.asyncHandler(blogController.updateBlog)
  );
