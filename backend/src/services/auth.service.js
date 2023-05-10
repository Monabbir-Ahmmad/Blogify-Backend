import { AuthResDto } from "../dtos/response/auth.res.dto.js";
import { HttpError } from "../utils/objects/HttpError.js";
import { StatusCode } from "../utils/objects/StatusCode.js";
import { mailUtil } from "../utils/functions/mail.util.js";
import { passwordUtil } from "../utils/functions/password.util.js";
import { tokenUtil } from "../utils/functions/token.util.js";
import { userDB } from "../repositories/database/sequelize/user.db.js";
import { userService } from "./user.service.js";

const signup = async (signupReqDto) => {
  if (await userDB.getUserByEmail(signupReqDto.email))
    throw new HttpError(StatusCode.CONFLICT, "Email already exists.");

  signupReqDto.password = await passwordUtil.hashPassword(
    signupReqDto.password
  );

  const user = await userDB.createUser(signupReqDto);

  return new AuthResDto(user.id, user.userType.name);
};

const signin = async (email, password) => {
  const user = await userDB.getUserByEmail(email);

  if (!user)
    throw new HttpError(StatusCode.UNAUTHORIZED, "Wrong email address.");

  if (!(await passwordUtil.verifyPassword(password, user.password)))
    throw new HttpError(StatusCode.UNAUTHORIZED, "Wrong password.");

  return new AuthResDto(user.id, user.userType.name);
};

const forgotPassword = async (email) => {
  const user = await userDB.getUserByEmail(email);

  if (!user)
    throw new HttpError(StatusCode.NOT_FOUND, "User with email not found.");

  const resetToken = tokenUtil.generateResetToken(user.id);

  await mailUtil.sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html: await mailUtil.getResetPasswordMailTemplate(
      "App Name",
      user.name,
      resetToken
    ),
  });

  return { message: "Password reset email sent." };
};

const resetPassword = async (resetToken, newPassword) => {
  const decodedToken = tokenUtil.verifyResetToken(resetToken);

  const user = await userService.getUser(decodedToken.id);

  newPassword = await passwordUtil.hashPassword(newPassword);

  await userDB.updatePassword(user.id, newPassword);

  return { message: "Password updated." };
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decodedToken = tokenUtil.verifyRefreshToken(refreshToken);

    const accessToken = tokenUtil.generateAccessToken(
      decodedToken.id,
      decodedToken.userType
    );

    return { accessToken };
  } catch (error) {
    console.error(error);
    throw new HttpError(StatusCode.UNAUTHORIZED, "Token failed.");
  }
};

export const authService = {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
};
