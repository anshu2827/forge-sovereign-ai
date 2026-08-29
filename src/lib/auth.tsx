import React, { createContext, useContext, useEffect, useState } from "react";

export interface UserSession {
  email: string;
  name: string;
  organization: string;
  authenticatedAt: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const STORAGE_KEY = "forge_auth_session";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserSession;
        setUser(parsed);
      }
    } catch (err) {
      console.error("Failed to parse auth session", err);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate brief authentication network delay
    await new Promise((resolve) => setTimeout(resolve, 650));

    const domain = email.includes("@") ? email.split("@")[1] : "organization.gov";
    const orgName = domain?.split(".")[0]?.toUpperCase() || "ENTERPRISE";

    const session: UserSession = {
      email,
      name: email.split("@")[0] || "Authorized User",
      organization: `${orgName} Sovereign Unit`,
      authenticatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
