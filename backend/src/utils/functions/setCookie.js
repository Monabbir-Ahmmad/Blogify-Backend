export const setAuthCookie = (res, token) => {
  res.cookie("authorization", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
};
