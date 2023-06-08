import { CommentResDto } from "../../../dtos/response/comment.res.dto.js";
import { PaginatedResDto } from "../../../dtos/response/paginated.res.dto.js";
import { StatusCode } from "../../../utils/statusCode.js";
import { commentController } from "../../../controllers/comment.controller.js";
import { commentService } from "../../../services/comment.service.js";
import { commonUtil } from "../../../utils/common.util.js";
import { responseUtil } from "../../../utils/response.util.js";

jest.mock("../../../services/comment.service.js");
jest.mock("../../../utils/common.util.js");
jest.mock("../../../utils/response.util.js");

describe("CommentController", () => {
  let req = {};
  const res = {};

  const expectedCommentResDto = new CommentResDto(
    1,
    "This is a comment",
    1,
    { id: 1, name: "John Doe" },
    "2021-01-01",
    "2021-01-01",
    [],
    0
  );

  const expectedPaginatedCommentResDto = new PaginatedResDto(
    [
      {
        ...expectedCommentResDto,
        id: 1,
      },
    ],
    1,
    10
  );

  beforeEach(() => {
    responseUtil.sendContentNegotiatedResponse.mockImplementationOnce();
    commonUtil.getPagination.mockReturnValue({ offset: 0, limit: 10 });
  });

  describe("postComment", () => {
    test("should post a comment and return the result", async () => {
      req = {
        user: {
          id: 1,
        },
        body: {
          blogId: 1,
          text: "This is a comment",
          parentId: "parent-comment-id",
        },
      };

      commentService.postComment.mockResolvedValueOnce(expectedCommentResDto);

      await commentController.postComment(req, res);

      expect(commentService.postComment).toHaveBeenCalledWith(
        req.body.blogId,
        req.user.id,
        req.body.text,
        req.body.parentId
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.CREATED,
        expectedCommentResDto
      );
    });
  });

  describe("getBlogComments", () => {
    test("should get the comments for a specific blog with pagination and return the result", async () => {
      req = {
        params: {
          blogId: 1,
        },
        query: {
          page: 1,
          limit: 10,
        },
      };

      commentService.getComments.mockResolvedValueOnce(
        expectedPaginatedCommentResDto
      );

      await commentController.getBlogComments(req, res);

      expect(commentService.getComments).toHaveBeenCalledWith(1, {
        offset: (req.query.page - 1) * req.query.limit,
        limit: 10,
      });
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedPaginatedCommentResDto
      );
    });
  });

  describe("getComment", () => {
    test("should get a specific comment and return the result", async () => {
      req = {
        params: {
          commentId: 1,
        },
      };

      commentService.getComment.mockResolvedValueOnce(expectedCommentResDto);

      await commentController.getComment(req, res);

      expect(commentService.getComment).toHaveBeenCalledWith(1);
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedCommentResDto
      );
    });
  });

  describe("getCommentReplies", () => {
    test("should get the replies for a specific comment with pagination and return the result", async () => {
      req = {
        params: {
          commentId: 1,
        },
        query: {
          page: 1,
          limit: 10,
        },
      };

      const expectedReplyResDto = new CommentResDto(
        2,
        "This is a comment",
        1,
        1,
        { id: 1, name: "John Doe" },
        "2021-01-01",
        "2021-01-01",
        [],
        0
      );

      const expectedPaginatedReplyResDto = new PaginatedResDto(
        [
          {
            ...expectedReplyResDto,
            id: 1,
          },
        ],
        1,
        10
      );

      commentService.getCommentReplies.mockResolvedValueOnce(
        expectedPaginatedReplyResDto
      );

      await commentController.getCommentReplies(req, res);

      expect(commentService.getCommentReplies).toHaveBeenCalledWith(1, {
        offset: (req.query.page - 1) * req.query.limit,
        limit: 10,
      });
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedPaginatedReplyResDto
      );
    });
  });

  describe("updateComment", () => {
    test("should update a specific comment and return the result", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          commentId: 1,
        },
        body: {
          text: "Updated comment",
        },
      };

      commentService.updateComment.mockResolvedValueOnce(expectedCommentResDto);

      await commentController.updateComment(req, res);

      expect(commentService.updateComment).toHaveBeenCalledWith(
        req.user.id,
        req.params.commentId,
        req.body.text
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedCommentResDto
      );
    });
  });

  describe("deleteComment", () => {
    test("should delete a specific comment and return the result", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          commentId: 1,
        },
      };

      commentService.deleteComment.mockResolvedValueOnce(expectedCommentResDto);

      await commentController.deleteComment(req, res);

      expect(commentService.deleteComment).toHaveBeenCalledWith(
        req.user.id,
        req.params.commentId
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedCommentResDto
      );
    });
  });

  describe("likeComment", () => {
    test("should update the like status of a specific comment and return the result", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          commentId: 1,
        },
      };

      commentService.updateCommentLike.mockResolvedValueOnce(
        expectedCommentResDto
      );

      await commentController.likeComment(req, res);

      expect(commentService.updateCommentLike).toHaveBeenCalledWith(
        req.user.id,
        req.params.commentId
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedCommentResDto
      );
    });
  });
});
