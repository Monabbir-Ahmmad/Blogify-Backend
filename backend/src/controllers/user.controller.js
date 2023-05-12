import Express from "express";
import { HttpError } from "../utils/objects/HttpError.js";
import { StatusCode } from "../utils/objects/StatusCode.js";
import { UserProfileUpdateReqDto } from "../dtos/request/userProfileUpdate.req.dto.js";
import { responseUtil } from "../utils/functions/response.util.js";
import { userService } from "../services/user.service.js";

/** A class that provides controller functions for user-related operations. */
class UserController {
  /**
   * Get user controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async getUser(req, res) {
    const userId = req.params.userId;

    const result = await userService.getUser(userId);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Update user profile controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async updateProfile(req, res) {
    const userId = req.user.id;
    const { name, email, birthDate, gender, bio, password } = req.body;

    if (userId !== req.params.userId) {
      throw new HttpError(
        StatusCode.FORBIDDEN,
        "You are not allowed to update this user's profile."
      );
    }

    const result = await userService.updateProfile(
      userId,
      new UserProfileUpdateReqDto({ name, email, gender, birthDate, bio }),
      password
    );

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Update user password controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async updatePassword(req, res) {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (userId !== req.params.userId) {
      throw new HttpError(
        StatusCode.FORBIDDEN,
        "You are not allowed to update this user's password."
      );
    }

    const result = await userService.updatePassword(
      userId,
      oldPassword,
      newPassword
    );

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Update user profile image controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async updateProfileImage(req, res) {
    const userId = req.user.id;
    const profileImage = req.file?.filename;

    if (userId !== req.params.userId) {
      throw new HttpError(
        StatusCode.FORBIDDEN,
        "You are not allowed to update this user's profile image."
      );
    }

    const result = await userService.updateProfileImage(userId, profileImage);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Update user cover image controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async updateCoverImage(req, res) {
    const userId = req.user.id;
    const coverImage = req.file?.filename;

    if (userId !== req.params.userId) {
      throw new HttpError(
        StatusCode.FORBIDDEN,
        "You are not allowed to update this user's cover image."
      );
    }

    const result = await userService.updateCoverImage(userId, coverImage);
    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }

  /**
   * Delete user controller function.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   */
  async deleteUser(req, res) {
    const userId = req.user.id;

    if (userId !== req.params.userId) {
      throw new HttpError(
        StatusCode.FORBIDDEN,
        "You are not allowed to delete this user."
      );
    }

    const result = await userService.deleteUser(userId);

    responseUtil.sendContentNegotiatedResponse(req, res, StatusCode.OK, result);
  }
}

export const userController = new UserController();
