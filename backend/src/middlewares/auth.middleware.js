import Express from "express";
import { HttpError } from "../utils/httpError.js";
import { StatusCode } from "../utils/statusCode.js";
import { tokenUtil } from "../utils/token.util.js";

/**
 * @category Middlewares
 * @classdesc A class that provides authentication-related middleware.
 */
class AuthMiddleware {
  /**
   * Middleware function to check if a user is already logged in.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   * @param {Express.NextFunction} next - The next middleware function.
   * @throws {HttpError} - Throws an error if the user is already logged in.
   */
  async checkLoggedin(req, res, next) {
    const token = req.cookies.authorization;

    if (token) {
      next(
        new HttpError(
          StatusCode.FORBIDDEN,
          "Already logged in. Please log out first."
        )
      );
    }

    next();
  }

  /**
   * Middleware function to verify the access token and set the authenticated user in the request object.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   * @param {Express.NextFunction} next - The next middleware function.
   * @throws {HttpError} - Throws an error if the token is invalid.
   * @throws {HttpError} - Throws an error if the token is expired.
   * @throws {HttpError} - Throws an error if the token is not found.
   */
  async verifyToken(req, res, next) {
    try {
      const token = req.cookies.authorization;

      if (!token) {
        throw new HttpError(
          StatusCode.UNAUTHORIZED,
          "Not authorized. No token found."
        );
      }
      const decodedToken = tokenUtil.verifyAccessToken(token);

      req.user = {
        id: decodedToken.id,
      };

      next();
    } catch (error) {
      if (!(error instanceof HttpError)) {
        error = new HttpError(
          StatusCode.UNAUTHORIZED,
          "Not authorized. Token failed."
        );
      }

      next(error);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
