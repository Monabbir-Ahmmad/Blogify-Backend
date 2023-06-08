import { Comment } from "../../../../../models/comment.model.js";
import { CommentLike } from "../../../../../models/commentLike.model.js";
import { commentDB } from "../../../../../repositories/database/sequelize/comment.db.js";

jest.mock("../../../../../models/comment.model.js");
jest.mock("../../../../../models/commentLike.model.js");
jest.mock("../../../../../models/user.model.js");

describe("CommentDB", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createComment", () => {
    const blogId = 1;
    const userId = 1;
    const text = "Comment text";
    const parentId = null;
    const comment = {
      id: 1,
      text,
      parentId,
      blogId,
      userId,
      reload: jest.fn().mockImplementation(() => ({
        ...this,
        user: {
          id: 1,
          name: "John Doe",
          profileImage: "profile-image.jpg",
        },
        likes: [],
      })),
    };

    it("should create a comment on a blog post", async () => {
      Comment.create.mockResolvedValue(comment);

      const result = await commentDB.createComment(
        blogId,
        userId,
        text,
        parentId
      );

      expect(result).toEqual(comment);
    });

    it("should return null if comment creation fails", async () => {
      Comment.create.mockResolvedValue(null);

      const result = await commentDB.createComment(
        blogId,
        userId,
        text,
        parentId
      );

      expect(result).toBeNull();
    });
  });

  describe("getCommentById", () => {
    const commentId = 1;
    const comment = {
      id: commentId,
      text: "Comment text",
      parentId: null,
      blogId: 1,
      createdAt: "2021-01-01T00:00:00.000Z",
      updatedAt: "2021-01-01T00:00:00.000Z",
      user: {
        id: 1,
        name: "John Doe",
        profileImage: "profile-image.jpg",
      },
    };

    it("should retrieve a comment by its ID", async () => {
      Comment.findByPk.mockResolvedValue(comment);

      const result = await commentDB.getCommentById(commentId);

      expect(result).toEqual(comment);
    });

    it("should return null if comment is not found", async () => {
      Comment.findByPk.mockResolvedValue(null);

      const result = await commentDB.getCommentById(commentId);

      expect(result).toBeNull();
    });
  });

  describe("getCommentsByBlogId", () => {
    it("should retrieve a list of comments for a specific blog post with pagination", async () => {
      const blogId = 1;
      const offset = 0;
      const limit = 10;
      const comments = [];
      const count = [];
      Comment.findAndCountAll.mockResolvedValue({ rows: comments, count });

      const result = await commentDB.getCommentsByBlogId(blogId, offset, limit);

      expect(result).toEqual({ comments, count: 0, limit });
    });
  });

  describe("getRepliesByCommentId", () => {
    it("should retrieve a list of replies for a specific comment with pagination", async () => {
      const commentId = 1;
      const offset = 0;
      const limit = 10;
      const replies = [];
      const count = [];
      Comment.findAndCountAll.mockResolvedValue({ rows: replies, count });

      const result = await commentDB.getRepliesByCommentId(
        commentId,
        offset,
        limit
      );

      expect(result).toEqual({ comments: replies, count: 0, limit });
    });
  });

  describe("updateComment", () => {
    const commentId = 1;
    const text = "Updated comment";
    const updatedComment = { id: commentId, text };
    const comment = {
      id: commentId,
      text: "Comment text",
      update: jest.fn().mockResolvedValue(updatedComment),
    };

    it("should update a comment", async () => {
      commentDB.getCommentById = jest.fn().mockResolvedValue(comment);

      const result = await commentDB.updateComment(commentId, text);

      expect(commentDB.getCommentById).toHaveBeenCalledWith(commentId);
      expect(comment.update).toHaveBeenCalledWith({ text });
      expect(result).toEqual(comment);
    });

    it("should return null if comment is not found", async () => {
      commentDB.getCommentById = jest.fn().mockResolvedValue(null);

      const result = await commentDB.updateComment(commentId, text);

      expect(result).toBeNull();
    });
  });

  describe("deleteComment", () => {
    const commentId = 1;
    const comment = {
      id: commentId,
      text: "Comment text",
      destroy: jest.fn().mockReturnThis(),
    };
    it("should delete a comment", async () => {
      commentDB.getCommentById = jest.fn().mockResolvedValue(comment);

      const result = await commentDB.deleteComment(commentId);

      expect(result).toEqual(comment);
    });

    it("should return null if comment is not found", async () => {
      commentDB.getCommentById = jest.fn().mockResolvedValue(null);

      const result = await commentDB.deleteComment(commentId);

      expect(result).toBeNull();
    });
  });

  describe("updateCommentLike", () => {
    const userId = 1;
    const commentId = 1;
    const like = { id: 1 };

    it("should create a new like if it does not exist", async () => {
      CommentLike.findOrCreate.mockResolvedValue([like, true]);

      const result = await commentDB.updateCommentLike(userId, commentId);

      expect(CommentLike.findOrCreate).toHaveBeenCalledWith({
        where: { userId, commentId },
        defaults: { userId, commentId },
      });
      expect(result).toBe(true);
    });

    it("should remove the like if it already exists", async () => {
      CommentLike.findOrCreate.mockResolvedValue([like, false]);
      like.destroy = jest.fn().mockResolvedValue();

      const result = await commentDB.updateCommentLike(userId, commentId);

      expect(CommentLike.findOrCreate).toHaveBeenCalledWith({
        where: { userId, commentId },
        defaults: { userId, commentId },
      });
      expect(like.destroy).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
