"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';

export type CartItem = {
  id: string;
  titulo: string;
  preco: number;
  quantidade: number;
  imagem?: string;
  tamanho?: string;
  descricao?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, quantidade: number) => void;
  clear: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const exists = prev.find(p => p.id === item.id && p.tamanho === item.tamanho);
      if (exists) {
        return prev.map(p => p.id === item.id && p.tamanho === item.tamanho ? { ...p, quantidade: p.quantidade + item.quantidade } : p);
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(p => p.id !== id));
  const updateQty = (id: string, quantidade: number) => setItems(prev => prev.map(p => p.id === id ? { ...p, quantidade } : p));
  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.preco * i.quantidade, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error('Erro: useCart deve ser usado dentro de um CartProvider');
  return c;
}
