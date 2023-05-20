import { StatusCode } from "../../utils/statusCode.js";
import { server } from "../../../server.js";
import supertest from "supertest";

const request = supertest(server);

describe("Blog", () => {
  let cookie;
  let userId;
  let blogId;
  beforeAll(async () => {
    const signupReq = {
      name: "John Doe",
      email: "john.doe@email.com",
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

  describe("POST /api/blog", () => {
    const createBlogReq = {
      title: "Blog title",
      content: "Blog content",
      coverImage: "src/__tests__/testFiles/test.png",
    };

    it("should return 201 and with blog data", async () => {
      const response = await request
        .post("/api/blog")
        .set("Cookie", cookie)
        .field("title", createBlogReq.title)
        .field("content", createBlogReq.content)
        .attach("coverImage", createBlogReq.coverImage);

      expect(response.status).toBe(StatusCode.CREATED);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("content");

      blogId = response.body.id;
    });
  });

  describe("GET /api/blog/:blogId", () => {
    it("should return 200 and with blog data", async () => {
      const response = await request.get(`/api/blog/${blogId}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("content");
    });
  });

  describe("PUT /api/blog/:blogId", () => {
    const updateBlogReq = {
      title: "Blog title updated",
      content: "Blog content updated",
      coverImage: "http://localhost:5000/uploads/test.png",
    };
    it("should return 200 and with blog data", async () => {
      const response = await request
        .put(`/api/blog/${blogId}`)
        .set("Cookie", cookie)
        .field("title", updateBlogReq.title)
        .field("content", updateBlogReq.content)
        .field("coverImage", updateBlogReq.coverImage);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("content");
      expect(response.body).toHaveProperty("coverImage");
    });
  });

  describe("GET /api/blog", () => {
    const limit = 10;
    const page = 1;
    it("should return 200 and with paginated blog list", async () => {
      const response = await request.get(
        `/api/blog?limit=${limit}&page=${page}`
      );

      expect(response.status).toBe(StatusCode.OK);

      expect(response.body).toHaveProperty("pageCount");
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("GET /api/blog/user/:userId", () => {
    const limit = 10;
    const page = 1;
    it("should return 200 and with a user's paginated blog list", async () => {
      const response = await request.get(
        `/api/blog/user/${userId}?limit=${limit}&page=${page}`
      );

      expect(response.status).toBe(StatusCode.OK);

      expect(response.body).toHaveProperty("pageCount");
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("PUT /api/blog/like/:blogId", () => {
    it("should return 200 and with liked blog data", async () => {
      const response = await request
        .put(`/api/blog/like/${blogId}`)
        .set("Cookie", cookie);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("content");
      expect(response.body).toHaveProperty("coverImage");
    });
  });

  describe("DELETE /api/blog/:blogId", () => {
    it("should return 200 and with deleted blog data", async () => {
      const response = await request
        .delete(`/api/blog/${blogId}`)
        .set("Cookie", cookie);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("content");
      expect(response.body).toHaveProperty("coverImage");
    });
  });
});
