import { body, param } from "express-validator";
import { commonUtil } from "../utils/common.util.js";

const post = [
  body("title")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters long."),
  body("content")
    .notEmpty()
    .withMessage("Content is required.")
    .bail()
    .custom((content) => {
      const contentLength = commonUtil.extractTextFromHtml(content).length;
      return contentLength <= 5000;
    })
    .withMessage("Content can not be more than 5000 characters."),
];

const update = [
  body("title")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters long."),
  body("content")
    .custom((content) => {
      const contentLength = commonUtil.extractTextFromHtml(content).length;
      return contentLength > 0 && contentLength <= 5000;
    })
    .withMessage("Content must be between 1 and 5000 characters long."),
];

const routeParam = [
  param("blogId").isNumeric().withMessage("Invalid blog id."),
];

export const blogRouteValidator = { post, update, routeParam };
