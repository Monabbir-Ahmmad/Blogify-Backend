import { cookieUtil } from "../../../utils/cookie.util.js";

describe("CookieUtil", () => {
  const res = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("setAuthCookie", () => {
    it("should set an authentication cookie with the provided token", () => {
      const token = "example_token";

      cookieUtil.setAuthCookie(res, token);

      expect(res.cookie).toHaveBeenCalledWith("authorization", token, {
        httpOnly: true,
        sameSite: "none",
        secure: false,
      });
    });
  });

  describe("clearAuthCookie", () => {
    it("should clear the authentication cookie", () => {
      cookieUtil.clearAuthCookie(res);

      expect(res.clearCookie).toHaveBeenCalledWith("authorization");
    });
  });
});
