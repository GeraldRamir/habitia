"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/lib/types";
import {
  getCurrentUser,
  initializeStorage,
  setCurrentUser as saveCurrentUser,
  getTheme,
  setTheme as saveTheme,
} from "@/lib/storage";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface AppContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
  ready: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeStorage();
    setUserState(getCurrentUser());
    const storedTheme = getTheme();
    setThemeState(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
    setReady(true);
  }, []);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    saveCurrentUser(u);
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
    saveCurrentUser(null);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      saveTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  const addToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        logout,
        theme,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        ready,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
