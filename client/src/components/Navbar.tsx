import { useState } from "react";
import Modal from "./Modal";
import AuthModalContent from "./AuthModalContent";
import { useUser } from "@/context/User";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useUser();
  const handleLogout = async () => {
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
    if (resp.ok) setUser(null);
  };
  return (
    <>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <AuthModalContent />
        </Modal>
      )}
      <nav className="bg-transparent backdrop-blur-md top-0 sticky z-50 text-white py-4 px-10">
        <div className="flex justify-between mx-auto items-center">
          <div className="flex items-center gap-1">
            <img src="/logo.svg" alt="logo" className="w-8 h-8" />
            <p className="text-xl font-bold text-smoky tracking-wide">
              BuildTest
            </p>
          </div>
          <div className="text-smoky text-sm font-medium">
            {user ? (
              <div className="flex items-center gap-2">
                <a
                  href={`https://github.com/${user.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={user.githubAvatarUrl}
                    className="w-9 h-9 rounded-full"
                    alt="github avatar"
                  />
                </a>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer bg-zinc-900 transition-colors hover:text-black hover:bg-smoky px-5 py-2.5 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="cursor-pointer hover:bg-main px-5 py-2.5 bg-smoky text-black rounded-lg hover:text-smoky transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
