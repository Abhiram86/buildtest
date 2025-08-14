import { createContext, useContext, useEffect, useState } from "react";

interface User {
  githubId: string;
  githubUsername: string;
  email: string;
  githubAvatarUrl: string;
  createdAt: Date;
}

type UserContext = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const userContext = createContext<UserContext>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const getUser = async () => {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/auth/user`, {
        method: "GET",
        credentials: "include",
      });
      if (!resp.ok) return;
      const user = await resp.json();
      setUser(user);
    };
    getUser();
  }, []);
  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
}

export const useUser = () => useContext(userContext);
