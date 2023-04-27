import { AuthResDto } from "../dtos/response/auth.res.dto.js";
import { tokenService } from "./token.service.js";

const signup = async (signupReqDto) => {
  return new AuthResDto(2, "user");
};

const signin = async (signinReqDto) => {
  return new AuthResDto(2, "user");
};

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

export const authService = { signup, signin, refreshAccessToken };
