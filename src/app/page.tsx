"use client"

import React from 'react';
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (raw) {
        const u = JSON.parse(raw);
        setUserName(u?.name || null);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-between mt-10">
      <div className="relative w-full flex flex-col items-center min-h-[600px]">
        <Image
          src="/hero.png"
          alt="Aquarela de uma cidade da Itália"
          fill
          className="object-cover w-full h-full z-0"
          style={{ objectPosition: "top" }}
        />
        <h1 className="text-5xl font-title text-[var(--details)] z-10">ONDE CADA FATIA CONTA</h1>
        <h1 className="text-9xl z-10">UMA HISTÓRIA</h1>
        {userName && (
          <div className="z-10 text-2xl mt-4 text-[var(--details)]">
       
          </div>
        )}
        <button className="absolute bottom-[35px] left-1/2 -translate-x-1/2 bg-[var(--details)] text-[var(--background)] rounded-3xl px-8 py-4 hover:bg-[var(--details)] cursor-pointer text-2xl font-semibold z-10">
          FAÇA SEU PEDIDO
        </button>
      </div>
    </main>
  )
}