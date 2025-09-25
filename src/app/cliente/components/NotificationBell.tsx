"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useUser } from "@/app/components/UserContext";

export type NotificationItem = {
  id: string;
  userId?: string;
  title?: string;
  message: string;
  createdAt?: string;
  read?: boolean;
};

export default function NotificationBell() {
  const { user } = useUser();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState<NotificationItem[]>([]);

  // Fetch notifications only when dropdown is opened
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    async function fetchNotifs() {
      try {
        const userId = user?.id || '';
        const res = await fetch(`/api/notifications?userId=${userId}`);
        const data = await res.json();
        if (mounted) setNotifs(data || []);
      } catch {
        // ignore
      }
    }
    if (showNotifs) {
      fetchNotifs();
    }
    return () => { mounted = false; };
  }, [user, showNotifs]);

  const marcarComoLida = async (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' }).catch(() => {});
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifs(s => !s)}
        className="relative bg-transparent text-[var(--primary)] hover:text-[var(--details)]"
        aria-label="Notificações"
      >
        <Bell size={28} />
        {notifs.filter(n => !n.read).length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs font-sans">
            {notifs.filter(n => !n.read).length}
          </span>
        )}
      </button>
      {showNotifs && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow rounded z-50 p-2 font-sans">
          {notifs.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-600">Nenhuma notificação</div>
          ) : (
            <>
              {notifs.filter(n => !n.read).length > 0 && (
                <>
                  <div className="text-xs text-gray-500 mb-1">Novas notificações</div>
                  {notifs.filter(n => !n.read).slice(0,6).map(n => (
                    <div key={n.id} className="border-b last:border-b-0 p-2 cursor-pointer hover:bg-gray-100" onClick={() => marcarComoLida(n.id)}>
                      <div className="font-semibold text-base">{n.title}</div>
                      <div className="text-xs text-gray-600">{n.message}</div>
                    </div>
                  ))}
                </>
              )}
              {notifs.filter(n => n.read).length > 0 && (
                <>
                  <div className="text-xs text-gray-400 mt-2 mb-1">Histórico</div>
                  {notifs.filter(n => n.read).slice(0,6).map(n => (
                    <div key={n.id} className="border-b last:border-b-0 p-2 bg-gray-50 text-gray-400">
                      <div className="font-semibold text-base">{n.title}</div>
                      <div className="text-xs text-gray-600">{n.message}</div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
