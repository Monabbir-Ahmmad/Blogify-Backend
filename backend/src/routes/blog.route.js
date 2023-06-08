import { upload, uploadImage } from "../middlewares/fileUpload.middleware.js";

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { blogController } from "../controllers/blog.controller.js";
import { blogRouteValidator } from "../validators/blog.route.validator.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { validationCheck } from "../middlewares/validation.middleware.js";
import { userRouteValidator } from "../validators/user.route.validator.js";

export const blogRouter = Router();

blogRouter
  .route("/")
  .get(errorMiddleware.asyncHandler(blogController.getBlogList))
  .post(
    authMiddleware.verifyToken,
    upload.single("coverImage"),
    blogRouteValidator.post,
    validationCheck,
    uploadImage,
    errorMiddleware.asyncHandler(blogController.createBlog)
  );

blogRouter
  .route("/user/:userId")
  .get(
    userRouteValidator.routeParam,
    validationCheck,
    errorMiddleware.asyncHandler(blogController.getUserBlogList)
  );

blogRouter
  .route("/like/:blogId")
  .put(
    authMiddleware.verifyToken,
    blogRouteValidator.routeParam,
    validationCheck,
    errorMiddleware.asyncHandler(blogController.likeBlog)
  );

blogRouter
  .route("/:blogId")
  .get(
    blogRouteValidator.routeParam,
    validationCheck,
    errorMiddleware.asyncHandler(blogController.getBlog)
  )
  .delete(
    authMiddleware.verifyToken,
    blogRouteValidator.routeParam,
    validationCheck,
    errorMiddleware.asyncHandler(blogController.deleteBlog)
  )
  .put(
    authMiddleware.verifyToken,
    upload.single("coverImage"),
    blogRouteValidator.routeParam,
    blogRouteValidator.update,
    validationCheck,
    uploadImage,
    errorMiddleware.asyncHandler(blogController.updateBlog)
  );
