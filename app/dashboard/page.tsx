import { configured, supabase } from "@/lib/supabase";
import { demoTransactions } from "@/lib/finance";
import { listTransactions } from "@/lib/transactions";
import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ salva?: string; mes?: string }>;
}) {
  const params = await searchParams;
  const saved = params.salva === "1";
  const initialMonth =
    params.mes && /^\d{4}-(0[1-9]|1[0-2])$/.test(params.mes)
      ? params.mes
      : new Date().toISOString().slice(0, 7);
  if (!configured())
    return <Dashboard transactions={demoTransactions()} demo />;
  const client = await supabase();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) redirect("/login");

  // O Server Component consulta dados privados e entrega apenas o resultado à interface.
  const transactions = await listTransactions(client, user.id);

  return (
    <Dashboard
      transactions={transactions}
      email={user.email}
      saved={saved}
      initialMonth={initialMonth}
    />
  );
}
