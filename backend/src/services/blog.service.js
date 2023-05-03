import { blogDB } from "../repositories/database/sequelize/blog.db.js";
import { userDB } from "../repositories/database/sequelize/user.db.js";
import { commonUtil } from "../utils/functions/common.util.js";
import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";

const createBlog = async (userId, blogPostReqDto) => {
  const blog = await blogDB.createBlog(userId, blogPostReqDto);

  return blog;
};

const getBlog = async (id) => {
  const blog = await blogDB.getBlogById(id);

  return blog;
};

const getBlogs = async (offset, limit) => {
  const blogs = await blogDB.getBlogs(offset, limit);

  return blogs;
};

const getUserBlogs = async (userId, offset, limit) => {
  const user = await userDB.getUserById(userId);

  if (!user) throw new HttpError(StatusCode.NOT_FOUND, "User not found.");

  const blogs = await blogDB.getUserBlogs(userId, offset, limit);

  return blogs;
};

const updateBlog = async (userId, blogId, blogUpdatetReqDto) => {
  const blog = await blogDB.getBlogById(blogId);

  if (!blog) throw new HttpError(StatusCode.NOT_FOUND, "Blog not found.");

  if (blog.user.id !== userId)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "You are not allowed to update this blog."
    );

  const blogUpdated = await blogDB.updateBlog(blogId, blogUpdatetReqDto);

  if (blogUpdated && blog.coverImage !== blogUpdatetReqDto.coverImage)
    await commonUtil.deleteUploadedFile(blog.coverImage);

  return await blogDB.getBlogById(blogId);
};

const deleteBlog = async (userId, blogId) => {
  const blog = await blogDB.getBlogById(blogId);

  if (!blog) throw new HttpError(StatusCode.NOT_FOUND, "Blog not found.");

  if (blog.user.id !== userId)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "You are not allowed to delete this blog."
    );

  const deletedBlog = await blogDB.deleteBlog(blogId);

  if (deletedBlog && blog.coverImage)
    await commonUtil.deleteUploadedFile(blog.coverImage);

  return { message: "Blog deleted successfully." };
};

const updateBlogLike = async (userId, blogId) => {
  const blog = await blogDB.getBlogById(blogId);

  if (!blog) throw new HttpError(StatusCode.NOT_FOUND, "Blog not found.");

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
