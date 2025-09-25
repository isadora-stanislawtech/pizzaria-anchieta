"use client"
import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUser } from '@/app/components/UserContext';

type Produto = {
  id: string;
  categoria: string;
  titulo: string;
  descricao?: string;
  imagem?: string;
  tamanho?: string;
  preco?: number;
  preco4?: number;
  preco8?: number;
};

export default function AdminProdutos() {
  const { user } = useUser();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState({ categoria: 'pizza', titulo: '', descricao: '', imagem: '', preco: '', preco4: '', preco8: '' });
  const [loading, setLoading] = useState(false);

  // Format a numeric input as Brazilian currency for display while typing.
  function formatBRCurrencyInput(raw: string) {
    // keep only digits
    const digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    const cents = parseInt(digits, 10);
    const reais = Math.floor(cents / 100);
    const centPart = (cents % 100).toString().padStart(2, '0');
    // use pt-BR thousands separator (.) and comma for decimals
    return reais.toLocaleString('pt-BR') + ',' + centPart;
  }

  function parseBRCurrencyToNumber(formatted: string) {
    if (!formatted) return 0;
    // remove thousands separator and replace decimal comma
    const normalized = formatted.replace(/\./g, '').replace(/,/g, '.');
    const n = parseFloat(normalized);
    return isNaN(n) ? 0 : n;
  }

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      window.location.href = '/login';
    }
  }, [user]);

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    setLoading(true);
    const res = await fetch('/api/produtos');
    const data = await res.json();
    setProdutos(data || []);
    setLoading(false);
  }

  type CreatePayload = {
    categoria: string;
    titulo: string;
    descricao?: string;
    imagem?: string;
    preco?: number;
    preco4?: number;
    preco8?: number;
  };

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const payload: CreatePayload = { categoria: form.categoria, titulo: form.titulo, descricao: form.descricao, imagem: form.imagem };
    if (form.categoria === 'pizza') {
      payload.preco4 = parseBRCurrencyToNumber(form.preco4);
      payload.preco8 = parseBRCurrencyToNumber(form.preco8);
    } else {
      payload.preco = parseBRCurrencyToNumber(form.preco);
    }
    const res = await fetch('/api/produtos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
  setForm({ categoria: 'pizza', titulo: '', descricao: '', imagem: '', preco: '', preco4: '', preco8: '' });
      fetchList();
    } else {
      const err = await res.json();
      alert(err?.error || 'Erro');
    }
  }

  async function uploadFile(file: File) {
    // read as data URL
    return new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const data = reader.result as string;
          const res = await fetch('/api/uploads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: file.name, data }) });
          const json = await res.json();
          resolve(json?.url || null);
        } catch {
          resolve(null);
        }
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja apagar este produto?')) return;
    await fetch(`/api/produtos?id=${id}`, { method: 'DELETE' });
    fetchList();
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--primary)]">Gerenciar Produtos</h1>
      </header>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Adicionar Produto</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleCreate}>
          <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} className="border px-2 py-1 font-sans">
            <option value="pizza">Pizza</option>
            <option value="bebida">Bebida</option>
            <option value="outros">Outros</option>
          </select>
          <input required placeholder="Título" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} className="border px-2 py-1 font-sans" />
          <input placeholder="Descrição" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} className="border px-2 py-1 md:col-span-2 font-sans" />
          <div className="md:col-span-2 flex flex-col gap-2">
            <input placeholder="Imagem (caminho ou URL)" value={form.imagem} onChange={e => setForm(f => ({ ...f, imagem: e.target.value }))} className="border px-2 py-1 font-sans" />
              <div className="flex gap-2 items-center">
              <input id="admin-file" className="font-sans" type="file" accept="image/*" onChange={async e => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await uploadFile(f);
                if (url) setForm(s => ({ ...s, imagem: url }));
                else alert('Erro ao enviar imagem');
              }} />
              <span className="text-sm text-gray-500">ou cole uma URL no campo acima</span>
            </div>
          </div>
          {form.categoria === 'pizza' ? (
            <>
              <label className="flex flex-col">
                <span>Preço <span className="font-sans">4</span> pedaços</span>
                <input required value={form.preco4} onChange={e => setForm(f => ({ ...f, preco4: formatBRCurrencyInput(e.target.value) }))} className="border px-2 py-1 font-sans" placeholder="R$ 0,00" />
              </label>
              <label className="flex flex-col">
                <span>Preço <span className="font-sans">8</span> pedaços</span>
                <input required value={form.preco8} onChange={e => setForm(f => ({ ...f, preco8: formatBRCurrencyInput(e.target.value) }))} className="border px-2 py-1 font-sans" placeholder="R$ 0,00" />
              </label>
            </>
          ) : (
            <input required placeholder="R$ 0,00" value={form.preco} onChange={e => setForm(f => ({ ...f, preco: formatBRCurrencyInput(e.target.value) }))} className="border px-2 py-1 font-sans" />
          )}
          <div className="md:col-span-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded font-bold">Salvar Produto</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Produtos</h2>
        {loading ? <div>Carregando...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {produtos.map(p => (
              <div key={p.id} className="border rounded p-3 flex gap-3 items-start">
                <div className="w-24 h-24 bg-gray-100 flex-shrink-0 relative">
                  {p.imagem ? (
                    <Image src={p.imagem} alt={p.titulo} fill className="object-cover rounded" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Sem imagem</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold font-sans">{p.titulo}</h3>
                      <div className="text-sm text-gray-600">{p.categoria} • {p.tamanho || '-'}</div>
                    </div>
                    <div className="text-green-600 font-bold font-sans">
                      {p.categoria === 'pizza' ? (
                        <div className="text-right">
                          <div className="text-sm font-sans">4 pedaços: R$ {Number(p.preco4 ?? 0).toFixed(2)}</div>
                          <div className="text-sm font-sans">8 pedaços: R$ {Number(p.preco8 ?? 0).toFixed(2)}</div>
                        </div>
                      ) : (
                        <>R$ {Number(p.preco).toFixed(2)}</>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{p.descricao || '-'}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-3 py-1 rounded">Apagar</button>
                  </div>
                </div>
              </div>
            ))}
            {produtos.length === 0 && <div>Nenhum produto cadastrado.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
