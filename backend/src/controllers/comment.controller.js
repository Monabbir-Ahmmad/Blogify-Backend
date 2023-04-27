import asyncHandler from "express-async-handler";

// @desc Comment on blog
// @route POST /comment/
// @access Protected
// @needs blogId, text, ?parentId
const postComment = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { blogId, text, parentId } = req.body;
});

// @desc Get comments for blog
// @route Get /comment/:blogId
// @access Protected
const getBlogComments = asyncHandler(async (req, res) => {
  const blogId = req.params.blogId;
});

// @desc Update a comment
// @route Put /comment/update
// @access Protected
// @needs commentId, text
const updateComment = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { commentId, text } = req.body;
});

// @desc Delete a comment
// @route Delete /comment/delete/:commentId
// @access Protected
const deleteComment = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const commentId = req.params.commentId;
});

export const commentController = {
  postComment,
  getBlogComments,
  updateComment,
  deleteComment,
};
