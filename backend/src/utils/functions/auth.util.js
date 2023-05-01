import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(parseInt(process.env.SALT_ROUNDS));
  return await bcryptjs.hash(password, salt);
};

const verifyPassword = async (inputPassword, hashedPassword) => {
  return await bcryptjs.compare(inputPassword, hashedPassword);
};

const generateRefreshToken = (id, privilege) => {
  return jwt.sign({ id, privilege }, process.env.JWT_REFRESH_KEY, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
  });
};

const generateAccessToken = (id, privilege) => {
  return jwt.sign({ id, privilege }, process.env.JWT_ACCESS_KEY, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
  });
};

const generateResetToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_RESET_KEY, {
    expiresIn: process.env.JWT_RESET_EXPIRE_TIME,
  });
};

const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
};

const verifyAccessToken = (accessToken) => {
  return jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
};

const verifyResetToken = (resetToken) => {
  return jwt.verify(resetToken, process.env.JWT_RESET_KEY);
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
