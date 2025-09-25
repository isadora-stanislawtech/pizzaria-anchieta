"use client"

import React from 'react';
import Image from 'next/image'
import { useUser } from '@/app/components/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { NotificationBell } from './components';

export default function ClienteRoot() {
  const { user } = useUser();
  const router = useRouter();

  // if not logged in, send to login
  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  return (
    <main className="flex flex-col items-center justify-between mt-10">
      <div className="relative w-full flex flex-col items-center min-h-[600px]">
        <div className="absolute top-6 right-10 z-20">
          <NotificationBell />
        </div>
        <Image
          src="/hero.png"
          alt="Aquarela de uma cidade da Itália"
          fill
          className="object-cover w-full h-full z-0"
          style={{ objectPosition: "top" }}
        />
        <h1 className="text-5xl font-title text-[var(--details)] z-10">ONDE CADA FATIA CONTA</h1>
        <h1 className="text-9xl z-10">UMA HISTÓRIA</h1>

        <button onClick={() => router.push('/cardapio')} className="absolute bottom-[35px] left-1/2 -translate-x-1/2 bg-[var(--details)] text-[var(--background)] rounded-3xl px-8 py-4 hover:bg-[var(--details)] cursor-pointer text-2xl font-semibold z-10">
          FAÇA SEU PEDIDO
        </button>
      </div>
    </main>
  );
}
