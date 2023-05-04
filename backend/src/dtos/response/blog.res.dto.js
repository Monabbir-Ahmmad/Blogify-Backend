// @ts-check

import { UserResDto } from "./user.res.dto.js";

export class BlogResDto {
  /**
   * @param {Object} param
   * @param {number | string} param.id
   * @param {string} param.title
   * @param {string} param.content
   * @param {string} [param.coverImage]
   * @param {Date} param.createdAt
   * @param {Date} param.updatedAt
   * @param {UserResDto} param.user
   * @param {any[]} param.likes
   * @param {number} param.commentCount
   */
  constructor({
    id,
    title,
    content,
    coverImage,
    createdAt,
    updatedAt,
    user,
    likes,
    commentCount,
  }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.coverImage = coverImage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.user = user;
    this.likes = likes;
    this.commentCount = commentCount;
  }
}
