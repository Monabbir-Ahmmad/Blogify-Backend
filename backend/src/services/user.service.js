import { HttpError } from "../utils/objects/HttpError.js";
import { PaginatedResDto } from "../dtos/response/paginated.res.dto.js";
import { StatusCode } from "../utils/objects/StatusCode.js";
import { User } from "../models/user.model.js";
import { UserResDto } from "../dtos/response/user.res.dto.js";
import { mapper } from "../configs/mapper.config.js";
import { passwordUtil } from "../utils/functions/password.util.js";
import { userDB } from "../repositories/database/sequelize/user.db.js";

/**
 * This is a class that provides user-related services.
 */
export class UserService {
  /**
   * @param {Object} dependencies - The dependencies needed by UserService.
   * @param {typeof mapper} dependencies.mapper - The Mapper class.
   * @param {typeof userDB} dependencies.userDB - The UserDB class.
   * @param {typeof passwordUtil} dependencies.passwordUtil - The PasswordUtil class.
   */
  constructor({ mapper, userDB, passwordUtil }) {
    this.mapper = mapper;
    this.userDB = userDB;
    this.passwordUtil = passwordUtil;
  }

  /**
   * Get a user by ID.
   * @param {string|number} userId - ID of the user.
   * @returns {Promise<UserResDto>} - Retrieved user response DTO.
   * @throws {HttpError} 404 - User not found.
   */
  async getUser(userId) {
    const user = await this.userDB.getUserById(userId);

    if (!user) throw new HttpError(StatusCode.NOT_FOUND, "User not found.");

    return this.mapper.map(User, UserResDto, user);
  }

  /**
   * Update the profile of a user.
   * @param {string|number} userId - ID of the user.
   * @param {import("../dtos/request/userProfileUpdate.req.dto.js").UserProfileUpdateReqDto} userProfileUpdateReqDto - User profile update request DTO.
   * @param {string} password - User's current password.
   * @returns {Promise<UserResDto>} - Updated user response DTO.
   * @throws {HttpError} 404 - User not found.
   * @throws {HttpError} 403 - Wrong password.
   * @throws {HttpError} 409 - Email already in use.
   */
  async updateProfile(userId, userProfileUpdateReqDto, password) {
    const user = await this.userDB.getUserById(userId);

    if (!user) throw new HttpError(StatusCode.NOT_FOUND, "User not found.");

    if (!(await this.passwordUtil.verifyPassword(password, user.password)))
      throw new HttpError(StatusCode.FORBIDDEN, "Wrong password.");

    if (
      (await this.userDB.getUserByEmail(userProfileUpdateReqDto.email))?.id !==
      userId
    )
      throw new HttpError(StatusCode.CONFLICT, "Email already in use.");

    const updatedUser = await this.userDB.updateUser(
      userId,
      userProfileUpdateReqDto
    );

    return this.mapper.map(User, UserResDto, updatedUser);
  }

  /**
   * Update the password of a user.
   * @param {string|number} userId - ID of the user.
   * @param {string} oldPassword - User's current password.
   * @param {string} newPassword - User's new password.
   * @returns {Promise<void>}
   * @throws {HttpError} 404 - User not found.
   * @throws {HttpError} 403 - Wrong password.
   * @throws {HttpError} 403 - New password cannot be the same as the old password.
   */
  async updatePassword(userId, oldPassword, newPassword) {
    const user = await this.userDB.getUserById(userId);

    if (!user) throw new HttpError(StatusCode.NOT_FOUND, "User not found.");

    if (!(await this.passwordUtil.verifyPassword(oldPassword, user.password)))
      throw new HttpError(StatusCode.FORBIDDEN, "Wrong password.");

    if (oldPassword === newPassword)
      throw new HttpError(
        StatusCode.FORBIDDEN,
        "New password cannot be the same as the old password."
      );

    newPassword = await this.passwordUtil.hashPassword(newPassword);

    await this.userDB.updatePassword(userId, newPassword);
  }

  /**
   * Update the profile image of a user.
   * @param {string|number} userId - ID of the user.
   * @param {string | null} profileImage - URL or null to remove the profile image.
   * @returns {Promise<UserResDto>} - Updated user response DTO.
   * @throws {HttpError} 404 - User not found.
   */
  async updateProfileImage(userId, profileImage = null) {
    await this.getUser(userId);

    const updatedUser = await this.userDB.updateProfileImage(
      userId,
      profileImage
    );

    return this.mapper.map(User, UserResDto, updatedUser);
  }

  /**
   * Update the cover image of a user.
   * @param {string|number} userId - ID of the user.
   * @param {string | null} coverImage - URL or null to remove the cover image.
   * @returns {Promise<UserResDto>} - Updated user response DTO.
   * @throws {HttpError} 404 - User not found.
   */
  async updateCoverImage(userId, coverImage = null) {
    await this.getUser(userId);

    const updatedUser = await this.userDB.updateCoverImage(userId, coverImage);

    return this.mapper.map(User, UserResDto, updatedUser);
  }

  /**
   * Delete a user.
   * @param {string|number} userId - ID of the user.
   * @param {string} password - User's password.
   * @returns {Promise<void>}
   * @throws {HttpError} 403 - Wrong password.
   */
  async deleteUser(userId, password) {
    const user = await this.getUser(userId);

    if (!(await this.passwordUtil.verifyPassword(password, user.password)))
      throw new HttpError(StatusCode.FORBIDDEN, "Wrong password.");

    await this.userDB.deleteUser(userId);
  }

  /**
   * Search users by keyword.
   * @param {string} keyword - Search keyword.
   * @param {{offset: number, limit: number}} options - Pagination options (offset, limit).
   * @returns {Promise<PaginatedResDto<UserResDto>>} - Paginated user response DTO.
   */
  async searchUser(keyword, { offset, limit }) {
    const { pageCount, users } = await this.userDB.searchUserByName(
      keyword,
      offset,
      limit
    );

    return new PaginatedResDto(
      pageCount,
      this.mapper.mapArray(User, UserResDto, users)
    );
  }
}

export const userService = new UserService({
  mapper,
  userDB,
  passwordUtil,
});
