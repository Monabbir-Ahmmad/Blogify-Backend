import { DataTypes, Model } from "sequelize";

import { Blog } from "./blog.model.js";
import { User } from "./user.model.js";
import { database } from "../configs/database.config.js";

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
