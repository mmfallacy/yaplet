import { useState, useEffect, createContext, useContext } from "react";
import { User } from "@/types/post";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

// Stub implementation - to be replaced with actual auth in Next.js
export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user (stub)
    const storedUser = localStorage.getItem("journal_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async () => {
    // Stub: In Next.js, this would redirect to GitHub OAuth
    // For now, simulate a login
    const mockUser: User = {
      id: "user-1",
      name: "Demo User",
      githubUsername: "demouser",
      avatar: undefined,
    };
    setUser(mockUser);
    localStorage.setItem("journal_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("journal_user");
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
}
