import { database } from "../configs/database.config.js";
import { Blog } from "./blog.model.js";
import { User } from "./user.model.js";

export const Like = database.define("like");

Blog.hasMany(Like, { onDelete: "CASCADE" });
Like.belongsTo(Blog, { onDelete: "CASCADE" });

User.hasMany(Like, { onDelete: "CASCADE" });
Like.belongsTo(User, { onDelete: "CASCADE" });
