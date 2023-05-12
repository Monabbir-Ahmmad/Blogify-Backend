import { authMiddleware } from "../middlewares/auth.middleware.js";
import express from "express";
import { filesUpload } from "../middlewares/fileUpload.middleware.js";
import { userController } from "../controllers/user.controller.js";
import { userRouteValidator } from "../validators/user.route.validator.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const userRouter = express.Router();

userRouter
  .route("/profile-image/:userId")
  .put(
    authMiddleware.verifyToken,
    filesUpload.single("userProfileImage"),
    userController.updateProfileImage
  );

userRouter
  .route("/cover-image/:userId")
  .put(
    authMiddleware.verifyToken,
    filesUpload.single("userCoverImage"),
    userController.updateCoverImage
  );

userRouter
  .route("/password/:userId")
  .put(
    authMiddleware.verifyToken,
    userRouteValidator.passwordUpdate,
    validationCheck,
    authMiddleware.verifyToken,
    userController.updatePassword
  );

userRouter
  .route("/:userId")
  .get(userController.getUser)
  .put(
    authMiddleware.verifyToken,
    userRouteValidator.profileUpdate,
    validationCheck,
    userController.updateProfile
  );
