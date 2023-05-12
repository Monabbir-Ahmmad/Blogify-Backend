/**
 * @category DTOs
 * @subcategory Request
 * @classdesc A class that defines the structure of the blog post request DTO.
 * @property {string} title - The title of the blog post.
 * @property {string} content - The content of the blog post.
 * @property {string|null} coverImage - The cover image of the blog post.
 */
export class BlogPostReqDto {
  /**
   * @param {Object} param
   * @param {string} param.title - The title of the blog post.
   * @param {string} param.content - The content of the blog post.
   * @param {string|null} [param.coverImage] - The cover image of the blog post.
   */
  constructor({ title, content, coverImage = null }) {
    this.title = title;
    this.content = content;
    this.coverImage = coverImage;
  }
}
