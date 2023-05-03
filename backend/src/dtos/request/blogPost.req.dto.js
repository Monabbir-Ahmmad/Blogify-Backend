export class BlogPostReqDto {
  constructor({ title, content, coverImage }) {
    this.title = title;
    this.content = content;
    this.coverImage = coverImage;
  }
}
