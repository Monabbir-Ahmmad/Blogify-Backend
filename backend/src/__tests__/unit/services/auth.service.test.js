import { AuthResDto } from "../../../dtos/response/auth.res.dto.js";
import { HttpError } from "../../../utils/httpError.js";
import { SignupReqDto } from "../../../dtos/request/signup.req.dto.js";
import { StatusCode } from "../../../utils/statusCode.js";
import { authService } from "../../../services/auth.service.js";
import { mailUtil } from "../../../utils/mail.util.js";
import { passwordUtil } from "../../../utils/password.util.js";
import { tokenUtil } from "../../../utils/token.util.js";
import { userDB } from "../../../repositories/database/sequelize/user.db.js";
import { userService } from "../../../services/user.service.js";

jest.mock("../../../repositories/database/sequelize/user.db.js");
jest.mock("../../../utils/password.util.js");
jest.mock("../../../utils/token.util.js");
jest.mock("../../../utils/mail.util.js");
jest.mock("../../../services/user.service.js");

describe("AuthService", () => {
  const user = {
    id: 123,
    email: "test@example.com",
    name: "John Doe",
    userType: "user",
    password: "hashedPassword",
  };
  const expectedAuthResDto = new AuthResDto(user.id, user.userType);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    const signupReqDto = new SignupReqDto({
      email: "test@example.com",
      name: "John Doe",
      gender: "Male",
      birthDate: new Date().toISOString(),
      password: "hashedPassword",
    });

    beforeEach(() => {
      userDB.getUserByEmail.mockResolvedValue(null);
      passwordUtil.hashPassword.mockResolvedValue("hashedPassword");
    });

    it("should create a new user and return AuthResDto", async () => {
      userDB.createUser.mockResolvedValue(user);

      const result = await authService.signup(signupReqDto);

      expect(result).toEqual(expectedAuthResDto);
    });

    it("should throw HttpError with 409 status code if email already exists", async () => {
      userDB.getUserByEmail.mockResolvedValue(true);

      await expect(authService.signup(signupReqDto)).rejects.toThrow(HttpError);
    });
  });

  describe("signin", () => {
    const email = "test@example.com";
    const password = "password";

    beforeEach(() => {
      userDB.getUserByEmail.mockResolvedValue(user);
      passwordUtil.verifyPassword.mockResolvedValue(true);
    });

    it("should sign in a user and return AuthResDto", async () => {
      const result = await authService.signin(email, password);

      expect(result).toEqual(expectedAuthResDto);
    });

    it("should throw HttpError with 401 status code if email address is wrong", async () => {
      userDB.getUserByEmail.mockResolvedValue(null);

      await expect(authService.signin(email, password)).rejects.toThrow(
        new HttpError(StatusCode.UNAUTHORIZED, "Wrong email address.")
      );
    });

    it("should throw HttpError with 401 status code if password is wrong", async () => {
      passwordUtil.verifyPassword.mockResolvedValue(false);

      await expect(authService.signin(email, password)).rejects.toThrow(
        new HttpError(StatusCode.UNAUTHORIZED, "Wrong password.")
      );
    });
  });

  describe("forgotPassword", () => {
    const email = "test@example.com";

    beforeEach(() => {
      userDB.getUserByEmail.mockResolvedValue(user);
    });

    it("should send a password reset email to the user", async () => {
      mailUtil.getResetPasswordMailTemplate.mockResolvedValue(
        "<html>Reset password</html>"
      );

      await authService.forgotPassword(email);
    });

    it("should throw HttpError with 404 status code if user with email not found", async () => {
      userDB.getUserByEmail.mockResolvedValue(null);

      await expect(authService.forgotPassword(email)).rejects.toThrow(
        new HttpError(StatusCode.NOT_FOUND, "User with such email not found.")
      );
    });
  });

  describe("resetPassword", () => {
    const resetToken = "resetToken";
    const newPassword = "newPassword";

    beforeEach(() => {
      tokenUtil.verifyResetToken.mockReturnValue({ id: user.id });
      userService.getUser.mockResolvedValue(user);
      passwordUtil.hashPassword.mockResolvedValue("hashedPassword");
    });

    it("should reset the password of a user", async () => {
      await authService.resetPassword(resetToken, newPassword);

      expect(tokenUtil.verifyResetToken).toHaveBeenCalledWith(resetToken);
      expect(userService.getUser).toHaveBeenCalledWith(user.id);
      expect(passwordUtil.hashPassword).toHaveBeenCalledWith(newPassword);
      expect(userDB.updatePassword).toHaveBeenCalledWith(
        user.id,
        "hashedPassword"
      );
    });
  });

  describe("refreshAccessToken", () => {
    const refreshToken = "refreshToken";
    const decodedToken = {
      id: user.id,
      userType: user.userType,
    };
    const expectedAccessToken = "accessToken";

    beforeEach(() => {
      tokenUtil.verifyRefreshToken.mockReturnValue(decodedToken);
      tokenUtil.generateAccessToken.mockReturnValue(expectedAccessToken);
      userService.getUser.mockResolvedValue(user);
    });

    it("should refresh the access token of a user", async () => {
      const result = await authService.refreshAccessToken(refreshToken);

      expect(result).toEqual({ accessToken: expectedAccessToken });
    });

    it("should throw HttpError with 401 status code if token verification fails", async () => {
      tokenUtil.verifyRefreshToken.mockImplementation(() => {
        throw new Error("Verification failed");
      });

      await expect(
        authService.refreshAccessToken(refreshToken)
      ).rejects.toThrow(HttpError);
    });
  });
});
