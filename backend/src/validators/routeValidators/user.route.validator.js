import { check } from "express-validator";
import { commonUtil } from "../../utils/functions/common.util.js";

const profileUpdate = [
  check("name", "Name field can not be empty.")
    .optional({ nullable: true })
    .notEmpty(),
  check("email", "Invalid email address.")
    .optional({ nullable: true })
    .isEmail(),
  check("gender", "Gender field can not be empty.")
    .optional({ nullable: true })
    .notEmpty(),
  check("birthDate", "Date of birth must be a valid date.")
    .optional({ nullable: true })
    .trim()
    .isDate()
    .withMessage("Date of birth must be a valid date.")
    .bail()
    .custom((birthDate) => commonUtil.calculateAge(birthDate) >= 13)
    .withMessage("Must be at least 13 years old."),
  check("password", "Password required.").notEmpty(),
];

const passwordUpdate = [
  check("oldPassword").notEmpty().withMessage("Old password required."),
  check("newPassword")
    .notEmpty()
    .withMessage("New password required.")
    .bail()
    .isStrongPassword()
    .withMessage(
      "Password should have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
    ),
];

export const userRouteValidator = { profileUpdate, passwordUpdate };
