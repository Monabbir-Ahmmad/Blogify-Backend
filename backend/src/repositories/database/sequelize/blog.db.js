import { Op, Sequelize } from "sequelize";

import { Blog } from "../../../models/blog.model.js";
import { BlogPostReqDto } from "../../../dtos/request/blogPost.req.dto.js";
import { BlogUpdateReqDto } from "../../../dtos/request/blogUpdate.req.dto.js";
import { Comment } from "../../../models/comment.model.js";
import { Like } from "../../../models/like.model.js";
import { User } from "../../../models/user.model.js";

/**
 * @category Repositories
 * @subcategory Database
 * @classdesc A class that provides blog-related database operations.
 */
export class BlogDB {
  /**
   * Creates a new blog post.
   * @param {string|number} userId - The ID of the user creating the blog post.
   * @param {BlogPostReqDto} blogPostReqDto - The blog post request data.
   * @returns {Promise<Blog|null>} A promise that resolves to the created blog post or null if unsuccessful.
   */
  async createBlog(userId, blogPostReqDto) {
    const blog = await Blog.create({ ...blogPostReqDto, userId });

    if (!blog) return null;

    await blog.reload({
      include: [
        {
          model: User,
          attributes: ["id", "name", "profileImage"],
        },
        {
          model: Like,
          attributes: ["userId"],
          required: false,
        },
      ],
    });

    return blog;
  }

  /**
   * Retrieves a blog post by its ID.
   * @param {string|number} blogId - The ID of the blog post.
   * @returns {Promise<Blog|null>} A promise that resolves to the retrieved blog post or null if not found.
   */
  async getBlogById(blogId) {
    const blog = await Blog.findByPk(blogId, {
      group: [
        "blog.id",
        "blog.title",
        "blog.content",
        "blog.coverImage",
        "blog.createdAt",
        "blog.updatedAt",
        "user.id",
        "user.name",
        "user.profileImage",
        "likes.userId",
        "likes.blogId",
      ],
      attributes: [
        "id",
        "title",
        "content",
        "coverImage",
        "createdAt",
        "updatedAt",
        [Sequelize.fn("COUNT", Sequelize.col("comments.id")), "commentCount"],
      ],
      include: [
        {
          model: User,
          attributes: ["id", "name", "profileImage"],
        },
        {
          model: Like,
          attributes: ["userId"],
          required: false,
        },
        {
          model: Comment,
          attributes: [],
          required: false,
          where: { parentId: null },
        },
      ],
    });

    if (!blog?.id) return null;

    return blog;
  }

  /**
   * Retrieves a list of blogs with pagination support.
   * @param {number} offset - The offset for pagination.
   * @param {number} limit - The maximum number of blogs to retrieve.
   * @returns {Promise<{ blogs: Blog[], count: number, limit: number }>} A promise that resolves to an object containing the retrieved blogs, the item count, and the limit.
   */
  async getBlogs(offset, limit) {
    const { rows: blogs, count } = await Blog.findAndCountAll({
      subQuery: false,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      group: [
        "blog.id",
        "blog.title",
        "blog.content",
        "blog.coverImage",
        "blog.createdAt",
        "blog.updatedAt",
        "user.id",
        "user.name",
        "user.profileImage",
        "likes.userId",
        "likes.blogId",
      ],
      attributes: [
        "id",
        "title",
        "content",
        "coverImage",
        "createdAt",
        "updatedAt",
        [Sequelize.fn("COUNT", Sequelize.col("comments.id")), "commentCount"],
      ],
      include: [
        {
          model: User,
          attributes: ["id", "name", "profileImage"],
        },
        {
          model: Like,
          attributes: ["userId"],
          required: false,
        },
        {
          model: Comment,
          attributes: [],
          required: false,
          where: { parentId: null },
        },
      ],
    });

    return {
      blogs,
      count: count.length,
      limit,
    };
  }

