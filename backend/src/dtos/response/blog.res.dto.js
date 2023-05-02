import { UserResDto } from "./user.res.dto.js";

export class BlogResDto {
  constructor({
    id,
    title,
    content,
    coverImage,
    createdAt,
    updatedAt,
    user,
    likes,
  }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.coverImage = coverImage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.user = new UserResDto(user);
    this.likes = likes;
  }
}
