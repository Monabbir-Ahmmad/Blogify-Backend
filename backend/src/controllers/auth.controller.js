import asyncHandler from "express-async-handler";
import { setAuthCookie } from "../utils/functions/setCookie.js";
import { authService } from "../services/auth.service.js";
import { SignupReqDto } from "../dtos/request/signup.req.dto.js";
import { sendContentNegotiatedResponse } from "../utils/functions/contentNegotiation.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { SigninReqDto } from "../dtos/request/signin.req.dto.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, birthDate, gender, password } = req.body;

  const result = await authService.signup(
    new SignupReqDto(name, email, gender, birthDate, password)
  );

  setAuthCookie(res, result.accessToken);

  sendContentNegotiatedResponse(req, res, StatusCode.CREATED, result);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.signin(new SigninReqDto(email, password));

  setAuthCookie(res, result.accessToken);

  sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("authorization");
  res.send("Logged out.");
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
});

const resetPassword = asyncHandler(async (req, res) => {
  const resetToken = req.params.resetToken;
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const result = await authService.refreshAccessToken(refreshToken);

  setAuthCookie(res, result.accessToken);

  sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

export const authController = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
};
