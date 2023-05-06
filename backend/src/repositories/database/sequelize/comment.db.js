import { Comment } from "../../../models/comment.model.js";
import { User } from "../../../models/user.model.js";
import { database } from "../../../configs/database.config.js";

const createComment = async (blogId, userId, text, parentId) => {
  const comment = await Comment.create({ text, parentId, blogId, userId });

  if (!comment) return null;

  await comment.reload({
    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
    ],
  });

  return comment;
};

const getCommentById = async (id) => {
  const comment = await Comment.findByPk(id, {
    attributes: [
      "id",
      "text",
      "parentId",
      "blogId",
      "createdAt",
      "updatedAt",
      [database.fn("COUNT", database.col("replies.id")), "replyCount"],
    ],
    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: Comment,
        as: "replies",
        attributes: [],
        required: false,
        where: { parentId: id },
      },
    ],
  });

  if (!comment?.id) return null;

  return comment;
};

const getCommentsByBlogId = async (blogId, offset, limit) => {
  const { rows: comments, count } = await Comment.findAndCountAll({
    subQuery: false,
    where: { blogId, parentId: null },
    attributes: [
      "id",
      "text",
      "parentId",
      "blogId",
      "createdAt",
      "updatedAt",
      [database.fn("COUNT", database.col("replies.id")), "replyCount"],
    ],
    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: Comment,
        as: "replies",
        attributes: [],
        required: false,
        where: { parentId: database.col("Comment.id") },
      },
    ],
    group: ["Comment.id"],
    offset,
    limit,
  });

  return {
    pageCount: Math.ceil(count.length / limit),
    comments,
  };
};

const getRepliesByCommentId = async (commentId, offset, limit) => {
  const { rows: comments, count } = await Comment.findAndCountAll({
    subQuery: false,
    where: { parentId: commentId },
    attributes: [
      "id",
      "text",
      "parentId",
      "blogId",
      "createdAt",
      "updatedAt",
      [database.fn("COUNT", database.col("replies.id")), "replyCount"],
    ],
    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: Comment,
        as: "replies",
        attributes: [],
        required: false,
        where: { parentId: database.col("Comment.id") },
      },
    ],
    group: ["Comment.id"],
    offset,
    limit,
  });

  return {
    pageCount: Math.ceil(count.length / limit),
    comments,
  };
};

const updateComment = async (id, text) => {
  const comment = await getCommentById(id);

  if (!comment) return null;

  await comment.update({ text });

  return comment;
};

const deleteComment = async (id) => {
  const comment = await getCommentById(id);

  if (!comment) return false;

  await comment.destroy();

  return true;
};

export const commentDB = {
  createComment,
  getCommentById,
  getCommentsByBlogId,
  getRepliesByCommentId,
  updateComment,
  deleteComment,
};
