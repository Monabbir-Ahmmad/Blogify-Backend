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
    filesUpload.single("blogCoverImage"),
    blogRouteValidator.post,
    validationCheck,
    blogController.createBlog
  );

blogRouter.route("/user/:userId").get(blogController.getUserBlogList);

blogRouter.route("/like/:blogId").put(blogController.likeBlog);

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
