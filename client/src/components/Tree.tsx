import { useRef, useState } from "react";
import { Node } from "./Node";
import { useTestSuite } from "@/context/TestSuite";

interface TreeProps {
  root: any;
  owner: string;
  repo: string;
  defaultBranch: string;
}

export const Tree = ({ root, owner, repo, defaultBranch }: TreeProps) => {
  const selectedFiles = useRef(new Set<string>());
  const [, forceUpdate] = useState(false);
  const { testSuite, setTestSuite } = useTestSuite();

  if (testSuite) {
    if ("error" in testSuite) return;
    testSuite.filePaths.forEach((path: string) => {
      selectedFiles.current.add(path);
    });
  }

  const handleGenerateTest = async () => {
    const resp = await fetch(
      `${import.meta.env.VITE_API_URL}/tests/${owner}/${repo}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner,
          repo,
          filePaths: Array.from(selectedFiles.current),
        }),
      }
    );
    if (resp.ok) {
      const data = await resp.json();
      setTestSuite(data);
    } else {
      console.log(resp.status, resp.statusText);
      alert("Failed to generate test suite.");
    }
  };

  return (
    <div
      id="tree"
      className="tree space-y-2 divide-y divide-zinc-500 p-2.5"
      role="tree"
      aria-label="Repository file tree"
    >
      <div className="pb-2">
        <Node
          node={root}
          owner={owner}
          repo={repo}
          selectedFiles={selectedFiles.current}
          onSelect={(path) => {
            const set = selectedFiles.current;
            set.has(path) ? set.delete(path) : set.add(path);
            console.log(set);
            forceUpdate((prev) => !prev);
          }}
          defaultBranch={defaultBranch}
        />
      </div>
      <button
        id="generate"
        disabled={selectedFiles.current.size === 0}
        onClick={handleGenerateTest}
        className="btn w-full disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 disabled:bg-none cursor-pointer active:scale-98 transition-transform bg-gradient-to-br from-[#FF7E5F] via-[#FEB47B] to-[#9333EA]
    bg-[length:_200%_200%]
    animate-gradient-bg text-black text-sm px-5 py-2.5 rounded-lg shadow font-semibold hover:border-blue-500"
      >
        Generate Tests
      </button>
    </div>
  );
};
