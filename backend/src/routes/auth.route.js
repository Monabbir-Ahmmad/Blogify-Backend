import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authRouteValidator } from "../validators/auth.route.validator.js";
import express from "express";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const authRouter = express.Router();

authRouter
  .route("/signup")
  .post(
    authMiddleware.checkLoggedin,
    authRouteValidator.signup,
    validationCheck,
    authController.signup
  );

authRouter
  .route("/signin")
  .post(
    authMiddleware.checkLoggedin,
    authRouteValidator.signin,
    validationCheck,
    authController.signin
  );

authRouter.route("/signout").post(authController.signout);

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
    authRouteValidator.refreshAccessToken,
    validationCheck,
    authController.refreshAccessToken
  );
