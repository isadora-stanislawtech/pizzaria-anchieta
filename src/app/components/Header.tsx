"use client"

import React from "react";
import Image from "next/image";
import { useUser } from "./UserContext";
import { LogOut } from "lucide-react";
import { NotificationBell } from "../cliente/components";
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, setUser } = useUser();
  const router = useRouter();

  return (
    <header className="bg-background text-primary p-4 flex items-center justify-between">
      <Image 
        src="/logo-blue.png" 
        alt="Logo Anchieta Pizzaria" 
        width={250} 
        height={250}
        className="m-10 cursor-pointer"
        onClick={() => window.location.href = '/'}
      />
      <nav>
        <ul className="flex gap-10 m-10 text-3xl items-center">
          {user ? (
            user.role === 'admin' ? (
              <>
                <li><a href="/admin" className="hover:text-[var(--details)]">Dashboard</a></li>
                <li><a href="/pedidos" className="hover:text-[var(--details)]">Pedidos</a></li>
                <li><a href="/clientes" className="hover:text-[var(--details)]">Clientes</a></li>
                <li className="relative">
                  <NotificationBell />
                </li>
                <li className="text-[var(--primary)]">Olá, {user.name}</li>
                <li>
                  <button className="bg-transparent text-[var(--primary)] hover:text-red-500" onClick={() => { setUser(null); router.push('/'); }}>
                    <LogOut size={28} />
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><a href="/cardapio" className="hover:text-[var(--details)]">Cardápio</a></li>
                <li><a href="/cliente/pedidos" className="hover:text-[var(--details)]">Pedidos</a></li>
                <li className="relative">
                  <NotificationBell />
                </li>
                <li className="text-[var(--primary)]">Olá, {user.name}</li>
                <li>
                  <button className="bg-transparent text-[var(--primary)] hover:text-red-500" onClick={() => { setUser(null); router.push('/'); }}>
                    <LogOut size={28} />
                  </button>
                </li>
              </>
            )
          ) : (
            <>
              <li><a href="/cardapio" className="hover:text-[var(--details)]">Cardápio</a></li>
              <li><a href="/contato" className="hover:text-[var(--details)]">Contato</a></li>
              <li><a href="/sobre-nos" className="hover:text-[var(--details)]">Sobre Nós</a></li>
              <li className="flex flex-col items-center">
                <button className="bg-[var(--primary)] text-[var(--background)] rounded-3xl px-8 hover:bg-[var(--details)] cursor-pointer" onClick={() => window.location.href = '/login'}>Entrar</button>
                <a href="/cadastro/cliente" className="text-sm mt-1 hover:underline">Cadastre-se</a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}