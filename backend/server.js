import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";
import { indexRouter } from "./src/routes/index.route.js";
import cookieParser from "cookie-parser";
import seedDatabase from "./seedDatabase.js";
import { loggerMiddleWare } from "./src/middlewares/logger.middleware.js";
import { connectToDatabase } from "./src/configs/database.config.js";

const app = express();

const server = http.createServer(app);

dotenv.config();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use(express.static("./public/uploads"));

app.use(loggerMiddleWare.consoleLogging);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", indexRouter);

app.use(errorMiddleware.notFound);

app.use(errorMiddleware.errorHandler);

const PORT = process.env.PORT || 5000;

connectToDatabase()
  .then(() => seedDatabase())
  .catch((error) => console.error(error));

server.listen(
  PORT,
  console.log(`Server started in ${process.env.NODE_ENV} mode on port: ${PORT}`)
);
