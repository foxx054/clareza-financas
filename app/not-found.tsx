import Link from "next/link";
export default function NotFound() {
  return (
    <main className="standalone">
      <div className="brand">◈ clareza.</div>
      <div className="form-card">
        <div className="eyebrow">PÁGINA NÃO ENCONTRADA</div>
        <h1>Vamos voltar ao caminho?</h1>
        <p>Este endereço não existe. Suas finanças estão no painel.</p>
        <Link className="primary" href="/dashboard" style={{ marginTop: 24 }}>
          Voltar ao painel
        </Link>
      </div>
    </main>
  );
}
