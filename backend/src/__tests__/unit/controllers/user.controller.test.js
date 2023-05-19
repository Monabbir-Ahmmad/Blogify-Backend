import { HttpError } from "../../../utils/httpError.js";
import { StatusCode } from "../../../utils/statusCode.js";
import { UserProfileUpdateReqDto } from "../../../dtos/request/userProfileUpdate.req.dto.js";
import { UserResDto } from "../../../dtos/response/user.res.dto.js";
import { cookieUtil } from "../../../utils/cookie.util.js";
import { responseUtil } from "../../../utils/response.util.js";
import { userController } from "../../../controllers/user.controller.js";
import { userService } from "../../../services/user.service.js";

jest.mock("../../../services/user.service.js");
jest.mock("../../../utils/cookie.util.js");
jest.mock("../../../utils/response.util.js");

describe("UserController", () => {
  let req = {};
  const res = {};

  const expectedUserResDto = new UserResDto(
    1,
    "John Doe",
    "john.doe@email.com",
    "male",
    "1990-01-01",
    "normal",
    "profile-image.jpg",
    "cover-image.jpg",
    "Hello, I'm John Doe",
    "2021-01-01"
  );

  beforeEach(() => {
    responseUtil.sendContentNegotiatedResponse.mockImplementationOnce();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("should get the user and return the result", async () => {
      req = {
        params: {
          userId: 1,
        },
      };

      userService.getUser.mockResolvedValueOnce(expectedUserResDto);

      await userController.getUser(req, res);

      expect(userService.getUser).toHaveBeenCalledWith(req.params.userId);
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedUserResDto
      );
    });
  });

  describe("updateProfile", () => {
    it("should update the user's profile and return the result", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          userId: 1,
        },
        body: {
          name: "John Doe",
          email: "john@example.com",
          birthDate: "1990-01-01",
          gender: "male",
          bio: "Hello, I'm John Doe",
          password: "new-password",
        },
      };

      userService.updateProfile.mockResolvedValueOnce(expectedUserResDto);

      await userController.updateProfile(req, res);

      expect(userService.updateProfile).toHaveBeenCalledWith(
        req.user.id,
        new UserProfileUpdateReqDto({
          name: req.body.name,
          email: req.body.email,
          gender: req.body.gender,
          birthDate: req.body.birthDate,
          bio: req.body.bio,
        }),
        req.body.password
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedUserResDto
      );
    });

    it("should throw Forbidden error when attempting to update another user's profile", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          userId: 2,
        },
        body: {
          name: "John Doe",
          email: "john@example.com",
          birthDate: "1990-01-01",
          gender: "male",
          bio: "Hello, I'm John Doe",
          password: "new-password",
        },
      };

      await expect(userController.updateProfile(req, res)).rejects.toThrow(
        new HttpError(
          StatusCode.FORBIDDEN,
          "You are not allowed to update this user's profile."
        )
      );

      expect(userService.updateProfile).not.toHaveBeenCalled();
      expect(responseUtil.sendContentNegotiatedResponse).not.toHaveBeenCalled();
    });
  });

  describe("updatePassword", () => {
    it("should update the user's password and return the result", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          userId: 1,
        },
        body: {
          oldPassword: "old-password",
          newPassword: "new-password",
        },
      };

      userService.updatePassword.mockResolvedValueOnce(expectedUserResDto);

      await userController.updatePassword(req, res);

      expect(userService.updatePassword).toHaveBeenCalledWith(
        req.user.id,
        req.body.oldPassword,
        req.body.newPassword
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedUserResDto
      );
    });

    it("should throw Forbidden error when attempting to update another user's password", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          userId: 2,
        },
        body: {
          oldPassword: "old-password",
          newPassword: "new-password",
        },
      };

      await expect(userController.updatePassword(req, res)).rejects.toThrow(
        new HttpError(
          StatusCode.FORBIDDEN,
          "You are not allowed to update this user's password."
        )
      );

      expect(userService.updatePassword).not.toHaveBeenCalled();
      expect(responseUtil.sendContentNegotiatedResponse).not.toHaveBeenCalled();
    });
  });

  describe("updateProfileImage", () => {
    it("should update the user's profile image and return the result", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          userId: 1,
        },
        file: {
          url: "https://blogify/profile-image.jpg",
        },
      };

      userService.updateProfileImage.mockResolvedValueOnce(expectedUserResDto);

      await userController.updateProfileImage(req, res);

      expect(userService.updateProfileImage).toHaveBeenCalledWith(
        req.user.id,
        req.file.url
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedUserResDto
      );
    });

    it("should throw Forbidden error when attempting to update another user's profile image", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          userId: 2,
        },
        file: {
          url: "https://blogify/profile-image.jpg",
        },
      };

      await expect(userController.updateProfileImage(req, res)).rejects.toThrow(
        new HttpError(
          StatusCode.FORBIDDEN,
          "You are not allowed to update this user's profile image."
        )
      );

      expect(userService.updateProfileImage).not.toHaveBeenCalled();
      expect(responseUtil.sendContentNegotiatedResponse).not.toHaveBeenCalled();
    });
  });

  describe("updateCoverImage", () => {
    it("should update the user's cover image and return the result", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          userId: 1,
        },
        file: {
          url: "https://blogify/cover-image.jpg",
        },
      };
      const expectedResult = { message: "Cover image updated successfully" };

      userService.updateCoverImage.mockResolvedValueOnce(expectedResult);

      await userController.updateCoverImage(req, res);

      expect(userService.updateCoverImage).toHaveBeenCalledWith(
        req.user.id,
        req.file.url
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedResult
      );
    });

    it("should throw Forbidden error when attempting to update another user's cover image", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          userId: 2,
        },
        file: {
          url: "https://blogify/cover-image.jpg",
        },
      };

      await expect(userController.updateCoverImage(req, res)).rejects.toThrow(
        new HttpError(
          StatusCode.FORBIDDEN,
          "You are not allowed to update this user's cover image."
        )
      );

      expect(userService.updateCoverImage).not.toHaveBeenCalled();
      expect(responseUtil.sendContentNegotiatedResponse).not.toHaveBeenCalled();
    });
  });

  describe("deleteUser", () => {
    it("should delete the user and return the result", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          userId: 1,
        },
        body: {
          password: "12345Aa!",
        },
      };
      const expectedResult = {
        id: req.user.id,
      };

      userService.deleteUser.mockResolvedValueOnce(expectedResult);
      cookieUtil.setAuthCookie.mockImplementationOnce();

      await userController.deleteUser(req, res);

      expect(userService.deleteUser).toHaveBeenCalledWith(
        req.user.id,
        req.body.password
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedResult
      );
    });

    it("should throw Forbidden error when attempting to delete another user", async () => {
      req = {
        user: {
          id: 1,
        },
        params: {
          userId: 2,
        },
        body: {
          password: "12345Aa!",
        },
      };

      await expect(userController.deleteUser(req, res)).rejects.toThrow(
        new HttpError(
          StatusCode.FORBIDDEN,
          "You are not allowed to delete this user."
        )
      );

      expect(userService.deleteUser).not.toHaveBeenCalled();
      expect(responseUtil.sendContentNegotiatedResponse).not.toHaveBeenCalled();
    });
  });
});
