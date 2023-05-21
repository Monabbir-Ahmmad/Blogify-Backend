import { body } from "express-validator";
import { commonUtil } from "../utils/common.util.js";

const profileUpdate = [
  body("name").notEmpty().withMessage("Name is required."),
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
    .withMessage("Bio can not be empty."),
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

export const userRouteValidator = {
  profileUpdate,
  passwordUpdate,
  profileDelete,
};
