import { environment } from "../../configs/environment.config.js";
import jwt from "jsonwebtoken";

/**
 * @param {string | number} id
 * @param {string} userType
 */
const generateRefreshToken = (id, userType) => {
  return jwt.sign({ id, userType }, environment.JWT_REFRESH_KEY, {
    expiresIn: environment.JWT_REFRESH_EXPIRE_TIME,
  });
};

/**
 * @param {string | number} id
 * @param {string} userType
 */
const generateAccessToken = (id, userType) => {
  return jwt.sign({ id, userType }, environment.JWT_ACCESS_KEY, {
    expiresIn: environment.JWT_ACCESS_EXPIRE_TIME,
  });
};

/**
 * @param {string | number} id
 * @param {string} userType
 */
const generateResetToken = (id) => {
  return jwt.sign({ id }, environment.JWT_RESET_KEY, {
    expiresIn: environment.JWT_RESET_EXPIRE_TIME,
  });
};

/** @param {string} refreshToken */
const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, environment.JWT_REFRESH_KEY);
};

/** @param {string} accessToken */
const verifyAccessToken = (accessToken) => {
  return jwt.verify(accessToken, environment.JWT_ACCESS_KEY);
};

/** @param {string} resetToken */
const verifyResetToken = (resetToken) => {
  return jwt.verify(resetToken, environment.JWT_RESET_KEY);
};

export const tokenUtil = {
  generateRefreshToken,
  generateAccessToken,
  generateResetToken,
  verifyRefreshToken,
  verifyAccessToken,
  verifyResetToken,
};
