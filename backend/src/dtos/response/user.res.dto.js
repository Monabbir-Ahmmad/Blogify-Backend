export class UserResDto {
  /**
   * @param {Object} param
   * @param {number | string} param.id
   * @param {string} param.name
   * @param {string} param.email
   * @param {string} param.gender
   * @param {Date} param.birthDate
   * @param {string} param.userType
   * @param {string} [param.profileImage]
   * @param {string} [param.coverImage]
   * @param {string} [param.bio]
   * @param {Date} param.createdAt
   * @param {string} param.password
   */
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
