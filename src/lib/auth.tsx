import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Frontend-only DEMO authentication. Not production security: anyone with browser
 * access can bypass it. Session is a flag in localStorage.
 */
const SESSION_KEY = "aryans-admin-session";

interface Session {
  email: string;
  loggedInAt: string;
}

interface AuthValue {
  ready: boolean;
  session: Session | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) setSession(JSON.parse(raw) as Session);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const login = useCallback((email: string) => {
    const s = { email, loggedInAt: new Date().toISOString() };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  return <AuthContext.Provider value={{ ready, session, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
