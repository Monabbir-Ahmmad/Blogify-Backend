import { StatusCode } from "../../utils/statusCode.js";
import { server } from "../../../server.js";
import supertest from "supertest";

const request = supertest(server);

describe("Comment", () => {
  let cookie;
  let blogId;
  let commentId;

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

    const blogReq = {
      title: "Blog title",
      content: "Blog content",
    };

    res = await request
      .post("/api/blog")
      .set("Cookie", cookie)
      .field("title", blogReq.title)
      .field("content", blogReq.content);

    blogId = res.body.id;
  });

  afterAll(() => {
    server.close();
  });

  describe("POST /api/comment", () => {
    it("should return 201 and with comment data", async () => {
      const createCommentReq = {
        blogId,
        text: "Comment text",
      };
      const response = await request
        .post("/api/comment")
        .set("Cookie", cookie)
        .send(createCommentReq);

      expect(response.status).toBe(StatusCode.CREATED);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("text");
      expect(response.body).toHaveProperty("blogId");

      commentId = response.body.id;
    });
  });

  describe("GET /api/comment/:commentId", () => {
    it("should return 200 and with blog data", async () => {
      const response = await request.get(`/api/comment/${commentId}`);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("text");
      expect(response.body).toHaveProperty("blogId");
    });
  });

  describe("PUT /api/comment/:commentId", () => {
    const updateCommentReq = {
      text: "Updated comment text",
    };
    it("should return 200 and with comment data", async () => {
      const response = await request
        .put(`/api/comment/${commentId}`)
        .set("Cookie", cookie)
        .send(updateCommentReq);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("text");
      expect(response.body).toHaveProperty("blogId");
    });
  });

  describe("GET /api/comment/blog/:blogId", () => {
    const limit = 10;
    const page = 1;
    it("should return 200 and with paginated comment list", async () => {
      const response = await request.get(
        `/api/comment/blog/${blogId}?limit=${limit}&page=${page}`
      );

      expect(response.status).toBe(StatusCode.OK);

      expect(response.body).toHaveProperty("data");
     expect(response.body).toHaveProperty("totalItems");
     expect(response.body).toHaveProperty("pageSize");
     expect(response.body).toHaveProperty("totalPages");
    });
  });

  describe("GET /api/comment/reply/:commentId", () => {
    const limit = 10;
    const page = 1;
    it("should return 200 and with paginated comment reply list", async () => {
      const response = await request.get(
        `/api/comment/reply/${commentId}?limit=${limit}&page=${page}`
      );

      expect(response.status).toBe(StatusCode.OK);

      expect(response.body).toHaveProperty("data");
     expect(response.body).toHaveProperty("totalItems");
     expect(response.body).toHaveProperty("pageSize");
     expect(response.body).toHaveProperty("totalPages");
    });
  });

  describe("PUT /api/comment/like/:commentId", () => {
    it("should return 200 and with liked comment data", async () => {
      const response = await request
        .put(`/api/comment/like/${commentId}`)
        .set("Cookie", cookie);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("text");
      expect(response.body).toHaveProperty("blogId");
    });
  });

  describe("DELETE /api/comment/:commentId", () => {
    it("should return 200 and with deleted comment data", async () => {
      const response = await request
        .delete(`/api/comment/${commentId}`)
        .set("Cookie", cookie);

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("text");
      expect(response.body).toHaveProperty("blogId");
    });
  });
});
