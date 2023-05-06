import { DataTypes, Model } from "sequelize";

import { UserType } from "./userType.model.js";
import { commonUtil } from "../utils/functions/common.util.js";
import { database } from "../configs/database.config.js";

export class User extends Model {}

User.init(
  {
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
  },
  {
    sequelize: database,
    modelName: "user",
  }
);

UserType.hasMany(User, { onDelete: "CASCADE" });
User.belongsTo(UserType, { onDelete: "CASCADE" });

User.afterUpdate(async (user) => {
  const previousUser = user._previousDataValues;

  if (
    previousUser.profileImage &&
    previousUser.profileImage !== user.profileImage
  )
    commonUtil.deleteUploadedFile(previousUser.profileImage);

  if (previousUser.coverImage && previousUser.coverImage !== user.coverImage)
    commonUtil.deleteUploadedFile(previousUser.coverImage);
});

User.afterDestroy(async (user) => {
  if (user.profileImage) commonUtil.deleteUploadedFile(user.profileImage);
  if (user.coverImage) commonUtil.deleteUploadedFile(user.coverImage);
});
