import { tokenService } from "../../services/token.service.js";

export class AuthResDto {
  constructor(user) {
    this.refreshToken = tokenService.generateRefreshToken(
      user.id,
      user.privilege
    );
    this.accessToken = tokenService.generateAccessToken(
      user.id,
      user.privilege
    );
  }
}
