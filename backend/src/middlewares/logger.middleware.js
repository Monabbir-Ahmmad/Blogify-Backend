/**
 * Logs the request to the console and to a file
 * @param {Express.Request} req The request object
 * @param {Express.Response} res The response object
 * @param {Express.NextFunction} next The next function
 */
const consoleLogging = (req, res, next) => {
  const { method, url, body } = req;

  console.log("Request: ", {
    method,
    url,
    body,
  });

  next();
};

const fileLogging = (req, res, next) => {};

export const loggerMiddleWare = { consoleLogging, fileLogging };
