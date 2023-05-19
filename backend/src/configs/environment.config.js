import dotenv from "dotenv";
import path from "path";

let envFileName = ".env";

switch (process.env.NODE_ENV) {
  case "production":
    envFileName = ".env.production";
    break;
  case "development":
    envFileName = ".env.development";
    break;
  case "test":
    envFileName = ".env.test";
    break;
  default:
    envFileName = ".env";
    break;
}

dotenv.config({
  path: path.resolve(process.cwd(), envFileName),
});

export const environment = {
  APP_NAME: process.env.APP_NAME ?? "App Name",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ?? 5000,
  DB_NAME: process.env.DB_NAME ?? "blog_database",
  DB_USER: process.env.DB_USER ?? "root",
  DB_PASSWORD: process.env.DB_PASSWORD ?? "",
  DB_HOST: process.env.DB_HOST ?? "localhost",
  DB_PORT: process.env.DB_PORT ?? 3306,
  DB_DIALECT: process.env.DB_DIALECT ?? "sqlite",
  DB_STORAGE: process.env.DB_STORAGE ?? "database.sqlite",
  SALT_ROUNDS: process.env.SALT_ROUNDS ?? 10,
  JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY ?? "JWT_ACCESS_KEY",
  JWT_ACCESS_EXPIRE_TIME: process.env.JWT_ACCESS_EXPIRE_TIME ?? "5m",
  JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY ?? "JWT_REFRESH_KEY",
  JWT_REFRESH_EXPIRE_TIME: process.env.JWT_REFRESH_EXPIRE_TIME ?? "15d",
  JWT_RESET_KEY: process.env.JWT_RESET_KEY ?? "JWT_RESET_KEY",
  JWT_RESET_EXPIRE_TIME: process.env.JWT_RESET_EXPIRE_TIME ?? "1d",
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS ?? "EMAIL_ADDRESS",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ?? "EMAIL_PASSWORD",
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:3000",
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME ?? "CLOUDINARY_NAME",
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY ?? "CLOUDINARY_KEY",
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET ?? "CLOUDINARY_SECRET",
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER ?? "CLOUDINARY_FOLDER",
};
