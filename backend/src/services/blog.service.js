import { Blog } from "../models/blog.model.js";
import { BlogResDto } from "../dtos/response/blog.res.dto.js";
import { BlogUpdateReqDto } from "../dtos/request/blogUpdate.req.dto.js";
import { HttpError } from "../utils/objects/HttpError.js";
import { PaginatedResDto } from "../dtos/response/paginated.res.dto.js";
import { StatusCode } from "../utils/objects/StatusCode.js";
import { blogDB } from "../repositories/database/sequelize/blog.db.js";
import { mapper } from "../configs/mapper.config.js";
import { userService } from "./user.service.js";

/**
 * This is a class that provides blog-related services.
 */
export class BlogService {
  /**
   * @param {Object} dependencies - The dependencies needed by BlogService.
   */
  constructor({ userService, blogDB, mapper }) {
    this.userService = userService;
    this.blogDB = blogDB;
    this.mapper = mapper;
  }

  /**
   * Create a new blog post.
   * @param {string|number} userId - ID of the user creating the blog post.
   * @param {import("../dtos/request/blogPost.req.dto.js").BlogPostReqDto} blogPostReqDto - Blog post request DTO.
   * @returns {Promise<BlogResDto>} - Created blog post response DTO.
   */
  async createBlog(userId, blogPostReqDto) {
    await this.userService.getUser(userId);

    const blog = await this.blogDB.createBlog(userId, blogPostReqDto);

    return this.mapper.map(Blog, BlogResDto, blog);
  }

  /**
   * Get a blog post by ID.
   * @param {string|number} id - ID of the blog post.
   * @returns {Promise<BlogResDto>} - Retrieved blog post response DTO.
   * @throws {HttpError} 404 - Blog not found.
   */
  async getBlog(id) {
    const blog = await this.blogDB.getBlogById(id);

    if (!blog) throw new HttpError(StatusCode.NOT_FOUND, "Blog not found.");

    return this.mapper.map(Blog, BlogResDto, blog);
  }

  /**
   * Get a list of blogs with pagination.
   * @param {{offset: number, limit: number}} options - Pagination options.
   * @returns {Promise<PaginatedResDto<BlogResDto>>} - Paginated blog response DTO.
   */
  async getBlogs({ offset, limit }) {
    const { pageCount, blogs } = await this.blogDB.getBlogs(offset, limit);

    return new PaginatedResDto(
      pageCount,
      this.mapper.mapArray(Blog, BlogResDto, blogs)
    );
  }

  /**
   * Get a list of blogs by a user with pagination.
   * @param {string|number} userId - ID of the user.
   * @param {{offset: number, limit: number}} options - Pagination options (offset, limit).
   * @returns {Promise<PaginatedResDto<BlogResDto>>} - Paginated blog response DTO.
   */
  async getUserBlogs(userId, { offset, limit }) {
    await this.userService.getUser(userId);

    const { pageCount, blogs } = await this.blogDB.getUserBlogs(
      userId,
      offset,
      limit
    );

    return new PaginatedResDto(
      pageCount,
      this.mapper.mapArray(Blog, BlogResDto, blogs)
    );
  }

  /**
   * Update a blog post by ID.
   * @param {string|number} userId - ID of the user updating the blog post.
   * @param {string|number} blogId - ID of the blog post.
   * @param {import("../dtos/request/blogUpdate.req.dto.js").BlogUpdateReqDto} blogUpdateReqDto - Blog update request DTO.
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

    const updatedBlog = await this.blogDB.updateBlog(blogId, blogUpdateReqDto);

    return this.mapper.map(Blog, BlogResDto, updatedBlog);
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

    await this.blogDB.deleteBlog(blogId);
  }

  /**
   * Update the like status of a blog post.
   * @param {string|number} userId - ID of the user updating the like status.
   * @param {string|number} blogId - ID of the blog post.
   * @returns {Promise<BlogResDto>} - Updated blog post response DTO.
   */
  async updateBlogLike(userId, blogId) {
    await this.userService.getUser(userId);

    await this.getBlog(blogId);

    await this.blogDB.updateBlogLike(userId, blogId);

    return await this.getBlog(blogId);
  }

  /**
   * Search blogs by keyword with pagination.
   * @param {string} keyword - Search keyword.
   * @param {{offset: number, limit: number}} options - Pagination options (offset, limit).
   * @returns {Promise<PaginatedResDto<BlogResDto>>} - Paginated blog response DTO.
   */
  async searchBlog(keyword, { offset, limit }) {
    const { pageCount, blogs } = await this.blogDB.searchBlogByTitle(
      keyword,
      offset,
      limit
    );

    return new PaginatedResDto(
      pageCount,
      this.mapper.mapArray(Blog, BlogResDto, blogs)
    );
  }
}

export const blogService = new BlogService({
  userService,
  blogDB,
  mapper,
});
