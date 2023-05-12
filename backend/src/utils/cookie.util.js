/** @module Utility */

/**
 * A class that provides utility functions for handling cookies.
 */
export class CookieUtil {
  /**
   * Sets an authentication cookie.
   * @param {Express.Response} res - The response object.
   * @param {string} token - The token to set as the cookie value.
   */
  setAuthCookie(res, token) {
    res.cookie("authorization", token, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
    });
  }

  /**
   * Clears the authentication cookie.
   * @param {Express.Response} res - The response object.
   */
  clearAuthCookie(res) {
    res.clearCookie("authorization");
  }
}

export const cookieUtil = new CookieUtil();