import { AutoMapper } from "../utils/objects/AutoMapper.js";
import { Blog } from "../models/blog.model.js";
import { BlogResDto } from "../dtos/response/blog.res.dto.js";
import { Comment } from "../models/comment.model.js";
import { CommentResDto } from "../dtos/response/comment.res.dto.js";
import { User } from "../models/user.model.js";
import { UserResDto } from "../dtos/response/user.res.dto.js";

/**
 * The singleton instance of the AutoMapper class.
 * @type {AutoMapper}
 */
export const mapper = AutoMapper.getInstance();

mapper.setMapping(User, UserResDto, {
  properties: {
    userType: (user) => user.userType?.name,
  },
});

mapper.setMapping(Blog, BlogResDto, {
  properties: {
    user: (blog) => mapper.map(User, UserResDto, blog.user),
    commentCount: (blog) => blog.get("commentCount") ?? 0,
  },
});

mapper.setMapping(Comment, CommentResDto, {
  properties: {
    user: (comment) => mapper.map(User, UserResDto, comment.user),
    replyCount: (comment) => comment.get("replyCount") ?? 0,
  },
});
