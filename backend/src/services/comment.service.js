import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { blogService } from "./blog.service.js";
import { commentDB } from "../repositories/database/sequelize/comment.db.js";

const getComment = async (commentId) => {
  const comment = await commentDB.getCommentById(commentId);

  if (!comment) throw new HttpError(StatusCode.NOT_FOUND, "Comment not found.");

  return comment;
};

const postComment = async (blogId, userId, text, parentId) => {
  await blogService.getBlog(blogId);

  if (parentId) await getComment(parentId);

  const comment = await commentDB.createComment(blogId, userId, text, parentId);

  return comment;
};

const getComments = async (blogId, { offset, limit }) => {
  await blogService.getBlog(blogId);

  const comments = await commentDB.getCommentsByBlogId(blogId, offset, limit);

  return comments;
};

const getCommentReplies = async (commentId, { offset, limit }) => {
  await getComment(commentId);

  const comments = await commentDB.getRepliesByCommentId(
    commentId,
    offset,
    limit
  );

  return comments;
};

const updateComment = async (userId, commentId, text) => {
  const comment = await getComment(commentId);

  if (comment.user.id !== userId)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "You are not allowed to update this comment."
    );

  const updatedComment = await commentDB.updateComment(commentId, text);

  return updatedComment;
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
