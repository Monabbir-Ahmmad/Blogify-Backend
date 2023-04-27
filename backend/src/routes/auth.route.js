import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { authRouteValidator } from "../validators/routeValidators/auth.route.validator.js";
import { validationCheck } from "../middlewares/validation.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

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

authRouter.route("/forgot-password").post(authController.forgotPassword);

authRouter
  .route("/reset-password/:resetToken")
  .get(authController.resetPassword);

authRouter
  .route("/refresh-token")
  .post(
    authRouteValidator.refreshToken,
    validationCheck,
    authController.refreshAccessToken
  );
