import asyncHandler from "express-async-handler";
import { getPagination } from "../utils/functions/pagination.js";

const postComment = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { blogId, text, parentId } = req.body;
});

const getBlogComments = asyncHandler(async (req, res) => {
  const blogId = req.params.blogId;
  const pagination = getPagination(req.query);
});

const getComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
});

const getCommentReplies = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const pagination = getPagination(req.query);
});

const updateComment = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const commentId = req.params.commentId;
  const { text } = req.body;
});

const deleteComment = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const commentId = req.params.commentId;
});

export const commentController = {
  postComment,
  getBlogComments,
  getComment,
  getCommentReplies,
  updateComment,
  deleteComment,
};
