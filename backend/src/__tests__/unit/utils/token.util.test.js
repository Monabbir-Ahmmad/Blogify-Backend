import { environment } from "../../../configs/environment.config.js";
import jwt from "jsonwebtoken";
import { tokenUtil } from "../../../utils/token.util.js";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mocked_token"),
  verify: jest.fn().mockReturnValue({}),
}));

describe("TokenUtil", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("generateRefreshToken", () => {
    it("should generate a refresh token", () => {
      const id = "123";
      const userType = "normal";

      const refreshToken = tokenUtil.generateRefreshToken(id, userType);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id, userType },
        environment.JWT_REFRESH_KEY,
        {
          expiresIn: environment.JWT_REFRESH_EXPIRE_TIME,
        }
      );
      expect(refreshToken).toBe("mocked_token");
    });
  });

  describe("generateAccessToken", () => {
    it("should generate an access token", () => {
      const id = "123";
      const userType = "normal";

      const accessToken = tokenUtil.generateAccessToken(id, userType);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id, userType },
        environment.JWT_ACCESS_KEY,
        {
          expiresIn: environment.JWT_ACCESS_EXPIRE_TIME,
        }
      );
      expect(accessToken).toBe("mocked_token");
    });
  });

  describe("generateResetToken", () => {
    it("should generate a reset token", () => {
      const id = "123";

      const resetToken = tokenUtil.generateResetToken(id);

      expect(jwt.sign).toHaveBeenCalledWith({ id }, environment.JWT_RESET_KEY, {
        expiresIn: environment.JWT_RESET_EXPIRE_TIME,
      });
      expect(resetToken).toBe("mocked_token");
    });
  });

  describe("verifyRefreshToken", () => {
    it("should verify a refresh token", () => {
      const refreshToken = "mocked_refresh_token";

      const decodedToken = tokenUtil.verifyRefreshToken(refreshToken);

      expect(jwt.verify).toHaveBeenCalledWith(
        refreshToken,
        environment.JWT_REFRESH_KEY
      );
      expect(decodedToken).toEqual({});
    });
  });

  describe("verifyAccessToken", () => {
    it("should verify an access token", () => {
      const accessToken = "mocked_access_token";

      const decodedToken = tokenUtil.verifyAccessToken(accessToken);

      expect(jwt.verify).toHaveBeenCalledWith(
        accessToken,
        environment.JWT_ACCESS_KEY
      );
      expect(decodedToken).toEqual({});
    });
  });

  describe("verifyResetToken", () => {
    it("should verify a reset token", () => {
      const resetToken = "mocked_reset_token";

      const decodedToken = tokenUtil.verifyResetToken(resetToken);

      expect(jwt.verify).toHaveBeenCalledWith(
        resetToken,
        environment.JWT_RESET_KEY
      );
      expect(decodedToken).toEqual({});
    });
  });
});
