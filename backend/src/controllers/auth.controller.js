import asyncHandler from "express-async-handler";
import { setAuthCookie } from "../utils/functions/setCookie.js";

// @desc Register new user
// @route POST /auth/signup
// @access Public
// @needs name, email, dateOfBirth, gender, password
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, dateOfBirth, gender, password } = req.body;

  setAuthCookie(res, "test");
});

// @desc Login user and get token
// @route POST /auth/signin
// @access Public
// @needs email, password
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  setAuthCookie(res, "test");
});

// @desc Logout user
// @route POST /auth/signout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("authorization");
  res.send("Logged out.");
});

// @desc Login user and get token
// @route POST /auth/refreshtoken
// @access Public
// @needs refreshToken
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  setAuthCookie(res, "test");
});

export const authController = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
};
