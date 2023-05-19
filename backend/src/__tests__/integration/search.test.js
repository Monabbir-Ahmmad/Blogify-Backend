import { StatusCode } from "../../utils/statusCode.js";
import { server } from "../../../server.js";
import supertest from "supertest";

const request = supertest(server);

describe("Search", () => {
  afterAll(() => {
    server.close();
  });

  describe("GET /api/search/user/:keyword", () => {
    it("should return 200 and with searched paginated user data", async () => {
      const response = await request.get("/api/search/user/john");

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("pageCount");
    });
  });

  describe("GET /api/search/blog/:keyword", () => {
    it("should return 200 and with searched paginated blog data", async () => {
      const response = await request.get("/api/search/blog/blog");

      expect(response.status).toBe(StatusCode.OK);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("pageCount");
    });
  });
});
