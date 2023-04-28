import { UserResDto } from "../../../dtos/response/user.res.dto.js";
import { User } from "../../../models/user.model.js";
import { UserType } from "../../../models/userType.model.js";

const createUser = async (signupReqDto) => {
  const userType = await UserType.findOne({
    where: { privilege: "Normal" },
  });

  const user = await User.create(signupReqDto);

  await user.setUserType(userType);

  user.userType = userType;

  return new UserResDto(user);
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({
    where: { email },
    include: {
      model: UserType,
      attributes: ["privilege"],
    },
  });

  return user ? new UserResDto(user) : null;
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: {
      model: UserType,
      attributes: ["privilege"],
    },
  });

  return new UserResDto(user);
};

export const userDB = { createUser, getUserByEmail, getUserById };
