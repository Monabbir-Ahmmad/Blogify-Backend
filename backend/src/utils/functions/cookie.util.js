/**
 * @description Set cookie with authorization token
 * @param {Response} res - Express response object
 * @param {string} token - Authorization token
 */
const setAuthCookie = (res, token) => {
  res.cookie("authorization", token, {
    httpOnly: true,
    sameSite: "none",
    secure: false,
  });
};

/**
 * @description Clear cookie with authorization token
 * @param {Response} res - Express response object
 */
const clearAuthCookie = (res) => {
  res.clearCookie("authorization");
};

export const cookieUtil = {
  setAuthCookie,
  clearAuthCookie,
};
