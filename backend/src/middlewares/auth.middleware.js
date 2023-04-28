import asyncHandler from "express-async-handler";
import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";
import { tokenService } from "../services/token.service.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.authorization || req.headers.authorization;

  if (!token)
    throw new HttpError(
      StatusCode.UNAUTHORIZED,
      "Not authorized. No token found."
    );

  try {
    const decodedToken = tokenService.verifyAccessToken(token);

    req.user = {
      id: decodedToken.id,
    };
    next();
  } catch (error) {
    console.error(error);
    throw new HttpError(
      StatusCode.UNAUTHORIZED,
      "Not authorized. Token failed."
    );
  }
});

export const authMiddleware = { verifyToken };
