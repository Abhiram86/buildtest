import { useState } from "react";

const iconType = (type: string, open: boolean) => {
  if (type === "tree")
    return <span className="icon folder">{open ? "📂" : "📁"}</span>;
  if (type === "symlink") return <span className="icon symlink">🔗</span>;
  return <span className="icon file">📄</span>;
};

const caretComponent = (open: boolean) => {
  return (
    <span className="caret" aria-hidden="true">
      {open ? "▾" : "▸"}
    </span>
  );
};

const bytes = (n: number) => {
  if (n == null) return "";
  const u = ["B", "KB", "MB", "GB", "TB"];
  let i = 0,
    x = n;
  while (x >= 1024 && i < u.length - 1) {
    x /= 1024;
    i++;
  }
  return `${x.toFixed(x < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
};

interface NodeProps {
  node: any;
  owner: string;
  repo: string;
  selectedFiles: Set<string>;
  defaultBranch: string;
  onSelect: (path: string) => void;
}

export const Node = ({
  node,
  owner,
  repo,
  defaultBranch,
  selectedFiles,
  onSelect,
}: NodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren =
    node.type === "tree" && node.children && node.children.size > 0;

  const toggle = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div>
      <div
        className="node flex items-center hover:bg-neutral-800 py-0.5 px-1.5 rounded cursor-default"
        role="treeitem"
        aria-expanded={hasChildren ? isOpen : true}
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
          if (e.key === "ArrowRight") {
            if (!isOpen) toggle();
          }
          if (e.key === "ArrowLeft") {
            if (isOpen) toggle();
          }
        }}
      >
        <div
          onClick={() => node.type === "blob" && onSelect(node.path)}
          className={`label flex items-center gap-0.5 rounded-md flex-1 min-w-0 ${selectedFiles.has(node.path) ? "bg-blue-800 hover:bg-blue-700" : ""}`}
        >
          <span>
            {hasChildren ? (
              caretComponent(isOpen)
            ) : (
              <span className="caret"></span>
            )}
          </span>
          <span>{iconType(node.type, isOpen)}</span>
          <span className="name truncate text-smoky">
            {node.name === "/" ? `${repo} @ ${defaultBranch}` : node.name}
          </span>
        </div>
        <div className="links flex gap-2.5 items-center text-xs">
          {node.type !== "tree" && node.size != null && (
            <span className="size text-smoky">{bytes(node.size)}</span>
          )}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-main ml-2 hover:underline"
            href={
              node.type === "tree"
                ? `https://github.com/${owner}/${repo}/tree/${encodeURIComponent(defaultBranch)}/${node.path}`
                : `https://github.com/${owner}/${repo}/blob/${encodeURIComponent(defaultBranch)}/${node.path}`
            }
          >
            GitHub
          </a>
          {node.type !== "tree" && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-main hover:underline"
              href={`https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(defaultBranch)}/${node.path}`}
            >
              Raw
            </a>
          )}
        </div>
      </div>
      {hasChildren && (
        <div
          className={`list ml-5 pl-2.5 border-l border-dashed border-gray-400 ${isOpen ? "" : "hidden"}`}
          role="group"
        >
          {Array.from(node.children.values())
            .sort((a: any, b: any) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === "tree" ? -1 : 1;
            })
            .map((child, index) => (
              <Node
                key={index}
                node={child}
                owner={owner}
                repo={repo}
                selectedFiles={selectedFiles}
                onSelect={onSelect}
                defaultBranch={defaultBranch}
              />
            ))}
        </div>
      )}
    </div>
  );
};
