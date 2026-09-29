import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TransactionForm from "@/components/transaction-form";
import { configured, supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function NewTransaction() {
  const demo = !configured();
  if (!demo) {
    const client = await supabase();
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) redirect("/login");
  }
  return (
    <main className="standalone">
      <Link className="back-link" href="/dashboard">
        <ArrowLeft size={17} /> Voltar ao painel
      </Link>
      <div className="form-card">
        <div className="eyebrow">UM PASSO PARA SE ORGANIZAR</div>
        <h1>
          Nova transação<span>.</span>
        </h1>
        <p>Registre um movimento e mantenha tudo em dia.</p>
        <TransactionForm demo={demo} />
      </div>
    </main>
  );
}
