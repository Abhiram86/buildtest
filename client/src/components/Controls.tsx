import { useUser } from "@/context/User";
import { useState, type KeyboardEvent } from "react";
import SelectMenu from "./SelectMenu";

interface ControlsProps {
  repopath: string;
  ref: string;
  token: string;
  onLoad: (repopath: string, ref: string, token: string) => void;
}

export interface Repo {
  id: number;
  name: string;
  defaultBranch: string;
  owner: string;
}

export const Controls = ({ repopath, ref, token, onLoad }: ControlsProps) => {
  const { user } = useUser();
  const [repoPath, setRepoPath] = useState(
    repopath || user?.githubUsername || ""
  );
  const [refValue, setRefValue] = useState(ref || "");
  const [tokenValue, setTokenValue] = useState(token || "");
  const [open, setOpen] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onLoad(repoPath, refValue, tokenValue);
    }
  };

  const handleRepoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRepoPath(value);

    if (value.includes("/")) {
      setOpen(true);
      if (user) {
        try {
          const resp = await fetch(
            `${import.meta.env.VITE_API_URL}/github/repos`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await resp.json();
          setRepos(data.repos);
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      setOpen(false);
      // setRepos([]);
    }
  };

  return (
    <div className="controls flex flex-wrap gap-3 text-smoky items-center">
      <div
        className="field relative flex focus-within:ring-main items-center gap-2 bg-black ring ring-neutral-700 transition-all p-2.5 rounded-lg shadow"
        title="owner/repo"
      >
        <span>Repo</span>
        <input
          type="text"
          placeholder="owner/repo"
          value={repoPath || user?.githubUsername || ""}
          onChange={handleRepoChange}
          onKeyUp={handleKeyUp}
          className="bg-transparent border-none z-0 outline-none"
        />
        {repos.length > 0 && open && (
          <SelectMenu
            data={repos.filter((repo) =>
              repo.name
                .toLocaleLowerCase()
                .includes(repoPath.split("/")[1].toLocaleLowerCase())
            )}
            onSelect={(name, enter) => {
              const newRepoPath = `${repoPath.split("/")[0]}/${name}`;
              setRepoPath(newRepoPath);
              setOpen(false);
              if (enter) {
                onLoad(newRepoPath, refValue, tokenValue);
              }
            }}
          />
        )}
      </div>
      <div
        className="field flex focus-within:ring-main items-center gap-2 ring-neutral-700 transition-all ring p-2.5 rounded-lg shadow"
        title="Branch or commit SHA (optional)"
      >
        <span>Ref</span>
        <input
          type="text"
          placeholder="main (optional)"
          value={refValue}
          onChange={(e) => setRefValue(e.target.value)}
          onKeyUp={handleKeyUp}
          className="bg-transparent border-none outline-none"
        />
      </div>
      {!user && (
        <div
          className="field flex focus-within:ring-main items-center gap-2 ring ring-neutral-700 transition-all p-2.5 rounded-lg shadow"
          title="Optional: GitHub token"
        >
          <span className="sr-only">Token</span>
          <input
            type="password"
            placeholder="token (optional)"
            value={tokenValue}
            onChange={(e) => setTokenValue(e.target.value)}
            onKeyUp={handleKeyUp}
            className="bg-transparent border-none outline-none"
          />
        </div>
      )}
      <button
        id="load"
        className="btn cursor-pointer bg-smoky active:scale-98 hover:bg-main hover:text-smoky transition-all text-black text-sm px-5 py-2.5 rounded-lg shadow font-semibold hover:border-blue-500"
        onClick={() => onLoad(repoPath, refValue, tokenValue)}
      >
        Load Tree
      </button>
    </div>
  );
};
