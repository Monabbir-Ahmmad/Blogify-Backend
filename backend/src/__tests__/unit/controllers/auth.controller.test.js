import { SignupReqDto } from "../../../dtos/request/signup.req.dto.js";
import { StatusCode } from "../../../utils/statusCode.js";
import { authController } from "../../../controllers/auth.controller.js";
import { authService } from "../../../services/auth.service.js";
import { cookieUtil } from "../../../utils/cookie.util.js";
import { responseUtil } from "../../../utils/response.util.js";

jest.mock("../../../services/auth.service.js");
jest.mock("../../../utils/cookie.util.js");
jest.mock("../../../utils/response.util.js");

describe("AuthController", () => {
  let req = {};
  const res = {};

  beforeEach(() => {
    responseUtil.sendContentNegotiatedResponse.mockImplementationOnce();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should create a new user and return the result", async () => {
      req = {
        body: {
          name: "John Doe",
          email: "john.doe@example.com",
          password: "password123",
        },
      };

      const expectedResult = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };

      authService.signup.mockResolvedValueOnce(expectedResult);
      cookieUtil.setAuthCookie.mockImplementationOnce();

      await authController.signup(req, res);

      expect(authService.signup).toHaveBeenCalledWith(
        new SignupReqDto(req.body)
      );
      expect(cookieUtil.setAuthCookie).toHaveBeenCalledWith(
        res,
        expectedResult.accessToken
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.CREATED,
        expectedResult
      );
    });
  });

  describe("signin", () => {
    it("should sign in the user and return the result", async () => {
      req = {
        body: {
          email: "john.doe@example.com",
          password: "password123",
        },
      };
      const expectedResult = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };

      authService.signin.mockResolvedValueOnce(expectedResult);
      cookieUtil.setAuthCookie.mockImplementationOnce();

      await authController.signin(req, res);

      expect(authService.signin).toHaveBeenCalledWith(
        req.body.email,
        req.body.password
      );
      expect(cookieUtil.setAuthCookie).toHaveBeenCalledWith(
        res,
        expectedResult.accessToken
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        expectedResult
      );
    });
  });

  describe("signout", () => {
    it("should clear the authentication cookie and send a success response", async () => {
      cookieUtil.clearAuthCookie.mockImplementationOnce();

      await authController.signout(req, res);

      expect(cookieUtil.clearAuthCookie).toHaveBeenCalledWith(res);
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK
      );
    });
  });

  describe("forgotPassword", () => {
    it("should initiate the password reset process and return the result", async () => {
      req = {
        body: {
          email: "john.doe@example.com",
        },
      };

      authService.forgotPassword.mockResolvedValueOnce(undefined);

      await authController.forgotPassword(req, res);

      expect(authService.forgotPassword).toHaveBeenCalledWith(req.body.email);
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        undefined
      );
    });
  });

  describe("resetPassword", () => {
    it("should reset the user's password and return the result", async () => {
      req = {
        params: {
          resetToken: "reset-token",
        },
        body: {
          newPassword: "new-password",
        },
      };

      authService.resetPassword.mockResolvedValueOnce(undefined);

      await authController.resetPassword(req, res);

      expect(authService.resetPassword).toHaveBeenCalledWith(
        req.params.resetToken,
        req.body.newPassword
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK,
        undefined
      );
    });
  });

  describe("refreshAccessToken", () => {
    it("should refresh the user's access token and return the result", async () => {
      req = {
        body: {
          refreshToken: "refresh-token",
        },
      };
      const expectedResult = { accessToken: "new-access-token" };

      authService.refreshAccessToken.mockResolvedValueOnce(expectedResult);
      cookieUtil.setAuthCookie.mockImplementationOnce();

      await authController.refreshAccessToken(req, res);

      expect(authService.refreshAccessToken).toHaveBeenCalledWith(
        req.body.refreshToken
      );
      expect(cookieUtil.setAuthCookie).toHaveBeenCalledWith(
        res,
        expectedResult.accessToken
      );
      expect(responseUtil.sendContentNegotiatedResponse).toHaveBeenCalledWith(
        req,
        res,
        StatusCode.OK
      );
    });
  });
});
