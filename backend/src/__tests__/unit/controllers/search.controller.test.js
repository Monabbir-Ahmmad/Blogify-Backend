import { BlogResDto } from "../../../dtos/response/blog.res.dto.js";
import { PaginatedResDto } from "../../../dtos/response/paginated.res.dto.js";
import { StatusCode } from "../../../utils/statusCode.js";
import { UserResDto } from "../../../dtos/response/user.res.dto.js";
import { blogService } from "../../../services/blog.service.js";
import { commonUtil } from "../../../utils/common.util.js";
import { responseUtil } from "../../../utils/response.util.js";
import { searchController } from "../../../controllers/search.controller.js";
import { userService } from "../../../services/user.service.js";

jest.mock("../../../services/blog.service.js");
jest.mock("../../../services/user.service.js");
jest.mock("../../../utils/common.util.js");
jest.mock("../../../utils/response.util.js");

describe("SearchController", () => {
  let req = {};
  const res = {};

  beforeEach(() => {
    responseUtil.sendContentNegotiatedResponse.mockImplementationOnce();
    commonUtil.getPagination.mockReturnValue({ offset: 0, limit: 10 });
  });

  describe("searchUser", () => {
    test("should search for users with a keyword and pagination and return the result", async () => {
      req = {
        params: {
          keyword: "john",
        },
        query: {
          page: 1,
          limit: 10,
        },
      };
      const expectedResult = new PaginatedResDto(1, [
        new UserResDto(
          1,
          "John Doe",
          "john.doe@email.com",
          "male",
          "1990-01-01",
          "normal",
          "profile-image.jpg",
          "cover-image.jpg",
          "Hello, I'm John Doe",
          "2021-01-01"
        ),
      ]);

      userService.searchUser.mockResolvedValueOnce(expectedResult);
      responseUtil.sendContentNegotiatedResponse.mockImplementationOnce();

      await searchController.searchUser(req, res);

      expect(userService.searchUser).toHaveBeenCalledWith("john", {
        offset: (req.query.page - 1) * req.query.limit,
        limit: 10,
      });
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedResult
      );
    });
  });

  describe("searchBlog", () => {
    test("should search for blogs with a keyword and pagination and return the result", async () => {
      req = {
        params: {
          keyword: "technology",
        },
        query: {
          page: 1,
          limit: 10,
        },
      };
      const expectedResult = new PaginatedResDto(1, [
        new BlogResDto(
          1,
          "Test Blog",
          "This is a test blog",
          "cover-image.jpg",
          "2021-01-01",
          "2021-01-01",
          { id: 1, name: "John Doe" },
          [],
          0
        ),
      ]);

      blogService.searchBlog.mockResolvedValueOnce(expectedResult);
      responseUtil.sendContentNegotiatedResponse.mockImplementationOnce();

      await searchController.searchBlog(req, res);

      expect(blogService.searchBlog).toHaveBeenCalledWith("technology", {
        offset: (req.query.page - 1) * req.query.limit,
        limit: 10,
      });
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedResult
      );
    });
  });
});
