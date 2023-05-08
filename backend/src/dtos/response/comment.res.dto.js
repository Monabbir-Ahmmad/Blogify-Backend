export class CommentResDto {
  constructor(
    id,
    text,
    parentId,
    blogId,
    user,
    createdAt,
    updatedAt,
    likes,
    replyCount
  ) {
    this.id = id;
    this.text = text;
    this.parentId = parentId;
    this.blogId = blogId;
    this.user = user;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.likes = likes;
    this.replyCount = replyCount;
  }
}
