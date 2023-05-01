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
