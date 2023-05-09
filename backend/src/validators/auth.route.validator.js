import { body } from "express-validator";
import { commonUtil } from "../utils/functions/common.util.js";

const signup = [
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
    .withMessage(
      "Password should have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
    ),
  body("gender").notEmpty().withMessage("Gender is required."),
  body("birthDate")
    .notEmpty()
    .withMessage("Date of birth is required.")
    .bail()
    .trim()
    .isDate()
    .withMessage("Date of birth must be a valid date.")
    .bail()
    .custom((birthDate) => commonUtil.calculateAge(birthDate) >= 13)
    .withMessage("Must be at least 13 years old."),
];

const signin = [
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
];

const forgotPassword = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Invalid email address."),
];

const resetPassword = [
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .bail()
    .isStrongPassword()
    .withMessage(
      "Password should have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
    ),
];

const refreshToken = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required."),
];

export const authRouteValidator = {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  refreshToken,
};
