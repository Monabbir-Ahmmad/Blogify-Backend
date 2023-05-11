/** @module DTO/Request */

/**
 * A class that defines the structure of the signup request DTO.
 * @property {string} name - The name of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 * @property {string} gender - The gender of the user.
 * @property {Date} birthDate - The birth date of the user.
 */
export class SignupReqDto {
  /**
   * @param {Object} param
   * @param {string} param.name - The name of the user.
   * @param {string} param.email - The email of the user.
   * @param {string} param.password - The password of the user.
   * @param {string} param.gender - The gender of the user.
   * @param {Date} param.birthDate - The birth date of the user.
   */
  constructor({ name, email, password, gender, birthDate }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.gender = gender;
    this.birthDate = birthDate;
  }
}
