import { body } from "express-validator";

const post = [
  body("blogId").notEmpty().withMessage("Blog id required."),
  body("text").notEmpty().withMessage("Text can not be empty."),
  body("parentId")
    .optional({ nullable: true })
    .notEmpty()
    .withMessage("Parent comment id can not be empty."),
];

const update = [body("text").notEmpty().withMessage("Text can not be empty.")];

export const commentRouteValidator = { post, update };
