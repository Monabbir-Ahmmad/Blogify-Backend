import { Comment } from "../models/comment.model.js";
import { CommentResDto } from "../dtos/response/comment.res.dto.js";
import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { blogService } from "./blog.service.js";
import { commentDB } from "../repositories/database/sequelize/comment.db.js";
import { mapper } from "../configs/mapper.config.js";
import { userService } from "./user.service.js";

const getComment = async (commentId) => {
  const comment = await commentDB.getCommentById(commentId);

  if (!comment) throw new HttpError(StatusCode.NOT_FOUND, "Comment not found.");

  return mapper.map(Comment, CommentResDto, comment);
};

const postComment = async (blogId, userId, text, parentId) => {
  await blogService.getBlog(blogId);

  if (parentId) await getComment(parentId);

  const comment = await commentDB.createComment(blogId, userId, text, parentId);

  return mapper.map(Comment, CommentResDto, comment);
};

const getComments = async (blogId, { offset, limit }) => {
  await blogService.getBlog(blogId);

  const { pageCount, comments } = await commentDB.getCommentsByBlogId(
    blogId,
    offset,
    limit
  );

  return {
    pageCount,
    comments: mapper.mapArray(Comment, CommentResDto, comments),
  };
};

const getCommentReplies = async (commentId, { offset, limit }) => {
  await getComment(commentId);

  const { pageCount, comments } = await commentDB.getRepliesByCommentId(
    commentId,
    offset,
    limit
  );

  return {
    pageCount,
    comments: mapper.mapArray(Comment, CommentResDto, comments),
  };
};

const updateComment = async (userId, commentId, text) => {
  const comment = await getComment(commentId);

  if (comment.user.id !== userId)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "You are not allowed to update this comment."
    );

  const updatedComment = await commentDB.updateComment(commentId, text);

  return mapper.map(Comment, CommentResDto, updatedComment);
};

const deleteComment = async (userId, commentId) => {
  const comment = await getComment(commentId);

  if (comment.user.id !== userId)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "You are not allowed to delete this comment."
    );

  await commentDB.deleteComment(commentId);

  return { message: "Comment deleted successfully." };
};

const updateCommentLike = async (userId, commentId) => {
  await userService.getUser(userId);

  await getComment(commentId);

  await commentDB.updateCommentLike(userId, commentId);

  return await getComment(commentId);
};

export const commentService = {
  getComment,
  postComment,
  getComments,
  getCommentReplies,
  updateComment,
  deleteComment,
  updateCommentLike,
};
