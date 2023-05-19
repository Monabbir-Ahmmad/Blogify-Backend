import Express from "express";
import { HttpError } from "../utils/httpError.js";
import { StatusCode } from "../utils/statusCode.js";
import { cloudinary } from "../configs/cloudinary.config.js";
import { environment } from "../configs/environment.config.js";
import multer from "multer";

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
      new HttpError(
        StatusCode.FORBIDDEN,
        "Only jpg, jpeg and png files are allowed."
      ),
      false
    );

  if (file.size > 5 * 1024 * 1024)
    // 5 MB
    return cb(
      new HttpError(StatusCode.FORBIDDEN, "File size must be less than 5 MB."),
      false
    );

  return cb(null, true);
};

/**
 * Middleware for uploading an image to Cloudinary.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next function to pass control to the next middleware.
 * @returns {Promise<void>}
 */
export const uploadImage = async (req, res, next) => {
  if (!req.file) return next();

  cloudinary.uploader
    .upload_stream(
      {
        folder: environment.CLOUDINARY_FOLDER,
        resource_type: "image",
        transformation: [{ width: 1000, height: 1000, crop: "limit" }],
      },
      (error, result) => {
        if (error) {
          console.error(error);
          return next(
            new HttpError(
              StatusCode.INTERNAL_SERVER_ERROR,
              "Error while uploading image."
            )
          );
        }

        req.file = result;
        next();
      }
    )
    .end(req.file.buffer);
};

/**
 * @category Middlewares
 * @description A middleware function for uploading files.
 * @type {multer.Multer}
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});
