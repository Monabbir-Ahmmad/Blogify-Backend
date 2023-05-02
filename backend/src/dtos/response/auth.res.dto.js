import { authUtil } from "../../utils/functions/auth.util.js";

export class AuthResDto {
  constructor({ id, privilege }) {
    this.refreshToken = authUtil.generateRefreshToken(id, privilege);
    this.accessToken = authUtil.generateAccessToken(id, privilege);
  }
}
