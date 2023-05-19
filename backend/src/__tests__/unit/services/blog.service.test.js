import { BlogPostReqDto } from "../../../dtos/request/blogPost.req.dto.js";
import { BlogResDto } from "../../../dtos/response/blog.res.dto.js";
import { BlogUpdateReqDto } from "../../../dtos/request/blogUpdate.req.dto.js";
import { HttpError } from "../../../utils/httpError.js";
import { PaginatedResDto } from "../../../dtos/response/paginated.res.dto.js";
import { blogDB } from "../../../repositories/database/sequelize/blog.db.js";
import { blogService } from "../../../services/blog.service.js";
import { mapper } from "../../../configs/mapper.config.js";
import { userService } from "../../../services/user.service.js";

jest.mock("../../../repositories/database/sequelize/blog.db.js");
jest.mock("../../../configs/mapper.config.js");
jest.mock("../../../services/user.service.js");

describe("BlogService", () => {
  const userId = 1;
  const blogId = 1;

  const blog = {
    id: blogId,
    title: "Test Blog",
    content: "Test Content",
    coverImage: "test.jpg",
    user: { id: userId },
  };

  const expectedBlogResDto = new BlogResDto(
    blogId,
    blog.title,
    blog.content,
    blog.coverImage,
    undefined,
    undefined,
    { id: userId }
  );

  const offset = 0;
  const limit = 10;
  const pageCount = 1;
  const blogs = [
    { ...blog, id: 1 },
    { ...blog, id: 2 },
  ];
  const expectedBlogsResDto = blogs.map(
    (blog) =>
      new BlogResDto(
        blog.id,
        blog.title,
        blog.content,
        blog.coverImage,
        undefined,
        undefined,
        { id: userId }
      )
  );
  const expectedPaginatedResDto = new PaginatedResDto(
    pageCount,
    expectedBlogsResDto
  );

  beforeEach(() => {
    mapper.map.mockReturnValue(expectedBlogResDto);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBlog", () => {
    beforeEach(() => {
      userService.getUser.mockResolvedValue();
      blogDB.createBlog.mockResolvedValue(blog);
    });

    it("should create a new blog post", async () => {
      const blogPostReqDto = new BlogPostReqDto({
        title: "Test Blog",
        content: "Test Content",
        coverImage: "test.jpg",
      });
      const result = await blogService.createBlog(userId, blogPostReqDto);
      expect(result).toEqual(expectedBlogResDto);
    });
  });

  describe("getBlog", () => {
    beforeEach(() => {});

    it("should get a blog post by ID", async () => {
      blogDB.getBlogById.mockResolvedValue(blog);
      const result = await blogService.getBlog(blogId);
      expect(result).toEqual(expectedBlogResDto);
    });

    it("should throw HttpError if blog not found", async () => {
      blogDB.getBlogById.mockResolvedValue(null);
      await expect(blogService.getBlog(blogId)).rejects.toThrow(HttpError);
    });
  });

  describe("getBlogs", () => {
    beforeEach(() => {
      blogDB.getBlogs.mockResolvedValue({ pageCount: 1, blogs });
      mapper.mapArray.mockReturnValue(expectedBlogsResDto);
    });

    it("should get a list of blogs with pagination", async () => {
      const result = await blogService.getBlogs({ offset, limit });
      expect(result).toEqual(expectedPaginatedResDto);
    });
  });

  describe("getUserBlogs", () => {
    beforeEach(() => {
      blogDB.getUserBlogs.mockResolvedValue({ pageCount: 1, blogs });
      mapper.mapArray.mockReturnValue(expectedBlogsResDto);
    });

    it("should get a list of blogs by a user with pagination", async () => {
      const result = await blogService.getUserBlogs(userId, { offset, limit });
      expect(result).toEqual(expectedPaginatedResDto);
    });
  });

  describe("updateBlog", () => {
    const blogUpdateReqDto = new BlogUpdateReqDto({
      title: "Updated Blog",
      content: "Updated Content",
      coverImage: "updated.jpg",
    });
    const updatedBlog = {
      id: blogId,
      title: "Updated Blog",
      content: "Updated Content",
      coverImage: "updated.jpg",
      user: { id: userId },
    };
    const expectedUpdatedBlogResDto = {
      ...expectedBlogResDto,
      ...blogUpdateReqDto,
    };

    beforeEach(() => {
      blogService.getBlog = jest.fn().mockResolvedValue(expectedBlogResDto);
      blogDB.updateBlog.mockResolvedValue(updatedBlog);
      mapper.map.mockReturnValue(expectedUpdatedBlogResDto);
    });

    it("should update a blog post by ID", async () => {
      const result = await blogService.updateBlog(
        userId,
        blogId,
        blogUpdateReqDto
      );
      expect(result).toEqual(expectedUpdatedBlogResDto);
    });

    it("should throw HttpError if user is not allowed to update the blog post", async () => {
      expectedBlogResDto.user.id = 2;
      await expect(
        blogService.updateBlog(userId, blogId, blogUpdateReqDto)
      ).rejects.toThrow(HttpError);
    });
  });

  describe("deleteBlog", () => {
    beforeEach(() => {
      blogService.getBlog = jest.fn().mockResolvedValue(expectedBlogResDto);
      blogDB.deleteBlog.mockResolvedValue(blog);
    });

    it("should delete a blog post by ID", async () => {
      expectedBlogResDto.user = { id: userId };
      const result = await blogService.deleteBlog(userId, blogId);
      expect(result).toEqual(expectedBlogResDto);
    });

    it("should throw HttpError if user is not allowed to delete the blog post", async () => {
      expectedBlogResDto.user = { id: 2 };
      await expect(blogService.deleteBlog(userId, blogId)).rejects.toThrow(
        HttpError
      );
    });
  });

  describe("updateBlogLike", () => {
    const existingUser = {
      id: userId,
      email: "text@ex.com",
      name: "John Doe",
    };
    beforeEach(() => {
      blogService.getBlog = jest.fn().mockResolvedValue(expectedBlogResDto);
      userService.getUser.mockResolvedValue(existingUser);
      blogDB.updateBlogLike.mockResolvedValue();
    });

    it("should update the like status of a blog post", async () => {
      const result = await blogService.updateBlogLike(userId, blogId);
      expect(result).toEqual(expectedBlogResDto);
    });
  });

  describe("searchBlog", () => {
    const keyword = "test";

    beforeEach(() => {
      blogDB.searchBlogByTitle.mockResolvedValue({ pageCount, blogs });
      mapper.mapArray.mockReturnValue(expectedBlogsResDto);
    });

    it("should search blogs by keyword with pagination", async () => {
      const result = await blogService.searchBlog(keyword, { offset, limit });
      expect(result).toEqual(expectedPaginatedResDto);
    });
  });
});
