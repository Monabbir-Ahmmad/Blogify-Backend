import { ValidationChain, body } from "express-validator";

/**@type {ValidationChain[]} */
const post = [
  body("title")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters long."),
  body("content")
    .notEmpty()
    .withMessage("Content field can not be empty. Please write something."),
];

/**@type {ValidationChain[]} */
const update = [
  body("title")
    .optional({ nullable: true })
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters long."),
  body("content")
    .optional({ nullable: true })
    .notEmpty()
    .withMessage("Content field can not be empty."),
];

export const blogRouteValidator = { post, update };
