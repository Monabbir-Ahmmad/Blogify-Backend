import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { validationResult } from "express-validator";

export const validationCheck = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError(
      StatusCode.BAD_REQUEST,
      errors
        .array()
        .map((e) => e.msg)
        .join(" ")
    );
  }

  next();
};
