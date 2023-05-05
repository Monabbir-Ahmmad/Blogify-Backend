import { Comment } from "../../../models/comment.model.js";
import { CommentResDto } from "../../../dtos/response/comment.res.dto.js";
import { User } from "../../../models/user.model.js";
import { UserResDto } from "../../../dtos/response/user.res.dto.js";
import { database } from "../../../configs/database.config.js";

const createComment = async (blogId, userId, text, parentId) => {
  const comment = await Comment.create({ text, parentId, blogId, userId });

  if (!comment) return null;

  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "profileImage"],
  });

  return new CommentResDto({
    id: comment.id,
    text,
    parentId,
    blogId,
    user: new UserResDto(user),
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    replyCount: 0,
  });
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
      },
    ],
  });

  if (!comment?.id) return null;

  return new CommentResDto({
    id: comment.id,
    text: comment.text,
    parentId: comment.parentId,
    blogId: comment.blogId,
    user: new UserResDto(comment.user),
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    replyCount: comment.get("replyCount"),
  });
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
      },
    ],
    group: ["Comment.id"],
    offset,
    limit,
  });

  return {
    pageCount: Math.ceil(count.length / limit),
    comments: comments.map(
      (comment) =>
        new CommentResDto({
          id: comment.id,
          text: comment.text,
          parentId: comment.parentId,
          blogId: comment.blogId,
          user: new UserResDto(comment.user),
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          replyCount: comment.get("replyCount"),
        })
    ),
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
      },
    ],
    group: ["Comment.id"],
    offset,
    limit,
  });

  return {
    pageCount: Math.ceil(count.length / limit),
    comments: comments.map(
      (comment) =>
        new CommentResDto({
          id: comment.id,
          text: comment.text,
          parentId: comment.parentId,
          blogId: comment.blogId,
          user: new UserResDto(comment.user),
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          replyCount: comment.get("replyCount"),
        })
    ),
  };
};

const updateComment = async (id, text) => {
  const [updatedRows] = await Comment.update({ text }, { where: { id } });

  return updatedRows === 1;
};

const deleteComment = async (id) => {
  const deletedRows = await Comment.destroy({ where: { id } });

  return deletedRows === 1;
};

export const commentDB = {
  createComment,
  getCommentById,
  getCommentsByBlogId,
  getRepliesByCommentId,
  updateComment,
  deleteComment,
};
