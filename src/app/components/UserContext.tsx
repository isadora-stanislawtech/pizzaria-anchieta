
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type PublicUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
};

type Ctx = {
  user: PublicUser | null;
  setUser: (u: PublicUser | null) => void;
  initializing: boolean;
  hydrateFromStorage: () => void;
};

const UserContext = createContext<Ctx | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  const hydrateFromStorage = () => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  };

  useEffect(() => {
    hydrateFromStorage();
    setInitializing(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, initializing, hydrateFromStorage }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("Erro: useUser deve ser usado dentro de um UserProvider");
  return ctx;
}
