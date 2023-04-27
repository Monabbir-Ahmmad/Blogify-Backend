import express from "express";
import { userController } from "../controllers/user.controller.js";
import { filesUpload } from "../middlewares/fileUpload.middleware.js";
import { userRouteValidator } from "../validators/routeValidators/user.route.validator.js";
import { validationCheck } from "../middlewares/validation.middleware.js";

export const userRouter = express.Router();

userRouter.route("/").get(userController.getUserList);

userRouter
  .route("/profile-image/:userId")
  .put(
    filesUpload.single("userProfileImage"),
    userController.updateUserProfileImage
  );

userRouter
  .route("/cover-image/:userId")
  .put(
    filesUpload.single("userCoverImage"),
    userController.updateUserCoverImage
  );

userRouter
  .route("/password/:userId")
  .put(
    userRouteValidator.passwordUpdate,
    validationCheck,
    userController.updateUserPassword
  );

userRouter
  .route("/:userId")
  .get(userController.getUser)
  .patch(
    userRouteValidator.profileUpdate,
    validationCheck,
    userController.updateUserProfile
  );
