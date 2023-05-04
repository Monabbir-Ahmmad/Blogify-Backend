import { UserResDto } from "./user.res.dto.js";

export class CommentResDto {
  /**
   * @param {Object} param
   * @param {number | string} param.id
   * @param {string} param.text
   * @param {number | string} param.parentId
   * @param {number | string} param.blogId
   * @param {UserResDto} param.user
   * @param {Date} param.createdAt
   * @param {Date} param.updatedAt
   * @param {number} param.replyCount
   */
  constructor({
    id,
    text,
    parentId,
    blogId,
    user,
    createdAt,
    updatedAt,
    replyCount,
  }) {
    this.id = id;
    this.text = text;
    this.parentId = parentId;
    this.blogId = blogId;
    this.user = user;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.replyCount = replyCount;
  }
}
