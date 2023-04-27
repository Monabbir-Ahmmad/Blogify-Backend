import { DataTypes } from "sequelize";
import { database } from "../configs/database.config.js";
import { User } from "./user.model.js";

export const Blog = database.define("blog", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: true },
  },
  coverImage: {
    type: DataTypes.STRING,
  },
});

User.hasMany(Blog, { onDelete: "CASCADE" });
Blog.belongsTo(User, { onDelete: "CASCADE" });
