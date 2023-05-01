import express from "express";
import { blogController } from "../controllers/blog.controller.js";
import { filesUpload } from "../middlewares/fileUpload.middleware.js";
import { blogRouteValidator } from "../validators/routeValidators/blog.route.validator.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const blogRouter = express.Router();

blogRouter
  .route("/")
  .get(blogController.getBlogList)
  .post(
    filesUpload.single("blogCoverImage"),
    blogRouteValidator.post,
    validationCheck,
    blogController.createBlog
  );

blogRouter.route("/user/:userId").get(blogController.getUserBlogList);

blogRouter
  .route("/like/:blogId")
  .post(blogRouteValidator.like, validationCheck, blogController.likeBlog);

blogRouter
  .route("/:blogId")
  .get(blogController.getBlog)
  .delete(blogController.deleteBlog)
  .put(
    filesUpload.single("blogCoverImage"),
    blogRouteValidator.update,
    validationCheck,
    blogController.updateBlog
  );
