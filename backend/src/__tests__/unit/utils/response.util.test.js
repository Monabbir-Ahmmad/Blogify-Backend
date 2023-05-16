import js2xmlparser from "js2xmlparser";
import { responseUtil } from "../../../utils/response.util.js";

jest.mock("js2xmlparser", () => ({
  parse: jest.fn().mockReturnValue("<data></data>"),
}));

describe("ResponseUtil", () => {
  let req;
  let res;
  const data = { name: "John Doe", age: 25 };

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("convertToXml", () => {
    it("should convert data to XML format using js2xmlparser", () => {
      const xmlData = responseUtil.convertToXml(data);

      expect(js2xmlparser.parse).toHaveBeenCalledWith("data", data);
      expect(xmlData).toBe("<data></data>");
    });
  });

  describe("convertToText", () => {
    it("should convert data to JSON text format", () => {
      const jsonData = responseUtil.convertToText(data);

      expect(jsonData).toBe(JSON.stringify(data));
    });
  });

  describe("sendContentNegotiatedResponse", () => {
    it("should send an XML response if the client accepts application/xml", () => {
      req.headers.accept = "application/xml";

      responseUtil.sendContentNegotiatedResponse(req, res, 200, data);

      expect(js2xmlparser.parse).toHaveBeenCalledWith("data", data);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("<data></data>");
    });

    it("should send a plain text response if the client accepts text/plain", () => {
      req.headers.accept = "text/plain";

      responseUtil.sendContentNegotiatedResponse(req, res, 200, data);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(JSON.stringify(data));
    });

    it("should send a JSON response by default if the client does not specify the accept header", () => {
      responseUtil.sendContentNegotiatedResponse(req, res, 200, data);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(data);
    });
  });
});
