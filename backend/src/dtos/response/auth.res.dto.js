import { tokenUtil } from "../../utils/functions/token.util.js";

export class AuthResDto {
  constructor(id, userType) {
    this.refreshToken = tokenUtil.generateRefreshToken(id, userType);
    this.accessToken = tokenUtil.generateAccessToken(id, userType);
  }
}
