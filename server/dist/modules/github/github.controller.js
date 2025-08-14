"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubRepo = exports.githubRepos = void 0;
const githubService = __importStar(require("./github.service"));
const user_model_1 = require("../../database/models/user.model");
const utils_1 = require("../../common/utils");
const githubRepos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(req.session.userId);
    const fields = req.query.fields;
    console.log(fields && fields[0]);
    if (!user)
        return res.status(404).send("User not found");
    const repos = yield githubService.getRepos(user.githubUsername, (0, utils_1.decrypt)(user.githubAccessToken));
    res.status(200).json({
        repos: repos.map((repo) => ({
            id: repo.id,
            name: repo.name,
            defaultBranch: repo.default_branch,
            owner: repo.owner.login,
        })),
    });
});
exports.githubRepos = githubRepos;
const githubRepo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(req.session.userId);
    const defaultBranch = req.body.ref || "main";
    // if (!user) return res.status(404).send("User not found");
    const path = req.body.path;
    if (!path || !path.includes("/")) {
        return res
            .status(400)
            .send("Invalid repository path. Expected 'owner/repo'.");
    }
    const [owner, repo] = path.split("/", 2);
    const repoDetails = yield githubService.getRepo(owner, repo, defaultBranch, user ? (0, utils_1.decrypt)(user.githubAccessToken) : "");
    res.status(200).json({ repo: repoDetails });
});
exports.githubRepo = githubRepo;
