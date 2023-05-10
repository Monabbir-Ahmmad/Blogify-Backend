/**
 * @description Logs the request to the console and to a file
 * @param {Request} req The request object
 * @param {Response} res The response object
 * @param {NextFunction} next The next function
 * @returns {void}
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
