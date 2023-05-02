export class BlogUpdateReqDto {
  constructor({ title, content, coverImage }) {
    this.title = title;
    this.content = content;
    this.coverImage = coverImage;
  }
}
