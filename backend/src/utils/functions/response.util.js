import js2xmlparser from "js2xmlparser";

/**
 * ResponseUtil is a class that provides utility functions for handling HTTP responses.
 */
export class ResponseUtil {
  /**
   * Converts data to XML format using js2xmlparser.
   * @param {object} data - The data to be converted.
   * @returns {string} The XML representation of the data.
   */
  convertToXml(data) {
    return js2xmlparser.parse("data", data);
  }

  /**
   * Converts data to JSON text format.
   * @param {object} data - The data to be converted.
   * @returns {string} The JSON text representation of the data.
   */
  convertToText(data) {
    return JSON.stringify(data);
  }

  /**
   * Sends a content-negotiated response based on the client's accept header.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @param {number} statusCode - The status code to send with the response.
   * @param {object} data - The data to be sent in the response.
   */
  sendContentNegotiatedResponse(req, res, statusCode, data) {
    let responseData = data;

    switch (req.headers.accept) {
      case "application/xml":
        responseData = this.convertToXml(data);
        break;
      case "text/plain":
        responseData = this.convertToText(data);
        break;
    }

    res.status(statusCode).send(responseData);
  }
}

export const responseUtil = new ResponseUtil();
