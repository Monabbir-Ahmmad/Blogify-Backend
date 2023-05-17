import { connectToDatabase } from "./src/configs/database.config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createModelAssociations } from "./src/models/model.associations.js";
import { environment } from "./src/configs/environment.config.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";
import express from "express";
import { indexRouter } from "./src/routes/index.route.js";
import { loggerMiddleware } from "./src/middlewares/logger.middleware.js";
import seedDatabase from "./seedDatabase.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use(express.static("./public/uploads"));

app.use(loggerMiddleware.consoleLogging);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", indexRouter);

app.use(errorMiddleware.notFound);

app.use(errorMiddleware.errorHandler);

createModelAssociations();

connectToDatabase().then(() => seedDatabase());

app.listen(environment.PORT, () => {
  console.log(
    `Server is running in ${environment.NODE_ENV} environment on port ${environment.PORT}`
  );
});
