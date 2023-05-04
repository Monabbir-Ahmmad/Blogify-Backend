import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { environment } from "./environment.config.js";

dotenv.config();

export const database = new Sequelize({
  database: environment.DB_NAME,
  username: environment.DB_USERNAME,
  password: environment.DB_PASSWORD,
  dialect: environment.DB_DIALECT,
  storage: "database.sqlite",
  logging: console.log,
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
