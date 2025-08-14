import express from "express";
import * as testsController from "./tests.controller.js";
import { testsMiddleware } from "./tests.middleware.js";
const testsRouter = express.Router();
testsRouter.get("/:repo", testsMiddleware, testsController.getTest);
testsRouter.post("/:owner/:repo", testsMiddleware, testsController.createTest);
export default testsRouter;
