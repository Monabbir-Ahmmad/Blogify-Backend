import { DataTypes, Model } from "sequelize";

import { Comment } from "./comment.model.js";
import { User } from "./user.model.js";
import { database } from "../configs/database.config.js";

export class CommentLike extends Model {}

CommentLike.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: "id",
      },
    },
    commentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Comment,
        key: "id",
      },
    },
  },
  {
    sequelize: database,
    modelName: "commentLike",
  }
);

Comment.hasMany(CommentLike, { onDelete: "CASCADE" });
CommentLike.belongsTo(Comment, { onDelete: "CASCADE" });

User.hasMany(CommentLike, { onDelete: "CASCADE" });
CommentLike.belongsTo(User, { onDelete: "CASCADE" });
