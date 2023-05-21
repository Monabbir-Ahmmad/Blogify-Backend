import { Blog } from "./blog.model.js";
import { Comment } from "./comment.model.js";
import { CommentLike } from "./commentLike.model.js";
import { Like } from "./like.model.js";
import { User } from "./user.model.js";
import { UserType } from "./userType.model.js";

export const createModelAssociations = () => {
  User.belongsTo(UserType, { onDelete: "CASCADE" });
  UserType.hasMany(User, { onDelete: "CASCADE" });

  Blog.belongsTo(User, { onDelete: "CASCADE" });
  User.hasMany(Blog, { onDelete: "CASCADE" });

  Like.belongsTo(Blog, { onDelete: "CASCADE" });
  Blog.hasMany(Like, { onDelete: "CASCADE" });

  Like.belongsTo(User, { onDelete: "CASCADE" });
  User.hasMany(Like, { onDelete: "CASCADE" });

  Comment.belongsTo(User, { onDelete: "CASCADE" });
  User.hasMany(Comment, { onDelete: "CASCADE" });

  Comment.belongsTo(Blog, { onDelete: "CASCADE" });
  Blog.hasMany(Comment, { onDelete: "CASCADE" });

  Comment.hasMany(Comment, {
    as: "replies",
    foreignKey: "parentId",
    onDelete: "CASCADE",
  });
  Comment.belongsTo(Comment, {
    as: "parent",
    foreignKey: "parentId",
    onDelete: "CASCADE",
  });

  CommentLike.belongsTo(Comment, { onDelete: "CASCADE" });
  Comment.hasMany(CommentLike, { onDelete: "CASCADE" });

  CommentLike.belongsTo(User, { onDelete: "CASCADE" });
  User.hasMany(CommentLike, { onDelete: "CASCADE" });
};
