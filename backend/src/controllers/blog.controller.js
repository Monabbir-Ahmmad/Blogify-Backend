import asyncHandler from "express-async-handler";
import { commonUtil } from "../utils/functions/common.util.js";

const createBlog = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { title, content } = req.body;
  const coverImage = req.file?.filename;
});

const getBlogList = asyncHandler(async (req, res) => {
  const pagination = commonUtil.getPagination(req.query);
});

const getUserBlogList = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const pagination = commonUtil.getPagination(req.query);
});

const getBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.blogId;
});

const updateBlog = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const blogId = req.params.blogId;
  const { title, content } = req.body;
  const coverImage = req.file?.filename;
  const removeCoverImage =
    !coverImage && parseInt(req.body.removeCoverImage) === 1;
});

const likeBlog = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const blogId = req.params.blogId;
});

const deleteBlog = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const blogId = req.params.blogId;
});

export const blogController = {
  createBlog,
  getBlogList,
  getUserBlogList,
  getBlog,
  updateBlog,
  likeBlog,
  deleteBlog,
};
