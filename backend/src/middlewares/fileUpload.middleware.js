import Express from "express";
import { HttpError } from "../utils/HttpError.js";
import { StatusCode } from "../utils/StatusCode.js";
import multer from "multer";
import path from "path";

/**
 * The storage engine to use for file upload.
 * @type {multer.StorageEngine}
 */
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

/**
 * The file filter to use for file upload.
 * @param {Express.Request} req - The HTTP request object.
 * @param {multer.File} file - The file object to be uploaded.
 * @param {multer.FileFilterCallback} cb - The callback function to be called when the file is accepted or rejected.
 * @returns {multer.FileFilterCallback} - A callback function that accepts a boolean to indicate if the file should be accepted.
 * @throws {HttpError} - If the file is not an image file.
 */
const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (!file.mimetype.startsWith("image/"))
    return cb(
      new HttpError(StatusCode.FORBIDDEN, "Only image files are allowed."),
      false
    );

  return cb(null, true);
};

/**
 * @category Middlewares
 * @description A middleware function for uploading files.
 * @type {multer.Multer}
 */
export const filesUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
