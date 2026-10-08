"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LockKeyhole, LogIn, ShoppingCart } from "lucide-react";

const MASTER_EMAIL = "master@liverpoll.com";
const MASTER_PASSWORD = "Liverpoll@2026";
const AUTH_KEY = "liverpoll-auth";

function hasStoredSession() {
  const cookieSession = document.cookie.split("; ").some(cookie => cookie === `${AUTH_KEY}=master`);
  return window.localStorage.getItem(AUTH_KEY) === "master" || cookieSession;
}

type AuthContextValue = { logout: () => void };
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthGate");
  return context;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthenticated(hasStoredSession());
    setReady(true);
  }, []);

  function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim().toLowerCase() === MASTER_EMAIL && password.trim() === MASTER_PASSWORD) {
      setAuthenticated(true);
      window.localStorage.setItem(AUTH_KEY, "master");
      document.cookie = `${AUTH_KEY}=master; path=/; max-age=2592000; SameSite=Lax`;
      setError("");
      return;
    }
    setError("E-mail ou senha incorretos. Use o usuário master de demonstração.");
  }

  if (!ready) return <main className="flex min-h-screen items-center justify-center bg-[#f4f8f3] text-sm text-[#526157]">Carregando...</main>;
  if (!authenticated) return <main className="flex min-h-screen items-center justify-center bg-[#f4f8f3] p-5"><div className="w-full max-w-md rounded-3xl border border-[#e1eae2] bg-white p-7 shadow-xl sm:p-9"><div className="mb-8 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c9f36b] text-[#173c2c]"><ShoppingCart size={22} /></div><div><h1 className="text-xl font-extrabold text-[#173c2c]">Mercado Liverpoll.</h1><p className="text-xs text-[#849087]">Painel de gestão</p></div></div><div className="mb-6"><h2 className="text-2xl font-extrabold text-[#173c2c]">Acesse sua conta</h2><p className="mt-2 text-sm text-[#849087]">Entre para gerenciar sua operação.</p></div><form onSubmit={login} className="space-y-4"><label className="block text-sm font-semibold text-[#526157]">E-mail<input type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="seu@email.com" className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-4 py-3 font-normal outline-none focus:border-[#16865b]" /></label><label className="block text-sm font-semibold text-[#526157]">Senha<input type="password" required value={password} onChange={event => setPassword(event.target.value)} placeholder="Digite sua senha" className="mt-2 w-full rounded-xl border border-[#dfe7e1] px-4 py-3 font-normal outline-none focus:border-[#16865b]" /></label>{error && <p role="alert" className="rounded-xl bg-[#fff1ee] p-3 text-xs font-medium text-[#c55243]">{error}</p>}<button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173c2c] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#24533e]"><LogIn size={17} /> Entrar</button></form><div className="mt-6 rounded-xl bg-[#f4f9ef] p-4 text-xs text-[#526157]"><div className="mb-1 flex items-center gap-2 font-bold text-[#173c2c]"><LockKeyhole size={14} /> Acesso de demonstração</div><p>E-mail: <strong>{MASTER_EMAIL}</strong></p><p>Senha: <strong>{MASTER_PASSWORD}</strong></p><button type="button" onClick={() => { setEmail(MASTER_EMAIL); setPassword(MASTER_PASSWORD); setError(""); }} className="mt-3 font-bold text-[#16865b]">Preencher acesso demo</button></div></div></main>;

  return <AuthContext.Provider value={{ logout: () => { setAuthenticated(false); window.localStorage.removeItem(AUTH_KEY); document.cookie = `${AUTH_KEY}=; path=/; max-age=0; SameSite=Lax`; } }}>{children}</AuthContext.Provider>;
}
