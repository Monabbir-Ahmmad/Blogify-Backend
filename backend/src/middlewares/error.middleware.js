import deleteUploadedFile from "../utils/functions/deleteUploadedFile.js";
import StatusCode from "../utils/objects/StatusCode.js";

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = StatusCode.NOT_FOUND;

  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (!err.statusCode) console.error(err);

  err.statusCode = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;

  if (req.file) deleteUploadedFile(req.file.filename);

  if (err.statusCode === StatusCode.UNAUTHORIZED)
    res.clearCookie("authorization");

  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: err.message,
  });
};

export const errorMiddleware = { notFound, errorHandler };
