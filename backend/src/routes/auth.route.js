import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { authRouteValidator } from "../validators/routeValidators/auth.route.validator.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const authRouter = express.Router();

authRouter
  .route("/signup")
  .post(
    authRouteValidator.signup,
    validationCheck,
    authController.registerUser
  );

authRouter
  .route("/signin")
  .post(authRouteValidator.signin, validationCheck, authController.loginUser);

authRouter.route("/signout").get(authController.logoutUser);

authRouter
  .route("/refreshtoken")
  .post(
    authRouteValidator.refreshToken,
    validationCheck,
    authController.refreshAccessToken
  );
