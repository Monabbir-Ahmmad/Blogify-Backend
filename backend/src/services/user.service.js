import { HttpError } from "../utils/httpError.js";
import { PaginatedResDto } from "../dtos/response/paginated.res.dto.js";
import { StatusCode } from "../utils/statusCode.js";
import { User } from "../models/user.model.js";
import { UserProfileUpdateReqDto } from "../dtos/request/userProfileUpdate.req.dto.js";
import { UserResDto } from "../dtos/response/user.res.dto.js";
import { mapper } from "../configs/mapper.config.js";
import { passwordUtil } from "../utils/password.util.js";
import { userDB } from "../repositories/database/sequelize/user.db.js";

/**
 * @category Services
 * @classdesc A class that provides user-related services.
 */
export class UserService {
  /**
   * Get a user by ID.
   * @param {string|number} userId - ID of the user.
   * @returns {Promise<UserResDto>} - Retrieved user response DTO.
   * @throws {HttpError} 404 - User not found.
   */
  async getUser(userId) {
    const user = await userDB.getUserById(userId);

    if (!user) throw new HttpError(StatusCode.NOT_FOUND, "User not found.");

    return mapper.map(User, UserResDto, user);
  }

  /**
   * Update the profile of a user.
   * @param {string|number} userId - ID of the user.
   * @param {UserProfileUpdateReqDto} userProfileUpdateReqDto - User profile update request DTO.
   * @param {string} password - User's current password.
   * @returns {Promise<UserResDto>} - Updated user response DTO.
   * @throws {HttpError} 404 - User not found.
   * @throws {HttpError} 403 - Wrong password.
   * @throws {HttpError} 409 - Email already in use.
   */
  async updateProfile(userId, userProfileUpdateReqDto, password) {
    const user = await userDB.getUserById(userId);

    if (!user) throw new HttpError(StatusCode.NOT_FOUND, "User not found.");

    if (!(await passwordUtil.verifyPassword(password, user.password)))
      throw new HttpError(StatusCode.FORBIDDEN, "Wrong password.");

    const existingUser = await userDB.getUserByEmail(
      userProfileUpdateReqDto.email
    );

    if (existingUser && existingUser.id !== userId)
      throw new HttpError(StatusCode.CONFLICT, "Email already in use.");

    const updatedUser = await userDB.updateUser(
      userId,
      userProfileUpdateReqDto
    );

    return mapper.map(User, UserResDto, updatedUser);
  }

  /**
   * Update the password of a user.
   * @param {string|number} userId - ID of the user.
   * @param {string} oldPassword - User's current password.
   * @param {string} newPassword - User's new password.
   * @returns {Promise<void>}
   * @throws {HttpError} 404 - User not found.
   * @throws {HttpError} 403 - Wrong old password.
   */
  async updatePassword(userId, oldPassword, newPassword) {
    const user = await userDB.getUserById(userId);

    if (!user) throw new HttpError(StatusCode.NOT_FOUND, "User not found.");

    if (!(await passwordUtil.verifyPassword(oldPassword, user.password)))
      throw new HttpError(StatusCode.FORBIDDEN, "Wrong old password.");

    newPassword = await passwordUtil.hashPassword(newPassword);

    const updatedUser = await userDB.updatePassword(userId, newPassword);

    return mapper.map(User, UserResDto, updatedUser);
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

    const updatedUser = await userDB.updateProfileImage(userId, profileImage);

    return mapper.map(User, UserResDto, updatedUser);
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

    const updatedUser = await userDB.updateCoverImage(userId, coverImage);

    return mapper.map(User, UserResDto, updatedUser);
  }

  /**
   * Delete a user.
   * @param {string|number} userId - ID of the user.
   * @param {string} password - User's password.
   * @returns {Promise<void>}
   * @throws {HttpError} 403 - Wrong password.
   */
  async deleteUser(userId, password) {
    const user = await userDB.getUserById(userId);

    if (!user) throw new HttpError(StatusCode.NOT_FOUND, "User not found.");

    if (!(await passwordUtil.verifyPassword(password, user.password)))
      throw new HttpError(StatusCode.FORBIDDEN, "Wrong password.");

    const deletedUser = await userDB.deleteUser(userId);

    return mapper.map(User, UserResDto, deletedUser);
  }

  /**
   * Search users by keyword.
   * @param {string} keyword - Search keyword.
   * @param {{offset: number, limit: number}} options - Pagination options (offset, limit).
   * @returns {Promise<PaginatedResDto<UserResDto>>} - Paginated user response DTO.
   */
  async searchUser(keyword, { offset, limit }) {
    const {
      users,
      count,
      limit: pageSize,
    } = await userDB.searchUserByName(keyword, offset, limit);

    return new PaginatedResDto(
      mapper.mapArray(User, UserResDto, users),
      count,
      pageSize
    );
  }
}

export const userService = new UserService();
