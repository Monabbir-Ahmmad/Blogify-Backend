export class SignupReqDto {
  constructor(name, email, gender, birthDate, password) {
    this.name = name;
    this.email = email;
    this.gender = gender;
    this.birthDate = birthDate;
    this.password = password;
  }
}
