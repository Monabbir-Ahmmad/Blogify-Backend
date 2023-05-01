import asyncHandler from "express-async-handler";
import { userService } from "../services/user.service.js";
import { responseUtil } from "../utils/functions/response.util.js";
import { UserProfileUpdateReqDto } from "../dtos/request/userProfileUpdate.req.dto.js";
import StatusCode from "../utils/objects/StatusCode.js";
import HttpError from "../utils/objects/HttpError.js";

const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const result = await userService.getUser(userId);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, email, birthDate, gender, bio, password } = req.body;

  if (userId != req.params.userId)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "You are not allowed to update this user's profile."
    );

  const result = await userService.updateProfile(
    userId,
    new UserProfileUpdateReqDto(name, email, gender, birthDate, bio),
    password
  );

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const updatePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (userId != req.params.userId)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "You are not allowed to update this user's password."
    );

  const result = await userService.updatePassword(
    userId,
    oldPassword,
    newPassword
  );

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const updateProfileImage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const profileImage = req.file?.filename;

  if (userId != req.params.userId)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "You are not allowed to update this user's profile image."
    );

  const result = await userService.updateProfileImage(userId, profileImage);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const coverImage = req.file?.filename;

  if (userId != req.params.userId)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "You are not allowed to update this user's cover image."
    );

  const result = await userService.updateCoverImage(userId, coverImage);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

export const userController = {
  getUser,
  updateProfile,
  updatePassword,
  updateProfileImage,
  updateCoverImage,
};
