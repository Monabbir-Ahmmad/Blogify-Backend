/**
 * @category Utilities
 * @classdesc A class that provides the functionality to map objects.
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
      sameSite: "strict",
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
