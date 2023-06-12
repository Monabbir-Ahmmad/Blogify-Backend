/**
 * @category DTOs
 * @subcategory Response
 * @classdesc A class that defines the structure of the user response DTO.
 * @property {string|number} id - The id of the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email of the user.
 * @property {string} gender - The gender of the user.
 * @property {Date} birthDate - The birth date of the user.
 * @property {string} userType - The user type of the user.
 * @property {string|null} [profileImage] - The profile image of the user.
 * @property {string|null} [coverImage] - The cover image of the user.
 * @property {string|null} [bio] - The bio of the user.
 * @property {Date} createdAt - The date when the user was created.
 * @property {number} blogCount - The number of blogs the user has.
 * @property {number} commentCount - The number of comments the user has.
 */
export class UserResDto {
  constructor(
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
    blogCount,
    commentCount
  ) {
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
    this.blogCount = blogCount;
    this.commentCount = commentCount;
  }
}
