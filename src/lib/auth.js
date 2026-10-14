import { createClient } from "@supabase/supabase-js";

const DEMO_SESSION_KEY = "sama-boutique-demo-session";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isDemoMode =
  import.meta.env.VITE_DEMO_MODE === "true" || !supabaseUrl || !supabaseAnonKey;

export const supabase = isDemoMode
  ? null
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });

function readDemoSession() {
  const stored = window.localStorage.getItem(DEMO_SESSION_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch (error) {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
    throw new Error("La session de démonstration est illisible. Reconnectez-vous.");
  }
}

function saveDemoSession(user) {
  const session = {
    access_token: "sama-demo-session",
    user: {
      id: user.id ?? "demo-user",
      email: user.email ?? null,
      phone: user.phone ?? null,
      user_metadata: user.user_metadata ?? {},
    },
  };
  window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function getSession() {
  if (isDemoMode) return readDemoSession();

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(callback) {
  if (isDemoMode) return () => {};

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}

export async function signInWithGoogle(redirectTo = `${window.location.origin}/connexion`) {
  if (isDemoMode) return saveDemoSession({ email: "demo@sama-boutique.sn" });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) throw error;
  return data;
}

export async function signInWithPhone(phone) {
  if (isDemoMode) return { demo: true, phone };

  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
    options: { shouldCreateUser: true },
  });
  if (error) throw error;
  return data;
}

export async function verifyPhoneOtp(phone, token) {
  if (isDemoMode) {
    if (token !== "123456") {
      throw new Error("Code incorrect. En mode démo, utilisez le code 123456.");
    }
    return saveDemoSession({ phone });
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  if (error) throw error;
  return data.session;
}

export async function signInWithPassword(email, password) {
  if (isDemoMode) {
    if (!email.trim() || !password) throw new Error("Saisissez votre e-mail et votre mot de passe.");
    return saveDemoSession({ email: email.trim().toLowerCase() });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signUpWithPassword(email, password) {
  if (isDemoMode) {
    if (password.length < 6) throw new Error("Choisissez un mot de passe d’au moins 6 caractères.");
    return saveDemoSession({ email: email.trim().toLowerCase() });
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (isDemoMode) {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
