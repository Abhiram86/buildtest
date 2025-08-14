import express from "express";
import * as authController from "./auth.controller";
const authRouter = express.Router();
authRouter.get("/github", authController.githubOauth);
authRouter.get("/github/callback", authController.callback);
authRouter.get("/user", authController.user);
authRouter.get("/logout", authController.logout);
export default authRouter;
