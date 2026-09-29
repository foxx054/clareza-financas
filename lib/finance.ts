export const transactionTypes = ["receita", "despesa"] as const;
export type TransactionType = (typeof transactionTypes)[number];

export const categories = [
  "Salário",
  "Freelance",
  "Alimentação",
  "Moradia",
  "Transporte",
  "Lazer",
  "Saúde",
  "Educação",
  "Outros",
] as const;
export type TransactionCategory = (typeof categories)[number];

export type Transaction = {
  id: string;
  descricao: string;
  valor: number;
  tipo: TransactionType;
  categoria: string;
  data: string;
  criado_em: string;
};

export type TransactionFilter = TransactionType | "todos";

export type ExpenseGroup = {
  category: string;
  percentage: number;
  color: string;
};

export const chartColors = [
  "#8873e7",
  "#baaaf4",
  "#d8cef9",
  "#b3cfb8",
  "#e7e4ee",
] as const;

export const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );

export function isTransactionType(value: string): value is TransactionType {
  return transactionTypes.some((type) => type === value);
}

export function isCategory(value: string): value is TransactionCategory {
  return categories.some((category) => category === value);
}

/** Converte a entrada decimal em centavos para validar dinheiro sem arredondamentos acidentais. */
export function parseAmount(value: string): number | null {
  if (!/^\d{1,9}([.,]\d{1,2})?$/.test(value.trim())) return null;
  const cents = Math.round(Number(value.replace(",", ".")) * 100);
  return cents > 0 && cents <= 99999999999 ? cents : null;
}

/** Mantém todos os cálculos monetários em centavos até o resultado final. */
export function totals(rows: Transaction[]) {
  const income = rows
    .filter((transaction) => transaction.tipo === "receita")
    .reduce((sum, transaction) => sum + Math.round(transaction.valor * 100), 0);
  const expense = rows
    .filter((transaction) => transaction.tipo === "despesa")
    .reduce((sum, transaction) => sum + Math.round(transaction.valor * 100), 0);

  return {
    income: income / 100,
    expense: expense / 100,
    balance: (income - expense) / 100,
  };
}

export function transactionsFromMonth(rows: Transaction[], month: string) {
  return rows.filter((transaction) => transaction.data.startsWith(month));
}

export function filterTransactions(
  rows: Transaction[],
  search: string,
  type: TransactionFilter,
) {
  const normalizedSearch = search.toLocaleLowerCase("pt-BR");
  return rows.filter(
    (transaction) =>
      (type === "todos" || transaction.tipo === type) &&
      transaction.descricao
        .toLocaleLowerCase("pt-BR")
        .includes(normalizedSearch),
  );
}

export function groupExpenses(rows: Transaction[]): ExpenseGroup[] {
  const expenses = rows.filter((transaction) => transaction.tipo === "despesa");
  const totalCents = expenses.reduce(
    (sum, transaction) => sum + Math.round(transaction.valor * 100),
    0,
  );
  const byCategory = expenses.reduce<Record<string, number>>(
    (groups, transaction) => ({
      ...groups,
      [transaction.categoria]:
        (groups[transaction.categoria] || 0) +
        Math.round(transaction.valor * 100),
    }),
    {},
  );

  return Object.entries(byCategory)
    .sort(([, first], [, second]) => second - first)
    .map(([category, cents], index) => ({
      category,
      percentage: totalCents ? (cents / totalCents) * 100 : 0,
      color: chartColors[index % chartColors.length],
    }));
}

export function expenseGradient(groups: ExpenseGroup[]) {
  let cumulative = 0;
  return groups
    .map((group) => {
      const start = cumulative;
      cumulative += group.percentage;
      return `${group.color} ${start}% ${cumulative}%`;
    })
    .join(",");
}

export function shiftMonth(month: string, delta: number) {
  const date = new Date(`${month}-01T12:00:00`);
  date.setMonth(date.getMonth() + delta);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function demoTransactions(): Transaction[] {
  const month = new Date().toISOString().slice(0, 7);
  const rows = [
    ["1", "Salário mensal", 6500, "receita", "Salário", "05"],
    ["2", "Projeto de identidade visual", 1800, "receita", "Freelance", "12"],
    ["3", "Aluguel do apartamento", 1850, "despesa", "Moradia", "10"],
    ["4", "Compras da semana", 348.9, "despesa", "Alimentação", "18"],
    ["5", "Café com amigos", 64.5, "despesa", "Lazer", "20"],
    ["6", "Transporte por aplicativo", 32.8, "despesa", "Transporte", "21"],
    ["7", "Curso de desenvolvimento", 149.9, "despesa", "Educação", "15"],
  ] as const;

  return rows
    .map(([id, descricao, valor, tipo, categoria, day]) => ({
      id,
      descricao,
      valor,
      tipo,
      categoria,
      data: `${month}-${day}`,
      criado_em: `${month}-${day}T12:00:00Z`,
    }))
    .sort((first, second) => second.data.localeCompare(first.data));
}
