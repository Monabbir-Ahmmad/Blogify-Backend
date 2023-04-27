import express from "express";
import { AuthResDto } from "../dtos/response/auth.res.dto.js";

export const testRouter = express.Router();

testRouter.route("/").get((req, res) => {
  res.cookie("test", "test");
  res.send(new AuthResDto());
});
