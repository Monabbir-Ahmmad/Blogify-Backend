import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (!file.mimetype.startsWith("image/"))
    return cb(
      new HttpError(StatusCode.FORBIDDEN, "Only image files are allowed."),
      false
    );

  return cb(null, true);
};

export const filesUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
