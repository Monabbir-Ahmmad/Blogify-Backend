import { tokenUtil } from "../../utils/token.util.js";

/**
 * @category DTOs
 * @subcategory Response
 * @classdesc A class that defines the structure of the authentication response DTO.
 * @property {string} refreshToken - The refresh token.
 * @property {string} accessToken - The access token.
 */
export class AuthResDto {
  /**
   * @param {string|number} id - The user ID.
   * @param {string} userType - The user type.
   */
  constructor(id, userType) {
    this.refreshToken = tokenUtil.generateRefreshToken(id, userType);
    this.accessToken = tokenUtil.generateAccessToken(id, userType);
  }
}
