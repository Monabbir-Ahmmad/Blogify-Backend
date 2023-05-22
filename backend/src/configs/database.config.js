import { Sequelize } from "sequelize";
import { environment } from "./environment.config.js";

export const database = new Sequelize({
  dialect: environment.DB_DIALECT,
  host: environment.DB_HOST,
  port: environment.DB_PORT,
  database: environment.DB_NAME,
  username: environment.DB_USER,
  password: environment.DB_PASSWORD,
  storage: environment.DB_STORAGE,
  logging: environment.NODE_ENV === "development" ? console.log : false,
});

/**
 * Establishes a connection to the database and synchronizes it.
 * @function connectToDatabase
 * @returns {Promise<void>} A promise that resolves when the database connection is established and synchronized successfully.
 */
export async function connectToDatabase(forceSync = false) {
  try {
    await database.authenticate();
    console.log("Connected to the database...");

    await database.sync({ force: forceSync });
    console.log("Database synced...");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
