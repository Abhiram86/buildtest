export default function AuthModalContent() {
  return (
    <div className="text-smoky space-y-2">
      <p>Continue with</p>
      <button
        id="load"
        onClick={() =>
          (window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`)
        }
        className="cursor-pointer flex gap-2 items-center bg-smoky hover:bg-zinc-900 hover:text-smoky transition-colors text-black text-sm px-5 py-2.5 rounded-lg shadow font-semibold hover:border-blue-500"
      >
        <img src="/github.svg" alt="GitHub Logo" className="w-6" />
        <p>GitHub</p>
      </button>
    </div>
  );
}
