import { check } from "express-validator";
import { commonUtil } from "../../utils/functions/common.util.js";

const signup = [
  check("name", "Name field can not be empty.").notEmpty(),
  check("email", "Invalid email address.").isEmail(),
  check(
    "password",
    "Password should have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
  ).isStrongPassword(),
  check("gender", "Gender field can not be empty.").notEmpty(),
  check("birthDate")
    .trim()
    .isDate()
    .withMessage("Date of birth must be a valid date.")
    .bail()
    .custom((birthDate) => commonUtil.calculateAge(birthDate) >= 13)
    .withMessage("Must be at least 13 years old."),
  check("bio", "Bio field can not be empty.")
    .optional({ nullable: true })
    .notEmpty(),
];

const signin = [check("email", "Invalid email address.").isEmail()];

const forgotPassword = [check("email", "Invalid email address.").isEmail()];

const resetPassword = [
  check(
    "newPassword",
    "Password should have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
  ).isStrongPassword(),
];

const refreshToken = [
  check("refreshToken", "Refresh Token required.").notEmpty(),
];

export const authRouteValidator = {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  refreshToken,
};
