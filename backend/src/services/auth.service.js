import { AuthResDto } from "../dtos/response/auth.res.dto.js";
import { HttpError } from "../utils/objects/HttpError.js";
import { StatusCode } from "../utils/objects/StatusCode.js";
import { environment } from "../configs/environment.config.js";
import { mailUtil } from "../utils/functions/mail.util.js";
import { passwordUtil } from "../utils/functions/password.util.js";
import { tokenUtil } from "../utils/functions/token.util.js";
import { userDB } from "../repositories/database/sequelize/user.db.js";
import { userService } from "./user.service.js";

/**
 * This is a class that provides authentication services.
 */
export class AuthService {
  /**
   * @param {Object} dependencies - The dependencies needed by AuthService.
   */
  constructor({ userDB, passwordUtil, tokenUtil, mailUtil, userService }) {
    this.userDB = userDB;
    this.passwordUtil = passwordUtil;
    this.tokenUtil = tokenUtil;
    this.mailUtil = mailUtil;
    this.userService = userService;
  }

  /**
   * This is used to signup a user.
   * @param {import("../dtos/request/signup.req.dto").SignupReqDto} signupReqDto
   * @returns {Promise<AuthResDto>}
   * @throws {HttpError} 409 - Email already exists.
   */
  async signup(signupReqDto) {
    if (await this.userDB.getUserByEmail(signupReqDto.email))
      throw new HttpError(StatusCode.CONFLICT, "Email already exists.");

    signupReqDto.password = await this.passwordUtil.hashPassword(
      signupReqDto.password
    );

    const user = await this.userDB.createUser(signupReqDto);

    return new AuthResDto(user.id, user.userType.name);
  }

  /**
   * This is used to signin a user.
   * @param {string} email - Email of the user.
   * @param {string} password - Password of the user.
   * @returns {Promise<AuthResDto>}
   * @throws {HttpError} 401 - Wrong email address.
   * @throws {HttpError} 401 - Wrong password.
   */
  async signin(email, password) {
    const user = await this.userDB.getUserByEmail(email);

    if (!user)
      throw new HttpError(StatusCode.UNAUTHORIZED, "Wrong email address.");

    if (!(await this.passwordUtil.verifyPassword(password, user.password)))
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
    const user = await this.userDB.getUserByEmail(email);

    if (!user)
      throw new HttpError(
        StatusCode.NOT_FOUND,
        "User with such email not found."
      );

    const resetToken = this.tokenUtil.generateResetToken(user.id);

    await this.mailUtil.sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: await this.mailUtil.getResetPasswordMailTemplate(
        environment.APP_NAME,
        user.name,
        resetToken
      ),
    });
  }

  /**
   * This is used to reset the password of a user.
   * @param {string} resetToken - Reset token of the user sent in mail.
   * @param {string} newPassword - New password of the user.
   * @returns {Promise<void>}
   */
  async resetPassword(resetToken, newPassword) {
    const decodedToken = this.tokenUtil.verifyResetToken(resetToken);
    const user = await this.userService.getUser(decodedToken.id);
    newPassword = await this.passwordUtil.hashPassword(newPassword);

    await this.userDB.updatePassword(user.id, newPassword);
  }

  /**
   * This is used to refresh the access token of a user.
   * @param {string} refreshToken - Refresh token of the user.
   * @returns {Promise<{accessToken: string}>} - New access token.
   * @throws {HttpError} 401 - Token failed.
   */
  async refreshAccessToken(refreshToken) {
    try {
      const decodedToken = this.tokenUtil.verifyRefreshToken(refreshToken);

      const accessToken = this.tokenUtil.generateAccessToken(
        decodedToken.id,
        decodedToken.userType
      );

      return { accessToken };
    } catch (error) {
      console.error(error);
      throw new HttpError(StatusCode.UNAUTHORIZED, "Token failed.");
    }
  }
}

export const authService = new AuthService({
  userDB,
  passwordUtil,
  tokenUtil,
  mailUtil,
  userService,
});
