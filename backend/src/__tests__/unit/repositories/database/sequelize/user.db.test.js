import { Op } from "sequelize";
import { User } from "../../../../../models/user.model.js";
import { UserType } from "../../../../../models/userType.model.js";
import { userDB } from "../../../../../repositories/database/sequelize/user.db.js";

jest.mock("../../../../../models/user.model.js");
jest.mock("../../../../../models/userType.model.js");

User.belongsTo.mockReturnValue();
User.hasMany.mockReturnValue();

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

    it("should create a new user and return the created user", async () => {
      const createdUser = {
        ...signupReqDto,
        userType,
        id: 1,
        setUserType: jest.fn().mockResolvedValue(),
      };

      UserType.findOne.mockResolvedValue(userType);
      User.create.mockResolvedValue(createdUser);
      User.prototype.setUserType = createdUser.setUserType;

      const result = await userDB.createUser(signupReqDto);

      expect(UserType.findOne).toHaveBeenCalledWith({
        where: { name: "Normal" },
      });
      expect(User.create).toHaveBeenCalledWith(signupReqDto);
      expect(User.prototype.setUserType).toHaveBeenCalledWith(userType);
      expect(result).toBe(createdUser);
    });

    it("should return null if the user type is not found", async () => {
      UserType.findOne.mockResolvedValue(null);

      const result = await userDB.createUser(signupReqDto);

      expect(UserType.findOne).toHaveBeenCalledWith({
        where: { name: "Normal" },
      });
      expect(User.create).not.toHaveBeenCalled();
      expect(User.prototype.setUserType).not.toHaveBeenCalled();
      expect(result).toBe(null);
    });

    it("should return null if the user creation fails", async () => {
      UserType.findOne.mockResolvedValue(userType);
      User.create.mockResolvedValue(null);

      const result = await userDB.createUser(signupReqDto);

      expect(UserType.findOne).toHaveBeenCalledWith({
        where: { name: "Normal" },
      });
      expect(User.create).toHaveBeenCalledWith(signupReqDto);
      expect(User.prototype.setUserType).not.toHaveBeenCalled();
      expect(result).toBe(null);
    });
  });

  describe("getUserByEmail", () => {
    const email = "john@example.com";
    const user = { email, userType: { name: "Normal" } };

    it("should retrieve a user by their email address", async () => {
      User.findOne.mockResolvedValue(user);

      const result = await userDB.getUserByEmail(email);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email },
        include: {
          model: UserType,
          attributes: ["name"],
        },
      });
      expect(result).toBe(user);
    });

    it("should return null if the user is not found", async () => {
      User.findOne.mockResolvedValue(null);

      const result = await userDB.getUserByEmail(email);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email },
        include: {
          model: UserType,
          attributes: ["name"],
        },
      });
      expect(result).toBe(null);
    });
  });

  describe("getUserById", () => {
    const userId = 1;
    const user = { id: userId, userType: { name: "Normal" } };
    it("should retrieve a user by their ID", async () => {
      User.findByPk.mockResolvedValue(user);

      const result = await userDB.getUserById(userId);

      expect(User.findByPk).toHaveBeenCalledWith(userId, {
        include: {
          model: UserType,
          attributes: ["name"],
        },
      });
      expect(result).toBe(user);
    });

    it("should return null if the user is not found", async () => {
      User.findByPk.mockResolvedValue(null);

      const result = await userDB.getUserById(userId);

      expect(User.findByPk).toHaveBeenCalledWith(userId, {
        include: {
          model: UserType,
          attributes: ["name"],
        },
      });
      expect(result).toBe(null);
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
      User.prototype.update = user.update;

      const result = await userDB.updateUser(userId, userProfileUpdateReqDto);

      expect(userDB.getUserById).toHaveBeenCalledWith(userId);
      expect(user.update).toHaveBeenCalledWith(userProfileUpdateReqDto);
      expect(result).toBe(updatedUser);
    });

    it("should return null if the user is not found", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(null);

      const result = await userDB.updateUser(userId, userProfileUpdateReqDto);

      expect(userDB.getUserById).toHaveBeenCalledWith(userId);
      expect(User.prototype.update).not.toHaveBeenCalled();
      expect(result).toBe(null);
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

      User.prototype.update = user.update;

      const result = await userDB.updatePassword(userId, password);

      expect(userDB.getUserById).toHaveBeenCalledWith(userId);
      expect(user.update).toHaveBeenCalledWith({ password });
      expect(result).toBe(updatedUser);
    });

    it("should return null if the user is not found", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(null);

      const result = await userDB.updatePassword(userId, password);

      expect(userDB.getUserById).toHaveBeenCalledWith(userId);
      expect(User.prototype.update).not.toHaveBeenCalled();
      expect(result).toBe(null);
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
      User.prototype.update = user.update;

      const result = await userDB.updateProfileImage(userId, profileImage);

      expect(userDB.getUserById).toHaveBeenCalledWith(userId);
      expect(user.update).toHaveBeenCalledWith({ profileImage });
      expect(result).toBe(updatedUser);
    });

    it("should return null if the user is not found", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(null);

      const result = await userDB.updateProfileImage(userId, profileImage);

      expect(userDB.getUserById).toHaveBeenCalledWith(userId);
      expect(User.prototype.update).not.toHaveBeenCalled();
      expect(result).toBe(null);
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
      User.prototype.update = user.update;

      const result = await userDB.updateCoverImage(userId, coverImage);

      expect(userDB.getUserById).toHaveBeenCalledWith(userId);
      expect(user.update).toHaveBeenCalledWith({ coverImage });
      expect(result).toBe(updatedUser);
    });

    it("should return null if the user is not found", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(null);

      const result = await userDB.updateCoverImage(userId, coverImage);

      expect(userDB.getUserById).toHaveBeenCalledWith(userId);
      expect(User.prototype.update).not.toHaveBeenCalled();
      expect(result).toBe(null);
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
      User.prototype.destroy = user.destroy;

      const result = await userDB.deleteUser(userId);

      expect(userDB.getUserById).toHaveBeenCalledWith(userId);
      expect(user.destroy).toHaveBeenCalled();
      expect(result).toBe(user);
    });

    it("should return null if the user is not found", async () => {
      userDB.getUserById = jest.fn().mockResolvedValue(null);

      const result = await userDB.deleteUser(userId);

      expect(userDB.getUserById).toHaveBeenCalledWith(userId);
      expect(User.prototype.destroy).not.toHaveBeenCalled();
      expect(result).toBe(null);
    });
  });

  describe("searchUserByName", () => {
    it("should search users by name with pagination support and return the result", async () => {
      const keyword = "John";
      const offset = 0;
      const limit = 10;
      const users = [{ id: 1, name: "John Doe", profileImage: "profile.jpg" }];
      const count = 1;

      User.findAndCountAll.mockResolvedValue({ rows: users, count });

      const result = await userDB.searchUserByName(keyword, offset, limit);

      // Assert
      expect(User.findAndCountAll).toHaveBeenCalledWith({
        where: {
          name: {
            [Op.substring]: keyword,
          },
        },
        offset,
        limit,
        attributes: ["id", "name", "profileImage"],
      });
      expect(result).toEqual({
        users,
        pageCount: Math.ceil(count / limit),
      });
    });
  });
});
