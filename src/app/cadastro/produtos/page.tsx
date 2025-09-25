"use client"
import React, { useState } from 'react';

export default function CadastroProdutosPage() {
  const [form, setForm] = useState({
    categoria: 'pizza',
    titulo: '',
    descricao: '',
    imagem: '',
    preco: '',
    preco4: '',
    preco8: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      type CreatePayload = {
        categoria: string;
        titulo: string;
        descricao?: string;
        imagem?: string;
        preco?: number;
        preco4?: number;
        preco8?: number;
      };
      const payload: CreatePayload = { categoria: form.categoria, titulo: form.titulo, descricao: form.descricao, imagem: form.imagem };
      if (form.categoria === 'pizza') {
        payload.preco4 = Number(form.preco4);
        payload.preco8 = Number(form.preco8);
      } else {
        payload.preco = Number(form.preco);
      }
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Erro ao cadastrar produto.');
      }
      alert('Produto cadastrado com sucesso!');
  setForm({ categoria: 'pizza', titulo: '', descricao: '', imagem: '', preco: '', preco4: '', preco8: '' });
    } catch {
      alert('Erro ao cadastrar produto.');
    }
  };

  async function uploadFile(file: File) {
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Produtos</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Categoria:
          <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} className="border rounded px-2 py-1 w-full font-sans">
            <option value="pizza">Pizza</option>
            <option value="bebida">Bebida</option>
            <option value="outros">Outros</option>
          </select>
        </label>
        <label>
          Título:
          <input
            type="text"
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
            required
            className="border rounded px-2 py-1 w-full font-sans"
          />
        </label>
        <label>
          Descrição:
          <textarea
            value={form.descricao}
            onChange={e => setForm({ ...form, descricao: e.target.value })}
            required
            className="border rounded px-2 py-1 w-full font-sans"
          />
        </label>
        <label>
          Imagem (URL ou upload):
          <div className="flex flex-col gap-2">
            <input type="text" value={form.imagem} onChange={e => setForm({ ...form, imagem: e.target.value })} required className="border rounded px-2 py-1 w-full font-sans" />
            <div className="flex gap-2 items-center">
              <input id="cadastro-file" type="file" accept="image/*" className="font-sans" onChange={async e => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await uploadFile(f);
                if (url) setForm(s => ({ ...s, imagem: url }));
                else alert('Erro ao enviar imagem');
              }} />
              <span className="text-sm text-gray-500">ou cole uma URL no campo acima</span>
            </div>
          </div>
        </label>
        {/* tamanho removed: pizzas always 4 or 8 pedaços */}
        {form.categoria === 'pizza' ? (
          <>
            <label>
              Preço <span className="font-sans">4</span> pedaços:
              <input type="number" step="0.01" value={form.preco4} onChange={e => setForm({ ...form, preco4: e.target.value })} required className="border rounded px-2 py-1 w-full font-sans" />
            </label>
            <label>
              Preço <span className="font-sans">8</span> pedaços:
              <input type="number" step="0.01" value={form.preco8} onChange={e => setForm({ ...form, preco8: e.target.value })} required className="border rounded px-2 py-1 w-full font-sans" />
            </label>
          </>
        ) : (
          <label>
            Preço:
            <input type="number" step="0.01" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} required className="border rounded px-2 py-1 w-full font-sans" />
          </label>
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Cadastrar Produto
        </button>
      </form>
    </div>
  );
}