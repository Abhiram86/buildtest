export const getRepos = async (username: string, accessToken: string) => {
  const resp = await fetch(`https://api.github.com/users/${username}/repos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  return await resp.json();
};

interface TreeData {
  type: string;
  name: string;
  path: string;
  children?: Record<string, TreeData>;
}

export const getRepo = async (
  username: string,
  repo: string,
  defaultBranch: string,
  accessToken: string
): Promise<{ repo: TreeData; defaultBranch: string }> => {
  try {
    const branchResp = await fetch(
      `https://api.github.com/repos/${username}/${repo}/branches/${defaultBranch}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (!branchResp.ok) {
      throw new Error(
        `Branch not found: ${branchResp.status} ${branchResp.statusText}`
      );
    }
    const branchData: { commit: { commit: { tree: { sha: string } } } } =
      await branchResp.json();
    const treeSha = branchData.commit.commit.tree.sha;

    // Fetch tree recursively
    const treeResp = await fetch(
      `https://api.github.com/repos/${username}/${repo}/git/trees/${treeSha}?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (!treeResp.ok) {
      throw new Error(
        `Failed to fetch tree: ${treeResp.status} ${treeResp.statusText}`
      );
    }
    const treeData: { tree: Array<{ path: string; type: "blob" | "tree" }> } =
      await treeResp.json();

    const root: TreeData = {
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

        if (!current.children) current.children = {};
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
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(String(error));
  }
};
