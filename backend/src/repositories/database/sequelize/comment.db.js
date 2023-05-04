import { Comment } from "../../../models/comment.model.js";
import { CommentResDto } from "../../../dtos/response/comment.res.dto.js";
import { User } from "../../../models/user.model.js";
import { UserResDto } from "../../../dtos/response/user.res.dto.js";

const createComment = async (blogId, userId, text, parentId) => {
  const comment = await Comment.create({ text, parentId, blogId, userId });

  if (!comment) return null;

  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "profileImage"],
  });

  return new CommentResDto({
    id: comment.id,
    text,
    parentId,
    blogId,
    user: new UserResDto(user),
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    replyCount: 0,
  });
};

export const commentDB = {
  createComment,
};
