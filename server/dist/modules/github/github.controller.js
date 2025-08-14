var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as githubService from "./github.service";
import { User } from "../../database/models/user.model";
import { decrypt } from "../../common/utils";
export const githubRepos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findById(req.session.userId);
    const fields = req.query.fields;
    console.log(fields && fields[0]);
    if (!user)
        return res.status(404).send("User not found");
    const repos = yield githubService.getRepos(user.githubUsername, decrypt(user.githubAccessToken));
    res.status(200).json({
        repos: repos.map((repo) => ({
            id: repo.id,
            name: repo.name,
            defaultBranch: repo.default_branch,
            owner: repo.owner.login,
        })),
    });
});
export const githubRepo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findById(req.session.userId);
    const defaultBranch = req.body.ref || "main";
    // if (!user) return res.status(404).send("User not found");
    const path = req.body.path;
    if (!path || !path.includes("/")) {
        return res
            .status(400)
            .send("Invalid repository path. Expected 'owner/repo'.");
    }
    const [owner, repo] = path.split("/", 2);
    const repoDetails = yield githubService.getRepo(owner, repo, defaultBranch, user ? decrypt(user.githubAccessToken) : "");
    res.status(200).json({ repo: repoDetails });
});
