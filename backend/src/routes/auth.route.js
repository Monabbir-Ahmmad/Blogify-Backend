import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authRouteValidator } from "../validators/auth.route.validator.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const authRouter = Router();

authRouter
  .route("/signup")
  .post(
    authMiddleware.checkLoggedin,
    authRouteValidator.signup,
    validationCheck,
    errorMiddleware.asyncHandler(authController.signup)
  );

authRouter
  .route("/signin")
  .post(
    authMiddleware.checkLoggedin,
    authRouteValidator.signin,
    validationCheck,
    errorMiddleware.asyncHandler(authController.signin)
  );

authRouter
  .route("/signout")
  .post(errorMiddleware.asyncHandler(authController.signout));

authRouter
  .route("/forgot-password")
  .post(
    authRouteValidator.forgotPassword,
    validationCheck,
    errorMiddleware.asyncHandler(authController.forgotPassword)
  );

authRouter
  .route("/reset-password/:resetToken")
  .put(
    authRouteValidator.resetPassword,
    validationCheck,
    errorMiddleware.asyncHandler(authController.resetPassword)
  );

authRouter
  .route("/refresh-token")
  .post(errorMiddleware.asyncHandler(authController.refreshAccessToken));
