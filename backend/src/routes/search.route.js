import { Router } from "express";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { searchController } from "../controllers/search.controller.js";

export const searchRouter = Router();

searchRouter
  .route("/user/:keyword")
  .get(errorMiddleware.asyncHandler(searchController.searchUser));

searchRouter
  .route("/blog/:keyword")
  .get(errorMiddleware.asyncHandler(searchController.searchBlog));
