import { StatusCode } from "../../utils/statusCode.js";
import { User } from "../../models/user.model.js";
import { server } from "../../../server.js";
import supertest from "supertest";

const request = supertest(server);

describe("User", () => {
  let cookie;
  let userId;
  beforeAll(async () => {
    await User.sync({ force: true });

    const signupReq = {
      name: "John Doe",
      email: "john.doe@email.com",
      gender: "male",
      birthDate: "1990-01-01",
      password: "12345Aa!",
    };

    let res = await request.post("/api/auth/signup").send(signupReq);

    if (res.status !== StatusCode.CREATED) {
      res = await request.post("/api/auth/signin").send(signupReq);
    }

    cookie = res.headers["set-cookie"];
    userId = res.body.userId;
  });

  afterAll(() => {
    server.close();
  });

  describe("GET /api/user/:userId", () => {
    it("should return 200 and with user data", async () => {
      const response = await request
        .get(`/api/user/${userId}`)
        .set("Cookie", cookie);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("email");
    });
  });

  describe("PUT /api/user/:userId", () => {
    const updateReq = {
      name: "John Doe",
      email: "john.doe@email.com",
      gender: "Male",
      birthDate: "1990-01-01",
      password: "12345Aa!",
    };

    it("should return 200 and with updated user data", async () => {
      const response = await request
        .put(`/api/user/${userId}`)
        .send(updateReq)
        .set("Cookie", cookie);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id", userId);
      expect(response.body).toHaveProperty("name", updateReq.name);
    });
  });

  describe("PUT /api/user/password/:userId", () => {
    const updateReq = {
      oldPassword: "12345Aa!",
      newPassword: "12345Aa@",
    };

    it("should return 200 and with updated user data", async () => {
      const response = await request
        .put(`/api/user/password/${userId}`)
        .send(updateReq)
        .set("Cookie", cookie);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id", userId);
    });
  });

  describe("PUT /api/user/profile-image/:userId", () => {
    it("should return 200 and with updated user data with new profile image", async () => {
      const response = await request
        .put(`/api/user/profile-image/${userId}`)
        .attach("userProfileImage", "src/__tests__/testFiles/test.png")
        .set("Cookie", cookie);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id", userId);
    });
  });

  describe("PUT /api/user/cover-image/:userId", () => {
    it("should return 200 and with updated user data with new cover image", async () => {
      const response = await request
        .put(`/api/user/cover-image/${userId}`)
        .attach("userCoverImage", "src/__tests__/testFiles/test.png")
        .set("Cookie", cookie);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id", userId);
    });
  });

  describe("DELETE /api/user/:userId", () => {
    const deleteReq = {
      password: "12345Aa@",
    };
    it("should return 200 and with deleted user data", async () => {
      const response = await request
        .post(`/api/user/${userId}`)
        .send(deleteReq)
        .set("Cookie", cookie);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id", userId);
    });
  });
});
