import { tokenService } from "../../services/token.service.js";

export class AuthResDto {
  constructor(id, privilege) {
    this.refreshToken = tokenService.generateRefreshToken(id, privilege);
    this.accessToken = tokenService.generateAccessToken(id, privilege);
  }
}
