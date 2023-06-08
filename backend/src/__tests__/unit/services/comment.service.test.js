import { CommentResDto } from "../../../dtos/response/comment.res.dto.js";
import { HttpError } from "../../../utils/httpError.js";
import { PaginatedResDto } from "../../../dtos/response/paginated.res.dto.js";
import { StatusCode } from "../../../utils/statusCode.js";
import { blogService } from "../../../services/blog.service.js";
import { commentDB } from "../../../repositories/database/sequelize/comment.db.js";
import { commentService } from "../../../services/comment.service.js";
import { mapper } from "../../../configs/mapper.config.js";
import { userService } from "../../../services/user.service.js";

jest.mock("../../../repositories/database/sequelize/comment.db.js");
jest.mock("../../../configs/mapper.config.js");
jest.mock("../../../services/blog.service.js");
jest.mock("../../../services/user.service.js");

describe("CommentService", () => {
  const commentId = 1;
  const blogId = 1;
  const userId = 1;
  const text = "This is a comment";
  const parentId = 1;
  const comment = {
    id: commentId,
    text,
    blog: { id: blogId },
    user: { id: userId },
    parentId,
  };
  const expectedCommentResDto = new CommentResDto(
    commentId,
    text,
    parentId,
    blogId,
    comment.user
  );

  const offset = 0;
  const limit = 10;
  const count = 1;
  const comments = [{ ...comment, id: 1 }];

  const expectedCommentsResDto = comments.map(
    (comment) =>
      new CommentResDto(
        comment.id,
        comment.text,
        comment.parentId,
        comment.blog.id,
        comment.user
      )
  );
  const expectedPaginatedCommentResDto = new PaginatedResDto(
    expectedCommentsResDto,
    count,
    limit
  );

  beforeEach(() => {
    mapper.map.mockReturnValue(expectedCommentResDto);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getComment", () => {
    it("should get a comment by ID", async () => {
      commentDB.getCommentById.mockResolvedValue(comment);

      const result = await commentService.getComment(commentId);

      expect(result).toEqual(expectedCommentResDto);
    });

    it("should throw HttpError if comment is not found", async () => {
      commentDB.getCommentById.mockResolvedValue(null);

      await expect(commentService.getComment(commentId)).rejects.toThrow(
        new HttpError(StatusCode.NOT_FOUND, "Comment not found.")
      );
    });
  });

  describe("postComment", () => {
    const existingParentCommentResDto = new CommentResDto(
      parentId,
      "This is a parent comment"
    );

    beforeEach(() => {
      blogService.getBlog.mockResolvedValue();
      commentService.getComment = jest
        .fn()
        .mockResolvedValue(existingParentCommentResDto);
      commentDB.createComment.mockResolvedValue(comment);
    });

    it("should post a comment on a blog", async () => {
      const result = await commentService.postComment(
        blogId,
        userId,
        text,
        parentId
      );

      expect(result).toEqual(expectedCommentResDto);
    });

    it("should post a comment on a blog without a parent comment", async () => {
      expectedCommentResDto.parentId = null;
      const result = await commentService.postComment(blogId, userId, text);

      expect(result).toEqual(expectedCommentResDto);
    });
  });

  describe("getComments", () => {
    beforeEach(() => {
      commentDB.getCommentsByBlogId.mockResolvedValue({
        comments,
        count,
        limit,
      });
      mapper.mapArray.mockReturnValue(expectedCommentsResDto);
    });

    it("should get comments of a blog with pagination", async () => {
      const result = await commentService.getComments(blogId, {
        offset,
        limit,
      });

      expect(result).toEqual(expectedPaginatedCommentResDto);
    });
  });

  describe("getCommentReplies", () => {
    beforeEach(() => {
      commentDB.getRepliesByCommentId.mockResolvedValue({
        comments,
        count,
        limit,
      });
      mapper.mapArray.mockReturnValue(expectedCommentsResDto);
    });

    it("should get replies of a comment with pagination", async () => {
      const result = await commentService.getCommentReplies(commentId, {
        offset,
        limit,
      });

      expect(result).toEqual(expectedPaginatedCommentResDto);
    });
  });

  describe("updateComment", () => {
    const updatedComment = {
      ...comment,
      text: "Updated comment",
    };
    const expectedUpdatedCommentResDto = {
      ...expectedCommentResDto,
      text: updatedComment.text,
    };

    beforeEach(() => {
      commentService.getComment = jest
        .fn()
        .mockResolvedValue(expectedUpdatedCommentResDto);
      commentDB.updateComment.mockResolvedValue(updatedComment);
    });

    it("should update a comment by ID", async () => {
      comment.user.id = userId;

      const result = await commentService.updateComment(
        userId,
        commentId,
        text
      );

      expect(result).toEqual(expectedCommentResDto);
    });

    it("should throw HttpError if the user is not allowed to update the comment", async () => {
      comment.user.id = 2;

      await expect(
        commentService.updateComment(userId, commentId, text)
      ).rejects.toThrow(
        new HttpError(
          StatusCode.FORBIDDEN,
          "You are not allowed to update this comment."
        )
      );
    });
  });

  describe("deleteComment", () => {
    const deletedComment = { ...comment };

    beforeEach(() => {
      commentService.getComment = jest.fn().mockResolvedValue(comment);
      commentDB.deleteComment.mockResolvedValue(deletedComment);
    });

    it("should delete a comment by ID", async () => {
      comment.user = { id: userId };

      const result = await commentService.deleteComment(userId, commentId);

      expect(result).toEqual(expectedCommentResDto);
    });

    it("should throw HttpError if the user is not allowed to delete the comment", async () => {
      comment.user = { id: 2 };

      await expect(
        commentService.deleteComment(userId, commentId)
      ).rejects.toThrow(
        new HttpError(
          StatusCode.FORBIDDEN,
          "You are not allowed to delete this comment."
        )
      );
    });
  });

  describe("updateCommentLike", () => {
    const existingUser = {
      id: userId,
      name: "Test User",
      email: "text@ex.com",
    };

    beforeEach(() => {
      userService.getUser.mockResolvedValue(existingUser);
      commentService.getComment = jest
        .fn()
        .mockResolvedValue(expectedCommentResDto);
      commentDB.updateCommentLike.mockResolvedValue();
    });

    it("should update the like status of a comment", async () => {
      const result = await commentService.updateCommentLike(userId, commentId);

      expect(result).toEqual(expectedCommentResDto);
    });
  });
});
