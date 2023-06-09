import { Comment } from "../../../models/comment.model.js";
import { CommentLike } from "../../../models/commentLike.model.js";
import { Sequelize } from "sequelize";
import { User } from "../../../models/user.model.js";

/**
 * @category Repositories
 * @subcategory Database
 * @classdesc A class that provides comment-related database operations.
 */
export class CommentDB {
  /**
   * Creates a new comment on a blog post.
   * @param {string|number} blogId - The ID of the blog post.
   * @param {string|number} userId - The ID of the user creating the comment.
   * @param {string} text - The text content of the comment.
   * @param {string|number|null} [parentId] - The ID of the parent comment, if applicable.
   * @returns {Promise<Comment|null>} A promise that resolves to the created comment or null if unsuccessful.
   */
  async createComment(blogId, userId, text, parentId = null) {
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
  }

  /**
   * Retrieves a comment by its ID.
   * @param {string|number} commentId - The ID of the comment.
   * @returns {Promise<Comment|null>} A promise that resolves to the retrieved comment or null if not found.
   */
  async getCommentById(commentId) {
    const comment = await Comment.findByPk(commentId, {
      group: [
        "comment.id",
        "comment.text",
        "comment.parentId",
        "comment.blogId",
        "comment.createdAt",
        "comment.updatedAt",
        "user.id",
        "user.name",
        "user.profileImage",
        "commentLikes.userId",
        "commentLikes.commentId",
      ],
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
          where: { parentId: commentId },
        },
      ],
    });

    if (!comment?.id) return null;

    return comment;
  }

  /**
   * Retrieves a list of comments for a specific blog post with pagination support.
   * @param {string|number} blogId - The ID of the blog post.
   * @param {number} offset - The offset for pagination.
   * @param {number} limit - The maximum number of comments to retrieve.
   * @returns {Promise<{comments: Comment[], count: number, limit: number}>} A promise that resolves to an object containing the retrieved comments, the item count, and the limit.
   */
  async getCommentsByBlogId(blogId, offset, limit) {
    const { rows: comments, count } = await Comment.findAndCountAll({
      subQuery: false,
      where: { blogId, parentId: null },
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      group: [
        "comment.id",
        "comment.text",
        "comment.parentId",
        "comment.blogId",
        "comment.createdAt",
        "comment.updatedAt",
        "user.id",
        "user.name",
        "user.profileImage",
      ],
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
          separate: true,
        },
        {
          model: Comment,
          as: "replies",
          attributes: [],
          required: false,
          where: {
            parentId: Sequelize.literal('comment.id = "replies"."parentId"'),
          },
        },
      ],
    });

    return {
      comments,
      count: count.length,
      limit,
    };
  }

  /**
   * Retrieves a list of replies for a specific comment with pagination support.
   * @param {string|number} commentId - The ID of the parent comment.
   * @param {number} offset - The offset for pagination.
   * @param {number} limit - The maximum number of replies to retrieve.
   * @returns {Promise<{comments: Comment[], count: number, limit: number}>} A promise that resolves to an object containing the retrieved replies, the item count, and the limit.
   */
  async getRepliesByCommentId(commentId, offset, limit) {
    const { rows: comments, count } = await Comment.findAndCountAll({
      subQuery: false,
      where: { parentId: commentId },
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      group: [
        "comment.id",
        "comment.text",
        "comment.parentId",
        "comment.blogId",
        "comment.createdAt",
        "comment.updatedAt",
        "user.id",
        "user.name",
        "user.profileImage",
      ],
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
          separate: true,
        },
        {
          model: Comment,
          as: "replies",
          attributes: [],
          required: false,
          where: {
            parentId: Sequelize.literal('comment.id = "replies"."parentId"'),
          },
        },
      ],
    });

    return {
      comments,
      count: count.length,
      limit,
    };
  }

  /**
   * Updates a comment.
   * @param {string|number} commentId - The ID of the comment to update.
   * @param {string} text - The updated text content of the comment.
   * @returns {Promise<Comment|null>} A promise that resolves to the updated comment or null if not found.
   */
  async updateComment(commentId, text) {
    const comment = await this.getCommentById(commentId);

    if (!comment) return null;

    await comment.update({ text });

    return comment;
  }

  /**
   * Deletes a comment.
   * @param {string|number} commentId - The ID of the comment to delete.
   * @returns {Promise<Comment|null>} A promise that resolves to the deleted comment or null if not found.
   */
  async deleteComment(commentId) {
    const comment = await this.getCommentById(commentId);

    if (!comment) return null;

    await comment.destroy();

    return comment;
  }

  /**
   * Updates the like status of a comment.
   * @param {string|number} userId - The ID of the user.
   * @param {string|number} commentId - The ID of the comment.
   * @returns {Promise<boolean>} A promise that resolves to true if a new like was created, or false if the like was removed.
   */
  async updateCommentLike(userId, commentId) {
    const [like, created] = await CommentLike.findOrCreate({
      where: { userId, commentId },
      defaults: { userId, commentId },
    });

    if (!created && like) await like.destroy();

    return created;
  }
}

export const commentDB = new CommentDB();
