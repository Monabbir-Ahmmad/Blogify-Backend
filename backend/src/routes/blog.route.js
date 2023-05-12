import { authMiddleware } from "../middlewares/auth.middleware.js";
import { blogController } from "../controllers/blog.controller.js";
import { blogRouteValidator } from "../validators/blog.route.validator.js";
import express from "express";
import { filesUpload } from "../middlewares/fileUpload.middleware.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const blogRouter = express.Router();

blogRouter
  .route("/")
  .get(blogController.getBlogList)
  .post(
    authMiddleware.verifyToken,
    filesUpload.single("blogCoverImage"),
    blogRouteValidator.post,
    validationCheck,
    blogController.createBlog
  );

blogRouter.route("/user/:userId").get(blogController.getUserBlogList);

blogRouter
  .route("/like/:blogId")
  .put(authMiddleware.verifyToken, blogController.likeBlog);

blogRouter
  .route("/:blogId")
  .get(blogController.getBlog)
  .delete(authMiddleware.verifyToken, blogController.deleteBlog)
  .put(
    authMiddleware.verifyToken,
    filesUpload.single("blogCoverImage"),
    blogRouteValidator.update,
    validationCheck,
    blogController.updateBlog
  );
