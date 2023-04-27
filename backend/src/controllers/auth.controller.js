import asyncHandler from "express-async-handler";

// @desc Register new user
// @route POST /auth/signup
// @access Public
// @needs name, email, dateOfBirth, gender, password
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, dateOfBirth, gender, password } = req.body;
});

// @desc Login user and get token
// @route POST /auth/signin
// @access Public
// @needs email, password
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
});

// @desc Login user and get token
// @route POST /auth/refreshtoken
// @access Public
// @needs refreshToken
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
});

export const authController = { registerUser, loginUser, refreshAccessToken };
