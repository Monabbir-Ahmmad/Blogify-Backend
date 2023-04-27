import { check } from "express-validator";
import calculateAge from "../../utils/functions/calculateAge.js";

const signup = [
  check("name", "Name field can not be empty.").notEmpty(),
  check("email", "Invalid email address.").isEmail(),
  check("gender", "Gender field can not be empty.").notEmpty(),
  check("birthDate")
    .trim()
    .isDate()
    .withMessage("Date of birth must be a valid date.")
    .bail()
    .custom((birthDate) => calculateAge(birthDate) >= 13)
    .withMessage("Must be at least 13 years old."),
  check(
    "password",
    "Password should have at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
  ).isStrongPassword(),
];

const signin = [check("email", "Invalid email address.").isEmail()];

const refreshToken = [
  check("refreshToken", "Refresh Token required.").notEmpty(),
];

export const authRouteValidator = { signup, signin, refreshToken };
