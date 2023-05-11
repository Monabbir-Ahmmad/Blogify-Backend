/** @module DTO/Response */

import { tokenUtil } from "../../utils/functions/token.util.js";

/**
 * AuthResDto is a class that defines the structure of the authentication response DTO.
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
