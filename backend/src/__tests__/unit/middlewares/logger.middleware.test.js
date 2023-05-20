import { loggerMiddleware } from "../../../middlewares/logger.middleware.js";

describe("LoggerMiddleware", () => {
  const req = {};
  const res = {};
  const next = jest.fn();

  beforeEach(() => {});

  test("consoleLogging should log request details and call next", () => {
    const consoleSpy = jest.spyOn(console, "info");

    loggerMiddleware.consoleLogging(req, res, next);

    expect(consoleSpy).toHaveBeenCalledWith("Request: ", {
      method: undefined,
      url: undefined,
      body: undefined,
    });

    expect(next).toHaveBeenCalled();
  });
});
