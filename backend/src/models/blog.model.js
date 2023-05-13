import { DataTypes, Model } from "sequelize";

import { User } from "./user.model.js";
import { commonUtil } from "../utils/common.util.js";
import { database } from "../configs/database.config.js";

/**
 * @category Models
 * @classdesc A class that defines the blog model.
 * @property {string|number} id - The id of the blog.
 * @property {string} title - The title of the blog.
 * @property {string} content - The content of the blog.
 * @property {string|null} coverImage - The cover image of the blog.
 * @property {Date} createdAt - The date when the blog was created.
 * @property {Date} updatedAt - The date when the blog was updated.
 * @property {User} user - The user who created the blog.
 * @property {any[]} likes - The likes of the blog.
 * @property {any[]} comments - The comments of the blog.
 */
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
