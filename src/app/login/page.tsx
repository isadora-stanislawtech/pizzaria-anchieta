"use client"
// Página de login única para admin e cliente
import LoginForm from '@/app/components/LoginForm';


export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--background)]">
      <div className="w-full max-w-md p-4 rounded-2xl shadow-lg bg-white">
        <h1 className="text-2xl font-bold text-center mb-4 text-[var(--primary)]">Entrar</h1>
        <LoginForm />
      </div>
    </div>
  );
}
