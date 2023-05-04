import { authUtil } from "../../utils/functions/auth.util.js";

export class AuthResDto {
  /**
   * @param {Object} param
   * @param {number | string} param.id
   * @param {string} param.userType
   */
  constructor({ id, userType }) {
    this.refreshToken = authUtil.generateRefreshToken(id, userType);
    this.accessToken = authUtil.generateAccessToken(id, userType);
  }
}
