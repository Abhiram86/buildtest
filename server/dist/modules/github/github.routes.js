import express from "express";
import * as githubController from "./github.controller.js";
import { githubMiddleware } from "./github.middleware.js";
const githubRouter = express.Router();
githubRouter.get("/repos", githubMiddleware, githubController.githubRepos);
githubRouter.post("/repos/:repo", githubController.githubRepo);
export default githubRouter;
