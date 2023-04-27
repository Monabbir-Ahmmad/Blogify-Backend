import asyncHandler from "express-async-handler";

// @desc Create blog
// @route POST /blog/create
// @access Protected
// @needs title, content, ?blogCoverImage
const createBlog = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { title, content } = req.body;
  const coverImage = req.file?.filename;
});

// @desc Search for blogs by username or title
// @route GET /blog/search?page=number&limit=number&keyword=String
// @access Protected
const searchBlogs = asyncHandler(async (req, res) => {
  let { page, limit, keyword = "" } = req.query;
  page = parseInt(page > 0 ? page : 1);
  limit = parseInt(limit > 0 ? limit : 12);
});

// @desc Get blogs of other user
// @route GET /blog/user/:userId?page=Number&limit=Number
// @access Protected
const getUserBlogList = asyncHandler(async (req, res) => {
  const userId = req.params?.userId;
  let { page, limit } = req.query;
  page = parseInt(page > 0 ? page : 1);
  limit = parseInt(limit > 0 ? limit : 12);
});

// @desc Get single blog
// @route GET /blog/:blogId
// @access Protected
const getBlog = asyncHandler(async (req, res) => {
  const blogId = req.params?.blogId;
});

// @desc Update blog
// @route PATCH /blog/update
// @access Protected
// @needs blogId, title, content, ?blogCoverImage, ?removeCoverImage
const updateBlog = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { blogId, title, content } = req.body;
  const coverImage = req.file?.filename;
  const removeCoverImage =
    !coverImage && parseInt(req.body.removeCoverImage) === 1;
});

// @desc Like blog
// @route POST /blog/like
// @access Protected
// @needs blogId
const likeBlog = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { blogId } = req.body;
});

// @desc Delete single blog
// @route DELETE /blog/delete/:blogId
// @access Protected
// @needs blogId
const deleteBlog = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { blogId } = req.params;
});

export const blogController = {
  createBlog,
  getUserBlogList,
  getBlog,
  updateBlog,
  likeBlog,
  deleteBlog,
  searchBlogs,
};
