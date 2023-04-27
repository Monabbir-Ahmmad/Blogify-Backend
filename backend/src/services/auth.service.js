import { tokenService } from "./token.service.js";

const refreshAccessToken = async (refreshToken) => {
  try {
    const decodedToken = tokenService.verifyRefreshToken(refreshToken);

    const accessToken = tokenService.generateAccessToken(
      decodedToken.id,
      decodedToken.privilege
    );

    return { accessToken };
  } catch (error) {
    console.log(error);
    throw new HttpError(StatusCode.UNAUTHORIZED, "Token failed.");
  }
};

export const authService = { refreshAccessToken };
