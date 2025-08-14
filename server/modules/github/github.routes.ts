import express from "express";
import * as githubController from "./github.controller";
import { githubMiddleware } from "./github.middleware";

const githubRouter = express.Router();

githubRouter.get("/repos", githubMiddleware, githubController.githubRepos);
githubRouter.post(
  "/repos/:repo",
  //   githubMiddleware,
  githubController.githubRepo
);

export default githubRouter;
