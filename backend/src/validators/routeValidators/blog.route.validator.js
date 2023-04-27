import { check } from "express-validator";

const post = [
  check("title", "Title field can not be empty.")
    .notEmpty()
    .withMessage("Title field can not be empty.")
    .isLength({ max: 200 })
    .withMessage("Title is too large. Maximum length is 200 characters."),
  check("content", "Content field can not be empty.").notEmpty(),
];

const update = [
  check("blogId", "Blog id required.").notEmpty(),
  check("title")
    .optional({ nullable: true })
    .notEmpty()
    .withMessage("Title field can not be empty.")
    .isLength({ max: 200 })
    .withMessage("Title is too large. Maximum length is 200 characters."),
  check("content", "Content field can not be empty.")
    .optional({ nullable: true })
    .notEmpty(),
];

const like = [check("blogId", "Blog id required.").notEmpty()];

export const blogRouteValidator = { post, update, like };
