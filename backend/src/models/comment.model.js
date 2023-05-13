import { DataTypes, Model } from "sequelize";

import { Blog } from "./blog.model.js";
import { User } from "./user.model.js";
import { database } from "../configs/database.config.js";

/**
 * @category Models
 * @classdesc A class that defines the comment model.
 * @property {string|number} id - The id of the comment.
 * @property {string} text - The text of the comment.
 * @property {string|null} [parentId] - The parent comment id of the comment.
 * @property {Date} createdAt - The date when the comment was created.
 * @property {Date} updatedAt - The date when the comment was updated.
 * @property {User} user - The user who created the comment.
 * @property {Blog} blog - The blog of the comment.
 * @property {any[]} likes - The likes of the comment.
 * @property {any[]} replies - The replies of the comment.
 * @property {Comment} parent - The parent comment of the comment.
 */
export class Comment extends Model {}

Comment.init(
  {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  {
    sequelize: database,
    modelName: "comment",
  }
);

User.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(User, { onDelete: "CASCADE" });

Blog.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(Blog, { onDelete: "CASCADE" });

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
