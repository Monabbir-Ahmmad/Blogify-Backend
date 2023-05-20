/**
 * @category DTOs
 * @subcategory Request
 * @classdesc A class that defines the structure of the user profile update request DTO.
 * @property {string} name - The name of the user.
 * @property {string} email - The email of the user.
 * @property {string|null} [gender] - The gender of the user.
 * @property {Date|null} [birthDate] - The birth date of the user.
 * @property {string|null} [bio] - The bio of the user.
 */
export class UserProfileUpdateReqDto {
  /**
   * @param {Object} param
   * @param {string} param.name - The name of the user.
   * @param {string} param.email - The email of the user.
   * @param {string|null} [param.gender] - The gender of the user.
   * @param {Date|null} [param.birthDate] - The birth date of the user.
   * @param {string|null} [param.bio] - The bio of the user.
   */
  constructor({ name, email, gender = null, birthDate = null, bio = null }) {
    this.name = name;
    this.email = email;
    this.gender = gender;
    this.birthDate = birthDate;
    this.bio = bio;
  }
}
