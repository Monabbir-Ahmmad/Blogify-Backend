import { Comment } from "../models/comment.model.js";
import { CommentResDto } from "../dtos/response/comment.res.dto.js";
import { HttpError } from "../utils/objects/HttpError.js";
import { PaginatedResDto } from "../dtos/response/paginated.res.dto.js";
import { StatusCode } from "../utils/objects/StatusCode.js";
import { blogService } from "./blog.service.js";
import { commentDB } from "../repositories/database/sequelize/comment.db.js";
import { mapper } from "../configs/mapper.config.js";
import { userService } from "./user.service.js";

/**
 * This is a class that provides comment-related services.
 */
export class CommentService {
  /**
   * @param {Object} dependencies - The dependencies needed by CommentService.
   */
  constructor({ blogService, commentDB, mapper, userService }) {
    this.blogService = blogService;
    this.commentDB = commentDB;
    this.mapper = mapper;
    this.userService = userService;
  }

  /**
   * Get a comment by ID.
   * @param {string|number} commentId - ID of the comment.
   * @returns {Promise<CommentResDto>} - Retrieved comment response DTO.
   * @throws {HttpError} 404 - Comment not found.
   */
  async getComment(commentId) {
    const comment = await this.commentDB.getCommentById(commentId);

    if (!comment)
      throw new HttpError(StatusCode.NOT_FOUND, "Comment not found.");

    return this.mapper.map(Comment, CommentResDto, comment);
  }

  /**
   * Post a comment on a blog.
   * @param {string|number} blogId - ID of the blog.
   * @param {string|number} userId - ID of the user posting the comment.
   * @param {string} text - Comment text.
   * @param {string|number} [parentId] - ID of the parent comment (optional).
   * @returns {Promise<CommentResDto>} - Created comment response DTO.
   */
  async postComment(blogId, userId, text, parentId) {
    await this.blogService.getBlog(blogId);

    if (parentId) await this.getComment(parentId);

    const comment = await this.commentDB.createComment(
      blogId,
      userId,
      text,
      parentId
    );

    return this.mapper.map(Comment, CommentResDto, comment);
  }

  /**
   * Get comments of a blog with pagination.
   * @param {string|number} blogId - ID of the blog.
   * @param {{offset: number, limit: number}} options - Pagination options (offset, limit).
   * @returns {Promise<PaginatedResDto<CommentResDto>>} - Paginated comment response DTO.
   */
  async getComments(blogId, { offset, limit }) {
    await this.blogService.getBlog(blogId);

    const { pageCount, comments } = await this.commentDB.getCommentsByBlogId(
      blogId,
      offset,
      limit
    );

    return new PaginatedResDto(
      pageCount,
      this.mapper.mapArray(Comment, CommentResDto, comments)
    );
  }

  /**
   * Get replies of a comment with pagination.
   * @param {string|number} commentId - ID of the comment.
   * @param {{offset: number, limit: number}} options - Pagination options (offset, limit).
   * @returns {Promise<PaginatedResDto<CommentResDto>>} - Paginated comment response DTO.
   */
  async getCommentReplies(commentId, { offset, limit }) {
    await this.getComment(commentId);

    const { pageCount, comments } = await this.commentDB.getRepliesByCommentId(
      commentId,
      offset,
      limit
    );

    return new PaginatedResDto(
      pageCount,
      this.mapper.mapArray(Comment, CommentResDto, comments)
    );
  }

  /**
   * Update a comment by ID.
   * @param {string|number} userId - ID of the user updating the comment.
   * @param {string|number} commentId - ID of the comment.
   * @param {string} text - Updated comment text.
   * @returns {Promise<CommentResDto>} - Updated comment response DTO.
   * @throws {HttpError} 403 - You are not allowed to update this comment.
   */
  async updateComment(userId, commentId, text) {
    const comment = await this.getComment(commentId);

    if (comment.user.id !== userId)
      throw new HttpError(
        StatusCode.FORBIDDEN,
        "You are not allowed to update this comment."
      );

    const updatedComment = await this.commentDB.updateComment(commentId, text);

    return this.mapper.map(Comment, CommentResDto, updatedComment);
  }

  /**
   * Delete a comment by ID.
   * @param {string|number} userId - ID of the user deleting the comment.
   * @param {string|number} commentId - ID of the comment.
   * @returns {Promise<void>} - Deletion success message.
   * @throws {HttpError} 403 - You are not allowed to delete this comment.
   */
  async deleteComment(userId, commentId) {
    const comment = await this.getComment(commentId);

    if (comment.user.id !== userId)
      throw new HttpError(
        StatusCode.FORBIDDEN,
        "You are not allowed to delete this comment."
      );

    await this.commentDB.deleteComment(commentId);
  }

  /**
   * Update the like status of a comment.
   * @param {string|number} userId - ID of the user updating the like status.
   * @param {string|number} commentId - ID of the comment.
   * @returns {Promise<CommentResDto>} - Updated comment response DTO.
   */
  async updateCommentLike(userId, commentId) {
    await this.userService.getUser(userId);

    await this.getComment(commentId);

    await this.commentDB.updateCommentLike(userId, commentId);

    return await this.getComment(commentId);
  }
}

export const commentService = new CommentService({
  blogService,
  commentDB,
  mapper,
  userService,
});
