import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import seedDatabase from "./seedDatabase.js";
import { connectToDatabase } from "./src/configs/database.config.js";
import { environment } from "./src/configs/environment.config.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";
import { loggerMiddleWare } from "./src/middlewares/logger.middleware.js";
import { indexRouter } from "./src/routes/index.route.js";

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

connectToDatabase()
  .then(() => seedDatabase())
  .catch((error) => console.error(error));

server.listen(
  environment.PORT,
  console.log(
    `Server started in ${environment.NODE_ENV} mode on port: ${environment.PORT}`
  )
);
