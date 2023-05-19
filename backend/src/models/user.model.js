import { DataTypes, Model } from "sequelize";

import { commonUtil } from "../utils/common.util.js";
import { database } from "../configs/database.config.js";

/**
 * @category Models
 * @classdesc A class that defines the user model.
 * @property {string|number} id - The id of the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email of the user.
 * @property {Date} birthDate - The birth date of the user.
 * @property {string} gender - The gebder of the user.
 * @property {string} password - The password of the user.
 * @property {string|null} [profileImage] - The profile image of the user.
 * @property {string|null} [coverImage] - The cover image of the user.
 * @property {string|null} [bio] - The bio of the user.
 * @property {Date} createdAt - The date when the user was created.
 * @property {Date} updatedAt - The date when the user was updated.
 * @property {UserType} userType - The user type of the user.
 */
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
