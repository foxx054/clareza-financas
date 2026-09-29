import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Transaction } from "@/lib/finance";

const PAGE_SIZE = 1000;

/**
 * Busca o histórico completo do usuário.
 * A paginação evita que o limite padrão do Supabase altere o saldo acumulado.
 */
export async function listTransactions(
  client: SupabaseClient,
  userId: string,
): Promise<Transaction[]> {
  const transactions: Transaction[] = [];

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await client
      .from("transacoes")
      .select("id,descricao,valor,tipo,categoria,data,criado_em")
      .eq("user_id", userId)
      .order("data", { ascending: false })
      .order("criado_em", { ascending: false })
      .order("id")
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      throw new Error(
        "Falha ao consultar as transações. Confira a configuração do Supabase.",
      );
    }

    transactions.push(...(data as Transaction[]));
    if (data.length < PAGE_SIZE) break;
  }

  return transactions;
}
