"use client"

import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '@/app/components/UserContext';
import { useRouter } from 'next/navigation';
import type { User, Endereco } from '@/generated/prisma';

// Tipo do pedido retornado pela API
type PedidoItem = {
  id: string;
  tipoProduto: string;
  tamanho?: string | null;
  meioMeio?: boolean;
  sabores?: string[];
  bebida?: string | null;
  volumeMl?: number | null;
  quantidade: number;
};

type PedidoComCliente = {
  id: string;
  realizadoEm: Date | string;
  finalizadoEm?: Date | string | null;
  status?: string | null;
  tipoPedido: string;
  valorTotal: number;
  formaPagamento?: string;
  trocoPara?: number;
  cliente?: User;
  endereco?: Endereco;
  itens: PedidoItem[];
};

export default function PedidosAdminPage() {
  // Estado dos pedidos
  const { user, initializing } = useUser();
  const router = useRouter();
  const [pedidos, setPedidos] = useState<PedidoComCliente[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca pedidos ao carregar a página
  useEffect(() => {
    if (initializing) return; // Aguarda carregar contexto
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/login');
      return;
    }
    async function fetchPedidos() {
      const res = await fetch('/api/pedidos');
      const data = await res.json();
      setPedidos(data);
      setLoading(false);
    }
    fetchPedidos();
  }, [user, initializing, router]);

  // Atualiza status do pedido
  const atualizarStatus = async (id: string, status: string) => {
    await fetch(`/api/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    // Atualiza lista após mudança
    setLoading(true);
    const res = await fetch('/api/pedidos');
    const data = await res.json();
    setPedidos(data);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-10 font-sans">Carregando pedidos...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-[var(--primary)]">Pedidos</h1>
      <div className="grid gap-6 font-sans">
        {pedidos.length === 0 && <div className="text-center">Nenhum pedido encontrado.</div>}
  {pedidos.map((pedido: PedidoComCliente) => (
          <div key={pedido.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
            {/* Informações principais do pedido */}
            <div className="flex flex-wrap gap-8 items-center justify-between">
              <div>
                <span className="font-bold">Cliente:</span> {pedido.cliente?.name}
              </div>
              <div>
                <span className="font-bold">Status:</span> {pedido.status || 'Novo'}
              </div>
              <div>
                <span className="font-bold">Data:</span> {new Date(pedido.realizadoEm).toLocaleString('pt-BR')}
              </div>
              <div>
                <span className="font-bold">Valor:</span> <span className="font-sans">R$ {pedido.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            {/* Detalhes dos itens do pedido */}
            <div className="mt-2">
              <span className="font-bold">Itens:</span>
              <ul className="ml-4 list-disc">
                {pedido.itens.map((item) => (
                  <li key={item.id} className="mb-1">
                    {item.tipoProduto === 'pizza' ? (
                      <>
                        <span className="font-bold">Pizza</span> - <span className="font-bold">Tamanho:</span> {item.tamanho} <span className="font-bold">Sabores:</span> {item.sabores?.join(', ')} <span className="font-bold">Qtd:</span> {item.quantidade} {item.meioMeio && <span>(Meio a meio)</span>}
                      </>
                    ) : (
                      <>
                        <span className="font-bold">Bebida</span> - <span className="font-bold">Nome:</span> {item.bebida} <span className="font-bold">Volume:</span> {item.volumeMl ? `${item.volumeMl} ml` : ''} <span className="font-bold">Qtd:</span> {item.quantidade}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* Endereço para delivery */}
            {pedido.tipoPedido === 'delivery' && pedido.endereco && (
              <div className="mt-2">
                <span className="font-bold">Endereço:</span> {pedido.endereco.rua}, {pedido.endereco.numero} - {pedido.endereco.bairro} {pedido.endereco.complemento && `(${pedido.endereco.complemento})`}<br />
                <span className="font-bold">CEP:</span> {pedido.endereco.cep}
              </div>
            )}
            {/* Pagamento */}
            <div className="mt-2">
              <span className="font-bold">Pagamento:</span> {
                pedido.formaPagamento === 'cartao_debito' ? 'Cartão de Débito' :
                pedido.formaPagamento === 'cartao_credito' ? 'Cartão de Crédito' :
                pedido.formaPagamento === 'dinheiro' ? 'Dinheiro' : pedido.formaPagamento
              }
              {pedido.formaPagamento === 'dinheiro' && pedido.trocoPara && (
                <span> (Troco para <span className="font-sans">R$ {pedido.trocoPara.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>)</span>
              )}
            </div>
            {/* Botões de status */}
            <div className="mt-2 flex gap-4">
              {/* Fluxo de status: */}
              {/* 1. Sempre libera "Sendo feito" se status não for "sendo feito" ou maior */}
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50"
                disabled={!!(pedido.status && pedido.status !== 'novo' && pedido.status !== '' && pedido.status !== null && pedido.status !== undefined)}
                onClick={() => atualizarStatus(pedido.id, 'sendo feito')}
              >Sendo feito</button>

              {/* 2. Se status === 'sendo feito', libera próximo conforme tipoPedido */}
              {pedido.tipoPedido === 'retirada' && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50"
                  disabled={pedido.status !== 'sendo feito'}
                  onClick={() => atualizarStatus(pedido.id, 'pronto para retirada')}
                >Pronto para retirada</button>
              )}
              {pedido.tipoPedido === 'delivery' && (
                <button
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50"
                  disabled={pedido.status !== 'sendo feito'}
                  onClick={() => atualizarStatus(pedido.id, 'saiu para entrega')}
                >Saiu para entrega</button>
              )}

              {/* 3. Só libera "Entregue" se status for 'pronto para retirada' (retirada) ou 'saiu para entrega' (delivery) */}
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50"
                disabled={
                  (pedido.tipoPedido === 'retirada' && pedido.status !== 'pronto para retirada') ||
                  (pedido.tipoPedido === 'delivery' && pedido.status !== 'saiu para entrega')
                }
                onClick={() => atualizarStatus(pedido.id, 'entregue')}
              >Entregue</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
