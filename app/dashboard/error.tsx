"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="standalone">
      <h1>Não conseguimos carregar suas finanças.</h1>
      <p>Verifique a conexão e se o script SQL foi executado no Supabase.</p>
      <button className="primary" onClick={reset}>
        Tentar novamente
      </button>
    </main>
  );
}
