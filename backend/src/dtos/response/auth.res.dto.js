export class AuthResDto {
  constructor(auth) {
    this.refreshToken = auth.refreshToken;
    this.accessToken = auth.accessToken;
  }
}
