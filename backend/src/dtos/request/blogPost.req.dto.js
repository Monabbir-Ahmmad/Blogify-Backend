export class BlogPostReqDto {
  constructor({ title, content, coverImage = null }) {
    this.title = title;
    this.content = content;
    this.coverImage = coverImage;
  }
}
