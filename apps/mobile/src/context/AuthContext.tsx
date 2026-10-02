import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { AuthUser } from "@sinity/shared";
import { api, loadToken, setToken } from "../lib/api";
import { registerPushToken, unregisterPushToken } from "../lib/push";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const token = await loadToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api.get<AuthUser>("/me");
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  // Login bo'lgach (yoki ilova ochilganda saqlangan sessiya tiklangach) qurilmani push uchun ro'yxatdan o'tkazamiz.
  useEffect(() => {
    if (user) registerPushToken();
  }, [user?.id]);

  async function login(email: string, password: string) {
    const data = await api.post<{ user: AuthUser; accessToken: string }>("/auth/login", {
      email,
      password,
    });
    await setToken(data.accessToken);
    setUser(data.user);
  }

  async function logout() {
    await unregisterPushToken();
    await setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth AuthProvider ichida ishlatilishi kerak");
  return ctx;
}
