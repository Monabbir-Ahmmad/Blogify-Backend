import bcryptjs from "bcryptjs";
import { environment } from "../../configs/environment.config.js";

/**
 * PasswordUtil is a class that provides utility functions for password hashing and verification.
 */
export class PasswordUtil {
  /**
   * Hashes a password.
   * @param {string} password - The password to be hashed.
   * @returns {Promise<string>} A promise that resolves with the hashed password.
   */
  hashPassword(password) {
    const saltRounds = parseInt(environment.SALT_ROUNDS);
    return bcryptjs.hash(password, saltRounds);
  }

  /**
   * Verifies a password against a hashed password.
   * @param {string} inputPassword - The password to be verified.
   * @param {string} hashedPassword - The hashed password to compare against.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the password is verified, or `false` otherwise.
   */
  verifyPassword(inputPassword, hashedPassword) {
    return bcryptjs.compare(inputPassword, hashedPassword);
  }
}

export const passwordUtil = new PasswordUtil();
