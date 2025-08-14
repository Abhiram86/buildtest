export const getRepos = async (username, accessToken) => {
    const resp = await fetch(`https://api.github.com/users/${username}/repos`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
        },
    });
    return await resp.json();
};
export const getRepo = async (owner, repo, defaultBranch, accessToken) => {
    try {
        const headers = {
            Accept: "application/vnd.github.v3+json",
        };
        accessToken.length > 0 &&
            (headers.Authorization = `Bearer ${accessToken}`);
        const branchResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches/${defaultBranch}`, {
            headers,
        });
        if (!branchResp.ok) {
            throw new Error(`Branch not found: ${branchResp.status} ${branchResp.statusText}`);
        }
        const branchData = await branchResp.json();
        const treeSha = branchData.commit.commit.tree.sha;
        // Fetch tree recursively
        const treeResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`, {
            headers,
        });
        if (!treeResp.ok) {
            throw new Error(`Failed to fetch tree: ${treeResp.status} ${treeResp.statusText}`);
        }
        const treeData = await treeResp.json();
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
};
