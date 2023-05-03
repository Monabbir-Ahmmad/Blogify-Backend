export class BlogUpdateReqDto {
  constructor({ title, content, coverImage = null }) {
    this.title = title;
    this.content = content;
    this.coverImage = coverImage;
  }
}
