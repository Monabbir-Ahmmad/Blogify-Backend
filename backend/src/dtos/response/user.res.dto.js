export class UserResDto {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.gender = user.gender;
    this.birthDate = user.birthDate;
    this.profileImage = user.profileImage;
    this.coverImage = user.coverImage;
  }
}
