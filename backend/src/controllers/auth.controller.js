import asyncHandler from "express-async-handler";
import { authService } from "../services/auth.service.js";
import { SignupReqDto } from "../dtos/request/signup.req.dto.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { authUtil } from "../utils/functions/auth.util.js";
import { responseUtil } from "../utils/functions/response.util.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, birthDate, gender, bio } = req.body;

  const result = await authService.signup(
    new SignupReqDto({ name, email, password, gender, birthDate, bio })
  );

  authUtil.setAuthCookie(res, result.accessToken);

  responseUtil.sendContentNegotiatedResponse(
    req,
    res,
    StatusCode.CREATED,
    result
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.signin(email, password);

  authUtil.setAuthCookie(res, result.accessToken);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const logoutUser = asyncHandler(async (req, res) => {
  authUtil.clearAuthCookie(res);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, {
    message: "Logged out successfully.",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await authService.forgotPassword(email);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const resetPassword = asyncHandler(async (req, res) => {
  const resetToken = req.params.resetToken;
  const { newPassword } = req.body;

  const result = await authService.resetPassword(resetToken, newPassword);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const result = await authService.refreshAccessToken(refreshToken);

  authUtil.setAuthCookie(res, result.accessToken);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

export const authController = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
};
