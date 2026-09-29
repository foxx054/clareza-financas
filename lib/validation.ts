import { isCategory, isTransactionType, parseAmount } from "@/lib/finance";

type ValidationResult<T> =
  { success: true; data: T } | { success: false; error: string };

export function validateTransactionForm(form: FormData): ValidationResult<{
  descricao: string;
  cents: number;
  tipo: "receita" | "despesa";
  categoria: string;
  data: string;
}> {
  const descricao = String(form.get("descricao") ?? "").trim();
  const cents = parseAmount(String(form.get("valor") ?? ""));
  const tipo = String(form.get("tipo") ?? "");
  const categoria = String(form.get("categoria") ?? "");
  const data = String(form.get("data") ?? "");
  const validDate =
    /^\d{4}-\d{2}-\d{2}$/.test(data) &&
    !Number.isNaN(Date.parse(data)) &&
    new Date(data).toISOString().slice(0, 10) === data;

  if (
    descricao.length < 2 ||
    descricao.length > 120 ||
    cents === null ||
    !isTransactionType(tipo) ||
    !isCategory(categoria) ||
    !validDate
  ) {
    return {
      success: false,
      error:
        "Confira os campos. Use uma descrição de 2 a 120 caracteres, uma data válida e um valor positivo com até 2 casas decimais.",
    };
  }

  return { success: true, data: { descricao, cents, tipo, categoria, data } };
}

export function validateCredentials(
  form: FormData,
): ValidationResult<{ email: string; password: string }> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 8 ||
    password.length > 128
  ) {
    return {
      success: false,
      error: "Informe um e-mail válido e uma senha de 8 a 128 caracteres.",
    };
  }

  return { success: true, data: { email, password } };
}
