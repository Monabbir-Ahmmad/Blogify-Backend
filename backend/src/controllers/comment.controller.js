import StatusCode from "../utils/objects/StatusCode.js";
import asyncHandler from "express-async-handler";
import { commentService } from "../services/comment.service.js";
import { commonUtil } from "../utils/functions/common.util.js";
import { responseUtil } from "../utils/functions/response.util.js";

const postComment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { blogId, text, parentId } = req.body;

  const result = await commentService.postComment(
    blogId,
    userId,
    text,
    parentId
  );

  responseUtil.sendContentNegotiatedResponse(
    req,
    res,
    StatusCode.CREATED,
    result
  );
});

const getBlogComments = asyncHandler(async (req, res) => {
  const blogId = req.params.blogId;
  const pagination = commonUtil.getPagination(req.query);

  const result = await commentService.getComments(blogId, pagination);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const getComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;

  const result = await commentService.getComment(commentId);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const getCommentReplies = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const pagination = commonUtil.getPagination(req.query);

  const result = await commentService.getCommentReplies(commentId, pagination);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const updateComment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const commentId = req.params.commentId;
  const { text } = req.body;

  const result = await commentService.updateComment(userId, commentId, text);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const deleteComment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const commentId = req.params.commentId;

  const result = await commentService.deleteComment(userId, commentId);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

export const commentController = {
  postComment,
  getBlogComments,
  getComment,
  getCommentReplies,
  updateComment,
  deleteComment,
};
