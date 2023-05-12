import { SignupReqDto } from "../dtos/request/signup.req.dto.js";
import { StatusCode } from "../utils/objects/StatusCode.js";
import { authService } from "../services/auth.service.js";
import { cookieUtil } from "../utils/functions/cookie.util.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { responseUtil } from "../utils/functions/response.util.js";

/**
 * Registers a new user and logs them in by setting the auth cookie
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 */
const signup = errorMiddleware.asyncHandler(async (req, res) => {
  const { name, email, password, birthDate, gender } = req.body;

  const result = await authService.signup(
    new SignupReqDto({ name, email, password, gender, birthDate })
  );

  cookieUtil.setAuthCookie(res, result.accessToken);

  responseUtil.sendContentNegotiatedResponse(
    req,
    res,
    StatusCode.CREATED,
    result
  );
});

/**
 * Logs in a user and sets the auth cookie
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 */
const signin = errorMiddleware.asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.signin(email, password);

  cookieUtil.setAuthCookie(res, result.accessToken);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

/**
 * Logs out a user by clearing the auth cookie
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 */
const signout = errorMiddleware.asyncHandler(async (req, res) => {
  cookieUtil.clearAuthCookie(res);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK);
});

/**
 * Sends a reset password email to the user
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 */
const forgotPassword = errorMiddleware.asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await authService.forgotPassword(email);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

/**
 * Resets the user's password with the reset token
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 */
const resetPassword = errorMiddleware.asyncHandler(async (req, res) => {
  const resetToken = req.params.resetToken;
  const { newPassword } = req.body;

  const result = await authService.resetPassword(resetToken, newPassword);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

/**
 * Refreshes the user's access token with the refresh token and sets the auth cookie
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 */
const refreshAccessToken = errorMiddleware.asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const result = await authService.refreshAccessToken(refreshToken);

  cookieUtil.setAuthCookie(res, result.accessToken);

  responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
});

export const authController = {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
};
