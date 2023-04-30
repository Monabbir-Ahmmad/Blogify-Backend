import { AuthResDto } from "../dtos/response/auth.res.dto.js";
import { userDB } from "../repositories/database/sequelize/user.db.js";
import { authUtil } from "../utils/functions/auth.util.js";
import { mailUtil } from "../utils/functions/mail.util.js";
import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";

const signup = async (signupReqDto) => {
  if (await userDB.getUserByEmail(signupReqDto.email))
    throw new HttpError(StatusCode.CONFLICT, "Email already exists.");

  signupReqDto.password = await authUtil.hashPassword(signupReqDto.password);

  const user = await userDB.createUser(signupReqDto);

  return new AuthResDto(user.id, user.privilege);
};

const signin = async (signinReqDto) => {
  const user = await userDB.getUserByEmail(signinReqDto.email);

  if (!user)
    throw new HttpError(StatusCode.UNAUTHORIZED, "Wrong email address.");

  if (!(await authUtil.verifyPassword(signinReqDto.password, user._password)))
    throw new HttpError(StatusCode.UNAUTHORIZED, "Wrong password.");

  return new AuthResDto(user.id, user.privilege);
};

const forgotPassword = async (email) => {
  const user = await userDB.getUserByEmail(email);

  if (!user)
    throw new HttpError(StatusCode.NOT_FOUND, "User with email not found.");

  const resetToken = authUtil.generateResetToken(user.id);

  await mailUtil.sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    text: mailUtil.getMailTemplate("App Name", user.name, resetToken),
  });

  return { message: "Email sent." };
};

const resetPassword = async (resetToken, newPassword) => {
  const decodedToken = authUtil.verifyResetToken(resetToken);

  const user = await userDB.getUserById(decodedToken.id);

  if (!user)
    throw new HttpError(StatusCode.NOT_FOUND, "User with email not found.");

  newPassword = await authUtil.hashPassword(newPassword);

  await userDB.updatePassword(user.id, newPassword);

  return { message: "Password updated." };
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decodedToken = authUtil.verifyRefreshToken(refreshToken);

    const accessToken = authUtil.generateAccessToken(
      decodedToken.id,
      decodedToken.privilege
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
