import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { money } from "@/lib/finance";

export function SummaryCards({
  balance,
  income,
  expense,
  incomeCount,
  expenseCount,
}: {
  balance: number;
  income: number;
  expense: number;
  incomeCount: number;
  expenseCount: number;
}) {
  return (
    <div className="stats">
      <article className="stat balance">
        <div className="stat-label">
          Saldo atual <Wallet size={20} />
        </div>
        <strong>{money(balance)}</strong>
        <small>
          <span className="mini-dot" /> Considerando todas as transações
        </small>
        <div className="card-decoration" />
      </article>
      <article className="stat">
        <div className="stat-label">
          Receitas do mês
          <span className="stat-icon income">
            <ArrowDownLeft size={20} />
          </span>
        </div>
        <strong>{money(income)}</strong>
        <small>
          <span className="mini-dot green" />
          {incomeCount} entradas no período
        </small>
      </article>
      <article className="stat">
        <div className="stat-label">
          Despesas do mês
          <span className="stat-icon expense">
            <ArrowUpRight size={20} />
          </span>
        </div>
        <strong>{money(expense)}</strong>
        <small>
          <span className="mini-dot red" />
          {expenseCount} saídas no período
        </small>
      </article>
    </div>
  );
}
