// Página de autocadastro do cliente
// Permite que o cliente crie sua própria conta
import React from 'react';
import CadastroForm from '@/app/components/CadastroForm';

export default function CadastroClientePage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--background)]">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-white">
        <h1 className="text-2xl font-bold text-center mb-4 text-[var(--primary)]">Cadastro</h1>
        <div className="cliente-form">
          <CadastroForm modo="cliente" />
        </div>
        <p className="text-center mt-4 text-sm">Já tem conta? <a href="/login" className="text-[var(--primary)] font-semibold hover:underline">Entrar</a></p>
      </div>
    </div>
  );
}
