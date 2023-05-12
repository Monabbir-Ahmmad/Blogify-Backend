import { DataTypes, Model } from "sequelize";

import { Comment } from "./comment.model.js";
import { User } from "./user.model.js";
import { database } from "../configs/database.config.js";

/**
 * @category Models
 * @classdesc A class that defines the comment like model.
 * @property {string|number} userId - The user id of the comment like.
 * @property {string|number} commentId - The comment id of the comment like.
 * @property {Date} createdAt - The date when the comment like was created.
 * @property {Date} updatedAt - The date when the comment like was updated.
 * @property {Comment} comment - The comment of the like.
 * @property {User} user - The user who liked the comment.
 */
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
