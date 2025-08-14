import { useEffect, useRef, useState } from "react";
import type { Repo } from "./Controls";

export default function SelectMenu({
  data,
  onSelect,
}: {
  data: Repo[];
  onSelect: (name: string, enter?: boolean) => void;
}) {
  const [highlighted, setHighlighted] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((prev) => (prev + 1) % data.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((prev) => (prev - 1 + data.length) % data.length);
      } else if (e.key === "Enter") {
        onSelect(data[highlighted].name, true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [highlighted, data, onSelect]);

  useEffect(() => {
    if (itemRefs.current?.[highlighted]) {
      itemRefs.current[highlighted].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlighted]);
  return (
    <div className="absolute top-12 list-none max-h-64 min-w-72 overflow-y-scroll p-2 space-y-1 bg-zinc-900">
      {data.map((repo, index) => (
        <li
          ref={(el) => {
            itemRefs.current = [...itemRefs.current];
            itemRefs.current[index] = el;
          }}
          onClick={() => onSelect(repo.name)}
          key={repo.id}
          className={`line-clamp-1 px-2 py-1 rounded-md cursor-pointer hover:bg-zinc-700 ${
            index === highlighted && "bg-zinc-700"
          }`}
          value={repo.name}
        >
          {repo.name}
        </li>
      ))}
    </div>
  );
}