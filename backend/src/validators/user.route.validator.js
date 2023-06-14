import { body, param } from "express-validator";

import { commonUtil } from "../utils/common.util.js";

const profileUpdate = [
  body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .bail()
    .isLength({ max: 50, min: 2 })
    .withMessage("Name must be between 2 and 50 characters long."),
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Invalid email address."),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isLength({ max: 20, min: 8 })
    .withMessage("Invalid password.")
    .bail()
    .isStrongPassword()
    .withMessage("Invalid password."),
  body("gender")
    .optional({ nullable: true })
    .isLength({ max: 50, min: 1 })
    .withMessage("Gender must be between 1 and 50 characters long."),
  body("birthDate")
    .optional({ nullable: true })
    .notEmpty()
    .withMessage("Date of birth is required.")
    .bail()
    .trim()
    .isDate()
    .withMessage("Date of birth must be a valid date.")
    .bail()
    .custom((birthDate) => commonUtil.calculateAge(birthDate) >= 10)
    .withMessage("Must be at least 10 years old."),
  body("bio")
    .optional({ nullable: true })
    .isLength({ max: 500, min: 1 })
    .withMessage("Bio must be between 1 and 500 characters long."),
];

const passwordUpdate = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required.")
    .bail()
    .isLength({ max: 20, min: 8 })
    .withMessage("Invalid old password.")
    .bail()
    .isStrongPassword()
    .withMessage("Invalid old password."),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .bail()
    .isLength({ max: 20, min: 8 })
    .withMessage("New password must be between 8 and 20 characters long.")
    .bail()
    .isStrongPassword()
    .withMessage(
      "New password should have at least one uppercase letter, one lowercase letter, one number and one special character."
    )
    .custom((newPassword, { req }) => {
      if (newPassword === req.body.oldPassword) {
        throw new Error("New password and old password should not be same.");
      }
      return true;
    }),
];

const profileDelete = [
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isLength({ max: 20, min: 8 })
    .withMessage("Invalid password.")
    .bail()
    .isStrongPassword()
    .withMessage("Invalid password."),
];

const routeParam = [
  param("userId").isNumeric().withMessage("Invalid user id."),
];

export const userRouteValidator = {
  profileUpdate,
  passwordUpdate,
  profileDelete,
  routeParam,
};
