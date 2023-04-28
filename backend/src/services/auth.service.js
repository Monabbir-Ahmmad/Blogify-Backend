import { AuthResDto } from "../dtos/response/auth.res.dto.js";
import { userDB } from "../repositories/database/sequelize/user.db.js";
import {
  hashPassword,
  verifyPassword,
} from "../utils/functions/passwordEncryption.js";
import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { tokenService } from "./token.service.js";

const signup = async (signupReqDto) => {
  if (await userDB.getUserByEmail(signupReqDto.email))
    throw new HttpError(StatusCode.CONFLICT, "Email already exists.");

  signupReqDto.password = await hashPassword(signupReqDto.password);

  const user = await userDB.createUser(signupReqDto);

  return new AuthResDto(user.id, user.privilege);
};

const signin = async (signinReqDto) => {
  const user = await userDB.getUserByEmail(signinReqDto.email);

  if (!user) throw new HttpError(StatusCode.UNAUTHORIZED, "Invalid email.");

  if (!(await verifyPassword(signinReqDto.password, user.password)))
    throw new HttpError(StatusCode.UNAUTHORIZED, "Password is incorrect.");

  return new AuthResDto(user.id, user.privilege);
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decodedToken = tokenService.verifyRefreshToken(refreshToken);

    const accessToken = tokenService.generateAccessToken(
      decodedToken.id,
      decodedToken.privilege
    );

    return { accessToken };
  } catch (error) {
    console.error(error);
    throw new HttpError(StatusCode.UNAUTHORIZED, "Token failed.");
  }
};

export const authService = { signup, signin, refreshAccessToken };
