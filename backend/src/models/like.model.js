import { Blog } from "./blog.model.js";
import { Model } from "sequelize";
import { User } from "./user.model.js";
import { database } from "../configs/database.config.js";

export class Like extends Model {}

Like.init(null, {
  sequelize: database,
  modelName: "like",
});

Blog.hasMany(Like, { onDelete: "CASCADE" });
Like.belongsTo(Blog, { onDelete: "CASCADE" });

User.hasMany(Like, { onDelete: "CASCADE" });
Like.belongsTo(User, { onDelete: "CASCADE" });
