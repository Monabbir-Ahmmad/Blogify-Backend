import { BlogPostReqDto } from "../dtos/request/blogPost.req.dto.js";
import { BlogUpdateReqDto } from "../dtos/request/blogUpdate.req.dto.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { blogService } from "../services/blog.service.js";
import { commonUtil } from "../utils/functions/common.util.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { responseUtil } from "../utils/functions/response.util.js";

/**
 * Creates a new blog post
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 */
const createBlog = errorMiddleware.asyncHandler(async (req, res) => {
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
});

/**
 * Gets a list of blogs
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 */
const getBlogList = errorMiddleware.asyncHandler(async (req, res) => {
  const pagination = commonUtil.getPagination(req.query);

  const result = await blogService.getBlogs(pagination);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

/**
 * Gets a list of blogs by a user
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 */
const getUserBlogList = errorMiddleware.asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const pagination = commonUtil.getPagination(req.query);

  const result = await blogService.getUserBlogs(userId, pagination);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

/**
 * Gets a blog by id
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 */
const getBlog = errorMiddleware.asyncHandler(async (req, res) => {
  const blogId = req.params.blogId;

  const result = await blogService.getBlog(blogId);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

/**
 * Updates a blog post
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 */
const updateBlog = errorMiddleware.asyncHandler(async (req, res) => {
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
});

/**
 * Deletes a blog post
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 */
const deleteBlog = errorMiddleware.asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const blogId = req.params.blogId;

  const result = await blogService.deleteBlog(userId, blogId);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

/**
 * Likes or removes like from a blog post
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 */
const likeBlog = errorMiddleware.asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const blogId = req.params.blogId;

  const result = await blogService.updateBlogLike(userId, blogId);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

export const blogController = {
  createBlog,
  getBlogList,
  getUserBlogList,
  getBlog,
  updateBlog,
  likeBlog,
  deleteBlog,
};
