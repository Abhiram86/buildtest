import express from "express";
import * as testsController from "./tests.controller";
import { testsMiddleware } from "./tests.middleware";
const testsRouter = express.Router();
testsRouter.get("/:repo", testsMiddleware, testsController.getTest);
testsRouter.post("/:owner/:repo", testsMiddleware, testsController.createTest);
export default testsRouter;
