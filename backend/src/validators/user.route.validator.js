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
    .isStrongPassword()
    .withMessage("Invalid password."),
  body("gender")
    .optional({ nullable: true })
    .notEmpty()
    .withMessage("Gender is required."),
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
    .notEmpty()
    .withMessage("Bio can not be empty.")
    .bail()
    .isLength({ max: 500 })
    .withMessage("Bio can not be more than 500 characters."),
];

const passwordUpdate = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required.")
    .bail()
    .isStrongPassword()
    .withMessage("Invalid old password."),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .bail()
    .isStrongPassword()
    .withMessage(
      "New password should have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
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
