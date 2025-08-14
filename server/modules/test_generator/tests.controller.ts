import { Request, Response } from "express";
import * as testService from "./tests.service";
import { User } from "../../database/models/user.model";
import { decrypt } from "../../common/utils";

export const getTest = async (req: Request, res: Response) => {
  const userId = (req.session as any).userId;
  const repo = req.params.repo;
  const data = await testService.getTest(userId, repo);
  if ("error" in data) return res.json(data);
  return res.status(200).json(data);
};

export const createTest = async (req: Request, res: Response) => {
  const user = await User.findById((req.session as any).userId);
  if (!user) return res.status(404).send("User not found");
  const owner = req.params.owner;
  const repo = req.params.repo;
  const filePaths = req.body.filePaths as string[];
  const data = await testService.createTest(
    owner,
    repo,
    filePaths,
    user._id,
    decrypt(user.githubAccessToken)
  );
  return res.json(data);
};
