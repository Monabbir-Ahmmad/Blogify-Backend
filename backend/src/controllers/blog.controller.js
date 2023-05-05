import { BlogPostReqDto } from "../dtos/request/blogPost.req.dto.js";
import { BlogUpdateReqDto } from "../dtos/request/blogUpdate.req.dto.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { blogService } from "../services/blog.service.js";
import { commonUtil } from "../utils/functions/common.util.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { responseUtil } from "../utils/functions/response.util.js";

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

const getBlogList = errorMiddleware.asyncHandler(async (req, res) => {
  const pagination = commonUtil.getPagination(req.query);

  const result = await blogService.getBlogs(pagination);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const getUserBlogList = errorMiddleware.asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const pagination = commonUtil.getPagination(req.query);

  const result = await blogService.getUserBlogs(userId, pagination);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const getBlog = errorMiddleware.asyncHandler(async (req, res) => {
  const blogId = req.params.blogId;

  const result = await blogService.getBlog(blogId);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

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

const deleteBlog = errorMiddleware.asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const blogId = req.params.blogId;

  const result = await blogService.deleteBlog(userId, blogId);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

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
