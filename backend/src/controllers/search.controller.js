import StatusCode from "../utils/objects/StatusCode.js";
import { blogService } from "../services/blog.service.js";
import { commonUtil } from "../utils/functions/common.util.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { responseUtil } from "../utils/functions/response.util.js";
import { userService } from "../services/user.service.js";

/**
 * @description Gets a list of blogs by a user name
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @returns {void}
 */
const searchUser = errorMiddleware.asyncHandler(async (req, res) => {
  const keyword = req.params.keyword;
  const pagination = commonUtil.getPagination(req.query);

  const result = await userService.searchUser(keyword, pagination);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

/**
 * @description Gets a list of blogs by a title
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @returns {void}
 */
const searchBlog = errorMiddleware.asyncHandler(async (req, res) => {
  const keyword = req.params.keyword;
  const pagination = commonUtil.getPagination(req.query);

  const result = await blogService.searchBlog(keyword, pagination);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

export const searchController = { searchUser, searchBlog };
