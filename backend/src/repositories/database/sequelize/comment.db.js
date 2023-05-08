import { Comment } from "../../../models/comment.model.js";
import { CommentLike } from "../../../models/commentLike.model.js";
import { Sequelize } from "sequelize";
import { User } from "../../../models/user.model.js";

const createComment = async (blogId, userId, text, parentId) => {
  const comment = await Comment.create({ text, parentId, blogId, userId });

  if (!comment) return null;

  await comment.reload({
    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: CommentLike,
        attributes: ["userId"],
        required: false,
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
      [Sequelize.fn("COUNT", Sequelize.col("replies.id")), "replyCount"],
    ],
    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: CommentLike,
        attributes: ["userId"],
        required: false,
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
      [Sequelize.fn("COUNT", Sequelize.col("replies.id")), "replyCount"],
    ],
    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: CommentLike,
        attributes: ["userId"],
        required: false,
      },
      {
        model: Comment,
        as: "replies",
        attributes: [],
        required: false,
        where: { parentId: Sequelize.col("Comment.id") },
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
      [Sequelize.fn("COUNT", Sequelize.col("replies.id")), "replyCount"],
    ],
    include: [
      {
        model: User,
        attributes: ["id", "name", "profileImage"],
      },
      {
        model: CommentLike,
        attributes: ["userId"],
        required: false,
      },
      {
        model: Comment,
        as: "replies",
        attributes: [],
        required: false,
        where: { parentId: Sequelize.col("Comment.id") },
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

const updateCommentLike = async (userId, commentId) => {
  const [like, created] = await CommentLike.findOrCreate({
    where: { userId, commentId },
    defaults: { userId, commentId },
  });

  if (!created && like) await like.destroy();

  return created;
};

export const commentDB = {
  createComment,
  getCommentById,
  getCommentsByBlogId,
  getRepliesByCommentId,
  updateComment,
  deleteComment,
  updateCommentLike,
};
