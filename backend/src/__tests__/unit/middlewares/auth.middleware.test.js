import { HttpError } from "../../../utils/httpError.js";
import { StatusCode } from "../../../utils/statusCode.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { tokenUtil } from "../../../utils/token.util.js";

describe("AuthMiddleware", () => {
  const req = { cookies: {} };
  const res = {};
  const next = jest.fn();

  describe("checkLoggedin", () => {
    it("should call next if user is not logged in", async () => {
      await authMiddleware.checkLoggedin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
    });

    it("should throw HttpError if user is already logged in", async () => {
      req.cookies = { authorization: "token" };

      await authMiddleware.checkLoggedin(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new HttpError(
          StatusCode.FORBIDDEN,
          "Already logged in. Please log out first."
        )
      );
    });
  });

  describe("verifyToken", () => {
    it("should set the authenticated user in the request object and call next if token is valid", async () => {
      const token = "valid_token";
      const decodedToken = { id: 1 };
      req.cookies = { authorization: token };

      tokenUtil.verifyAccessToken = jest.fn().mockReturnValue(decodedToken);

      await authMiddleware.verifyToken(req, res, next);

      expect(tokenUtil.verifyAccessToken).toHaveBeenCalledWith(token);
      expect(req.user).toEqual({ id: decodedToken.id });
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith();
    });

    it("should throw HttpError with UNAUTHORIZED status code if no token is found", async () => {
      req.cookies = {};

      await authMiddleware.verifyToken(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new HttpError(
          StatusCode.UNAUTHORIZED,
          "Not authorized. No token found."
        )
      );
    });

    it("should throw HttpError with UNAUTHORIZED status code if token is invalid", async () => {
      const token = "invalid_token";
      req.cookies = { authorization: token };

      tokenUtil.verifyAccessToken = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      await authMiddleware.verifyToken(req, res, next);

      expect(next).toHaveBeenCalledWith(
        new HttpError(StatusCode.UNAUTHORIZED, "Not authorized. Token failed.")
      );
    });
  });
});
