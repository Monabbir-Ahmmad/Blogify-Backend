import express from "express";
import { blogController } from "../controllers/blog.controller.js";
import { filesUpload } from "../middlewares/fileUpload.middleware.js";
import { blogRouteValidator } from "../validators/routeValidators/blog.route.validator.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const blogRouter = express.Router();

blogRouter
  .route("/create")
  .post(
    filesUpload.single("blogCoverImage"),
    blogRouteValidator.post,
    validationCheck,
    blogController.createBlog
  );

blogRouter.route("/search").get(blogController.searchBlogs);

blogRouter.route("/user/:userId").get(blogController.getUserBlogList);

blogRouter.route("/:blogId").get(blogController.getBlog);

blogRouter
  .route("/update")
  .patch(
    filesUpload.single("blogCoverImage"),
    blogRouteValidator.update,
    validationCheck,
    blogController.updateBlog
  );

blogRouter
  .route("/like")
  .post(blogRouteValidator.like, validationCheck, blogController.likeBlog);

blogRouter.route("/delete/:blogId").delete(blogController.deleteBlog);
