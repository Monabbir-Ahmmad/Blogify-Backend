import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { errorMiddleware } from "./error.middleware.js";
import { tokenUtil } from "../utils/functions/token.util.js";

/**
 * Check if user is logged in. This prevents logged in users from accessing login and signup routes.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
const checkLoggedin = errorMiddleware.asyncHandler(async (req, res, next) => {
  const token = req.cookies.authorization;

  if (token)
    throw new HttpError(
      StatusCode.FORBIDDEN,
      "Already logged in. Please log out first."
    );

  next();
});

/**
 * Verify token for private routes.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
const verifyToken = errorMiddleware.asyncHandler(async (req, res, next) => {
  const token = req.cookies.authorization;

  if (!token)
    throw new HttpError(
      StatusCode.UNAUTHORIZED,
      "Not authorized. No token found."
    );

  try {
    const decodedToken = tokenUtil.verifyAccessToken(token);

    req.user = {
      id: decodedToken.id,
    };
    next();
  } catch (error) {
    if (error instanceof HttpError) throw error;

    throw new HttpError(
      StatusCode.UNAUTHORIZED,
      "Not authorized. Token failed."
    );
  }
});

export const authMiddleware = { checkLoggedin, verifyToken };
