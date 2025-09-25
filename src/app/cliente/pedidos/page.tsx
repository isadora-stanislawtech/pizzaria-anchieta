"use client"

import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/components/UserContext';
import { useRouter } from 'next/navigation';

type PedidoItem = {
  id: string;
  tipoProduto: string;
  tamanho?: string | null;
  meioMeio?: boolean | null;
  sabores?: string[];
  bebida?: string | null;
  volumeMl?: number | null;
  quantidade: number;
};

type PedidoCliente = {
  id: string;
  clienteId?: string;
  valorTotal: number;
  status?: string | null;
  finalizadoEm?: string | null;
  itens: PedidoItem[];
};

type PublicUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
};

export default function ClientePedidosPage() {
  const { user, initializing, setUser } = useUser();
  const router = useRouter();
  const [pedidos, setPedidos] = useState<PedidoCliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initializing) return;

    if (!user) {
      try {
        const cached = localStorage.getItem("user");
        if (cached) {
          const cachedUser = JSON.parse(cached) as PublicUser;
          setUser(cachedUser);
          // Não redireciona, deixa o efeito rodar novamente com user populado
          return;
        } else {
          router.replace("/login?from=/pedidos");
          return;
        }
      } catch {
        router.replace("/login?from=/pedidos");
        return;
      }
    }

    (async () => {
      try {
        const res = await fetch("/api/pedidos", { cache: "no-store" });
        const data = await res.json();
        const currentUser = user as PublicUser;
        const meus: PedidoCliente[] = Array.isArray(data)
          ? (data as PedidoCliente[])
              .filter((p) => p.clienteId === currentUser.id)
              .map((p) => ({
                id: String(p.id ?? ""),
                clienteId: p.clienteId,
                valorTotal: Number(p.valorTotal ?? 0),
                status: p.status ?? null,
                finalizadoEm: p.finalizadoEm ?? null,
                itens: Array.isArray(p.itens) ? p.itens : [],
              }))
          : [];
        setPedidos(meus);
      } finally {
        setLoading(false);
      }
    })();
  }, [initializing, user, router, setUser]);

  const confirmar = async (id: string) => {
    await fetch(`/api/pedidos/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'entregue', finalizadoEm: new Date().toISOString() }) });
    setPedidos(prev => prev.map((x) => x.id === id ? { ...x, status: 'entregue', finalizadoEm: new Date().toISOString() } : x));
  };

  if (loading) return <div className="p-6 font-sans">Carregando...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Meus Pedidos</h1>
      {pedidos.length === 0 && <div className="font-sans">Nenhum pedido encontrado.</div>}
      <div className="space-y-4 font-sans">
        {pedidos.map(p => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold">Pedido: {p.id}</div>
                <div>Valor: R$ {p.valorTotal.toFixed(2)}</div>
                <div>Status: {p.status || 'Novo'}</div>
              </div>
              <div>
                {p.status !== 'entregue' && <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={() => confirmar(p.id)}>Confirmar recebimento</button>}
              </div>
            </div>
            {/* Itens do pedido */}
            <div className="mt-4">
              <div className="font-semibold mb-1">Itens:</div>
              <ul className="list-disc ml-6">
                {p.itens.length === 0 && <li className="text-gray-500 text-sm">Nenhum item encontrado.</li>}
                {p.itens.map((item, idx) => (
                  <li key={item.id || idx} className="mb-2">
                    {item.tipoProduto === 'pizza' ? (
                      <>
                        <span className="font-bold">Pizza</span>
                        {item.tamanho && <span> - Tamanho: {item.tamanho}</span>}
                        {item.meioMeio && <span> - Meio a meio</span>}
                        {item.sabores && item.sabores.length > 0 && (
                          <span> - Sabores: {item.sabores.join(', ')}</span>
                        )}
                        {item.quantidade > 1 && <span> - Qtd: {item.quantidade}</span>}
                      </>
                    ) : item.tipoProduto === 'bebida' ? (
                      <>
                        <span className="font-bold">Bebida</span>
                        {item.bebida && <span> - {item.bebida}</span>}
                        {item.volumeMl && <span> - {item.volumeMl}ml</span>}
                        {item.quantidade > 1 && <span> - Qtd: {item.quantidade}</span>}
                      </>
                    ) : (
                      <span>{item.tipoProduto} - Qtd: {item.quantidade}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
