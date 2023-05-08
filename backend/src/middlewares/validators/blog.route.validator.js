import { body } from "express-validator";

const post = [
  body("title")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters long."),
  body("content")
    .notEmpty()
    .withMessage("Content field can not be empty. Please write something."),
];

const update = [
  body("title")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters long."),
  body("content").notEmpty().withMessage("Content field can not be empty."),
];

export const blogRouteValidator = { post, update };
