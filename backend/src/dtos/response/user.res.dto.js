export class UserResDto {
  constructor(
    id,
    name,
    email,
    gender,
    birthDate,
    privilege,
    profileImage,
    coverImage,
    password
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.gender = gender;
    this.birthDate = birthDate;
    this.privilage = privilege;
    this.profileImage = profileImage;
    this.coverImage = coverImage;
    this._password = password;
  }
}
