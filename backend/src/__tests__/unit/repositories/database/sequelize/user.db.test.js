import { Op } from "sequelize";
import { User } from "../../../../../models/user.model.js";
import { UserType } from "../../../../../models/userType.model.js";
import { userDB } from "../../../../../repositories/database/sequelize/user.db.js";

jest.mock("../../../../../models/user.model.js");
jest.mock("../../../../../models/userType.model.js");

describe("UserDB", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    const signupReqDto = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };
    const userType = { name: "Normal" };
    const user = {
      ...signupReqDto,
      userType,
      id: 1,
      setUserType: jest.fn(),
    };

    it("should create a new user and return the created user", async () => {
      UserType.findOne.mockResolvedValue(userType);
      User.create.mockResolvedValue(user);

      const result = await userDB.createUser(signupReqDto);

      expect(result).toBe(user);
    });

    it("should return null if the user type is not found", async () => {
      UserType.findOne.mockResolvedValue(null);

      const result = await userDB.createUser(signupReqDto);

      expect(result).toBeNull();
    });

    it("should return null if the user creation fails", async () => {
      UserType.findOne.mockResolvedValue(userType);
      User.create.mockResolvedValue(null);

      const result = await userDB.createUser(signupReqDto);

      expect(result).toBeNull();
    });
  });

  describe("getUserByEmail", () => {
    const email = "john@example.com";
    const user = { email, userType: { name: "Normal" } };

    it("should retrieve a user by their email address", async () => {
      User.findOne.mockResolvedValue(user);

      const result = await userDB.getUserByEmail(email);

      expect(result).toBe(user);
    });

    it("should return null if the user is not found", async () => {
      User.findOne.mockResolvedValue(null);

      const result = await userDB.getUserByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe("getUserById", () => {
    const userId = 1;
    const user = { id: userId, userType: { name: "Normal" } };
    it("should retrieve a user by their ID", async () => {
      User.findByPk.mockResolvedValue(user);

      const result = await userDB.getUserById(userId);

      expect(result).toBe(user);
    });

    it("should return null if the user is not found", async () => {
      User.findByPk.mockResolvedValue(null);

      const result = await userDB.getUserById(userId);

      expect(result).toBeNull();
    });
  });

  describe("updateUser", () => {
    const userId = 1;
    const userProfileUpdateReqDto = { name: "John Smith" };
    const updatedUser = { id: userId, ...userProfileUpdateReqDto };
    const user = {
      id: userId,
      update: jest.fn().mockResolvedValue(updatedUser),
    };

    it("should update a user's profile and return the updated user", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(user);

      const result = await userDB.updateUser(userId, userProfileUpdateReqDto);

      expect(result).toBe(updatedUser);
    });

    it("should return null if the user is not found", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(null);

      const result = await userDB.updateUser(userId, userProfileUpdateReqDto);

      expect(result).toBeNull();
    });
  });

  describe("updatePassword", () => {
    const userId = 1;
    const password = "newpassword";
    const updatedUser = { id: userId, password };
    const user = {
      id: userId,
      update: jest.fn().mockResolvedValue(updatedUser),
    };

    it("should update a user's password and return the updated user", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(user);

      const result = await userDB.updatePassword(userId, password);

      expect(result).toBe(updatedUser);
    });

    it("should return null if the user is not found", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(null);

      const result = await userDB.updatePassword(userId, password);

      expect(result).toBeNull();
    });
  });

  describe("updateProfileImage", () => {
    const userId = 1;
    const profileImage = "http://example.com/profile.jpg";
    const updatedUser = { id: userId, profileImage };
    const user = {
      id: userId,
      update: jest.fn().mockResolvedValue(updatedUser),
    };

    it("should update a user's profile image and return the updated user", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(user);

      const result = await userDB.updateProfileImage(userId, profileImage);

      expect(result).toBe(updatedUser);
    });

    it("should return null if the user is not found", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(null);

      const result = await userDB.updateProfileImage(userId, profileImage);

      expect(result).toBeNull();
    });
  });

  describe("updateCoverImage", () => {
    const userId = 1;
    const coverImage = "http://example.com/cover.jpg";
    const updatedUser = { id: userId, coverImage };
    const user = {
      id: userId,
      update: jest.fn().mockResolvedValue(updatedUser),
    };

    it("should update a user's cover image and return the updated user", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(user);

      const result = await userDB.updateCoverImage(userId, coverImage);

      expect(result).toBe(updatedUser);
    });

    it("should return null if the user is not found", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(null);

      const result = await userDB.updateCoverImage(userId, coverImage);

      expect(result).toBeNull();
    });
  });

  describe("deleteUser", () => {
    const userId = 1;
    const user = {
      id: userId,
      destroy: jest.fn().mockReturnThis(),
    };
    it("should delete a user and return the deleted user", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(user);

      const result = await userDB.deleteUser(userId);

      expect(result).toBe(user);
    });

    it("should return null if the user is not found", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(null);

      const result = await userDB.deleteUser(userId);

      expect(result).toBeNull();
    });
  });

  describe("searchUserByName", () => {
    it("should search users by name with pagination support and return the result", async () => {
      const keyword = "John";
      const offset = 0;
      const limit = 10;
      const users = [];
      const count = 0;

      User.findAndCountAll.mockResolvedValue({ rows: users, count });

      const result = await userDB.searchUserByName(keyword, offset, limit);

      expect(result).toEqual({
        users,
        pageCount: 0,
      });
    });
  });
});
