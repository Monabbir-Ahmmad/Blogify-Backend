export class UserProfileUpdateReqDto {
  constructor({ name, email, gender, birthDate, bio }) {
    this.name = name;
    this.email = email;
    this.gender = gender;
    this.birthDate = birthDate;
    this.bio = bio;
  }
}
