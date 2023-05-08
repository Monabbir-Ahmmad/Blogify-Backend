import { ValidationChain, body } from "express-validator";

import { commonUtil } from "../../utils/functions/common.util.js";

/**@type {ValidationChain[]} */
const signup = [
  body("name").notEmpty().withMessage("Name field can not be empty."),
  body("email").isEmail().withMessage("Invalid email address."),
  body("password")
    .isStrongPassword()
    .withMessage(
      "Password should have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
    ),
  body("gender").notEmpty().withMessage("Gender field can not be empty."),
  body("birthDate")
    .trim()
    .isDate()
    .withMessage("Date of birth must be a valid date.")
    .bail()
    .custom((birthDate) => commonUtil.calculateAge(birthDate) >= 13)
    .withMessage("Must be at least 13 years old."),
];

/**@type {ValidationChain[]} */
const signin = [
  body("email").isEmail().withMessage("Invalid email address."),
  body("password")
    .isStrongPassword()
    .withMessage(
      "Password should have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
    ),
];

/**@type {ValidationChain[]} */
const forgotPassword = [
  body("email").isEmail().withMessage("Invalid email address."),
];

/**@type {ValidationChain[]} */
const resetPassword = [
  body("newPassword")
    .isStrongPassword()
    .withMessage(
      "Password should have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
    ),
];

/**@type {import("express-validator").ValidationChain[]} */
const refreshToken = [
  body("refreshToken").notEmpty().withMessage("Refresh token required."),
];

export const authRouteValidator = {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  refreshToken,
};
