import { DataTypes } from "sequelize";
import { database } from "../configs/database.config.js";
import { User } from "./user.model.js";
import { Blog } from "./blog.model.js";

export const Comment = database.define("comment", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
});

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
