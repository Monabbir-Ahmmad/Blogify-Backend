import { tokenUtil } from "../../utils/token.util.js";

/**
 * @category DTOs
 * @subcategory Response
 * @classdesc A class that defines the structure of the authentication response DTO.
 * @property {string|number} userId - The user ID.
 * @property {string} refreshToken - The refresh token.
 */
export class AuthResDto {
  /**
   * @param {string|number} userId - The user ID.
   * @param {string} userType - The user type.
   */
  constructor(userId, userType) {
    this.userId = userId;
    this.refreshToken = tokenUtil.generateRefreshToken(userId, userType);
  }
}