  /**
   * Retrieves a list of blogs by a specific user with pagination support.
   * @param {string|number} userId - The ID of the user.
   * @param {number} offset - The offset for pagination.
   * @param {number} limit - The maximum number of blogs to retrieve.
   * @returns {Promise<{ blogs: Blog[], count: number, limit: number }>} A promise that resolves to an object containing the retrieved blogs, the item count, and the limit.
   */
  async getUserBlogs(userId, offset, limit) {
    const { rows: blogs, count } = await Blog.findAndCountAll({
      where: { userId },
      subQuery: false,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      group: [
        "blog.id",
        "blog.title",
        "blog.content",
        "blog.coverImage",
        "blog.createdAt",
        "blog.updatedAt",
        "user.id",
        "user.name",
        "user.profileImage",
        "likes.userId",
        "likes.blogId",
      ],
      attributes: [
        "id",
        "title",
        "content",
        "coverImage",
        "createdAt",
        "updatedAt",
        [Sequelize.fn("COUNT", Sequelize.col("comments.id")), "commentCount"],
      ],
      include: [
        {
          model: User,
          attributes: ["id", "name", "profileImage"],
        },
        {
          model: Like,
          attributes: ["userId"],
          required: false,
        },
        {
          model: Comment,
          attributes: [],
          required: false,
          where: { parentId: null },
        },
      ],
    });

    return {
      blogs,
      count: count.length,
      limit,
    };
  }

  /**
   * Updates a blog post.
   * @param {string|number} blogId - The ID of the blog post to update.
   * @param {BlogUpdateReqDto} blogUpdateReqDto - The blog post update request data.
   * @returns {Promise<Blog|null>} A promise that resolves to the updated blog post or null if not found.
   */
  async updateBlog(blogId, blogUpdateReqDto) {
    const blog = await this.getBlogById(blogId);

    if (!blog) return null;

    return await blog.update(blogUpdateReqDto);
  }

  /**
   * Deletes a blog post.
   * @param {string|number} blogId - The ID of the blog post to delete.
   * @returns {Promise<Blog|null>} A promise that resolves to the deleted blog post or null if not found.
   */
  async deleteBlog(blogId) {
    const blog = await this.getBlogById(blogId);

    if (!blog) return null;

    await blog.destroy();

    return blog;
  }

  /**
   * Updates the like status of a blog post.
   * @param {string|number} userId - The ID of the user.
   * @param {string|number} blogId - The ID of the blog post.
   * @returns {Promise<boolean>} A promise that resolves to true if a new like was created, or false if the like was removed.
   */
  async updateBlogLike(userId, blogId) {
    const [like, created] = await Like.findOrCreate({
      where: { userId, blogId },
      defaults: { userId, blogId },
    });

    if (!created && like) await like.destroy();

    return created;
  }

  /**
   * Searches for blogs by title with pagination support.
   * @param {string} keyword - The keyword to search for in blog titles.
   * @param {number} offset - The offset for pagination.
   * @param {number} limit - The maximum number of blogs to retrieve.
   * @returns {Promise<{blogs: Blog[], count: number, limit: number}>} A promise that resolves to an object containing the retrieved blogs, the item count, and the limit.
   */
  async searchBlogByTitle(keyword, offset, limit) {
    const { rows: blogs, count } = await Blog.findAndCountAll({
      where: { title: { [Op.substring]: keyword } },
      subQuery: false,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      group: [
        "blog.id",
        "blog.title",
        "blog.content",
        "blog.coverImage",
        "blog.createdAt",
        "blog.updatedAt",
        "user.id",
        "user.name",
        "user.profileImage",
        "likes.userId",
        "likes.blogId",
      ],
      attributes: [
        "id",
        "title",
        "content",
        "coverImage",
        "createdAt",
        "updatedAt",
        [Sequelize.fn("COUNT", Sequelize.col("comments.id")), "commentCount"],
      ],
      include: [
        {
          model: User,
          attributes: ["id", "name", "profileImage"],
        },
        {
          model: Like,
          attributes: ["userId"],
          required: false,
        },
        {
          model: Comment,
          attributes: [],
          required: false,
          where: { parentId: null },
        },
      ],
    });

    return {
      blogs,
      count: count.length,
      limit,
    };
  }
}

export const blogDB = new BlogDB();
