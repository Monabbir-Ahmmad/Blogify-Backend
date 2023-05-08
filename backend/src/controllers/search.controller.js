import StatusCode from "../utils/objects/StatusCode.js";
import { blogService } from "../services/blog.service.js";
import { commonUtil } from "../utils/functions/common.util.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { responseUtil } from "../utils/functions/response.util.js";
import { userService } from "../services/user.service.js";

const searchUser = errorMiddleware.asyncHandler(async (req, res) => {
  const keyword = req.params.keyword;
  const pagination = commonUtil.getPagination(req.query);

  const result = await userService.searchUser(keyword, pagination);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const searchBlog = errorMiddleware.asyncHandler(async (req, res) => {
  const keyword = req.params.keyword;
  const pagination = commonUtil.getPagination(req.query);

  const result = await blogService.searchBlog(keyword, pagination);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

export const searchController = { searchUser, searchBlog };
