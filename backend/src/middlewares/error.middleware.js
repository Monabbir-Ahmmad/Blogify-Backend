import { authUtil } from "../utils/functions/auth.util.js";
import { commonUtil } from "../utils/functions/common.util.js";
import { responseUtil } from "../utils/functions/response.util.js";
import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = StatusCode.NOT_FOUND;

  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (!(err instanceof HttpError)) {
    console.error(err);
    err.statusCode = StatusCode.INTERNAL_SERVER_ERROR;
  }

  if (req.file) commonUtil.deleteUploadedFile(req.file.filename);

  if (err.statusCode === StatusCode.UNAUTHORIZED) authUtil.clearAuthCookie(res);

  responseUtil.sendContentNegotiatedResponse(req, res, err.statusCode, {
    statusCode: err.statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export const errorMiddleware = { notFound, errorHandler };
