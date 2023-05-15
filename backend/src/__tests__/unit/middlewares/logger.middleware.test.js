import { loggerMiddleware } from "../../../middlewares/logger.middleware.js";

describe("LoggerMiddleware", () => {
  const req = {};
  const res = {};
  const next = jest.fn();

  beforeEach(() => {});

  test("consoleLogging should log request details and call next", () => {
    const consoleLogSpy = jest.spyOn(console, "log");

    loggerMiddleware.consoleLogging(req, res, next);

    expect(consoleLogSpy).toHaveBeenCalledWith("Request: ", {
      method: undefined,
      url: undefined,
      body: undefined,
    });

    expect(next).toHaveBeenCalled();
  });
});
