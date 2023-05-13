import { BlogPostReqDto } from "../dtos/request/blogPost.req.dto.js";
import { BlogUpdateReqDto } from "../dtos/request/blogUpdate.req.dto.js";
import Express from "express";
import { StatusCode } from "../utils/StatusCode.js";
import { blogService } from "../services/blog.service.js";
import { commonUtil } from "../utils/common.util.js";
import { responseUtil } from "../utils/response.util.js";

/**
 * @category Controllers
 * @classdesc A class that provides controller functions for blog-related operations.
 */
class BlogController {
  /**
   * Create blog controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async createBlog(req, res) {
    const userId = req.user.id;
    const { title, content } = req.body;
    const coverImage = req.file?.filename;

    const result = await blogService.createBlog(
      userId,
      new BlogPostReqDto({
        title,
        content,
        coverImage,
      })
    );

    responseUtil.sendContentNegotiatedResponse(
      req,
      res,
      StatusCode.CREATED,
      result
    );
  }

  /**
   * Get blog list controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async getBlogList(req, res) {
    const pagination = commonUtil.getPagination(req.query);

    const result = await blogService.getBlogs(pagination);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Get user blog list controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async getUserBlogList(req, res) {
    const userId = req.params.userId;
    const pagination = commonUtil.getPagination(req.query);

    const result = await blogService.getUserBlogs(userId, pagination);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Get blog controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async getBlog(req, res) {
    const blogId = req.params.blogId;

    const result = await blogService.getBlog(blogId);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Update blog controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async updateBlog(req, res) {
    const userId = req.user.id;
    const blogId = req.params.blogId;
    const { title, content } = req.body;
    const coverImage = req.file?.filename || req.body.coverImage;

    const result = await blogService.updateBlog(
      userId,
      blogId,
      new BlogUpdateReqDto({ title, content, coverImage })
    );

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Delete blog controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async deleteBlog(req, res) {
    const userId = req.user.id;
    const blogId = req.params.blogId;

    const result = await blogService.deleteBlog(userId, blogId);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Like blog controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async likeBlog(req, res) {
    const userId = req.user.id;
    const blogId = req.params.blogId;

    const result = await blogService.updateBlogLike(userId, blogId);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }
}

export const blogController = new BlogController();
