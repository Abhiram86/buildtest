export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed z-10 h-full w-full backdrop-blur-md flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[calc(100vw-2rem)] rounded-xl ring ring-main flex items-center justify-center z-30 bg-zinc-900 h-[calc(100vh-24rem)]"
      >
        {children}
      </div>
    </div>
  );
}
