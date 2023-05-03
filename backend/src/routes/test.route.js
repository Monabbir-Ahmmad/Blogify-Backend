import express from "express";
import { UserResDto } from "../dtos/response/user.res.dto.js";

export const testRouter = express.Router();

testRouter.route("/").get((req, res) => {
  const userList = [
    new UserResDto({
      id: 1,
      password: "123456",
      name: "John Doe",
    }),
    new UserResDto({
      id: 2,
      password: "123456",
      name: "Jane Doe",
    }),
  ];

  res.status(200).send(userList);
});
