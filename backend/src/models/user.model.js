import { DataTypes } from "sequelize";
import { UserType } from "./userType.model.js";
import { commonUtil } from "../utils/functions/common.util.js";
import { database } from "../configs/database.config.js";

export const User = database.define("user", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { notEmpty: true },
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: { notEmpty: true },
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

UserType.hasMany(User, { onDelete: "CASCADE" });
User.belongsTo(UserType, { onDelete: "CASCADE" });

User.afterUpdate(async (user) => {
  if (user._previousDataValues.profileImage !== user.profileImage)
    commonUtil.deleteUploadedFile(user._previousDataValues.profileImage);
  if (user._previousDataValues.coverImage !== user.coverImage)
    commonUtil.deleteUploadedFile(user._previousDataValues.coverImage);
});

User.afterDestroy(async (user) => {
  if (user.profileImage) commonUtil.deleteUploadedFile(user.profileImage);
  if (user.coverImage) commonUtil.deleteUploadedFile(user.coverImage);
});
