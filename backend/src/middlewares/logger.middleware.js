import Express from "express";

/**
 * LoggerMiddleware is a class that provides middleware functions for logging.
 */
class LoggerMiddleware {
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

  /**
   * Middleware function for logging into a file.
   * @param {Express.Request} req - The HTTP request object.
   * @param {Express.Response} res - The HTTP response object.
   * @param {Express.NextFunction} next - The next middleware function.
   */
  fileLogging(req, res, next) {
    // Implement file logging logic here
    // This function is currently empty
    next();
  }
}

export const loggerMiddleware = new LoggerMiddleware();
