import js2xmlparser from "js2xmlparser";

/**
 * Converts a JSON object to XML.
 * @param {any} data
 * @returns {string}
 */
const convertToXml = (data) => {
  return js2xmlparser.parse("data", data);
};

/**
 * Converts a JSON object to plain text.
 * @param {any} data
 * @returns {string}
 */
const convertToText = (data) => {
  return JSON.stringify(data);
};

/**
 * Sends a response based on the Accept header of the request.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {number} statusCode
 * @param {any} data
 */
const sendContentNegotiatedResponse = (req, res, statusCode, data) => {
  let responseData = data;

  switch (req.headers.accept) {
    case "application/xml":
      responseData = convertToXml(data);
      break;
    case "text/plain":
      responseData = convertToText(data);
      break;
  }

  res.status(statusCode).send(responseData);
};

export const responseUtil = {
  sendContentNegotiatedResponse,
};
