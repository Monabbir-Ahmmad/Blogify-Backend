import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { filesUpload } from "../middlewares/fileUpload.middleware.js";
import { userController } from "../controllers/user.controller.js";
import { userRouteValidator } from "../validators/user.route.validator.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const userRouter = Router();

userRouter
  .route("/profile-image/:userId")
  .put(
    authMiddleware.verifyToken,
    filesUpload.single("userProfileImage"),
    errorMiddleware.asyncHandler(userController.updateProfileImage)
  );

userRouter
  .route("/cover-image/:userId")
  .put(
    authMiddleware.verifyToken,
    filesUpload.single("userCoverImage"),
    errorMiddleware.asyncHandler(userController.updateCoverImage)
  );

userRouter
  .route("/password/:userId")
  .put(
    authMiddleware.verifyToken,
    userRouteValidator.passwordUpdate,
    validationCheck,
    authMiddleware.verifyToken,
    errorMiddleware.asyncHandler(userController.updatePassword)
  );

userRouter
  .route("/:userId")
  .get(errorMiddleware.asyncHandler(userController.getUser))
  .put(
    authMiddleware.verifyToken,
    userRouteValidator.profileUpdate,
    validationCheck,
    errorMiddleware.asyncHandler(userController.updateProfile)
  );
