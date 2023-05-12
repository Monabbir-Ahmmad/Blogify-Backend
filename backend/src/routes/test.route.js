import { Router } from "express";

export const testRouter = Router();

testRouter.route("/").get((req, res) => {
  res.send("Test route");
});
