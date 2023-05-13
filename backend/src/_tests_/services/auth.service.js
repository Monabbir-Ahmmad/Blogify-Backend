import { AuthResDto } from "../../dtos/response/auth.res.dto.js";
import { AuthService } from "../../services/auth.service.js";
import { HttpError } from "../../utils/HttpError.js";
import { SignupReqDto } from "../../dtos/request/signup.req.dto.js";
import { StatusCode } from "../../utils/StatusCode.js";
import { mailUtil } from "../../utils/mail.util.js";
import { passwordUtil } from "../../utils/password.util.js";
import { tokenUtil } from "../../utils/token.util.js";
import { userDB } from "../../repositories/database/sequelize/user.db";
import { userService } from "../../services/user.service.js";

// Mock dependencies
jest.mock("../../repositories/database/sequelize/user.db.js");
jest.mock("../../utils/password.util.js");
jest.mock("../../utils/token.util.js");
jest.mock("../../utils/mail.util.js");
jest.mock("../../services/user.service.js");

describe("AuthService", () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("signup", () => {
    it("should create a new user and return AuthResDto", async () => {
      const signupReqDto = {
        email: "test@example.com",
        password: "password",
      };
      const user = {
        id: 123,
        userType: "user",
      };

      userDB.getUserByEmail.mockResolvedValue(null);
      userDB.createUser.mockResolvedValue(user);
      passwordUtil.hashPassword.mockResolvedValue("hashedPassword");

      const result = await authService.signup(signupReqDto);

      expect(result).toEqual(new AuthResDto(user.id, user.userType));
    });

    it("should throw HttpError with 409 status code if email already exists", async () => {
      const signupReqDto = {
        email: "test@example.com",
        password: "password",
      };

      userDB.getUserByEmail.mockResolvedValue(true);

      await expect(authService.signup(signupReqDto)).rejects.toThrow(
        new HttpError(StatusCode.CONFLICT, "Email already exists.")
      );
    });
  });

  describe("signin", () => {
    it("should sign in a user and return AuthResDto", async () => {
      const email = "test@example.com";
      const password = "password";
      const user = {
        id: 123,
        userType: "user",
        password: "hashedPassword",
      };
      const expectedAuthResDto = new AuthResDto(user.id, user.userType);

      userDB.getUserByEmail.mockResolvedValue(user);
      passwordUtil.verifyPassword.mockResolvedValue(true);

      const result = await authService.signin(email, password);

      expect(userDB.getUserByEmail).toHaveBeenCalledWith(email);
      expect(passwordUtil.verifyPassword).toHaveBeenCalledWith(
        password,
        user.password
      );
      expect(result).toEqual(expectedAuthResDto);
    });

    it("should throw HttpError with 401 status code if email address is wrong", async () => {
      const email = "test@example.com";
      const password = "password";

      userDB.getUserByEmail.mockResolvedValue(null);

      await expect(authService.signin(email, password)).rejects.toThrow(
        new HttpError(StatusCode.UNAUTHORIZED, "Wrong email address.")
      );

      expect(userDB.getUserByEmail).toHaveBeenCalledWith(email);
      expect(passwordUtil.verifyPassword).not.toHaveBeenCalled();
    });

    it("should throw HttpError with 401 status code if password is wrong", async () => {
      const email = "test@example.com";
      const password = "password";
      const user = {
        id: 123,
        userType: "user",
        password: "hashedPassword",
      };

      userDB.getUserByEmail.mockResolvedValue(user);
      passwordUtil.verifyPassword.mockResolvedValue(false);

      await expect(authService.signin(email, password)).rejects.toThrow(
        new HttpError(StatusCode.UNAUTHORIZED, "Wrong password.")
      );

      expect(userDB.getUserByEmail).toHaveBeenCalledWith(email);
      expect(passwordUtil.verifyPassword).toHaveBeenCalledWith(
        password,
        user.password
      );
    });
  });

  describe("forgotPassword", () => {
    it("should send a password reset email to the user", async () => {
      const email = "test@example.com";
      const user = {
        id: 123,
        email: "test@example.com",
        name: "John Doe",
      };

      userDB.getUserByEmail.mockResolvedValue(user);
      tokenUtil.generateResetToken.mockReturnValue("resetToken");
      mailUtil.getResetPasswordMailTemplate.mockResolvedValue(
        "<html>Reset password</html>"
      );

      await authService.forgotPassword(email);

      expect(userDB.getUserByEmail).toHaveBeenCalledWith(email);
      expect(tokenUtil.generateResetToken).toHaveBeenCalledWith(user.id);
      expect(mailUtil.sendEmail).toHaveBeenCalledWith({
        to: user.email,
        subject: "Password Reset Request",
        html: "<html>Reset password</html>",
      });
    });

    it("should throw HttpError with 404 status code if user with email not found", async () => {
      const email = "test@example.com";

      userDB.getUserByEmail.mockResolvedValue(null);

      await expect(authService.forgotPassword(email)).rejects.toThrow(
        new HttpError(StatusCode.NOT_FOUND, "User with such email not found.")
      );

      expect(userDB.getUserByEmail).toHaveBeenCalledWith(email);
      expect(tokenUtil.generateResetToken).not.toHaveBeenCalled();
      expect(mailUtil.sendEmail).not.toHaveBeenCalled();
    });
  });

  describe("resetPassword", () => {
    it("should reset the password of a user", async () => {
      const resetToken = "resetToken";
      const newPassword = "newPassword";
      const decodedToken = {
        id: 123,
      };
      const user = {
        id: decodedToken.id,
      };

      tokenUtil.verifyResetToken.mockReturnValue(decodedToken);
      userService.getUser.mockResolvedValue(user);
      passwordUtil.hashPassword.mockResolvedValue("hashedPassword");
      userDB.updatePassword.mockResolvedValue();

      await authService.resetPassword(resetToken, newPassword);

      expect(tokenUtil.verifyResetToken).toHaveBeenCalledWith(resetToken);
      expect(userService.getUser).toHaveBeenCalledWith(decodedToken.id);
      expect(passwordUtil.hashPassword).toHaveBeenCalledWith(newPassword);
      expect(userDB.updatePassword).toHaveBeenCalledWith(
        user.id,
        "hashedPassword"
      );
    });
  });

  describe("refreshAccessToken", () => {
    it("should refresh the access token of a user", async () => {
      const refreshToken = "refreshToken";
      const decodedToken = {
        id: 123,
        userType: "user",
      };
      const expectedAccessToken = "accessToken";

      tokenUtil.verifyRefreshToken.mockReturnValue(decodedToken);
      tokenUtil.generateAccessToken.mockReturnValue(expectedAccessToken);

      const result = await authService.refreshAccessToken(refreshToken);

      expect(tokenUtil.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(tokenUtil.generateAccessToken).toHaveBeenCalledWith(
        decodedToken.id,
        decodedToken.userType
      );
      expect(result).toEqual({ accessToken: expectedAccessToken });
    });

    it("should throw HttpError with 401 status code if token verification fails", async () => {
      const refreshToken = "refreshToken";

      tokenUtil.verifyRefreshToken.mockImplementation(() => {
        throw new Error("Verification failed");
      });

      await expect(
        authService.refreshAccessToken(refreshToken)
      ).rejects.toThrow(
        new HttpError(StatusCode.UNAUTHORIZED, "Token failed.")
      );

      expect(tokenUtil.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(tokenUtil.generateAccessToken).not.toHaveBeenCalled();
    });
  });
});
