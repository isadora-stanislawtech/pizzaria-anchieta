
"use client";
import React from 'react';
import { useUser } from '@/app/components/UserContext';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    pizzasVendidas: 0,
    clientesAtivos: 0,
    saborMaisPedido: '',
    valorFaturado: 0,
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      window.location.href = '/login';
    }
  }, [user]);

  // Busca dados reais do backend
  useEffect(() => {
    async function fetchStats() {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-[var(--primary)]">Dashboard do Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Indicadores principais */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-lg text-gray-500 mb-2">Pizzas vendidas</span>
          <span className="text-3xl font-bold text-[var(--primary)] font-sans">{stats.pizzasVendidas}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-lg text-gray-500 mb-2">Clientes ativos</span>
          <span className="text-3xl font-bold text-[var(--primary)] font-sans">{stats.clientesAtivos}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-lg text-gray-500 mb-2">Sabor mais pedido</span>
          <span className="text-3xl font-bold text-[var(--primary)] font-sans">{stats.saborMaisPedido || '-'}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-lg text-gray-500 mb-2">Valor faturado</span>
          <span className="text-3xl font-bold text-[var(--primary)] font-sans">R$ {stats.valorFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
      {/* Filtro de data global */}
      <div className="mb-8 flex gap-4 items-center">
        <label htmlFor="data-inicio" className="text-lg">De:</label>
        <input type="date" id="data-inicio" className="border rounded px-2 py-1" />
        <label htmlFor="data-fim" className="text-lg">Até:</label>
        <input type="date" id="data-fim" className="border rounded px-2 py-1" />
        <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg font-bold">Filtrar</button>
        <a href="/admin/produtos" className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Gerenciar Produtos</a>
      </div>
      {/* Outros indicadores podem ser adicionados aqui */}
      <div className="bg-white rounded-xl shadow p-6 mt-4">
        <h2 className="text-xl font-bold mb-2">Outros Indicadores</h2>
        <ul className="list-disc ml-6 text-lg text-gray-700">
          <li>Ticket médio</li>
          <li>Pedidos em aberto</li>
          <li>Clientes novos no período</li>
        </ul>
      </div>
    </div>
  );
}
