// Página para o admin cadastrar clientes
// Permite que o admin crie contas de clientes pelo sistema
import React from "react";
import CadastroForm from '@/app/components/CadastroForm';

export default function CadastroAdminPage() {
  return (
    <div>
      <h1>Cadastrar Cliente (Admin)</h1>
      <CadastroForm modo="admin" />
    </div>
  );
}
