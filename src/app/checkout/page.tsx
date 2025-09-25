"use client"

import React, { useState } from 'react';
import { useCart } from '@/app/components/CartContext';
import { useUser } from '@/app/components/UserContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');
  const [tipoPedido, setTipoPedido] = useState('retirada');
  const [enderecoId, setEnderecoId] = useState('');
  const [endereco, setEndereco] = useState({ rua: '', bairro: '', numero: '', complemento: '', cep: '' });
  const [trocoPara, setTrocoPara] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [pedidoRealizado, setPedidoRealizado] = useState<{ numero: string } | null>(null);

  const handleSubmit = async () => {
    if (!user) {
      alert('Você precisa estar logado para finalizar o pedido.');
      return;
    }
    setLoading(true);
    // Validate delivery address on client-side before sending
    if (tipoPedido === 'delivery' && !enderecoId) {
      if (!endereco.rua || !endereco.bairro || !endereco.numero || !endereco.cep) {
        alert('Preencha o endereço de delivery corretamente.');
        setLoading(false);
        return;
      }
    }

    // Monta payload com múltiplos itens
    // Corrigir tipoProduto: buscar categoria do produto original
    // Buscar produtos do cardápio para mapear id -> categoria
    let produtosMap: Record<string, string> = {};
    try {
      const res = await fetch('/api/produtos');
      if (res.ok) {
        const prods = await res.json();
  type ProdutoApi = { id: string; categoria: string };
  produtosMap = Object.fromEntries((prods as ProdutoApi[]).map((p) => [p.id, p.categoria]));
      }
    } catch {}

    const pedido = {
      clienteId: user.id,
      itens: items.map(item => {
        const categoria = produtosMap[item.id] || '';
        return {
          tipoProduto: categoria === 'pizza' ? 'pizza' : categoria === 'bebida' ? 'bebida' : 'outro',
          tamanho: item.tamanho || null,
          sabores: categoria === 'pizza' ? [item.titulo] : [],
          bebida: categoria === 'bebida' ? item.titulo : null,
          volumeMl: categoria === 'bebida' ? null : undefined,
          quantidade: item.quantidade,
        };
      }),
      tipoPedido,
      endereco: tipoPedido === 'delivery' ? (enderecoId ? { id: enderecoId } : endereco) : null,
      formaPagamento,
      trocoPara: formaPagamento === 'dinheiro' ? trocoPara : null,
      valorTotal: total,
    };

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      });
      if (!res.ok) throw new Error('Erro ao criar pedido');
      const data = await res.json();
      clear();
      setPedidoRealizado({ numero: data.id || 'N/A' });
    } catch {
      alert('Erro ao finalizar pedido.');
    }
    setLoading(false);
  };

  if (pedidoRealizado) {
    return (
      <div className="p-6 max-w-3xl mx-auto font-sans text-center">
        <div className="bg-white p-8 rounded shadow mx-auto max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-green-700">Pedido realizado!</h1>
          <p className="mb-2 text-lg">Seu pedido <span className="font-bold">#{pedidoRealizado.numero}</span> foi realizado com sucesso!</p>
        </div>
      </div>
    );
  }
  if (items.length === 0) return (
    <div className="p-6 text-center font-sans">
      <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
    </div>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="bg-white p-4 rounded shadow font-sans">
        <p className="mb-2">Total: R$ {total.toFixed(2)}</p>
        <div className="mb-2">
          <label className="block">Tipo de pedido</label>
          <select value={tipoPedido} onChange={e => setTipoPedido(e.target.value)} className="border rounded px-2 py-1 w-full font-sans">
            <option value="retirada">Retirada</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>
        {tipoPedido === 'delivery' && (
          <div className="mb-2">
            <p className="mb-2">Preencha o endereço para delivery</p>
            <div className="grid grid-cols-1 gap-2">
              <input placeholder="Rua" value={endereco.rua} onChange={e => setEndereco({ ...endereco, rua: e.target.value })} className="border rounded px-2 py-1 w-full font-sans" />
              <input placeholder="Bairro" value={endereco.bairro} onChange={e => setEndereco({ ...endereco, bairro: e.target.value })} className="border rounded px-2 py-1 w-full font-sans" />
              <input placeholder="Número" value={endereco.numero} onChange={e => setEndereco({ ...endereco, numero: e.target.value })} className="border rounded px-2 py-1 w-full font-sans" />
              <input placeholder="Complemento (opcional)" value={endereco.complemento} onChange={e => setEndereco({ ...endereco, complemento: e.target.value })} className="border rounded px-2 py-1 w-full font-sans" />
              <input placeholder="CEP" value={endereco.cep} onChange={e => setEndereco({ ...endereco, cep: e.target.value })} className="border rounded px-2 py-1 w-full font-sans" />
            </div>
            <div className="mt-2">
              <label className="block text-sm text-gray-600">Se já tiver um endereço salvo, cole o ID abaixo (opcional)</label>
              <input value={enderecoId} onChange={e => setEnderecoId(e.target.value)} className="border rounded px-2 py-1 w-full font-sans" />
            </div>
          </div>
        )}
        <div className="mb-2">
          <label>Forma de pagamento</label>
          <select value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)} className="border rounded px-2 py-1 w-full font-sans">
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao_debito">Cartão de Débito</option>
            <option value="cartao_credito">Cartão de Crédito</option>
          </select>
        </div>
        {formaPagamento === 'dinheiro' && (
          <div className="mb-2">
            <label>Troco para (R$)</label>
            <input type="number" value={trocoPara ?? ''} onChange={e => setTrocoPara(Number(e.target.value))} className="border rounded px-2 py-1 w-full font-sans" />
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => router.push('/carrinho')}>Voltar</button>
          <button className="bg-[var(--primary)] text-white px-4 py-2 rounded" onClick={handleSubmit} disabled={loading}>{loading ? 'Enviando...' : 'Finalizar Pedido'}</button>
        </div>
      </div>
    </div>
  );
}
