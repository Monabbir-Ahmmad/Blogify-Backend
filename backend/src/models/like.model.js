import { DataTypes, Model } from "sequelize";

import { Blog } from "./blog.model.js";
import { User } from "./user.model.js";
import { database } from "../configs/database.config.js";

/**
 * @category Models
 * @classdesc A class that defines the like model.
 * @property {string|number} userId - The user id of the like.
 * @property {string|number} blogId - The blog id of the like.
 * @property {Date} createdAt - The date when the like was created.
 * @property {Date} updatedAt - The date when the like was updated.
 * @property {Blog} blog - The blog of the like.
 * @property {User} user - The user who liked the blog.
 */
export class Like extends Model {}

Like.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: "id",
      },
    },
    blogId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Blog,
        key: "id",
      },
    },
  },
  {
    sequelize: database,
    modelName: "like",
  }
);

Blog.hasMany(Like, { onDelete: "CASCADE" });
Like.belongsTo(Blog, { onDelete: "CASCADE" });

User.hasMany(Like, { onDelete: "CASCADE" });
Like.belongsTo(User, { onDelete: "CASCADE" });
