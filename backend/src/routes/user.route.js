import { upload, uploadImage } from "../middlewares/fileUpload.middleware.js";

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { userController } from "../controllers/user.controller.js";
import { userRouteValidator } from "../validators/user.route.validator.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const userRouter = Router();

userRouter
  .route("/profile-image/:userId")
  .put(
    authMiddleware.verifyToken,
    userRouteValidator.routeParam,
    validationCheck,
    upload.single("profileImage"),
    uploadImage,
    errorMiddleware.asyncHandler(userController.updateProfileImage)
  );

userRouter
  .route("/cover-image/:userId")
  .put(
    authMiddleware.verifyToken,
    userRouteValidator.routeParam,
    validationCheck,
    upload.single("coverImage"),
    uploadImage,
    errorMiddleware.asyncHandler(userController.updateCoverImage)
  );

userRouter
  .route("/password/:userId")
  .put(
    authMiddleware.verifyToken,
    userRouteValidator.routeParam,
    userRouteValidator.passwordUpdate,
    validationCheck,
    authMiddleware.verifyToken,
    errorMiddleware.asyncHandler(userController.updatePassword)
  );

userRouter
  .route("/:userId")
  .get(
    userRouteValidator.routeParam,
    validationCheck,
    errorMiddleware.asyncHandler(userController.getUser)
  )
  .put(
    authMiddleware.verifyToken,
    userRouteValidator.routeParam,
    userRouteValidator.profileUpdate,
    validationCheck,
    errorMiddleware.asyncHandler(userController.updateProfile)
  )
  .post(
    authMiddleware.verifyToken,
    userRouteValidator.routeParam,
    userRouteValidator.profileDelete,
    validationCheck,
    errorMiddleware.asyncHandler(userController.deleteUser)
  );
