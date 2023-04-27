import jwt from "jsonwebtoken";

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

const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
};

const verifyAccessToken = (accessToken) => {
  return jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
};

export const tokenService = {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
  verifyAccessToken,
};
