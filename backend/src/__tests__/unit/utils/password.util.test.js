import bcryptjs from "bcryptjs";
import { passwordUtil } from "../../../utils/password.util.js";

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock("../../../configs/environment.config.js", () => ({
  environment: {
    SALT_ROUNDS: 10,
  },
}));

describe("PasswordUtil", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("hashPassword", () => {
    it("should hash the password using bcryptjs", async () => {
      const password = "password";

      const hashedPassword = await passwordUtil.hashPassword(password);

      expect(bcryptjs.hash).toHaveBeenCalledWith(password, 10);
      expect(hashedPassword).toBe("hashedPassword");
    });
  });

  describe("verifyPassword", () => {
    it("should verify the password against the hashed password using bcryptjs", async () => {
      const inputPassword = "password";
      const hashedPassword = "hashedPassword";

      const isPasswordVerified = await passwordUtil.verifyPassword(
        inputPassword,
        hashedPassword
      );

      expect(bcryptjs.compare).toHaveBeenCalledWith(
        inputPassword,
        hashedPassword
      );
      expect(isPasswordVerified).toBe(true);
    });
  });
});
