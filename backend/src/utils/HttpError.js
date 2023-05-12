/** @module Utility */

/**
 * An error class for HTTP errors
 * @extends Error
 */
export class HttpError extends Error {
  /**
   * @param {number} statusCode - The status code of the error.
   * @param {string} message - The error message.
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
