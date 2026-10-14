import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSession, isDemoMode, onAuthStateChange } from "./lib/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getSession()
      .then((currentSession) => {
        if (active) setSession(currentSession);
      })
      .catch((sessionError) => {
        if (active) setError(sessionError.message || "Impossible de vérifier la session.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const unsubscribe = onAuthStateChange((nextSession) => {
      setSession(nextSession);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({ session, setSession, loading, error, isDemoMode }),
    [session, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider.");
  return context;
}

export function RequireAuth({ children }) {
  const { session, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    return <main className="route-loading" aria-live="polite">Vérification de votre session…</main>;
  }

  if (error) {
    return <main className="route-loading route-error" role="alert">{error}</main>;
  }

  if (!session) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/connexion?next=${encodeURIComponent(next)}`} replace />;
  }

  return children;
}
