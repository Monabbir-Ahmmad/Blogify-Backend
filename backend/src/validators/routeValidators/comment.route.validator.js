import { check } from "express-validator";

const post = [
  check("blogId", "Blog id required.").notEmpty(),
  check("text", "Text can not be empty.").notEmpty(),
  check("parentId")
    .optional({ nullable: true })
    .notEmpty()
    .withMessage("Parent comment id required for comment reply."),
];

const update = [
  check("commentId", "Comment id required.").notEmpty(),
  check("text", "Text can not be empty.").notEmpty(),
];

export const commentRouteValidator = { post, update };
