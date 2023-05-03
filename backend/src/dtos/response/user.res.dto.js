export class UserResDto {
  constructor({
    id,
    name,
    email,
    gender,
    birthDate,
    userType,
    profileImage,
    coverImage,
    bio,
    createdAt,
    password,
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.gender = gender;
    this.birthDate = birthDate;
    this.userType = userType;
    this.profileImage = profileImage;
    this.coverImage = coverImage;
    this.bio = bio;
    this.createdAt = createdAt;
    this.password = password;

    // Hide password from response
    Object.defineProperty(this, "password", {
      enumerable: false,
    });
  }
}
