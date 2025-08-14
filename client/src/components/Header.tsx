import { Controls } from "./Controls";

interface HeaderProps {
  title: string;
  notice: string;
  controlsProps: any;
  onLoad: (repopath: string, ref: string, token: string) => void;
}

export const Header = ({
  title,
  notice,
  controlsProps,
  onLoad,
}: HeaderProps) => {
  return (
    <header className="mb-6 text-smoky">
      <div className="title text-2xl md:text-3xl text-main text-balance tracking-wide font-bold mb-4">
        {title}
      </div>
      <div className="notice font-medium tracking-wide text-balance border-stone-300 dark:border-stone-600 rounded-lg mb-3">
        {notice}
      </div>
      <Controls {...controlsProps} onLoad={onLoad} />
      <div id="status" className="status mt-3">
        No repository loaded.
      </div>
    </header>
  );
};
