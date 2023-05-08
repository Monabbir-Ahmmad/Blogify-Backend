import express from "express";
import { filesUpload } from "../middlewares/fileUpload.middleware.js";
import { userController } from "../controllers/user.controller.js";
import { userRouteValidator } from "../middlewares/validators/user.route.validator.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const userRouter = express.Router();

userRouter
  .route("/profile-image/:userId")
  .put(
    filesUpload.single("userProfileImage"),
    userController.updateProfileImage
  );

userRouter
  .route("/cover-image/:userId")
  .put(filesUpload.single("userCoverImage"), userController.updateCoverImage);

userRouter
  .route("/password/:userId")
  .put(
    userRouteValidator.passwordUpdate,
    validationCheck,
    userController.updatePassword
  );

userRouter
  .route("/:userId")
  .get(userController.getUser)
  .put(
    userRouteValidator.profileUpdate,
    validationCheck,
    userController.updateProfile
  );
