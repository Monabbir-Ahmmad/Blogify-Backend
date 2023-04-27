import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: process.env.DB_DIALECT,
    storage: "database.sqlite",
    logging: false,
  }
);

async function connectToDatabase() {
  try {
    await database.authenticate();
    console.log("Connected to the database...");

    await database.sync();
    console.log("Database synced...");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

connectToDatabase();
