import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { blogService } from "./blog.service.js";
import { commentDB } from "../repositories/database/sequelize/comment.db.js";

const getComment = async (commentId) => {
  const commentResDto = await commentDB.getCommentById(commentId);

  if (!commentResDto)
    throw new HttpError(StatusCode.NOT_FOUND, "Comment not found.");

  return commentResDto;
};

const postComment = async (blogId, userId, text, parentId) => {
  await blogService.getBlog(blogId);

  if (parentId) await getComment(parentId);

  return await commentDB.createComment(blogId, userId, text, parentId);
};

const getComments = async (blogId, { offset, limit }) => {
  await blogService.getBlog(blogId);

  return await commentDB.getCommentsByBlogId(blogId, offset, limit);
};

const getCommentReplies = async (commentId, { offset, limit }) => {
  await getComment(commentId);

  return await commentDB.getRepliesByCommentId(commentId, offset, limit);
};

const updateComment = async (userId, commentId, text) => {
  const comment = await getComment(commentId);

  if (comment.user.id !== userId)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "You are not allowed to update this comment."
    );

  await commentDB.updateComment(commentId, text);

  return await getComment(commentId);
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

export const commentService = {
  getComment,
  postComment,
  getComments,
  getCommentReplies,
  updateComment,
  deleteComment,
};
