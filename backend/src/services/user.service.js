import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { authUtil } from "../utils/functions/auth.util.js";
import { commonUtil } from "../utils/functions/common.util.js";
import { userDB } from "../repositories/database/sequelize/user.db.js";

const getUser = async (userId) => {
  const userResDto = await userDB.getUserById(userId);

  if (!userResDto) throw new HttpError(StatusCode.NOT_FOUND, "User not found.");

  return userResDto;
};

const updateProfile = async (userId, userProfileUpdateReqDto, password) => {
  const user = await getUser(userId);

  if (!(await authUtil.verifyPassword(password, user.password)))
    throw new HttpError(StatusCode.FORBIDDEN, "Wrong password.");

  if (
    (await userDB.getUserByEmail(userProfileUpdateReqDto.email))?.id !== userId
  )
    throw new HttpError(StatusCode.CONFLICT, "Email already in use.");

  await userDB.updateUser(userId, userProfileUpdateReqDto);

  return await userDB.getUserById(userId);
};

const updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await getUser(userId);

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
  const user = await getUser(userId);

  const profileImageUpdated = await userDB.updateProfileImage(
    userId,
    profileImage
  );

  if (profileImageUpdated && user.profileImage)
    commonUtil.deleteUploadedFile(user.profileImage);

  return await userDB.getUserById(userId);
};

const updateCoverImage = async (userId, coverImage = null) => {
  const user = await getUser(userId);

  const coverImageUpdated = await userDB.updateCoverImage(userId, coverImage);

  if (coverImageUpdated && user.coverImage)
    commonUtil.deleteUploadedFile(user.coverImage);

  return await userDB.getUserById(userId);
};

const deleteUser = async (userId) => {
  const user = await getUser(userId);

  await userDB.deleteUser(userId);

  if (user.profileImage) commonUtil.deleteUploadedFile(user.profileImage);

  if (user.coverImage) commonUtil.deleteUploadedFile(user.coverImage);

  return { message: "User deleted successfully." };
};

export const userService = {
  getUser,
  updateProfile,
  updatePassword,
  updateProfileImage,
  updateCoverImage,
};
