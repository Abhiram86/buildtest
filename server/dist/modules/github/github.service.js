"use strict";
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
exports.getRepo = exports.getRepos = void 0;
const getRepos = (username, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const resp = yield fetch(`https://api.github.com/users/${username}/repos`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
        },
    });
    return yield resp.json();
});
exports.getRepos = getRepos;
const getRepo = (owner, repo, defaultBranch, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const headers = {
            Accept: "application/vnd.github.v3+json",
        };
        accessToken.length > 0 &&
            (headers.Authorization = `Bearer ${accessToken}`);
        const branchResp = yield fetch(`https://api.github.com/repos/${owner}/${repo}/branches/${defaultBranch}`, {
            headers,
        });
        if (!branchResp.ok) {
            throw new Error(`Branch not found: ${branchResp.status} ${branchResp.statusText}`);
        }
        const branchData = yield branchResp.json();
        const treeSha = branchData.commit.commit.tree.sha;
        // Fetch tree recursively
        const treeResp = yield fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`, {
            headers,
        });
        if (!treeResp.ok) {
            throw new Error(`Failed to fetch tree: ${treeResp.status} ${treeResp.statusText}`);
        }
        const treeData = yield treeResp.json();
        const root = {
            type: "tree",
            name: "/",
            path: "",
            children: {},
        };
        // Build tree
        for (const entry of treeData.tree) {
            const parts = entry.path.split("/");
            let current = root;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const isLast = i === parts.length - 1;
                if (!current.children)
                    current.children = {};
                if (!current.children[part]) {
                    current.children[part] = {
                        type: isLast ? entry.type : "tree",
                        name: part,
                        path: parts.slice(0, i + 1).join("/"),
                        children: entry.type === "tree" && !isLast ? {} : undefined,
                    };
                }
                current = current.children[part];
            }
        }
        return { repo: root, defaultBranch };
    }
    catch (error) {
        if (error instanceof Error)
            throw error;
        throw new Error(String(error));
    }
});
exports.getRepo = getRepo;
