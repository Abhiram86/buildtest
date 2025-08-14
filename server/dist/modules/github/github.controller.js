import * as githubService from "./github.service.js";
import { User } from "../../database/models/user.model.js";
import { decrypt } from "../../common/utils.js";
export const githubRepos = async (req, res) => {
    const user = await User.findById(req.session.userId);
    const fields = req.query.fields;
    console.log(fields && fields[0]);
    if (!user)
        return res.status(404).send("User not found");
    const repos = await githubService.getRepos(user.githubUsername, decrypt(user.githubAccessToken));
    res.status(200).json({
        repos: repos.map((repo) => ({
            id: repo.id,
            name: repo.name,
            defaultBranch: repo.default_branch,
            owner: repo.owner.login,
        })),
    });
};
export const githubRepo = async (req, res) => {
    const user = await User.findById(req.session.userId);
    const defaultBranch = req.body.ref || "main";
    // if (!user) return res.status(404).send("User not found");
    const path = req.body.path;
    if (!path || !path.includes("/")) {
        return res
            .status(400)
            .send("Invalid repository path. Expected 'owner/repo'.");
    }
    const [owner, repo] = path.split("/", 2);
    const repoDetails = await githubService.getRepo(owner, repo, defaultBranch, user ? decrypt(user.githubAccessToken) : "");
    res.status(200).json({ repo: repoDetails });
};
