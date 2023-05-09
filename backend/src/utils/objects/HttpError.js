/**
 * @class HttpError
 * @classdesc An error class for HTTP errors
 * @extends Error
 */
export default class HttpError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
