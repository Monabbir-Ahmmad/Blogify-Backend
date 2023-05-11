/** @module Utility */

import { environment } from "../../configs/environment.config.js";
import jwt from "jsonwebtoken";

/**
 * A class that provides utility functions for generating and verifying JSON Web Tokens (JWT).
 */
export class TokenUtil {
  /**
   * Generates a refresh token.
   * @param {string|number} id - The user ID.
   * @param {string} userType - The user type.
   * @returns {string} The generated refresh token.
   */
  generateRefreshToken(id, userType) {
    return jwt.sign({ id, userType }, environment.JWT_REFRESH_KEY, {
      expiresIn: environment.JWT_REFRESH_EXPIRE_TIME,
    });
  }

  /**
   * Generates an access token.
   * @param {string|number} id - The user ID.
   * @param {string} userType - The user type.
   * @returns {string} The generated access token.
   */
  generateAccessToken(id, userType) {
    return jwt.sign({ id, userType }, environment.JWT_ACCESS_KEY, {
      expiresIn: environment.JWT_ACCESS_EXPIRE_TIME,
    });
  }

  /**
   * Generates a reset token.
   * @param {string|number} id - The user ID.
   * @returns {string} The generated reset token.
   */
  generateResetToken(id) {
    return jwt.sign({ id }, environment.JWT_RESET_KEY, {
      expiresIn: environment.JWT_RESET_EXPIRE_TIME,
    });
  }

  /**
   * Verifies a refresh token.
   * @param {string} refreshToken - The refresh token to verify.
   * @returns {object} The decoded refresh token.
   */
  verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, environment.JWT_REFRESH_KEY);
  }

  /**
   * Verifies an access token.
   * @param {string} accessToken - The access token to verify.
   * @returns {object} The decoded access token.
   */
  verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, environment.JWT_ACCESS_KEY);
  }

  /**
   * Verifies a reset token.
   * @param {string} resetToken - The reset token to verify.
   * @returns {object} The decoded reset token.
   */
  verifyResetToken(resetToken) {
    return jwt.verify(resetToken, environment.JWT_RESET_KEY);
  }
}

export const tokenUtil = new TokenUtil();
