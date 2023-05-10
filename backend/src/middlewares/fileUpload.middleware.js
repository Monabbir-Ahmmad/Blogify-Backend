import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
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
 * @type {multer.FileFilterCallback}
 * @param {Request} req The request object.
 * @param {multer.File} file The file object.
 * @param {multer.FileFilterCallback} cb The callback function.
 * @returns {multer.FileFilterCallback} The callback function.
 * @throws {HttpError} If the file is not an image file.
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
 * The multer middleware for file upload.
 * @type {multer.Multer}
 */
export const filesUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
