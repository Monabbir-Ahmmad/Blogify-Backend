import { authUtil } from "../../utils/functions/auth.util.js";

export class AuthResDto {
  constructor({ id, userType }) {
    this.refreshToken = authUtil.generateRefreshToken(id, userType);
    this.accessToken = authUtil.generateAccessToken(id, userType);
  }
}
