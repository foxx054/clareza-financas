"use client";
import { useActionState, useState } from "react";
import { authenticate } from "@/app/actions";
import Link from "next/link";
export default function Login() {
  const [state, action, pending] = useActionState(authenticate, {});
  const [signup, setSignup] = useState(false);
  return (
    <main className="standalone">
      <Link href="/dashboard" className="brand">
        ◈ clareza.
      </Link>
      <div className="form-card">
        <div className="eyebrow">SEU ESPAÇO FINANCEIRO</div>
        <h1>{signup ? "Comece com clareza." : "Que bom ter você aqui."}</h1>
        <p>
          {signup
            ? "Crie sua conta para organizar suas finanças."
            : "Entre para acompanhar suas receitas e despesas."}
        </p>
        <form action={action} className="entry-form">
          <input
            type="hidden"
            name="mode"
            value={signup ? "signup" : "login"}
          />
          <label>
            E-mail
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              required
            />
          </label>
          <label>
            Senha
            <input
              name="password"
              type="password"
              minLength={8}
              maxLength={128}
              autoComplete={signup ? "new-password" : "current-password"}
              placeholder="No mínimo 8 caracteres"
              required
            />
          </label>
          {state.error && (
            <p className="error-message" role="alert">
              {state.error}
            </p>
          )}
          {state.success && (
            <p className="notice" role="status">
              {state.success}
            </p>
          )}
          <button disabled={pending} className="primary full">
            {pending ? "Aguarde..." : signup ? "Criar conta" : "Entrar"}
          </button>
          <button
            type="button"
            className="text-button"
            onClick={() => setSignup(!signup)}
          >
            {signup
              ? "Já tenho uma conta. Entrar"
              : "Ainda não tem conta? Cadastre-se"}
          </button>
        </form>
      </div>
    </main>
  );
}
