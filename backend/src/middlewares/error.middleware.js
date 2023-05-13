import Express from "express";
import { HttpError } from "../utils/httpError.js";
import { StatusCode } from "../utils/statusCode.js";
import { commonUtil } from "../utils/common.util.js";
import { cookieUtil } from "../utils/cookie.util.js";
import { environment } from "../configs/environment.config.js";
import { responseUtil } from "../utils/response.util.js";

/**
 * @category Middlewares
 * @classdesc A class that provides error-related middleware.
 */
class ErrorMiddleware {
  /**
   * Middleware function to handle not found errors.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   * @param {Express.NextFunction} next - The next middleware function.
   */
  notFound(req, res, next) {
    throw new HttpError(StatusCode.NOT_FOUND, `Not found - ${req.originalUrl}`);
  }

  /**
   * Asynchronous error handler middleware function.
   * @param {function} fn - The asynchronous function to be handled.
   * @returns {function} - The middleware function.
   */
  asyncHandler(fn) {
    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
  }

  /**
   * Error handler middleware function.
   * @param {Error} err - The error object.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   * @param {Express.NextFunction} next - The next middleware function.
   */
  errorHandler(err, req, res, next) {
    if (!(err instanceof HttpError)) {
      console.error(err);
      err.statusCode = StatusCode.INTERNAL_SERVER_ERROR;
    }

    if (req.file) {
      commonUtil.deleteUploadedFile(req.file.filename);
    }

    if (err.statusCode === StatusCode.UNAUTHORIZED) {
      cookieUtil.clearAuthCookie(res);
    }

    responseUtil.sendContentNegotiatedResponse(req, res, err.statusCode, {
      statusCode: err.statusCode,
      message:
        environment.NODE_ENV === "development"
          ? err.message
          : "Internal server error.",
      stack: environment.NODE_ENV === "development" ? err.stack : null,
    });
  }
}

export const errorMiddleware = new ErrorMiddleware();
