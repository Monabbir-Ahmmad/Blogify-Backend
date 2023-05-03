import express from "express";

export const testRouter = express.Router();

testRouter.route("/").get((req, res) => {
  res.send("Test route");
});
