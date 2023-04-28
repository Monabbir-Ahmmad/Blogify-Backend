const consoleLogging = (req, res, next) => {
  const { method, url, body, params, query } = req;

  console.log("Request: ", {
    method,
    url,
    params,
    query,
    body,
  });

  next();
};

const fileLogging = (req, res, next) => {};

export const loggerMiddleWare = { consoleLogging, fileLogging };
