// src/app/clientes/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Trash2, RotateCcw, Plus } from "lucide-react";

interface Cliente {
  id: string;
  name: string;
  email: string;
  telefone?: string;
  enderecoPrincipal?: {
    rua: string;
    bairro: string;
    numero: string;
    complemento?: string;
    cep: string;
  };
  pedidos?: Array<{
    id: string;
    realizadoEm: string;
    valorTotal: number;
  }>;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    telefone: "",
    enderecoId: "",
    rua: "",
    bairro: "",
    numero: "",
    complemento: "",
    cep: "",
  });
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const clientesFiltrados = clientes.filter((cliente) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const nome = cliente.name?.toLowerCase().trim() || "";
    const email = cliente.email?.toLowerCase().trim() || "";
    const tel = cliente.telefone?.toLowerCase().trim() || "";
    return nome.includes(q) || email.includes(q) || tel.includes(q);
  });

  async function carregar() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/clientes");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setClientes(data);
    } catch (e: any) {
      setErrorMsg("Falha ao carregar clientes.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  // Adicionar novo cliente
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      // cria endereço (opcional) e obtém enderecoId
      let enderecoId = "";
      const temEndereco =
        form.rua && form.bairro && form.numero && form.cep;

      if (temEndereco) {
        const r = await fetch("/api/enderecos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rua: form.rua,
            bairro: form.bairro,
            numero: form.numero,
            complemento: form.complemento || null,
            cep: form.cep,
          }),
        });
        if (!r.ok) {
          const msg = await r.text().catch(() => "");
          throw new Error(`Falha ao criar endereço. ${msg}`);
        }
        const endereco = await r.json();
        enderecoId = endereco.id;
      }

      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          telefone: form.telefone,
          enderecoId, // a API aceita connect com esse id
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Falha ao salvar cliente (${res.status})`);
      }

      await carregar();
      setForm({
        name: "",
        email: "",
        telefone: "",
        enderecoId: "",
        rua: "",
        bairro: "",
        numero: "",
        complemento: "",
        cep: "",
      });
      setShowPopup(false);
    } catch (e: any) {
      setErrorMsg(e.message || "Erro ao salvar cliente.");
      console.error(e);
    }
  };

  // Editar cliente
  const handleEdit = async (id: string) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/clientes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`Falha ao editar. ${msg}`);
      }
      await carregar();
      setEditId(null);
      setForm({
        name: "",
        email: "",
        telefone: "",
        enderecoId: "",
        rua: "",
        bairro: "",
        numero: "",
        complemento: "",
        cep: "",
      });
    } catch (e: any) {
      setErrorMsg(e.message || "Erro ao editar cliente.");
      console.error(e);
    }
  };

  // Deletar cliente
  const handleDelete = async (id: string) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`Falha ao deletar. ${msg}`);
      }
      await carregar();
    } catch (e: any) {
      setErrorMsg(e.message || "Erro ao deletar cliente.");
      console.error(e);
    }
  };

  // Resetar senha
  const handleReset = async (id: string) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/clientes/${id}/reset`, { method: "POST" });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`Falha ao resetar senha. ${msg}`);
      }
      alert("Senha resetada para cliente@123");
    } catch (e: any) {
      setErrorMsg(e.message || "Erro ao resetar senha.");
      console.error(e);
    }
  };

  // Preencher form para edição
  const startEdit = (cliente: Cliente) => {
    setEditId(cliente.id);
    setForm({
      name: cliente.name,
      email: cliente.email,
      telefone: cliente.telefone || "",
      enderecoId: "",
      rua: cliente.enderecoPrincipal?.rua || "",
      bairro: cliente.enderecoPrincipal?.bairro || "",
      numero: cliente.enderecoPrincipal?.numero || "",
      complemento: cliente.enderecoPrincipal?.complemento || "",
      cep: cliente.enderecoPrincipal?.cep || "",
    });
  };

  if (loading) return <div className="text-center py-10">Carregando clientes...</div>;

  return (
    <div className="w-full py-8 px-4">
      {errorMsg && (
        <div className="mx-6 mb-4 rounded bg-red-100 text-red-800 px-3 py-2">
          {errorMsg}
        </div>
      )}

      <header className="flex justify-between items-center mb-6 px-6" />
      <div className="w-full px-6 mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-[var(--primary)]">
          Clientes{" "}
          <span className="text-gray-500 text-lg font-sans">
            ({clientesFiltrados.length})
          </span>
        </h1>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            className="border rounded px-3 py-2 font-sans w-full md:w-96 lg:w-[32rem]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded font-bold"
            onClick={() => setShowPopup(true)}
          >
            <Plus size={20} />
            Novo Cliente
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto px-6">
        <table className="w-full min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 font-bold text-left">Nome</th>
              <th className="px-4 py-2 font-bold text-left">Email</th>
              <th className="px-4 py-2 font-bold text-left">Telefone</th>
              <th className="px-4 py-2 font-bold text-left">Endereço</th>
              <th className="px-4 py-2 font-bold text-left">Último pedido</th>
              <th className="px-4 py-2 font-bold text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
            {clientesFiltrados.map((cliente, idx) => (
              <tr
                key={cliente.id}
                className={idx % 2 === 0 ? "bg-white/80" : "bg-gray-100/70"}
              >
                <td className="px-4 py-3 border border-gray-200 font-sans">
                  {cliente.name}
                </td>
                <td className="px-4 py-3 border border-gray-200 font-sans">
                  {cliente.email}
                </td>
                <td className="px-4 py-3 border border-gray-200 font-sans">
                  {cliente.telefone || "-"}
                </td>
                <td className="px-4 py-3 border border-gray-200 font-sans">
                  {cliente.enderecoPrincipal
                    ? `${cliente.enderecoPrincipal.rua}, ${cliente.enderecoPrincipal.numero} - ${cliente.enderecoPrincipal.bairro} ${
                        cliente.enderecoPrincipal.complemento
                          ? `(${cliente.enderecoPrincipal.complemento})`
                          : ""
                      } - CEP: ${cliente.enderecoPrincipal.cep}`
                    : "-"}
                </td>
                <td className="px-4 py-3 border border-gray-200 font-sans">
                  {cliente.pedidos && cliente.pedidos.length > 0
                    ? `${new Date(
                        cliente.pedidos[0].realizadoEm
                      ).toLocaleString("pt-BR")} - R$ ${cliente.pedidos[0].valorTotal.toLocaleString(
                        "pt-BR",
                        { minimumFractionDigits: 2 }
                      )}`
                    : "Nenhum"}
                </td>
                <td className="px-4 py-3 border border-gray-200">
                  <div className="flex gap-2">
                    <span className="relative group">
                      <button
                        className="p-1"
                        title="Editar"
                        onClick={() => startEdit(cliente)}
                      >
                        <Pencil size={20} />
                      </button>
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                        Editar
                      </span>
                    </span>
                    <span className="relative group">
                      <button
                        className="p-1"
                        title="Apagar"
                        onClick={() => handleDelete(cliente.id)}
                      >
                        <Trash2 size={20} />
                      </button>
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                        Apagar
                      </span>
                    </span>
                    <span className="relative group">
                      <button
                        className="p-1"
                        title="Resetar senha"
                        onClick={() => handleReset(cliente.id)}
                      >
                        <RotateCcw size={20} />
                      </button>
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                        Resetar senha
                      </span>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup novo cliente */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Novo Cliente</h2>
            <form className="flex flex-col gap-2" onSubmit={handleAdd}>
              <label className="font-bold">
                Nome <span className="text-red-600">*</span>
              </label>
              <input
                required
                className="border rounded px-2 py-1 font-sans"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <label className="font-bold">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                required
                className="border rounded px-2 py-1 font-sans"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
              <label className="font-bold">
                Telefone <span className="text-red-600">*</span>
              </label>
              <input
                required
                className="border rounded px-2 py-1 font-sans"
                value={form.telefone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, telefone: e.target.value }))
                }
              />
              <label className="font-bold">Endereço (opcional)</label>
              <input
                placeholder="Rua"
                className="border rounded px-2 py-1 font-sans"
                value={form.rua}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rua: e.target.value }))
                }
              />
              <input
                placeholder="Bairro"
                className="border rounded px-2 py-1 font-sans"
                value={form.bairro}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bairro: e.target.value }))
                }
              />
              <input
                placeholder="Número"
                className="border rounded px-2 py-1 font-sans"
                value={form.numero}
                onChange={(e) =>
                  setForm((f) => ({ ...f, numero: e.target.value }))
                }
              />
              <input
                placeholder="Complemento"
                className="border rounded px-2 py-1 font-sans"
                value={form.complemento}
                onChange={(e) =>
                  setForm((f) => ({ ...f, complemento: e.target.value }))
                }
              />
              <input
                placeholder="CEP"
                className="border rounded px-2 py-1 font-sans"
                value={form.cep}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cep: e.target.value }))
                }
              />
              <button className="bg-green-600 text-white px-4 py-2 rounded font-bold mt-2">
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Formulário de edição inline */}
      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w/full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setEditId(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Editar Cliente</h2>
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit(editId);
              }}
            >
              <label className="font-bold">
                Nome <span className="text-red-600">*</span>
              </label>
              <input
                required
                className="border rounded px-2 py-1 font-sans"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <label className="font-bold">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                required
                className="border rounded px-2 py-1 font-sans"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
              <label className="font-bold">
                Telefone <span className="text-red-600">*</span>
              </label>
              <input
                required
                className="border rounded px-2 py-1 font-sans"
                value={form.telefone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, telefone: e.target.value }))
                }
              />
              <label className="font-bold">Endereço (opcional)</label>
              <input
                placeholder="Rua"
                className="border rounded px-2 py-1 font-sans"
                value={form.rua}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rua: e.target.value }))
                }
              />
              <input
                placeholder="Bairro"
                className="border rounded px-2 py-1 font-sans"
                value={form.bairro}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bairro: e.target.value }))
                }
              />
              <input
                placeholder="Número"
                className="border rounded px-2 py-1 font-sans"
                value={form.numero}
                onChange={(e) =>
                  setForm((f) => ({ ...f, numero: e.target.value }))
                }
              />
              <input
                placeholder="Complemento"
                className="border rounded px-2 py-1 font-sans"
                value={form.complemento}
                onChange={(e) =>
                  setForm((f) => ({ ...f, complemento: e.target.value }))
                }
              />
              <input
                placeholder="CEP"
                className="border rounded px-2 py-1 font-sans"
                value={form.cep}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cep: e.target.value }))
                }
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold mt-2">
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
