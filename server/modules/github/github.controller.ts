import { Request, Response } from "express";
import * as githubService from "./github.service";
import { User } from "../../database/models/user.model";
import { decrypt } from "../../common/utils";

export const githubRepos = async (req: Request, res: Response) => {
  const user = await User.findById((req.session as any).userId);
  const fields = req.query.fields as string[];
  console.log(fields && fields[0]);

  if (!user) return res.status(404).send("User not found");
  const repos = await githubService.getRepos(
    user.githubUsername,
    decrypt(user.githubAccessToken)
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
  let user = null;

  if ((req.session as any).userId) {
    user = await User.findById((req.session as any).userId);
  }

  const defaultBranch = (req.body.ref as string) || "main";
  // if (!user) return res.status(404).send("User not found");

  const path = req.body.path as string;
  if (!path || !path.includes("/")) {
    return res
      .status(400)
      .send("Invalid repository path. Expected 'owner/repo'.");
  }
  const [owner, repo] = path.split("/", 2);

  const repoDetails = await githubService.getRepo(
    owner,
    repo,
    defaultBranch,
    user ? decrypt(user.githubAccessToken) : ""
  );
  res.status(200).json({ repo: repoDetails });
};
