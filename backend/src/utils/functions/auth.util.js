import bcryptjs from "bcryptjs";
import { environment } from "../../configs/environment.config.js";
import jwt from "jsonwebtoken";

const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(parseInt(environment.SALT_ROUNDS));
  return await bcryptjs.hash(password, salt);
};

const verifyPassword = async (inputPassword, hashedPassword) => {
  return await bcryptjs.compare(inputPassword, hashedPassword);
};

const generateRefreshToken = (id, userType) => {
  return jwt.sign({ id, userType }, environment.JWT_REFRESH_KEY, {
    expiresIn: environment.JWT_REFRESH_EXPIRE_TIME,
  });
};

const generateAccessToken = (id, userType) => {
  return jwt.sign({ id, userType }, environment.JWT_ACCESS_KEY, {
    expiresIn: environment.JWT_ACCESS_EXPIRE_TIME,
  });
};

const generateResetToken = (id) => {
  return jwt.sign({ id }, environment.JWT_RESET_KEY, {
    expiresIn: environment.JWT_RESET_EXPIRE_TIME,
  });
};

const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, environment.JWT_REFRESH_KEY);
};

const verifyAccessToken = (accessToken) => {
  return jwt.verify(accessToken, environment.JWT_ACCESS_KEY);
};

const verifyResetToken = (resetToken) => {
  return jwt.verify(resetToken, environment.JWT_RESET_KEY);
};

const setAuthCookie = (res, token) => {
  res.cookie("authorization", token, {
    httpOnly: true,
    sameSite: "none",
    secure: false,
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie("authorization");
};

export const authUtil = {
  hashPassword,
  verifyPassword,
  generateRefreshToken,
  generateAccessToken,
  generateResetToken,
  verifyRefreshToken,
  verifyAccessToken,
  verifyResetToken,
  setAuthCookie,
  clearAuthCookie,
};
