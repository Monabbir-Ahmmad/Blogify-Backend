import { AuthResDto } from "../dtos/response/auth.res.dto.js";
import { HttpError } from "../utils/httpError.js";
import { SignupReqDto } from "../dtos/request/signup.req.dto.js";
import { StatusCode } from "../utils/statusCode.js";
import { environment } from "../configs/environment.config.js";
import { mailUtil } from "../utils/mail.util.js";
import { passwordUtil } from "../utils/password.util.js";
import { tokenUtil } from "../utils/token.util.js";
import { userDB } from "../repositories/database/sequelize/user.db.js";
import { userService } from "./user.service.js";

/**
 * @category Services
 * @classdesc A class that provides authentication-related services.
 */
export class AuthService {
  /**
   * This is used to signup a user.
   * @param {SignupReqDto} signupReqDto - Signup request DTO.
   * @returns {Promise<AuthResDto>} - Created auth response DTO.
   * @throws {HttpError} 409 - Email already exists.
   */
  async signup(signupReqDto) {
    if (await userDB.getUserByEmail(signupReqDto.email))
      throw new HttpError(StatusCode.CONFLICT, "Email already exists.");

    signupReqDto.password = await passwordUtil.hashPassword(
      signupReqDto.password
    );

    const user = await userDB.createUser(signupReqDto);

    return new AuthResDto(user.id, user.userType.name);
  }

  /**
   * This is used to signin a user.
   * @param {string} email - Email of the user.
   * @param {string} password - Password of the user.
   * @returns {Promise<AuthResDto>} - Created auth response DTO.
   * @throws {HttpError} 401 - Wrong email address.
   * @throws {HttpError} 401 - Wrong password.
   */
  async signin(email, password) {
    const user = await userDB.getUserByEmail(email);

    if (!user)
      throw new HttpError(StatusCode.UNAUTHORIZED, "Wrong email address.");

    if (!(await passwordUtil.verifyPassword(password, user.password)))
      throw new HttpError(StatusCode.UNAUTHORIZED, "Wrong password.");

    return new AuthResDto(user.id, user.userType.name);
  }

  /**
   * This is used to send a password reset email.
   * @param {string} email - Email of the user.
   * @returns {Promise<void>}
   * @throws {HttpError} 404 - User with such email not found.
   */
  async forgotPassword(email) {
    const user = await userDB.getUserByEmail(email);

    if (!user)
      throw new HttpError(
        StatusCode.NOT_FOUND,
        "User with such email not found."
      );

    const resetToken = tokenUtil.generateResetToken(user.id);

    await mailUtil.sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: await mailUtil.getResetPasswordMailTemplate(
        environment.APP_NAME,
        user.name,
        `${environment.CLIENT_URL}/reset-password/?token=${resetToken}`
      ),
    });
  }

  /**
   * This is used to reset the password of a user.
   * @param {string} resetToken - Reset token of the user sent in mail.
   * @param {string} newPassword - New password of the user.
   * @returns {Promise<void>}
   * @throws {HttpError} 401 - Token verification failed.
   */
  async resetPassword(resetToken, newPassword) {
    let decodedToken = null;

    try {
      decodedToken = tokenUtil.verifyResetToken(resetToken);
    } catch (error) {
      throw new HttpError(
        StatusCode.UNAUTHORIZED,
        "Token verification failed."
      );
    }

    const user = await userService.getUser(decodedToken.id);
    newPassword = await passwordUtil.hashPassword(newPassword);

    await userDB.updatePassword(user.id, newPassword);
  }

  /**
   * This is used to refresh the access token of a user.
   * @param {string} refreshToken - Refresh token of the user.
   * @returns {Promise<{accessToken: string}>} - New access token.
   * @throws {HttpError} 401 - Token verification failed.
   */
  async refreshAccessToken(refreshToken) {
    try {
      const decodedToken = tokenUtil.verifyRefreshToken(refreshToken);
      const user = await userService.getUser(decodedToken.id);

      const accessToken = tokenUtil.generateAccessToken(user.id, user.userType);

      return { accessToken };
    } catch (error) {
      console.error(error);
      throw new HttpError(
        StatusCode.UNAUTHORIZED,
        "Token verification failed."
      );
    }
  }
}

export const authService = new AuthService();
