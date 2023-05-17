import { Sequelize } from "sequelize";
import { environment } from "./environment.config.js";

export const database = new Sequelize({
  database: environment.DB_NAME,
  username: environment.DB_USERNAME,
  password: environment.DB_PASSWORD,
  dialect: environment.DB_DIALECT,
  storage: "database.sqlite",
  logging: environment.NODE_ENV === "development" ? console.log : false,
});

// export const database = new Sequelize({
//   host: "ve3.h.filess.io",
//   port: 3307,
//   database: "cefaloBlog_dealschool",
//   username: "cefaloBlog_dealschool",
//   password: "74ca1a07dfb5ae35a18b4cd3d9e54c97964389a7",
//   dialect: "mysql",
//   logging: console.log,
// });

/**
 * Establishes a connection to the database and synchronizes it.
 * @function connectToDatabase
 * @returns {Promise<void>} A promise that resolves when the database connection is established and synchronized successfully.
 */
export async function connectToDatabase() {
  try {
    await database.authenticate();
    console.log("Connected to the database...");

    await database.sync({ force: false });
    console.log("Database synced...");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
