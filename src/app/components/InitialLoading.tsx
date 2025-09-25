"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function InitialLoading({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-[var(--background)]/80 backdrop-blur z-50">
        <div className="w-40 md:w-56">
          <Image src="/logo.gif" alt="Carregando..." className="w-full" width={224} height={224} unoptimized />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}