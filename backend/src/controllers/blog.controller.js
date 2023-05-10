import { BlogPostReqDto } from "../dtos/request/blogPost.req.dto.js";
import { BlogUpdateReqDto } from "../dtos/request/blogUpdate.req.dto.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { blogService } from "../services/blog.service.js";
import { commonUtil } from "../utils/functions/common.util.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { responseUtil } from "../utils/functions/response.util.js";

/**
 * @description Creates a new blog post
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @returns {void}
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
 * @description Gets a list of blogs
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @returns {void}
 */
const getBlogList = errorMiddleware.asyncHandler(async (req, res) => {
  const pagination = commonUtil.getPagination(req.query);

  const result = await blogService.getBlogs(pagination);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

/**
 * @description Gets a list of blogs by a user
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @returns {void}
 */
const getUserBlogList = errorMiddleware.asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const pagination = commonUtil.getPagination(req.query);

  const result = await blogService.getUserBlogs(userId, pagination);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

/**
 * @description Gets a blog by id
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @returns {void}
 */
const getBlog = errorMiddleware.asyncHandler(async (req, res) => {
  const blogId = req.params.blogId;

  const result = await blogService.getBlog(blogId);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

/**
 * @description Updates a blog post
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @returns {void}
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
 * @description Deletes a blog post
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @returns {void}
 */
const deleteBlog = errorMiddleware.asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const blogId = req.params.blogId;

  const result = await blogService.deleteBlog(userId, blogId);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

/**
 * @description Likes or removes like from a blog post
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @returns {void}
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
