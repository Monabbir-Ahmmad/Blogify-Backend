import Express from "express";

/**
 * @category Middlewares
 * @classdesc A class that provides logging-related middleware.
 */
export class LoggerMiddleware {
  /**
   * Middleware function for console logging.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   * @param {Express.NextFunction} next - The next middleware function.
   */
  consoleLogging(req, res, next) {
    const { method, url, body } = req;

    console.log("Request: ", {
      method,
      url,
      body,
    });

    next();
  }
}

export const loggerMiddleware = new LoggerMiddleware();
