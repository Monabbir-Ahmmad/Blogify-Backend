import { body } from "express-validator";
import { commonUtil } from "../../utils/functions/common.util.js";

const profileUpdate = [
  body("name").notEmpty().withMessage("Name field can not be empty."),
  body("email").isEmail().withMessage("Invalid email address."),
  body("password").isStrongPassword().withMessage("Invalid password."),
  body("gender").notEmpty().withMessage("Gender field can not be empty."),
  body("birthDate")
    .trim()
    .isDate()
    .withMessage("Date of birth must be a valid date.")
    .bail()
    .custom((birthDate) => commonUtil.calculateAge(birthDate) >= 13)
    .withMessage("Must be at least 13 years old."),
  body("bio")
    .optional({ nullable: true })
    .notEmpty()
    .withMessage("Bio can not be empty."),
];

const passwordUpdate = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password required.")
    .bail()
    .isStrongPassword()
    .withMessage("Invalid old password."),
  body("newPassword")
    .notEmpty()
    .withMessage("New password required.")
    .bail()
    .isStrongPassword()
    .withMessage(
      "New password should have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
    ),
];

export const userRouteValidator = { profileUpdate, passwordUpdate };
