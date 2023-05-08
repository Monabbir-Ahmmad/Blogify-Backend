export class SignupReqDto {
  constructor({ name, email, password, gender, birthDate }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.gender = gender;
    this.birthDate = birthDate;
  }
}
