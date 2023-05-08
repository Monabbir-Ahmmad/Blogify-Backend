import { ValidationChain, body } from "express-validator";

import { commonUtil } from "../../utils/functions/common.util.js";

/**@type {ValidationChain[]} */
const profileUpdate = [
  body("name")
    .optional({ nullable: true })
    .notEmpty()
    .withMessage("Name field can not be empty."),
  body("email")
    .optional({ nullable: true })
    .isEmail()
    .withMessage("Invalid email address."),
  body("password").isStrongPassword().withMessage("Invalid password."),
  body("gender")
    .optional({ nullable: true })
    .notEmpty()
    .withMessage("Gender field can not be empty."),
  body("birthDate")
    .optional({ nullable: true })
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

/**@type {ValidationChain[]} */
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
