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
    bio,
    joinDate,
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
    this.bio = bio;
    this.joinDate = joinDate;
    this._password = password;
  }
}
