import { HttpError } from "../../../utils/httpError.js";
import { PaginatedResDto } from "../../../dtos/response/paginated.res.dto.js";
import { UserProfileUpdateReqDto } from "../../../dtos/request/userProfileUpdate.req.dto.js";
import { UserResDto } from "../../../dtos/response/user.res.dto.js";
import { UserService } from "../../../services/user.service.js";
import { mapper } from "../../../configs/mapper.config.js";
import { passwordUtil } from "../../../utils/password.util.js";
import { userDB } from "../../../repositories/database/sequelize/user.db.js";

jest.mock("../../../repositories/database/sequelize/user.db.js");
jest.mock("../../../utils/password.util.js");
jest.mock("../../../configs/mapper.config.js");

describe("UserService", () => {
  const userService = new UserService();
  const userId = 123;
  const userProfileUpdateReqDto = new UserProfileUpdateReqDto({
    email: "updated@example.com",
    name: "Updated User",
  });
  const password = "password";
  const oldPassword = "oldPassword";
  const newPassword = "newPassword";
  const profileImage = "profile_image.jpg";
  const coverImage = "cover_image.jpg";

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getUser", () => {
    const user = {
      id: userId,
      email: "test@example.com",
      name: "Test User",
    };
    const expectedUserResDto = new UserResDto(user.id, user.name, user.email);

    it("should get a user by ID", async () => {
      userDB.getUserById.mockResolvedValue(user);
      mapper.map.mockReturnValue(expectedUserResDto);

      const result = await userService.getUser(userId);

      expect(result).toEqual(expectedUserResDto);
    });

    it("should throw HttpError with 404 status code if user not found", async () => {
      userDB.getUserById.mockResolvedValue(null);

      await expect(userService.getUser(userId)).rejects.toThrow(HttpError);
    });
  });

  describe("updateProfile", () => {
    const user = {
      id: userId,
      email: "test@example.com",
      name: "Test User",
      password: "hashedPassword",
    };
    const updatedUser = {
      id: userId,
      email: userProfileUpdateReqDto.email,
      name: userProfileUpdateReqDto.name,
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
      ).rejects.toThrow(HttpError);
    });

    it("should throw HttpError with 403 status code if wrong password provided", async () => {
      passwordUtil.verifyPassword.mockResolvedValue(false);

      await expect(
        userService.updateProfile(userId, userProfileUpdateReqDto, password)
      ).rejects.toThrow(HttpError);
    });

    it("should throw HttpError with 409 status code if email already in use", async () => {
      userDB.getUserByEmail.mockResolvedValue(existingUser);

      await expect(
        userService.updateProfile(userId, userProfileUpdateReqDto, password)
      ).rejects.toThrow(HttpError);
    });
  });

  describe("updatePassword", () => {
    const user = {
      id: userId,
      email: "test@example.com",
      name: "Test User",
      password: "hashedPassword",
    };
    const updatedUser = {
      id: userId,
      email: user.email,
      name: user.name,
      password: "newHashedPassword",
    };
    const newPasswordSameAsOld = "oldPassword";

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
      ).rejects.toThrow(HttpError);
    });

    it("should throw HttpError with 403 status code if wrong password provided", async () => {
      passwordUtil.verifyPassword.mockResolvedValue(false);

      await expect(
        userService.updatePassword(userId, oldPassword, newPassword)
      ).rejects.toThrow(HttpError);
    });

    it("should throw HttpError with 403 status code if new password is the same as the old password", async () => {
      await expect(
        userService.updatePassword(userId, oldPassword, newPasswordSameAsOld)
      ).rejects.toThrow(HttpError);
    });
  });

  describe("updateProfileImage", () => {
    const user = {
      id: userId,
      email: "test@example.com",
      name: "Test User",
    };
    const updatedUser = {
      id: userId,
      email: user.email,
      name: user.name,
      profileImage,
    };
    const expectedUserResDto = new UserResDto(
      updatedUser.id,
      updatedUser.email,
      updatedUser.name,
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
      ).rejects.toThrow(HttpError);
    });
  });

  describe("updateCoverImage", () => {
    const user = {
      id: userId,
      email: "test@example.com",
      name: "Test User",
    };
    const updatedUser = {
      id: userId,
      email: user.email,
      name: user.name,
      coverImage,
    };
    const expectedUserResDto = new UserResDto(
      updatedUser.id,
      updatedUser.email,
      updatedUser.name,
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
      ).rejects.toThrow(HttpError);
    });
  });

  describe("deleteUser", () => {
    const user = {
      id: userId,
      email: "test@example.com",
      name: "Test User",
      password: "hashedPassword",
    };
    const deletedUser = {
      id: userId,
      email: user.email,
      name: user.name,
    };
    const expectedUserResDto = new UserResDto(
      deletedUser.id,
      deletedUser.email,
      deletedUser.name
    );

    beforeEach(() => {
      userDB.getUserById.mockResolvedValue(user);
      passwordUtil.verifyPassword.mockResolvedValue(true);
      userDB.deleteUser.mockResolvedValue(deletedUser);
      mapper.map.mockReturnValue(expectedUserResDto);
    });

    it("should delete a user", async () => {
      const result = await userService.deleteUser(userId, password);

      expect(result).toEqual(expectedUserResDto);
    });

    it("should throw HttpError with 403 status code if wrong password provided", async () => {
      passwordUtil.verifyPassword.mockResolvedValue(false);

      await expect(userService.deleteUser(userId, password)).rejects.toThrow(
        HttpError
      );
    });
  });

  describe("searchUser", () => {
    const keyword = "test";
    const offset = 0;
    const limit = 10;
    const users = [
      {
        id: 1,
        email: "test1@example.com",
        name: "Test User 1",
      },
      {
        id: 2,
        email: "test2@example.com",
        name: "Test User 2",
      },
    ];
    const pageCount = 2;
    const expectedUsersResDto = users.map(
      (user) => new UserResDto(user.id, user.email, user.name)
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
