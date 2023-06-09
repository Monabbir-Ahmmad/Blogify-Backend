import Express from "express";
import { HttpError } from "../utils/httpError.js";
import { StatusCode } from "../utils/statusCode.js";
import { validationResult } from "express-validator";

/**
 * @category Middlewares
 * @description A middleware function for checking validation errors.s
 * @param {Express.Request} req - The HTTP request object.
 * @param {Express.Response} res - The HTTP response object.
 * @param {Express.NextFunction} next - The next middleware function.
 * @throws {HttpError} - Throws an error if any validation errors occurred.
 */
export const validationCheck = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(
      new HttpError(
        StatusCode.BAD_REQUEST,
        errors
          .array()
          .map((e) => e.msg)
          .join(" ")
      )
    );
  }

  next();
};
