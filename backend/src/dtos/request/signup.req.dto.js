/**
 * @category DTOs
 * @subcategory Request
 * @classdesc A class that defines the structure of the signup request DTO.
 * @property {string} name - The name of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 */
export class SignupReqDto {
  /**
   * @param {Object} param
   * @param {string} param.name - The name of the user.
   * @param {string} param.email - The email of the user.
   * @param {string} param.password - The password of the user.
   */
  constructor({ name, email, password }) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
