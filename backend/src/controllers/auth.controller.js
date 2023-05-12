import Express from "express";
import { SignupReqDto } from "../dtos/request/signup.req.dto.js";
import { StatusCode } from "../utils/StatusCode.js";
import { authService } from "../services/auth.service.js";
import { cookieUtil } from "../utils/cookie.util.js";
import { responseUtil } from "../utils/response.util.js";

/** A class that provides controller functions for authentication. */
class AuthController {
  /**
   * Signup controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async signup(req, res) {
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
  }

  /**
   * Signin controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async signin(req, res) {
    const { email, password } = req.body;

    const result = await authService.signin(email, password);

    cookieUtil.setAuthCookie(res, result.accessToken);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Signout controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async signout(req, res) {
    cookieUtil.clearAuthCookie(res);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK);
  }

  /**
   * Forgot password controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async forgotPassword(req, res) {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Reset password controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async resetPassword(req, res) {
    const resetToken = req.params.resetToken;
    const { newPassword } = req.body;

    const result = await authService.resetPassword(resetToken, newPassword);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Refresh access token controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async refreshAccessToken(req, res) {
    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(refreshToken);

    cookieUtil.setAuthCookie(res, result.accessToken);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }
}

export const authController = new AuthController();
