import { DataTypes } from "sequelize";
import { database } from "../configs/database.config.js";

export const UserType = database.define("userType", {
  privilege: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { notEmpty: true },
  },
});
