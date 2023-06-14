import { body } from "express-validator";

const signup = [
  body("name")
    .notEmpty()
    .withMessage("Name is required.")
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
    .withMessage("Password must be between 8 and 20 characters long.")
    .bail()
    .isStrongPassword()
    .withMessage(
      "Password should have at least one uppercase letter, one lowercase letter, one number and one special character."
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
    .isLength({ max: 20, min: 8 })
    .withMessage("Invalid password.")
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
    .isLength({ max: 20, min: 8 })
    .withMessage("New password must be between 8 and 20 characters long.")
    .bail()
    .isStrongPassword()
    .withMessage(
      "Password should have at least one uppercase letter, one lowercase letter, one number and one special character."
    ),
  body("resetToken").notEmpty().withMessage("Reset token is required."),
];

export const authRouteValidator = {
  signup,
  signin,
  forgotPassword,
  resetPassword,
};
