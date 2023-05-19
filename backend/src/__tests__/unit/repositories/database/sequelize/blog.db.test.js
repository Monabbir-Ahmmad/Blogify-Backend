import { Blog } from "../../../../../models/blog.model.js";
import { BlogPostReqDto } from "../../../../../dtos/request/blogPost.req.dto.js";
import { BlogUpdateReqDto } from "../../../../../dtos/request/blogUpdate.req.dto.js";
import { Like } from "../../../../../models/like.model.js";
import { blogDB } from "../../../../../repositories/database/sequelize/blog.db.js";

jest.mock("../../../../../models/blog.model.js");

describe("BlogDB", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBlog", () => {
    const userId = 1;
    const blogPostReqDto = new BlogPostReqDto({
      title: "Title",
      content: "Content",
    });

    const expectedBlog = {
      id: 1,
      ...blogPostReqDto,
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

    it("should create a new blog post and return it if successful", async () => {
      Blog.create.mockResolvedValue(expectedBlog);

      const result = await blogDB.createBlog(userId, blogPostReqDto);

      expect(Blog.create).toHaveBeenCalledWith({
        ...blogPostReqDto,
        userId,
      });
      expect(result).toEqual(expectedBlog);
    });

    it("should return null if blog creation is unsuccessful", async () => {
      Blog.create.mockResolvedValue(null);

      const result = await blogDB.createBlog(userId, blogPostReqDto);

      expect(Blog.create).toHaveBeenCalledWith({
        ...blogPostReqDto,
        userId,
      });
      expect(result).toBeNull();
    });
  });

  describe("getBlogById", () => {
    const blogId = 1;

    it("should retrieve a blog post by its ID if found", async () => {
      Blog.findByPk.mockResolvedValue({ id: blogId });

      const result = await blogDB.getBlogById(blogId);

      expect(result).toEqual({ id: blogId });
    });

    it("should return null if blog post is not found", async () => {
      Blog.findByPk.mockResolvedValue(null);

      const result = await blogDB.getBlogById(blogId);

      expect(result).toBeNull();
    });
  });

  describe("getBlogs", () => {
    it("should retrieve a list of blogs with pagination support", async () => {
      const offset = 0;
      const limit = 10;
      Blog.findAndCountAll.mockResolvedValue({ rows: [], count: [] });

      const result = await blogDB.getBlogs(offset, limit);

      expect(result).toEqual({
        pageCount: 0,
        blogs: [],
      });
    });
  });

  describe("getUserBlogs", () => {
    it("should retrieve a list of blogs by a specific user with pagination support", async () => {
      const userId = 1;
      const offset = 0;
      const limit = 10;
      Blog.findAndCountAll.mockResolvedValue({ rows: [], count: [] });

      const result = await blogDB.getUserBlogs(userId, offset, limit);

      expect(result).toEqual({ pageCount: 0, blogs: [] });
    });
  });

  describe("updateBlog", () => {
    const blogId = 1;
    const blogUpdateReqDto = new BlogUpdateReqDto({
      title: "Updated Title",
      content: "Updated Content",
    });
    const updatedBlog = {
      id: blogId,
      ...blogUpdateReqDto,
    };
    const blog = {
      id: blogId,
      update: jest.fn().mockResolvedValue(updatedBlog),
    };

    it("should update a blog post", async () => {
      blogDB.getBlogById = jest.fn().mockResolvedValue(blog);

      const result = await blogDB.updateBlog(blogId, blogUpdateReqDto);

      expect(result).toEqual(updatedBlog);
    });

    it("should return null if blog post is not found", async () => {
      blogDB.getBlogById = jest.fn().mockResolvedValue(null);

      const result = await blogDB.updateBlog(blogId, blogUpdateReqDto);

      expect(blogDB.getBlogById).toHaveBeenCalledWith(blogId);
      expect(result).toBeNull();
    });
  });

  describe("deleteBlog", () => {
    const blogId = 1;
    const blog = {
      id: blogId,
      destroy: jest.fn().mockReturnThis(),
    };

    it("should delete a blog post", async () => {
      blogDB.getBlogById = jest.fn().mockResolvedValue(blog);

      const result = await blogDB.deleteBlog(blogId);

      expect(result).toEqual(blog);
    });

    it("should return null if blog post is not found", async () => {
      blogDB.getBlogById = jest.fn().mockResolvedValue(null);

      const result = await blogDB.deleteBlog(blogId);

      expect(result).toBeNull();
    });
  });

  describe("updateBlogLike", () => {
    const userId = 1;
    const blogId = 1;
    const like = { destroy: jest.fn() };

    it("should update the like status of a blog post", async () => {
      Like.findOrCreate = jest.fn().mockResolvedValue([like, true]);

      const result = await blogDB.updateBlogLike(userId, blogId);

      expect(result).toBe(true);
    });

    it("should remove the like if it already exists", async () => {
      Like.findOrCreate = jest.fn().mockResolvedValue([like, false]);

      const result = await blogDB.updateBlogLike(userId, blogId);

      expect(result).toBe(false);
    });
  });
});
