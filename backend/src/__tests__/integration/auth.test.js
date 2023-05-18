import { StatusCode } from "../../utils/statusCode.js";
import { User } from "../../models/user.model.js";
import { database } from "../../configs/database.config.js";
import { server } from "../../../server.js";
import supertest from "supertest";

const request = supertest(server);

describe("Auth", () => {
  beforeAll(async () => {
    await User.sync({ force: true });
  });

  afterAll(async () => {
    server.close();
    await database.close();
  });

  describe("POST /api/auth/signup", () => {
    const url = "/api/auth/signup";
    const signupReq = {
      name: "John Doe",
      email: "john.doe@email.com",
      gender: "male",
      birthDate: "1990-01-01",
      password: "12345Aa!",
    };

    it("should return 201 and with tokens", async () => {
      const response = await request.post(url).send(signupReq);

      const token = response.headers["set-cookie"][0]
        .split(";")[0]
        .split("=")[1];

      expect(response.status).toBe(StatusCode.CREATED);
      expect(token).toBeTruthy();
      expect(response.body).toHaveProperty("userId");
      expect(response.body).toHaveProperty("refreshToken");
      expect(response.body).toHaveProperty("accessToken");
    });
  });

  describe("POST /api/auth/signin", () => {
    const url = "/api/auth/signin";
    const signinReq = {
      email: "john.doe@email.com",
      password: "12345Aa!",
    };

    it("should return 200 and with tokens", async () => {
      const response = await request.post(url).send(signinReq);

      const token = response.headers["set-cookie"][0]
        .split(";")[0]
        .split("=")[1];

      expect(response.status).toBe(StatusCode.OK);
      expect(token).toBeTruthy();
      expect(response.body).toHaveProperty("userId");
      expect(response.body).toHaveProperty("refreshToken");
      expect(response.body).toHaveProperty("accessToken");
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    const url = "/api/auth/forgot-password";
    const forgotPasswordReq = {
      email: "john.doe@email.com",
    };

    it("should return 200 and with a password reset token", async () => {
      const response = await request.post(url).send(forgotPasswordReq);

      expect(response.status).toBe(StatusCode.OK);
    });
  });

  describe("POST /api/auth/refresh-token", () => {
    const signinUrl = "/api/auth/signin";
    const url = "/api/auth/refresh-token";
    const signinReq = {
      email: "john.doe@email.com",
      password: "12345Aa!",
    };

    it("should return 200 and with an access token", async () => {
      const signinRes = await request.post(signinUrl).send(signinReq);

      const refreshToken = signinRes.body.refreshToken;

      const response = await request.post(url).send({ refreshToken });
      const token = response.headers["set-cookie"][0]
        .split(";")[0]
        .split("=")[1];

      expect(response.status).toBe(StatusCode.OK);
      expect(token).toBeTruthy();
      expect(response.body).toHaveProperty("accessToken");
    });
  });

  describe("POST /api/auth/signout", () => {
    const url = "/api/auth/signout";

    it("should return 200", async () => {
      const response = await request.post(url);

      const token = response.headers["set-cookie"][0]
        .split(";")[0]
        .split("=")[1];

      expect(token).toBeFalsy();
      expect(response.status).toBe(StatusCode.OK);
    });
  });
});
