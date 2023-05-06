import { DataTypes, Model } from "sequelize";
import { database } from "../configs/database.config.js";

export class UserType extends Model { }

UserType.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
  },
  {
    sequelize: database,
    modelName: "userType",
  }
);
