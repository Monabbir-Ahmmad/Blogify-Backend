import { DataTypes } from "sequelize";
import { User } from "./user.model.js";
import { commonUtil } from "../utils/functions/common.util.js";
import { database } from "../configs/database.config.js";

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

Blog.afterUpdate(async (blog) => {
  if (blog._previousDataValues.coverImage !== blog.coverImage)
    commonUtil.deleteUploadedFile(blog._previousDataValues.coverImage);
});

Blog.afterDestroy(async (blog) => {
  if (blog.coverImage) commonUtil.deleteUploadedFile(blog.coverImage);
});
