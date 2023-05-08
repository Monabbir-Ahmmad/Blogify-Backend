import express from "express";
import { searchController } from "../controllers/search.controller.js";

export const searchRouter = express.Router();

searchRouter.route("/user/:keyword").get(searchController.searchUser);

searchRouter.route("/blog/:keyword").get(searchController.searchBlog);
