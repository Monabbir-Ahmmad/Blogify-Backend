import express from "express";
import { authController } from "../controllers/auth.controller.js";

export const authRouter = express.Router();

authRouter.route("/signup").post(authController.registerUser);

authRouter.route("/signin").post(authController.loginUser);

authRouter.route("/refreshtoken").post(authController.refreshAccessToken);
