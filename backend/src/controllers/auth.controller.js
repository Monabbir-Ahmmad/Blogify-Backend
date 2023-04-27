import asyncHandler from "express-async-handler";
import { setAuthCookie } from "../utils/functions/setCookie.js";
import { authService } from "../services/auth.service.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, birthDate, gender, password } = req.body;

  setAuthCookie(res, "test");
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  setAuthCookie(res, "test");
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("authorization");
  res.send("Logged out.");
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const result = await authService.refreshAccessToken(refreshToken);

  setAuthCookie(res, result.accessToken);

  res.send("Access token refreshed.");
});

export const authController = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
};
