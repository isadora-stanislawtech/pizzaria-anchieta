"use client"

import React from 'react';
import { useState } from 'react';
import { useUser } from './UserContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const { setUser } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password }),
      });
      const data = await res.json();
      if (data.sucesso) {
        try {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch {}
        try {
          const pending = typeof window !== 'undefined' ? localStorage.getItem('pendingCartItem') : null;
          if (pending) {
            const pendingItem = JSON.parse(pending);
            const storedCart = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
            let cart = storedCart ? JSON.parse(storedCart) : [];
            type SimpleItem = { id: string; tamanho?: string; quantidade: number } & Record<string, unknown>;
            const c = cart as SimpleItem[];
            const exists = c.find(p => p.id === pendingItem.id && p.tamanho === pendingItem.tamanho);
            if (exists) {
              cart = c.map(p => p.id === pendingItem.id && p.tamanho === pendingItem.tamanho ? { ...p, quantidade: p.quantidade + pendingItem.quantidade } : p);
            } else {
              cart = [...c, pendingItem];
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.removeItem('pendingCartItem');
            router.push('/carrinho');
            return;
          }
        } catch {
        }
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/cliente');
        }
      } else {
        setError(data.erro || 'Usuário ou senha inválidos');
      }
    } catch {
      setError('Erro ao tentar logar. Tente novamente.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">Email</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          name="email"
          type="email"
          required
    className="w-full border border-gray-300 rounded-md px-3 py-2 font-sans"
        />
      </div>

      <div>
        <label className="block text-sm">Senha</label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          name="password"
          type="password"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 font-sans"
        />
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <button
        type="submit"
        className="bg-[var(--primary)] text-white rounded-lg py-2 font-bold text-lg hover:bg-[var(--details)] transition w-full disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="text-sm">
        Não tem conta? <a href="/cadastro/cliente" className="font-medium">Cadastre-se aqui</a>
      </p>
    </form>
  );
}
