import { AuthResDto } from "../dtos/response/auth.res.dto.js";
import { userDB } from "../repositories/database/sequelize/user.db.js";
import { hashPassword } from "../utils/functions/passwordEncryption.js";
import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { tokenService } from "./token.service.js";

const signup = async (signupReqDto) => {
  if (await userDB.getUserByEmail(signupReqDto.email))
    throw new HttpError(StatusCode.CONFLICT, "Email already exists.");

  signupReqDto.password = await hashPassword(signupReqDto.password);

  return await userDB.createUser(signupReqDto);
};

const signin = async (signinReqDto) => {
  return new AuthResDto(2, "user");
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
    console.log(error);
    throw new HttpError(StatusCode.UNAUTHORIZED, "Token failed.");
  }
};

export const authService = { signup, signin, refreshAccessToken };
