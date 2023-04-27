import express from "express";
import { blogController } from "../controllers/blog.controller.js";
import { filesUpload } from "../middlewares/fileUpload.middleware.js";

export const blogRouter = express.Router();

blogRouter
  .route("/create")
  .post(filesUpload.single("blogCoverImage"), blogController.createBlog);

blogRouter.route("/search").get(blogController.searchBlogs);

blogRouter.route("/user/:userId").get(blogController.getUserBlogList);

blogRouter.route("/:blogId").get(blogController.getBlog);

blogRouter
  .route("/update")
  .patch(filesUpload.single("blogCoverImage"), blogController.updateBlog);

blogRouter.route("/like").post(blogController.likeBlog);

blogRouter.route("/delete/:blogId").delete(blogController.deleteBlog);
