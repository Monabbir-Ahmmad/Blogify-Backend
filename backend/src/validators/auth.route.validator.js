import { body } from "express-validator";

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

const refreshAccessToken = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required."),
];

export const authRouteValidator = {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
};
