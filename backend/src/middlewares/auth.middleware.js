import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import HttpError from "../utils/objects/HttpError.js";
import StatusCode from "../utils/objects/StatusCode.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer"))
    throw new HttpError(
      StatusCode.UNAUTHORIZED,
      "Not authorized. No token found."
    );

  const token = authHeader.split(" ")[1];
  if (!token)
    throw new HttpError(
      StatusCode.UNAUTHORIZED,
      "Not authorized. No token found."
    );

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_KEY);

    req.user = {
      id: decodedToken.id,
    };
    next();
  } catch (error) {
    console.log(error);
    if (error.statusCode) throw error;
    else
      throw new HttpError(
        StatusCode.UNAUTHORIZED,
        "Not authorized. Token failed."
      );
  }
});

export const authMiddleware = { verifyToken };
