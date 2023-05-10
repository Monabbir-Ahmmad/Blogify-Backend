import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { commonUtil } from "../utils/functions/common.util.js";
import { cookieUtil } from "../utils/functions/cookie.util.js";
import { environment } from "../configs/environment.config.js";
import { responseUtil } from "../utils/functions/response.util.js";

/**
 * @description This is for when a route is not found.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const notFound = (req, res, next) => {
  throw new HttpError(StatusCode.NOT_FOUND, `Not found - ${req.originalUrl}`);
};

/**
 * @description This is for handling async errors.
 * @param {Function} fn
 * @returns {Function}
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @description This is for handling errors.
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Function}
 */
const errorHandler = (err, req, res, next) => {
  if (!(err instanceof HttpError)) {
    console.error(err);
    err.statusCode = StatusCode.INTERNAL_SERVER_ERROR;
  }

  if (req.file) commonUtil.deleteUploadedFile(req.file.filename);

  if (err.statusCode === StatusCode.UNAUTHORIZED)
    cookieUtil.clearAuthCookie(res);

  responseUtil.sendContentNegotiatedResponse(req, res, err.statusCode, {
    statusCode: err.statusCode,
    message:
      environment.NODE_ENV === "development"
        ? err.message
        : "Internal server error.",
    stack: environment.NODE_ENV === "development" ? err.stack : null,
  });
};

export const errorMiddleware = { notFound, asyncHandler, errorHandler };
