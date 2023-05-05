import { User } from "../../../models/user.model.js";
import { UserType } from "../../../models/userType.model.js";

const createUser = async (signupReqDto) => {
  const userType = await UserType.findOne({
    where: { name: "Normal" },
  });

  if (!userType) return null;

  const user = await User.create(signupReqDto);

  if (!user) return null;

  await user.setUserType(userType);

  user.userType = userType;

  return user;
};

const getUserByEmail = async (email) => {
  return await User.findOne({
    where: { email },
    include: {
      model: UserType,
      attributes: ["name"],
    },
  });
};

const getUserById = async (id) => {
  return await User.findByPk(id, {
    include: {
      model: UserType,
      attributes: ["name"],
    },
  });
};

const updateUser = async (userId, userProfileUpdateReqDto) => {
  const user = await getUserById(userId);

  if (!user) return null;

  return await user.update(userProfileUpdateReqDto);
};

const updatePassword = async (userId, password) => {
  const user = await getUserById(userId);

  if (!user) return null;

  return await user.update({ password });
};

const updateProfileImage = async (userId, profileImage = null) => {
  const user = await getUserById(userId);

  if (!user) return null;

  return await user.update({ profileImage });
};

const updateCoverImage = async (userId, coverImage = null) => {
  const user = await getUserById(userId);

  if (!user) return null;

  return await user.update({ coverImage });
};

const deleteUser = async (id) => {
  const user = await getUserById(userId);

  if (!user) return null;

  return await user.destroy();
};

export const userDB = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  updatePassword,
  updateProfileImage,
  updateCoverImage,
  deleteUser,
};
