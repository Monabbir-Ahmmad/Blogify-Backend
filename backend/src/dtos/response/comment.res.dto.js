import { UserResDto } from "./user.res.dto.js";

/**
 * @category DTOs
 * @subcategory Response
 * @classdesc A class that defines the structure of the comment response DTO.
 * @property {string|number} id - The id of the comment.
 * @property {string} text - The text of the comment.
 * @property {string|null} [parentId] - The parent comment id of the comment.
 * @property {string|number} blogId - The blog id of the comment.
 * @property {UserResDto} user - The user who created the comment.
 * @property {Date} createdAt - The date when the comment was created.
 * @property {Date} updatedAt - The date when the comment was updated.
 * @property {any[]} likes - The likes of the comment.
 * @property {number} replyCount - The reply count of the comment.
 */
export class CommentResDto {
  constructor(
    id,
    text,
    parentId,
    blogId,
    user,
    createdAt,
    updatedAt,
    likes,
    replyCount
  ) {
    this.id = id;
    this.text = text;
    this.parentId = parentId;
    this.blogId = blogId;
    this.user = user;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.likes = likes;
    this.replyCount = replyCount;
  }
}
