import { body, param } from "express-validator";

const post = [
  body("blogId")
    .notEmpty()
    .withMessage("Blog id is required.")
    .isNumeric()
    .withMessage("Blog id must be a number."),
  body("text")
    .isLength({ min: 1, max: 500 })
    .withMessage("Text must be between 1 and 500 characters long."),
  body("parentId")
    .optional({ nullable: true })
    .notEmpty()
    .withMessage("Parent comment id can not be empty."),
];

const update = [
  body("text")
    .isLength({ min: 1, max: 500 })
    .withMessage("Text must be between 1 and 500 characters long."),
];

const routeParam = [
  param("commentId").isNumeric().withMessage("Invalid comment id."),
];

export const commentRouteValidator = { post, update, routeParam };
