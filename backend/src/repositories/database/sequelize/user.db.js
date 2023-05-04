import { User } from "../../../models/user.model.js";
import { UserResDto } from "../../../dtos/response/user.res.dto.js";
import { UserType } from "../../../models/userType.model.js";

const createUser = async (signupReqDto) => {
  const userType = await UserType.findOne({
    where: { name: "Normal" },
  });

  const user = await User.create(signupReqDto);

  await user.setUserType(userType);

  if (!user) return null;

  return new UserResDto({
    id: user.id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    birthDate: user.birthDate,
    profileImage: user.profileImage,
    coverImage: user.coverImage,
    bio: user.bio,
    createdAt: user.createdAt,
    userType: userType.name,
  });
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({
    where: { email },
    include: {
      model: UserType,
      attributes: ["name"],
    },
  });

  if (!user) return null;

  return new UserResDto({
    id: user.id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    birthDate: user.birthDate,
    profileImage: user.profileImage,
    coverImage: user.coverImage,
    bio: user.bio,
    createdAt: user.createdAt,
    userType: user.userType.name,
    password: user.password,
  });
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: {
      model: UserType,
      attributes: ["name"],
    },
  });

  if (!user) return null;

  return new UserResDto({
    id: user.id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    birthDate: user.birthDate,
    profileImage: user.profileImage,
    coverImage: user.coverImage,
    bio: user.bio,
    createdAt: user.createdAt,
    userType: user.userType.name,
    password: user.password,
  });
};

const updateUser = async (userId, userProfileUpdateReqDto) => {
  const [updatedRows] = await User.update(userProfileUpdateReqDto, {
    where: { id: userId },
  });

  return updatedRows === 1;
};

const updatePassword = async (userId, password) => {
  const [updatedRows] = await User.update(
    { password },
    { where: { id: userId } }
  );

  return updatedRows === 1;
};

const updateProfileImage = async (userId, profileImage = null) => {
  const [updatedRows] = await User.update(
    { profileImage },
    { where: { id: userId } }
  );

  return updatedRows === 1;
};

const updateCoverImage = async (userId, coverImage = null) => {
  const [updatedRows] = await User.update(
    { coverImage },
    { where: { id: userId } }
  );

  return updatedRows === 1;
};

const deleteUser = async (id) => {
  const deletedRows = await User.destroy({ where: { id } });

  return deletedRows === 1;
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
