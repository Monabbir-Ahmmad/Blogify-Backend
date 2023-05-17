import Express from "express";
import { StatusCode } from "../utils/statusCode.js";
import { commentService } from "../services/comment.service.js";
import { commonUtil } from "../utils/common.util.js";
import { responseUtil } from "../utils/response.util.js";

/**
 * @category Controllers
 * @classdesc A class that provides controller functions for comment-related operations.
 */
export class CommentController {
  /**
   * Post comment controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async postComment(req, res) {
    const userId = req.user.id;
    const { blogId, text, parentId } = req.body;

    const result = await commentService.postComment(
      blogId,
      userId,
      text,
      parentId
    );

    responseUtil.sendContentNegotiatedResponse(
      req,
      res,
      StatusCode.CREATED,
      result
    );
  }

  /**
   * Get blog comments controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async getBlogComments(req, res) {
    const blogId = req.params.blogId;
    const pagination = commonUtil.getPagination(req.query);

    const result = await commentService.getComments(blogId, pagination);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Get comment controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async getComment(req, res) {
    const commentId = req.params.commentId;

    const result = await commentService.getComment(commentId);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Get comment replies controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async getCommentReplies(req, res) {
    const commentId = req.params.commentId;
    const pagination = commonUtil.getPagination(req.query);

    const result = await commentService.getCommentReplies(
      commentId,
      pagination
    );

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Update comment controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async updateComment(req, res) {
    const userId = req.user.id;
    const commentId = req.params.commentId;
    const { text } = req.body;

    const result = await commentService.updateComment(userId, commentId, text);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Delete comment controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async deleteComment(req, res) {
    const userId = req.user.id;
    const commentId = req.params.commentId;

    const result = await commentService.deleteComment(userId, commentId);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Like comment controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async likeComment(req, res) {
    const userId = req.user.id;
    const commentId = req.params.commentId;

    const result = await commentService.updateCommentLike(userId, commentId);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }
}

export const commentController = new CommentController();
