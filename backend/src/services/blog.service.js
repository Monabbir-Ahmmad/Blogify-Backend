import { Blog } from "../models/blog.model.js";
import { BlogResDto } from "../dtos/response/blog.res.dto.js";
import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { blogDB } from "../repositories/database/sequelize/blog.db.js";
import { mapper } from "../configs/mapper.config.js";
import { userService } from "./user.service.js";

const createBlog = async (userId, blogPostReqDto) => {
  await userService.getUser(userId);

  const blog = await blogDB.createBlog(userId, blogPostReqDto);

  return mapper.map(Blog, BlogResDto, blog);
};

const getBlog = async (id) => {
  const blog = await blogDB.getBlogById(id);

  if (!blog) throw new HttpError(StatusCode.NOT_FOUND, "Blog not found.");

  return mapper.map(Blog, BlogResDto, blog);
};

const getBlogs = async ({ offset, limit }) => {
  const { pageCount, blogs } = await blogDB.getBlogs(offset, limit);

  return {
    pageCount,
    blogs: mapper.mapArray(Blog, BlogResDto, blogs),
  };
};

const getUserBlogs = async (userId, { offset, limit }) => {
  await userService.getUser(userId);

  const { pageCount, blogs } = await blogDB.getUserBlogs(userId, offset, limit);

  return {
    pageCount,
    blogs: mapper.mapArray(Blog, BlogResDto, blogs),
  };
};

const updateBlog = async (userId, blogId, blogUpdatetReqDto) => {
  const blog = await getBlog(blogId);

  if (blog.user.id !== userId)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "You are not allowed to update this blog."
    );

  const updatedBlog = await blogDB.updateBlog(blogId, blogUpdatetReqDto);

  return mapper.map(Blog, BlogResDto, updatedBlog);
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

  return await getBlog(blogId);
};

const searchBlog = async (keyword, { offset, limit }) => {
  const { pageCount, blogs } = await blogDB.searchBlogByTitle(
    keyword,
    offset,
    limit
  );

  return {
    pageCount,
    blogs: mapper.mapArray(Blog, BlogResDto, blogs),
  };
};

export const blogService = {
  createBlog,
  getBlog,
  getBlogs,
  getUserBlogs,
  updateBlog,
  deleteBlog,
  updateBlogLike,
  searchBlog,
};
