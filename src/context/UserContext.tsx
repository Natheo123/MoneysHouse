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
  updateName: (name: string) => Promise<{ ok: boolean; error?: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

async function registerMemberOnServer(email: string, name: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/members/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    return { ok: data.ok === true, error: data.error };
  } catch {
    return { ok: false, error: "Erreur réseau." };
  }
}

async function fetchMemberProfileFromServer(email: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/members/profile?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { profile?: { name?: string } | null };
    const name = data.profile?.name?.trim();
    return name || null;
  } catch {
    return null;
  }
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

      const storedUser = data.user;
      if (storedUser?.email) {
        void fetchMemberProfileFromServer(storedUser.email).then((serverName) => {
          if (!serverName || serverName === storedUser.name) return;
          setUser((current) => {
            if (!current || current.email !== storedUser.email) return current;
            const updated = { ...current, name: serverName };
            persist(updated, data.favorites || [], data.history || []);
            return updated;
          });
        });
      }
    }
  }, [persist]);

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

    void fetchMemberProfileFromServer(normalized).then((serverName) => {
      if (!serverName) return;
      setUser((current) => {
        if (!current || current.email !== normalized) return current;
        const updated = { ...current, name: serverName };
        persist(updated, favorites, history);
        return updated;
      });
    });
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

  const updateName = useCallback(
    async (name: string): Promise<{ ok: boolean; error?: string }> => {
      const trimmed = name.trim();
      if (!user?.email) return { ok: false, error: "Non connecté." };
      if (!trimmed) return { ok: false, error: "Le prénom est obligatoire." };

      const updated = { ...user, name: trimmed };
      setUser(updated);
      persist(updated, favorites, history);

      const result = await registerMemberOnServer(user.email, trimmed);
      if (!result.ok) {
        return { ok: false, error: result.error ?? "Impossible de mettre à jour le profil." };
      }
      return { ok: true };
    },
    [user, favorites, history, persist]
  );

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
        updateName,
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
