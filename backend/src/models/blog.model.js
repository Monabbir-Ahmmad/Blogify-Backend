import { DataTypes, Model } from "sequelize";

import { User } from "./user.model.js";
import { commonUtil } from "../utils/functions/common.util.js";
import { database } from "../configs/database.config.js";

export class Blog extends Model {}

Blog.init(
  {
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
  },
  {
    sequelize: database,
    modelName: "blog",
  }
);

User.hasMany(Blog, { onDelete: "CASCADE" });
Blog.belongsTo(User, { onDelete: "CASCADE" });

Blog.afterUpdate(async (blog) => {
  const previousBlog = blog._previousDataValues;

  if (previousBlog.coverImage && previousBlog.coverImage !== blog.coverImage)
    commonUtil.deleteUploadedFile(previousBlog.coverImage);
});

Blog.afterDestroy(async (blog) => {
  if (blog.coverImage) commonUtil.deleteUploadedFile(blog.coverImage);
});
