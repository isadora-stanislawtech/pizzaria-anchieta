"use client"

import React from 'react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export type CadastroFormProps = {
  modo: "admin" | "cliente";
};

export default function CadastroForm({ modo }: CadastroFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [enderecoPrincipal, setEnderecoPrincipal] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const phoneDigits = telefone.replace(/\D/g, '');
  const isEmailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const isPhoneValid = useMemo(() => phoneDigits.length === 10 || phoneDigits.length === 11, [phoneDigits]);
  const isFormValid = name.trim() !== '' && isEmailValid && isPhoneValid && password.length >= 6;

  function formatPhone(v: string) {
    const d = v.replace(/\D/g, '');
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;
    setSubmitting(true);
    try {
      type Payload = { name: string; email: string; telefone: string; password: string; enderecoPrincipal?: string };
      const payload: Payload = { name, email, telefone: phoneDigits, password };
      if (enderecoPrincipal.trim()) {
        payload.enderecoPrincipal = '';
      }

      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json();
        alert(data?.error || 'Erro ao cadastrar');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de rede');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">Nome</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          name="name"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 font-sans"
        />
      </div>

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
        <label className="block text-sm">Telefone</label>
        <input
          value={formatPhone(telefone)}
          onChange={e => setTelefone(e.target.value)}
          name="telefone"
          inputMode="tel"
          placeholder="(xx) xxxxx-xxxx"
          className="w-full border border-gray-300 rounded-md px-3 py-2 font-sans"
        />
        {!isPhoneValid && telefone.length > 0 && <div className="text-red-500 text-xs mt-1">Telefone inválido</div>}
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

      <div>
        <label className="block text-sm">Endereço principal (opcional)</label>
        <input
          value={enderecoPrincipal}
          onChange={e => setEnderecoPrincipal(e.target.value)}
          name="enderecoPrincipal"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="bg-[var(--primary)] text-white rounded-lg py-2 font-bold text-lg hover:bg-[var(--details)] transition w-full disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        disabled={!isFormValid || submitting}
      >
        {submitting ? 'Cadastrando...' : 'Cadastrar'}
      </button>

      <div className="text-center text-sm text-gray-500">
        Modo: {modo}
      </div>
    </form>
  );
}
