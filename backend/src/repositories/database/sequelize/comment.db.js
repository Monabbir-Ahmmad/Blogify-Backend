import { Comment } from "../../../models/comment.model.js";
import { CommentLike } from "../../../models/commentLike.model.js";
import { Sequelize } from "sequelize";
import { User } from "../../../models/user.model.js";

/**
 * CommentDB is a class that provides database operations related to comments.
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
   * @param {string|number} id - The ID of the comment.
   * @returns {Promise<Comment|null>} A promise that resolves to the retrieved comment or null if not found.
   */
  async getCommentById(id) {
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
  }

  /**
   * Retrieves a list of comments for a specific blog post with pagination support.
   * @param {string|number} blogId - The ID of the blog post.
   * @param {number} offset - The offset for pagination.
   * @param {number} limit - The maximum number of comments to retrieve.
   * @returns {Promise<{pageCount: number, comments: Comment[]}>} A promise that resolves to an object containing the page count and the retrieved comments.
   */
  async getCommentsByBlogId(blogId, offset, limit) {
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
  }

  /**
   * Retrieves a list of replies for a specific comment with pagination support.
   * @param {string|number} commentId - The ID of the parent comment.
   * @param {number} offset - The offset for pagination.
   * @param {number} limit - The maximum number of replies to retrieve.
   * @returns {Promise<{pageCount: number, comments: Comment[]}>} A promise that resolves to an object containing the page count and the retrieved replies.
   */
  async getRepliesByCommentId(commentId, offset, limit) {
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
  }

  /**
   * Updates a comment.
   * @param {string|number} id - The ID of the comment to update.
   * @param {string} text - The updated text content of the comment.
   * @returns {Promise<Comment|null>} A promise that resolves to the updated comment or null if not found.
   */
  async updateComment(id, text) {
    const comment = await getCommentById(id);

    if (!comment) return null;

    await comment.update({ text });

    return comment;
  }

  /**
   * Deletes a comment.
   * @param {string|number} id - The ID of the comment to delete.
   * @returns {Promise<boolean>} A promise that resolves to true if the deletion was successful, or false otherwise.
   */
  async deleteComment(id) {
    const comment = await getCommentById(id);

    if (!comment) return false;

    await comment.destroy();

    return true;
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
