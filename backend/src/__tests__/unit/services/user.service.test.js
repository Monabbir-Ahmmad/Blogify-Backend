import { HttpError } from "../../../utils/httpError.js";
import { PaginatedResDto } from "../../../dtos/response/paginated.res.dto.js";
import { StatusCode } from "../../../utils/statusCode.js";
import { UserProfileUpdateReqDto } from "../../../dtos/request/userProfileUpdate.req.dto.js";
import { UserResDto } from "../../../dtos/response/user.res.dto.js";
import { mapper } from "../../../configs/mapper.config.js";
import { passwordUtil } from "../../../utils/password.util.js";
import { userDB } from "../../../repositories/database/sequelize/user.db.js";
import { userService } from "../../../services/user.service.js";

jest.mock("../../../repositories/database/sequelize/user.db.js");
jest.mock("../../../utils/password.util.js");
jest.mock("../../../configs/mapper.config.js");

describe("UserService", () => {
  const userId = 1;
  const user = {
    id: userId,
    email: "test@example.com",
    name: "Test User",
    password: "hashedPassword",
    gender: "Male",
    birthDate: new Date().toISOString(),
    profileImage: "profile_image.jpg",
    coverImage: "cover_image.jpg",
    bio: "Test bio.",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    const expectedUserResDto = new UserResDto(user.id, user.name, user.email);

    it("should get a user by ID", async () => {
      userDB.getUserById.mockResolvedValue(user);
      mapper.map.mockReturnValue(expectedUserResDto);

      const result = await userService.getUser(userId);

      expect(result).toEqual(expectedUserResDto);
    });

    it("should throw HttpError with 404 status code if user not found", async () => {
      userDB.getUserById.mockResolvedValue(null);

      await expect(userService.getUser(userId)).rejects.toThrow(
        new HttpError(StatusCode.NOT_FOUND, "User not found.")
      );
    });
  });

  describe("updateProfile", () => {
    const userProfileUpdateReqDto = new UserProfileUpdateReqDto({
      email: "updated@example.com",
      name: "Updated User",
    });
    const password = "password";
    const updatedUser = {
      ...user,
      ...userProfileUpdateReqDto,
    };
    const existingUser = {
      id: 456,
      email: userProfileUpdateReqDto.email,
      name: "Existing User",
    };
    const expectedUserResDto = new UserResDto(
      updatedUser.id,
      updatedUser.email,
      updatedUser.name
    );

    beforeEach(() => {
      userDB.getUserById.mockResolvedValue(user);
      passwordUtil.verifyPassword.mockResolvedValue(true);
      userDB.getUserByEmail.mockResolvedValue(null);
      userDB.updateUser.mockResolvedValue(updatedUser);
      mapper.map.mockReturnValue(expectedUserResDto);
    });

    it("should update the profile of a user", async () => {
      const result = await userService.updateProfile(
        userId,
        userProfileUpdateReqDto,
        password
      );

      expect(result).toEqual(expectedUserResDto);
    });

    it("should throw HttpError with 404 status code if user not found", async () => {
      userDB.getUserById.mockResolvedValue(null);

      await expect(
        userService.updateProfile(userId, userProfileUpdateReqDto, password)
      ).rejects.toThrow(new HttpError(StatusCode.NOT_FOUND, "User not found."));
    });

    it("should throw HttpError with 403 status code if wrong password provided", async () => {
      passwordUtil.verifyPassword.mockResolvedValue(false);

      await expect(
        userService.updateProfile(userId, userProfileUpdateReqDto, password)
      ).rejects.toThrow(new HttpError(StatusCode.FORBIDDEN, "Wrong password."));
    });

    it("should throw HttpError with 409 status code if email already in use", async () => {
      userDB.getUserByEmail.mockResolvedValue(existingUser);

      await expect(
        userService.updateProfile(userId, userProfileUpdateReqDto, password)
      ).rejects.toThrow(
        new HttpError(StatusCode.CONFLICT, "Email already in use.")
      );
    });
  });

  describe("updatePassword", () => {
    const updatedUser = {
      id: userId,
      email: user.email,
      name: user.name,
      password: "newHashedPassword",
    };
    const oldPassword = "oldPassword";
    const newPassword = "newPassword";
    const newPasswordSameAsOld = oldPassword;

    beforeEach(() => {
      userDB.getUserById.mockResolvedValue(user);
      passwordUtil.verifyPassword.mockResolvedValue(true);
      passwordUtil.hashPassword.mockResolvedValue(updatedUser.password);
      userDB.updatePassword.mockResolvedValue(updatedUser);
      mapper.map.mockReturnValue(
        new UserResDto(updatedUser.id, updatedUser.email, updatedUser.name)
      );
    });

    it("should update the password of a user", async () => {
      const result = await userService.updatePassword(
        userId,
        oldPassword,
        newPassword
      );

      expect(result).toEqual(
        new UserResDto(updatedUser.id, updatedUser.email, updatedUser.name)
      );
    });

    it("should throw HttpError with 404 status code if user not found", async () => {
      userDB.getUserById.mockResolvedValue(null);

      await expect(
        userService.updatePassword(userId, oldPassword, newPassword)
      ).rejects.toThrow(new HttpError(StatusCode.NOT_FOUND, "User not found."));
    });

    it("should throw HttpError with 403 status code if wrong password provided", async () => {
      passwordUtil.verifyPassword.mockResolvedValue(false);

      await expect(
        userService.updatePassword(userId, oldPassword, newPassword)
      ).rejects.toThrow(new HttpError(StatusCode.FORBIDDEN, "Wrong password."));
    });

    it("should throw HttpError with 403 status code if new password is the same as the old password", async () => {
      await expect(
        userService.updatePassword(userId, oldPassword, newPasswordSameAsOld)
      ).rejects.toThrow(
        new HttpError(
          StatusCode.FORBIDDEN,
          "New password cannot be the same as the old password."
        )
      );
    });
  });

  describe("updateProfileImage", () => {
    const profileImage = "profile_image.jpg";
    const updatedUser = {
      ...user,
      profileImage,
    };
    const expectedUserResDto = new UserResDto(
      updatedUser.id,
      updatedUser.email,
      updatedUser.name,
      undefined,
      undefined,
      undefined,
      updatedUser.profileImage
    );

    beforeEach(() => {
      userDB.getUserById.mockResolvedValue(user);
      userDB.updateProfileImage.mockResolvedValue(updatedUser);
      mapper.map.mockReturnValue(expectedUserResDto);
    });

    it("should update the profile image of a user", async () => {
      const result = await userService.updateProfileImage(userId, profileImage);

      expect(result).toEqual(expectedUserResDto);
    });

    it("should update the profile image to null (remove profile image)", async () => {
      const result = await userService.updateProfileImage(userId, null);

      expect(result).toEqual(expectedUserResDto);
    });

    it("should throw HttpError with 404 status code if user not found", async () => {
      userDB.getUserById.mockResolvedValue(null);

      await expect(
        userService.updateProfileImage(userId, profileImage)
      ).rejects.toThrow(new HttpError(StatusCode.NOT_FOUND, "User not found."));
    });
  });

  describe("updateCoverImage", () => {
    const coverImage = "cover_image.jpg";
    const updatedUser = {
      ...user,
      coverImage,
    };
    const expectedUserResDto = new UserResDto(
      updatedUser.id,
      updatedUser.email,
      updatedUser.name,
      undefined,
      undefined,
      undefined,
      undefined,
      updatedUser.coverImage
    );

    beforeEach(() => {
      userDB.getUserById.mockResolvedValue(user);
      userDB.updateCoverImage.mockResolvedValue(updatedUser);
      mapper.map.mockReturnValue(expectedUserResDto);
    });

    it("should update the cover image of a user", async () => {
      const result = await userService.updateCoverImage(userId, coverImage);

      expect(result).toEqual(expectedUserResDto);
    });

    it("should update the cover image to null (remove cover image)", async () => {
      const result = await userService.updateCoverImage(userId, null);

      expect(result).toEqual(expectedUserResDto);
    });

    it("should throw HttpError with 404 status code if user not found", async () => {
      userDB.getUserById.mockResolvedValue(null);

      await expect(
        userService.updateCoverImage(userId, coverImage)
      ).rejects.toThrow(new HttpError(StatusCode.NOT_FOUND, "User not found."));
    });
  });

  describe("deleteUser", () => {
    const password = "password";
    const expectedUserResDto = new UserResDto(user.id, user.name, user.email);

    beforeEach(() => {
      userDB.getUserById.mockResolvedValue(user);
      passwordUtil.verifyPassword.mockResolvedValue(true);
      userDB.deleteUser.mockResolvedValue(user);
      mapper.map.mockReturnValue(expectedUserResDto);
    });

    it("should delete a user", async () => {
      const result = await userService.deleteUser(userId, password);

      expect(result).toEqual(expectedUserResDto);
    });

    it("should throw HttpError with 404 status code if user not found", async () => {
      userDB.getUserById.mockResolvedValue(null);

      await expect(userService.deleteUser(userId, password)).rejects.toThrow(
        new HttpError(StatusCode.NOT_FOUND, "User not found.")
      );
    });

    it("should throw HttpError with 403 status code if wrong password provided", async () => {
      passwordUtil.verifyPassword.mockResolvedValue(false);

      await expect(userService.deleteUser(userId, password)).rejects.toThrow(
        new HttpError(StatusCode.FORBIDDEN, "Wrong password.")
      );
    });
  });

  describe("searchUser", () => {
    const keyword = "test";
    const offset = 0;
    const limit = 10;
    const users = [
      { ...user, id: 1 },
      { ...user, id: 2 },
    ];
    const pageCount = 2;
    const expectedUsersResDto = users.map(
      (user) => new UserResDto(user.id, user.name, user.email)
    );
    const expectedPaginatedResDto = new PaginatedResDto(
      pageCount,
      expectedUsersResDto
    );

    beforeEach(() => {
      userDB.searchUserByName.mockResolvedValue({ pageCount, users });
      mapper.mapArray.mockReturnValue(expectedUsersResDto);
    });

    it("should search users by keyword and return paginated result", async () => {
      const options = { offset, limit };
      const result = await userService.searchUser(keyword, options);

      expect(result).toEqual(expectedPaginatedResDto);
    });
  });
});
