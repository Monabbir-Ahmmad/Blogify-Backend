import { DataTypes } from "sequelize";
import { database } from "../configs/database.config.js";
import { UserType } from "./userType.model.js";

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
  },
});

UserType.hasMany(User, { onDelete: "CASCADE" });
User.belongsTo(UserType, { onDelete: "CASCADE" });
