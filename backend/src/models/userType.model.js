import { DataTypes, Model } from "sequelize";

import { database } from "../configs/database.config.js";

/**
 * @category Models
 * @classdesc A class that defines the user type model.
 * @property {string|number} id - The id of the user type.
 * @property {string} name - The name of the user type.
 * @property {Date} createdAt - The date when the user type was created.
 * @property {Date} updatedAt - The date when the user type was updated.
 */
export class UserType extends Model {}

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
