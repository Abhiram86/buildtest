import { Request, Response } from "express";
import * as githubService from "./github.service";
import { User } from "../../database/models/user.model";

export const githubRepos = async (req: Request, res: Response) => {
  const user = await User.findById((req.session as any).userId);
  const fields = req.query.fields as string[];
  console.log(fields && fields[0]);

  // const user = await User.findById("6898fc9e55f15cb4198573a0");
  if (!user) return res.status(404).send("User not found");
  const repos = await githubService.getRepos(
    user.githubUsername,
    user.githubAccessToken
  );
  res.status(200).json({
    repos: repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      defaultBranch: repo.default_branch,
      owner: repo.owner.login,
    })),
  });
};

export const githubRepo = async (req: Request, res: Response) => {
  // const user = await User.findById((req.session as any).userId);
  // const defaultBranch = req.body.defaultBranch as string;
  const user = await User.findById("6898fc9e55f15cb4198573a0");
  const defaultBranch = "main";
  if (!user) return res.status(404).send("User not found");
  const repo = await githubService.getRepo(
    user.githubUsername,
    req.params.repo,
    defaultBranch,
    user.githubAccessToken
  );
  res.status(200).json({ repo });
};
