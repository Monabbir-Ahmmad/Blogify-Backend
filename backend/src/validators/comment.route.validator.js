import { body } from "express-validator";

const post = [
  body("blogId").notEmpty().withMessage("Blog id is required."),
  body("text").notEmpty().withMessage("Text is required."),
  body("parentId")
    .optional({ nullable: true })
    .notEmpty()
    .withMessage("Parent comment id can not be empty."),
];

const update = [body("text").notEmpty().withMessage("Text is required.")];

export const commentRouteValidator = { post, update };
