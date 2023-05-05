export class CommentResDto {
  constructor(
    id,
    text,
    parentId,
    blogId,
    user,
    createdAt,
    updatedAt,
    replyCount
  ) {
    this.id = id;
    this.text = text;
    this.parentId = parentId;
    this.blogId = blogId;
    this.user = user;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.replyCount = replyCount;
  }
}
