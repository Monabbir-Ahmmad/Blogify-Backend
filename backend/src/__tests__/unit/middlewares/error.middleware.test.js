import { HttpError } from "../../../utils/httpError.js";
import { StatusCode } from "../../../utils/statusCode.js";
import { commonUtil } from "../../../utils/common.util.js";
import { cookieUtil } from "../../../utils/cookie.util.js";
import { environment } from "../../../configs/environment.config.js";
import { errorMiddleware } from "../../../middlewares/error.middleware.js";
import { responseUtil } from "../../../utils/response.util.js";

describe("ErrorMiddleware", () => {
  const req = {
    headers: { accept: "application/json" },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
  const next = jest.fn();

  describe("notFound", () => {
    it("should throw HttpError with status code 404 and 'Not found' message", () => {
      req.originalUrl = "/not-found";

      expect(() => errorMiddleware.notFound(req, res, next)).toThrow(
        new HttpError(StatusCode.NOT_FOUND, `Not found - ${req.originalUrl}`)
      );
    });
  });

  describe("asyncHandler", () => {
    it("should return a middleware function that handles asynchronous function", async () => {
      const asyncFn = async (req, res, next) => {
        await Promise.resolve();
        throw new Error("Async error");
      };

      const middleware = errorMiddleware.asyncHandler(asyncFn);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error("Async error"));
    });
  });

  describe("errorHandler", () => {
    it("should log the error and set status code to 500 if error is not an instance of HttpError", () => {
      const err = new Error("Internal server error");
      console.error = jest.fn();

      errorMiddleware.errorHandler(err, req, res, next);

      expect(console.error).toHaveBeenCalledWith(err);
      expect(err.statusCode).toBe(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it("should delete uploaded file if request has a file", () => {
      const err = new HttpError(StatusCode.BAD_REQUEST, "Bad request");
      req.file = { filename: "example.jpg" };

      commonUtil.deleteUploadedFile = jest.fn();

      errorMiddleware.errorHandler(err, req, res, next);

      expect(commonUtil.deleteUploadedFile).toHaveBeenCalledWith("example.jpg");
    });

    it("should clear authentication cookie if status code is 401", () => {
      const err = new HttpError(StatusCode.UNAUTHORIZED, "Unauthorized");
      cookieUtil.clearAuthCookie = jest.fn();

      errorMiddleware.errorHandler(err, req, res, next);

      expect(cookieUtil.clearAuthCookie).toHaveBeenCalledWith(res);
    });

    it("should send content-negotiated response with error details", () => {
      const err = new HttpError(StatusCode.NOT_FOUND, "Not found");
      environment.NODE_ENV = "development";
      responseUtil.sendContentNegotiatedResponse = jest.fn();

      errorMiddleware.errorHandler(err, req, res, next);

      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.NOT_FOUND,
        {
          statusCode: StatusCode.NOT_FOUND,
          message: "Not found",
          stack: err.stack,
        }
      );
    });
  });
});
