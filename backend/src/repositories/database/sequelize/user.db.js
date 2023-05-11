import { Op } from "sequelize";
import { User } from "../../../models/user.model.js";
import { UserType } from "../../../models/userType.model.js";

/**
 * UserDB is a class that provides database operations related to users.
 */
export class UserDB {
  /**
   * Creates a new user.
   * @param {Object} signupReqDto - The signup request data transfer object.
   * @returns {Promise<User|null>} A promise that resolves to the created user or null if unsuccessful.
   */
  async createUser(signupReqDto) {
    const userType = await UserType.findOne({
      where: { name: "Normal" },
    });

    if (!userType) return null;

    const user = await User.create(signupReqDto);

    if (!user) return null;

    await user.setUserType(userType);

    user.userType = userType;

    return user;
  }

  /**
   * Retrieves a user by their email address.
   * @param {string} email - The email address of the user.
   * @returns {Promise<User|null>} A promise that resolves to the retrieved user or null if not found.
   */
  async getUserByEmail(email) {
    return await User.findOne({
      where: { email },
      include: {
        model: UserType,
        attributes: ["name"],
      },
    });
  }

  /**
   * Retrieves a user by their ID.
   * @param {number} id - The ID of the user.
   * @returns {Promise<User|null>} A promise that resolves to the retrieved user or null if not found.
   */
  async getUserById(id) {
    return await User.findByPk(id, {
      include: {
        model: UserType,
        attributes: ["name"],
      },
    });
  }

  /**
   * Updates a user's profile.
   * @param {number} userId - The ID of the user to update.
   * @param {Object} userProfileUpdateReqDto - The user profile update request data transfer object.
   * @returns {Promise<User|null>} A promise that resolves to the updated user or null if not found.
   */
  async updateUser(userId, userProfileUpdateReqDto) {
    const user = await getUserById(userId);

    if (!user) return null;

    return await user.update(userProfileUpdateReqDto);
  }

  /**
   * Updates a user's password.
   * @param {number} userId - The ID of the user to update.
   * @param {string} password - The new password.
   * @returns {Promise<User|null>} A promise that resolves to the updated user or null if not found.
   */
  async updatePassword(userId, password) {
    const user = await getUserById(userId);

    if (!user) return null;

    return await user.update({ password });
  }

  /**
   * Updates a user's profile image.
   * @param {number} userId - The ID of the user to update.
   * @param {string|null} profileImage - The new profile image URL.
   * @returns {Promise<User|null>} A promise that resolves to the updated user or null if not found.
   */
  async updateProfileImage(userId, profileImage = null) {
    const user = await getUserById(userId);

    if (!user) return null;

    return await user.update({ profileImage });
  }

  /**
   * Updates a user's cover image.
   * @param {number} userId - The ID of the user to update.
   * @param {string|null} coverImage - The new cover image URL.
   * @returns {Promise<User|null>} A promise that resolves to the updated user or null if not found.
   */
  async updateCoverImage(userId, coverImage = null) {
    const user = await getUserById(userId);

    if (!user) return null;

    return await user.update({ coverImage });
  }

  /**
   * Deletes a user.
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<User|null>} A promise that resolves to the deleted user or null if not found.
   */
  async deleteUser(id) {
    const user = await getUserById(userId);

    if (!user) return null;

    return await user.destroy();
  }

  /**
   * Searches users by name with pagination support.
   * @param {string} keyword - The keyword to search for in the user names.
   * @param {number} offset - The offset for pagination.
   * @param {number} limit - The maximum number of users to retrieve.
   * @returns {Promise<{pageCount: number, users: User[]}>} A promise that resolves to an object containing the page count and the retrieved users.
   */
  async searchUserByName(keyword, offset, limit) {
    const { rows: users, count } = await User.findAndCountAll({
      where: {
        name: {
          [Op.substring]: keyword,
        },
      },
      offset,
      limit,
      attributes: ["id", "name", "profileImage"],
    });

    return {
      pageCount: Math.ceil(count / limit),
      users,
    };
  }
}

export const userDB = new UserDB();
