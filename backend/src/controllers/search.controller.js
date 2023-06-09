import Express from "express";
import { StatusCode } from "../utils/statusCode.js";
import { blogService } from "../services/blog.service.js";
import { commonUtil } from "../utils/common.util.js";
import { responseUtil } from "../utils/response.util.js";
import { userService } from "../services/user.service.js";

/**
 * @category Controllers
 * @classdesc A class that provides controller functions for search-related operations.
 */
export class SearchController {
  /**
   * Search user controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async searchUser(req, res) {
    const keyword = req.params.keyword;
    const pagination = commonUtil.getPagination(req.query);

    const result = await userService.searchUser(keyword, pagination);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Search blog controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async searchBlog(req, res) {
    const keyword = req.params.keyword;
    const pagination = commonUtil.getPagination(req.query);

    const result = await blogService.searchBlog(keyword, pagination);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }
}

export const searchController = new SearchController();
