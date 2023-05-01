import { UserResDto } from "../../../dtos/response/user.res.dto.js";
import { User } from "../../../models/user.model.js";
import { UserType } from "../../../models/userType.model.js";

const createUser = async (signupReqDto) => {
  const userType = await UserType.findOne({
    where: { privilege: "Normal" },
  });

  const user = await User.create(signupReqDto);

  await user.setUserType(userType);

  if (!user) return null;

  return new UserResDto(
    user.id,
    user.name,
    user.email,
    user.gender,
    user.birthDate,
    userType.privilege,
    user.profileImage,
    user.coverImage,
    user.bio,
    user.createdAt
  );
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({
    where: { email },
    include: {
      model: UserType,
      attributes: ["privilege"],
    },
  });

  if (!user) return null;

  return new UserResDto(
    user.id,
    user.name,
    user.email,
    user.gender,
    user.birthDate,
    user.userType.privilege,
    user.profileImage,
    user.coverImage,
    user.bio,
    user.createdAt,
    user.password
  );
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: {
      model: UserType,
      attributes: ["privilege"],
    },
  });

  if (!user) return null;

  return new UserResDto(
    user.id,
    user.name,
    user.email,
    user.gender,
    user.birthDate,
    user.userType.privilege,
    user.profileImage,
    user.coverImage,
    user.bio,
    user.createdAt,
    user.password
  );
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
