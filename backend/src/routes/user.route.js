import express from "express";
import { userController } from "../controllers/user.controller.js";
import { filesUpload } from "../middlewares/fileUpload.middleware.js";
import { userRouteValidator } from "../validators/routeValidators/user.route.validator.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const userRouter = express.Router();

userRouter.route("/profile/:userId").get(userController.getUserDetails);

userRouter.route("/users").get(userController.getUserList);

userRouter
  .route("/profile")
  .patch(
    userRouteValidator.profileUpdate,
    validationCheck,
    userController.updateUserProfile
  );

userRouter
  .route("/profileImage")
  .put(
    filesUpload.single("userProfileImage"),
    userController.updateUserProfileImage
  );

userRouter
  .route("/coverImage")
  .put(
    filesUpload.single("userCoverImage"),
    userController.updateUserCoverImage
  );

userRouter
  .route("/password")
  .put(
    userRouteValidator.passwordUpdate,
    validationCheck,
    userController.updateUserPassword
  );
