import { DataTypes, Model } from "sequelize";

import { Blog } from "./blog.model.js";
import { User } from "./user.model.js";
import { database } from "../configs/database.config.js";

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
