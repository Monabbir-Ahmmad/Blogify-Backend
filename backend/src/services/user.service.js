import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { User } from "../models/user.model.js";
import { UserResDto } from "../dtos/response/user.res.dto.js";
import { authUtil } from "../utils/functions/auth.util.js";
import { mapper } from "../configs/mapper.config.js";
import { userDB } from "../repositories/database/sequelize/user.db.js";

const getUser = async (userId) => {
  const user = await userDB.getUserById(userId);

  if (!user) throw new HttpError(StatusCode.NOT_FOUND, "User not found.");

  return mapper.map(User, UserResDto, user);
};

const updateProfile = async (userId, userProfileUpdateReqDto, password) => {
  const user = await userDB.getUserById(userId);

  if (!user) throw new HttpError(StatusCode.NOT_FOUND, "User not found.");

  if (!(await authUtil.verifyPassword(password, user.password)))
    throw new HttpError(StatusCode.FORBIDDEN, "Wrong password.");

  if (
    (await userDB.getUserByEmail(userProfileUpdateReqDto.email))?.id !== userId
  )
    throw new HttpError(StatusCode.CONFLICT, "Email already in use.");

  const updatedUser = await userDB.updateUser(userId, userProfileUpdateReqDto);

  return mapper.map(User, UserResDto, updatedUser);
};

const updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await userDB.getUserById(userId);

  if (!user) throw new HttpError(StatusCode.NOT_FOUND, "User not found.");

  if (!(await authUtil.verifyPassword(oldPassword, user.password)))
    throw new HttpError(StatusCode.FORBIDDEN, "Wrong password.");

  if (oldPassword === newPassword)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "New password cannot be the same as the old password."
    );

  newPassword = await authUtil.hashPassword(newPassword);

  await userDB.updatePassword(userId, newPassword);

  return { message: "Password updated successfully." };
};

const updateProfileImage = async (userId, profileImage = null) => {
  await getUser(userId);

  const updatedUser = await userDB.updateProfileImage(userId, profileImage);

  return mapper.map(User, UserResDto, updatedUser);
};

const updateCoverImage = async (userId, coverImage = null) => {
  await getUser(userId);

  const updatedUser = await userDB.updateCoverImage(userId, coverImage);

  return mapper.map(User, UserResDto, updatedUser);
};

const deleteUser = async (userId, password) => {
  const user = await getUser(userId);

  if (!(await authUtil.verifyPassword(password, user.password)))
    throw new HttpError(StatusCode.FORBIDDEN, "Wrong password.");

  await userDB.deleteUser(userId);

  return { message: "User deleted successfully." };
};

export const userService = {
  getUser,
  updateProfile,
  updatePassword,
  updateProfileImage,
  updateCoverImage,
  deleteUser,
};
