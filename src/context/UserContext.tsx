"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Notification {
  id: string;
  message: string;
  read: boolean;
}

interface UserContextType {
  user: User | null;
  favorites: string[];
  history: string[];
  notifications: Notification[];
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (name: string, email: string, password: string) => void;
  toggleFavorite: (appId: string) => void;
  addToHistory: (appId: string) => void;
  markNotificationRead: (id: string) => void;
  isFavorite: (appId: string) => boolean;
  refreshNotifications: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

async function registerMemberOnServer(email: string, name: string): Promise<void> {
  await fetch("/api/members/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  }).catch(() => undefined);
}

async function fetchNotificationsFromServer(email: string): Promise<Notification[]> {
  const res = await fetch(`/api/notifications?email=${encodeURIComponent(email)}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { notifications?: Notification[] };
  return Array.isArray(data.notifications) ? data.notifications : [];
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const persist = useCallback((u: User | null, f: string[], h: string[]) => {
    localStorage.setItem("moneyhub-user", JSON.stringify({ user: u, favorites: f, history: h }));
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (!user?.email) return;
    const serverNotifications = await fetchNotificationsFromServer(user.email);
    setNotifications(serverNotifications);
  }, [user?.email]);

  useEffect(() => {
    const stored = localStorage.getItem("moneyhub-user");
    if (stored) {
      const data = JSON.parse(stored) as {
        user?: User;
        favorites?: string[];
        history?: string[];
      };
      setUser(data.user ?? null);
      setFavorites(data.favorites || []);
      setHistory(data.history || []);
    }
  }, []);

  useEffect(() => {
    if (!user?.email) {
      setNotifications([]);
      return;
    }

    void registerMemberOnServer(user.email, user.name).then(() => refreshNotifications());

    const interval = window.setInterval(() => {
      void refreshNotifications();
    }, 60_000);

    const onFocus = () => {
      void refreshNotifications();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [user?.email, user?.name, refreshNotifications]);

  const login = (email: string, _password: string) => {
    const normalized = email.trim().toLowerCase();
    const u = { id: normalized, name: normalized.split("@")[0], email: normalized };
    setUser(u);
    persist(u, favorites, history);
  };

  const logout = () => {
    setUser(null);
    setNotifications([]);
    persist(null, favorites, history);
  };

  const register = (name: string, email: string, _password: string) => {
    const normalized = email.trim().toLowerCase();
    const u = { id: normalized, name: name.trim(), email: normalized };
    setUser(u);
    persist(u, favorites, history);
  };

  const toggleFavorite = (appId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId];
      persist(user, next, history);
      return next;
    });
  };

  const addToHistory = useCallback(
    (appId: string) => {
      setHistory((prev) => {
        if (prev[0] === appId) return prev;
        const next = [appId, ...prev.filter((id) => id !== appId)].slice(0, 20);
        persist(user, favorites, next);
        return next;
      });
    },
    [user, favorites, persist]
  );

  const markNotificationRead = (id: string) => {
    if (!user?.email) return;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    void fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, notificationId: id }),
    }).catch(() => undefined);
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
        refreshNotifications,
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
