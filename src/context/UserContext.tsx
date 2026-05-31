"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  favorites: string[];
  history: string[];
  notifications: { id: string; message: string; read: boolean }[];
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (name: string, email: string, password: string) => void;
  toggleFavorite: (appId: string) => void;
  addToHistory: (appId: string) => void;
  markNotificationRead: (id: string) => void;
  isFavorite: (appId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<
    { id: string; message: string; read: boolean }[]
  >([]);

  useEffect(() => {
    const stored = localStorage.getItem("moneyhub-user");
    if (stored) {
      const data = JSON.parse(stored);
      setUser(data.user);
      setFavorites(data.favorites || []);
      setHistory(data.history || []);
      setNotifications(data.notifications || []);
    }
  }, []);

  const persist = useCallback(
    (u: User | null, f: string[], h: string[], n: typeof notifications) => {
      localStorage.setItem(
        "moneyhub-user",
        JSON.stringify({ user: u, favorites: f, history: h, notifications: n })
      );
    },
    []
  );

  const login = (email: string, _password: string) => {
    const u = { id: "1", name: email.split("@")[0], email };
    setUser(u);
    persist(u, favorites, history, notifications);
  };

  const logout = () => {
    setUser(null);
    persist(null, favorites, history, notifications);
  };

  const register = (name: string, email: string, _password: string) => {
    const u = { id: "1", name, email };
    setUser(u);
    setNotifications([
      {
        id: "welcome",
        message: "Bienvenue sur Money's House ! Découvrez nos applications.",
        read: false,
      },
    ]);
    persist(u, favorites, history, [
      {
        id: "welcome",
        message: "Bienvenue sur Money's House ! Découvrez nos applications.",
        read: false,
      },
    ]);
  };

  const toggleFavorite = (appId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId];
      persist(user, next, history, notifications);
      return next;
    });
  };

  const addToHistory = useCallback((appId: string) => {
    setHistory((prev) => {
      if (prev[0] === appId) return prev;
      const next = [appId, ...prev.filter((id) => id !== appId)].slice(0, 20);
      persist(user, favorites, next, notifications);
      return next;
    });
  }, [user, favorites, notifications, persist]);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      persist(user, favorites, history, next);
      return next;
    });
  };

  const isFavorite = (appId: string) => favorites.includes(appId);

  return (
    <UserContext.Provider
      value={{
        user,
        favorites,
        history,
        notifications,
        login,
        logout,
        register,
        toggleFavorite,
        addToHistory,
        markNotificationRead,
        isFavorite,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
