import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { blogDB } from "../repositories/database/sequelize/blog.db.js";
import { userService } from "./user.service.js";

const createBlog = async (userId, blogPostReqDto) => {
  await userService.getUser(userId);

  const blog = await blogDB.createBlog(userId, blogPostReqDto);

  return blog;
};

const getBlog = async (id) => {
  const blog = await blogDB.getBlogById(id);

  if (!blog) throw new HttpError(StatusCode.NOT_FOUND, "Blog not found.");

  return blog;
};

const getBlogs = async ({ offset, limit }) => {
  const blogs = await blogDB.getBlogs(offset, limit);

  return blogs;
};

const getUserBlogs = async (userId, { offset, limit }) => {
  await userService.getUser(userId);

  const blogs = await blogDB.getUserBlogs(userId, offset, limit);

  return blogs;
};

const updateBlog = async (userId, blogId, blogUpdatetReqDto) => {
  const blog = await getBlog(blogId);

  if (blog.user.id !== userId)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "You are not allowed to update this blog."
    );

  const updatedBlog = await blogDB.updateBlog(blogId, blogUpdatetReqDto);

  return updatedBlog;
};

const deleteBlog = async (userId, blogId) => {
  const blog = await getBlog(blogId);

  if (blog.user.id !== userId)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "You are not allowed to delete this blog."
    );

  await blogDB.deleteBlog(blogId);

  return { message: "Blog deleted successfully." };
};

const updateBlogLike = async (userId, blogId) => {
  await userService.getUser(userId);

  await getBlog(blogId);

  await blogDB.updateBlogLike(userId, blogId);

  return await blogDB.getBlogById(blogId);
};

export const blogService = {
  createBlog,
  getBlog,
  getBlogs,
  getUserBlogs,
  updateBlog,
  deleteBlog,
  updateBlogLike,
};
