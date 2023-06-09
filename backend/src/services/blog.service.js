import { Blog } from "../models/blog.model.js";
import { BlogPostReqDto } from "../dtos/request/blogPost.req.dto.js";
import { BlogResDto } from "../dtos/response/blog.res.dto.js";
import { BlogUpdateReqDto } from "../dtos/request/blogUpdate.req.dto.js";
import { HttpError } from "../utils/httpError.js";
import { PaginatedResDto } from "../dtos/response/paginated.res.dto.js";
import { StatusCode } from "../utils/statusCode.js";
import { blogDB } from "../repositories/database/sequelize/blog.db.js";
import { mapper } from "../configs/mapper.config.js";
import { userService } from "./user.service.js";

/**
 * @category Services
 * @classdesc A class that provides blog-related services.
 */
export class BlogService {
  /**
   * Create a new blog post.
   * @param {string|number} userId - ID of the user creating the blog post.
   * @param {BlogPostReqDto} blogPostReqDto - Blog post request DTO.
   * @returns {Promise<BlogResDto>} - Created blog post response DTO.
   */
  async createBlog(userId, blogPostReqDto) {
    await userService.getUser(userId);

    const blog = await blogDB.createBlog(userId, blogPostReqDto);

    return mapper.map(Blog, BlogResDto, blog);
  }

  /**
   * Get a blog post by ID.
   * @param {string|number} blogId - ID of the blog post.
   * @returns {Promise<BlogResDto>} - Retrieved blog post response DTO.
   * @throws {HttpError} 404 - Blog not found.
   */
  async getBlog(blogId) {
    const blog = await blogDB.getBlogById(blogId);

    if (!blog) throw new HttpError(StatusCode.NOT_FOUND, "Blog not found.");

    return mapper.map(Blog, BlogResDto, blog);
  }

  /**
   * Get a list of blogs with pagination.
   * @param {{offset: number, limit: number}} options - Pagination options.
   * @returns {Promise<PaginatedResDto<BlogResDto>>} - Paginated blog response DTO.
   */
  async getBlogs({ offset, limit }) {
    const {
      blogs,
      count,
      limit: pageSize,
    } = await blogDB.getBlogs(offset, limit);

    return new PaginatedResDto(
      mapper.mapArray(Blog, BlogResDto, blogs),
      count,
      pageSize
    );
  }

  /**
   * Get a list of blogs by a user with pagination.
   * @param {string|number} userId - ID of the user.
   * @param {{offset: number, limit: number}} options - Pagination options (offset, limit).
   * @returns {Promise<PaginatedResDto<BlogResDto>>} - Paginated blog response DTO.
   */
  async getUserBlogs(userId, { offset, limit }) {
    const {
      blogs,
      count,
      limit: pageSize,
    } = await blogDB.getUserBlogs(userId, offset, limit);

    return new PaginatedResDto(
      mapper.mapArray(Blog, BlogResDto, blogs),
      count,
      pageSize
    );
  }

  /**
   * Update a blog post by ID.
   * @param {string|number} userId - ID of the user updating the blog post.
   * @param {string|number} blogId - ID of the blog post.
   * @param {BlogUpdateReqDto} blogUpdateReqDto - Blog update request DTO.
   * @returns {Promise<BlogResDto>} - Updated blog post response DTO.
   * @throws {HttpError} 403 - Forbidden if the user is not allowed to update the blog post.
   */
  async updateBlog(userId, blogId, blogUpdateReqDto) {
    const blog = await this.getBlog(blogId);

    if (blog.user.id !== userId) {
      throw new HttpError(
        StatusCode.FORBIDDEN,
        "You are not allowed to update this blog."
      );
    }

    const updatedBlog = await blogDB.updateBlog(blogId, blogUpdateReqDto);

    return mapper.map(Blog, BlogResDto, updatedBlog);
  }

  /**
   * Delete a blog post by ID.
   * @param {string|number} userId - ID of the user deleting the blog post.
   * @param {string|number} blogId - ID of the blog post.
   * @returns {Promise<void>}
   * @throws {HttpError} 403 - Forbidden if the user is not allowed to delete the blog post.
   */
  async deleteBlog(userId, blogId) {
    const blog = await this.getBlog(blogId);

    if (blog.user.id !== userId) {
      throw new HttpError(
        StatusCode.FORBIDDEN,
        "You are not allowed to delete this blog."
      );
    }

    const deletedBlog = await blogDB.deleteBlog(blogId);

    return mapper.map(Blog, BlogResDto, deletedBlog);
  }

  /**
   * Update the like status of a blog post.
   * @param {string|number} userId - ID of the user updating the like status.
   * @param {string|number} blogId - ID of the blog post.
   * @returns {Promise<BlogResDto>} - Updated blog post response DTO.
   */
  async updateBlogLike(userId, blogId) {
    await userService.getUser(userId);

    await this.getBlog(blogId);

    await blogDB.updateBlogLike(userId, blogId);

    return await this.getBlog(blogId);
  }

  /**
   * Search blogs by keyword with pagination.
   * @param {string} keyword - Search keyword.
   * @param {{offset: number, limit: number}} options - Pagination options (offset, limit).
   * @returns {Promise<PaginatedResDto<BlogResDto>>} - Paginated blog response DTO.
   */
  async searchBlog(keyword, { offset, limit }) {
    const {
      blogs,
      count,
      limit: pageSize,
    } = await blogDB.searchBlogByTitle(keyword, offset, limit);

    return new PaginatedResDto(
      mapper.mapArray(Blog, BlogResDto, blogs),
      count,
      pageSize
    );
  }
}

export const blogService = new BlogService();
