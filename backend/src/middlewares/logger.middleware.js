const consoleLogging = (req, res, next) => {
  console.log("Request: ", {
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  next();
};

const fileLogging = (req, res, next) => {};

export const loggerMiddleWare = { consoleLogging, fileLogging };
