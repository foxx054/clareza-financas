"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { configured, supabase } from "@/lib/supabase";
import { validateCredentials, validateTransactionForm } from "@/lib/validation";

export type ActionState = { error?: string; success?: string };

export async function createTransaction(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!configured())
    return {
      error:
        "Configure o Supabase para salvar suas transações. O modo demonstração é apenas para consulta.",
    };

  const validation = validateTransactionForm(form);
  if (!validation.success) return { error: validation.error };

  const client = await supabase();
  // A Server Action é uma fronteira pública: a sessão sempre é verificada no servidor.
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user)
    return { error: "Sua sessão expirou. Entre novamente para continuar." };

  const { descricao, cents, tipo, categoria, data } = validation.data;
  const { error } = await client.from("transacoes").insert({
    descricao,
    valor: cents / 100,
    tipo,
    categoria,
    data,
    user_id: user.id,
  });
  if (error)
    return {
      error:
        "Não foi possível salvar. Verifique a conexão e a configuração do banco e tente novamente.",
    };

  // Atualiza o Server Component antes de redirecionar para o mês da nova transação.
  revalidatePath("/dashboard");
  redirect(`/dashboard?salva=1&mes=${data.slice(0, 7)}`);
}

export async function authenticate(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!configured())
    return {
      error: "Configure as variáveis do Supabase no arquivo .env.local.",
    };

  const validation = validateCredentials(form);
  if (!validation.success) return { error: validation.error };

  const { email, password } = validation.data;
  const client = await supabase();
  if (form.get("mode") === "signup") {
    const { data, error } = await client.auth.signUp({ email, password });
    if (error)
      return {
        error:
          "Não foi possível criar a conta. Confira seus dados e tente novamente.",
      };
    if (!data.session)
      return {
        success:
          "Confira seu e-mail para confirmar o cadastro. Depois, volte e entre com sua senha.",
      };
  } else {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error)
      return {
        error:
          "Não foi possível entrar. Verifique e-mail, senha e confirmação do cadastro.",
      };
  }
  redirect("/dashboard");
}

export async function signOut() {
  const client = await supabase();
  await client.auth.signOut();
  redirect("/login");
}
