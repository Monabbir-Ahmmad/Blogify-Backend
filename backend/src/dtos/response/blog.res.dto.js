import { UserResDto } from "./user.res.dto.js";

/**
 * @category DTOs
 * @subcategory Response
 * @classdesc A class that defines the structure of the blog response DTO.
 * @property {string|number} id - The id of the blog post.
 * @property {string} title - The title of the blog post.
 * @property {string} content - The content of the blog post.
 * @property {string|null} [coverImage] - The cover image of the blog post.
 * @property {Date} createdAt - The date when the blog post was created.
 * @property {Date} updatedAt - The date when the blog post was updated.
 * @property {UserResDto} user - The user who created the blog post.
 * @property {any[]} likes - The likes of the blog post.
 * @property {number} commentCount - The comment count of the blog post.
 */
export class BlogResDto {
  constructor(
    id,
    title,
    content,
    coverImage,
    createdAt,
    updatedAt,
    user,
    likes,
    commentCount
  ) {
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
