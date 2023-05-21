import { AutoMapper } from "../utils/autoMapper.js";
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

/** Set the mappings for the User model and User res dto. */
mapper.setMapping(User, UserResDto, {
  properties: {
    userType: (user) => user.userType?.name,
  },
});

/** Set the mappings for the Blog model and Blog res dto. */
mapper.setMapping(Blog, BlogResDto, {
  properties: {
    user: (blog) => mapper.map(User, UserResDto, blog.user),
    commentCount: (blog) => parseInt(blog.get("commentCount")) ?? 0,
  },
});

/** Set the mappings for the Comment model and Comment res dto. */
mapper.setMapping(Comment, CommentResDto, {
  properties: {
    user: (comment) => mapper.map(User, UserResDto, comment.user),
    likes: (comment) => comment.commentLikes ?? [],
    replyCount: (comment) => parseInt(comment.get("replyCount")) ?? 0,
  },
});
