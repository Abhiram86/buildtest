import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Tree } from "@/components/Tree";
import { useState } from "react";
import { useUser } from "@/context/User";
import GeneratedTest from "@/components/GeneratedTest";
import { useTestSuite } from "@/context/TestSuite";

export const Route = createFileRoute("/")({
  component: App,
});

interface TreeData {
  type: string;
  name: string;
  path: string;
  children: Map<string, TreeData>;
}

function App() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [defaultBranch, setDefaultBranch] = useState("");
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [status, setStatus] = useState("No repository loaded.");

  const { user } = useUser();
  const { setTestSuite } = useTestSuite();

  function convertChildrenToMap(node: any) {
    if (node.children && typeof node.children === "object") {
      node.children = new Map(
        Object.entries(node.children).map(([key, value]) => [
          key,
          convertChildrenToMap(value),
        ])
      );
    }
    return node;
  }

  const loadRepo = async (
    path: string,
    refInput: string,
    tokenParam: string
  ) => {
    if (!path || !path.includes("/")) {
      setStatus("Please enter repository as owner/repo.");
      return;
    }

    const [owner, repo] = path.split("/", 2);
    setStatus("Loading repository from server...");

    try {
      const requestBody = {
        path,
        ref: refInput || undefined,
        token: user ? undefined : tokenParam,
      };

      // Prepare both requests
      const repoFetch = fetch(`http://localhost:8080/github/repos/${repo}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const secondFetch = user
        ? fetch(`http://localhost:8080/tests/${repo}`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          })
        : null;

      // Run both in parallel
      const [res, secondRes] = await Promise.all([
        repoFetch,
        secondFetch ?? Promise.resolve(null),
      ]);

      // Handle first response
      if (!res.ok) {
        console.error(res.status, res.statusText);
        alert("Failed to load repository.");
        return;
      }

      const data = await res.json();

      setOwner(owner);
      setRepo(repo);
      setDefaultBranch(data.repo.defaultBranch);
      setTreeData(convertChildrenToMap(data.repo.repo));

      setStatus(
        `Loaded repository ${owner}/${repo}@${data.repo.defaultBranch}`
      );

      if (secondRes) {
        if (!secondRes.ok) {
          console.error(secondRes.status, secondRes.statusText);
          alert("Failed to load repository.");
          return;
        }

        const secondData = await secondRes.json();
        setTestSuite(secondData);
      }
    } catch (err: any) {
      setStatus(err.message || "Failed to load repository.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:divide-x divide-main">
      <div className="lg:w-1/2 container mx-auto p-4 max-w-6xl overflow-y-auto">
        <Header
          title="Build Test Suites Using Large Language Models"
          notice="Enter a repository as owner/repo (e.g., torvalds/linux). Optional: add a token to increase rate limits. This uses the Git Trees API to fetch the full recursive file list."
          controlsProps={{ repopath: "", ref: "", token: "" }}
          onLoad={loadRepo}
        />
        <section className="panel border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg">
          <div className="panel-head flex justify-between items-center px-6 py-3.5 border-b border-gray-300 dark:border-gray-600">
            <div
              id="repoTitle"
              className="repo-meta flex gap-3 items-center text-smoky text-sm"
            >
              {treeData && `${owner}/${repo} @ ${defaultBranch}`}
            </div>
            <div className="links flex gap-2.5 items-center" id="repoLinks">
              {treeData && (
                <a
                  href={`https://github.com/${owner}/${repo}`}
                  className="text-main hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open on GitHub
                </a>
              )}
            </div>
          </div>
          {treeData && (
            <Tree
              root={treeData}
              owner={owner}
              repo={repo}
              defaultBranch={defaultBranch}
            />
          )}
        </section>
        <div className="status mt-3 text-gray-500">{status}</div>
      </div>
      <div className="lg:w-1/2 p-4">
        <div className="sticky top-20">
          <GeneratedTest />
        </div>
      </div>
    </div>
  );
}
