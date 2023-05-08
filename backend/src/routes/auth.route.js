import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authRouteValidator } from "../middlewares/validators/auth.route.validator.js";
import express from "express";
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

authRouter
  .route("/signout")
  .get(authMiddleware.verifyToken, authController.logoutUser);

authRouter
  .route("/forgot-password")
  .post(
    authRouteValidator.forgotPassword,
    validationCheck,
    authController.forgotPassword
  );

authRouter
  .route("/reset-password/:resetToken")
  .put(
    authRouteValidator.resetPassword,
    validationCheck,
    authController.resetPassword
  );

authRouter
  .route("/refresh-token")
  .post(
    authRouteValidator.refreshToken,
    validationCheck,
    authController.refreshAccessToken
  );
