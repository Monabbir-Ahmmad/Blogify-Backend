export class BlogResDto {
  constructor(
    id,
    title,
    content,
    coverImage,
    createdAt,
    updatedAt,
    user,
    likes,
    commentCount
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.coverImage = coverImage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.user = user;
    this.likes = likes;
    this.commentCount = commentCount;
  }
}
