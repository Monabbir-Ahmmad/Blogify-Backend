import { BlogResDto } from "../../../dtos/response/blog.res.dto.js";
import { PaginatedResDto } from "../../../dtos/response/paginated.res.dto.js";
import { StatusCode } from "../../../utils/statusCode.js";
import { blogController } from "../../../controllers/blog.controller.js";
import { blogService } from "../../../services/blog.service.js";
import { commonUtil } from "../../../utils/common.util.js";
import { responseUtil } from "../../../utils/response.util.js";

jest.mock("../../../services/blog.service.js");
jest.mock("../../../utils/response.util.js");
jest.mock("../../../utils/common.util.js");

describe("BlogController", () => {
  let req = {};
  const res = {};

  const expectedBlogResDto = new BlogResDto(
    1,
    "Test Blog",
    "This is a test blog",
    "cover-image.jpg",
    "2021-01-01",
    "2021-01-01",
    { id: 1, name: "John Doe" },
    [],
    0
  );

  const expectedPaginatedBlogResDto = new PaginatedResDto(1, [
    {
      ...expectedBlogResDto,
      id: 1,
    },
    {
      ...expectedBlogResDto,
      id: 2,
    },
  ]);

  beforeEach(() => {
    responseUtil.sendContentNegotiatedResponse.mockImplementationOnce();
    commonUtil.getPagination.mockReturnValue({ offset: 0, limit: 10 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBlog", () => {
    it("should create a new blog and return the result", async () => {
      req = {
        user: {
          id: 1,
        },
        body: {
          title: "Test Blog",
          content: "This is a test blog",
        },
        file: {
          filename: "cover-image.jpg",
        },
      };

      blogService.createBlog.mockResolvedValueOnce(expectedBlogResDto);

      await blogController.createBlog(req, res);

      expect(blogService.createBlog).toHaveBeenCalledWith(
        req.user.id,
        expect.objectContaining({
          title: req.body.title,
          content: req.body.content,
          coverImage: req.file.filename,
        })
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.CREATED,
        expectedBlogResDto
      );
    });
  });

  describe("getBlogList", () => {
    it("should get the list of blogs with pagination and return the result", async () => {
      req = {
        query: {
          page: 1,
          limit: 10,
        },
      };

      blogService.getBlogs.mockResolvedValueOnce(expectedPaginatedBlogResDto);

      await blogController.getBlogList(req, res);

      expect(blogService.getBlogs).toHaveBeenCalledWith({
        offset: (req.query.page - 1) * req.query.limit,
        limit: 10,
      });
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedPaginatedBlogResDto
      );
    });
  });

  describe("getUserBlogList", () => {
    it("should get the list of blogs for a specific user with pagination and return the result", async () => {
      req = {
        params: {
          userId: 1,
        },
        query: {
          page: 1,
          limit: 10,
        },
      };

      blogService.getUserBlogs.mockResolvedValueOnce(
        expectedPaginatedBlogResDto
      );

      await blogController.getUserBlogList(req, res);

      expect(blogService.getUserBlogs).toHaveBeenCalledWith(1, {
        offset: (req.query.page - 1) * req.query.limit,
        limit: 10,
      });
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedPaginatedBlogResDto
      );
    });
  });

  describe("getBlog", () => {
    it("should get a specific blog and return the result", async () => {
      req = {
        params: {
          blogId: 1,
        },
      };

      blogService.getBlog.mockResolvedValueOnce(expectedBlogResDto);

      await blogController.getBlog(req, res);

      expect(blogService.getBlog).toHaveBeenCalledWith(1);
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedBlogResDto
      );
    });
  });

  describe("updateBlog", () => {
    it("should update a specific blog and return the result", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          blogId: 1,
        },
        body: {
          title: "Updated Blog",
          content: "This is an updated blog",
          coverImage: "updated-cover-image.jpg",
        },
        file: {
          filename: "new-cover-image.jpg",
        },
      };

      blogService.updateBlog.mockResolvedValueOnce(expectedBlogResDto);

      await blogController.updateBlog(req, res);

      expect(blogService.updateBlog).toHaveBeenCalledWith(
        req.user.id,
        req.params.blogId,
        expect.objectContaining({
          title: req.body.title,
          content: req.body.content,
          coverImage: req.file.filename || req.body.coverImage,
        })
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedBlogResDto
      );
    });
  });

  describe("deleteBlog", () => {
    it("should delete a specific blog and return the result", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          blogId: 1,
        },
      };

      blogService.deleteBlog.mockResolvedValueOnce(expectedBlogResDto);

      await blogController.deleteBlog(req, res);

      expect(blogService.deleteBlog).toHaveBeenCalledWith(
        req.user.id,
        req.params.blogId
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,

        res,
        StatusCode.OK,
        expectedBlogResDto
      );
    });
  });

  describe("likeBlog", () => {
    it("should update the like status of a specific blog and return the result", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          blogId: 1,
        },
      };

      blogService.updateBlogLike.mockResolvedValueOnce(expectedBlogResDto);

      await blogController.likeBlog(req, res);

      expect(blogService.updateBlogLike).toHaveBeenCalledWith(
        req.user.id,
        req.params.blogId
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedBlogResDto
      );
    });
  });
});
