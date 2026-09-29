import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { money, type Transaction, type TransactionFilter } from "@/lib/finance";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
});

export function TransactionsPanel({
  monthRows,
  visibleRows,
  search,
  onSearchChange,
  type,
  onTypeChange,
  limit,
  onShowMore,
}: {
  monthRows: Transaction[];
  visibleRows: Transaction[];
  search: string;
  onSearchChange: (search: string) => void;
  type: TransactionFilter;
  onTypeChange: (type: TransactionFilter) => void;
  limit: number;
  onShowMore: () => void;
}) {
  return (
    <section className="panel transactions">
      <div className="panel-heading">
        <div>
          <h2>Últimas transações</h2>
          <p>Cada movimento, em um só lugar.</p>
        </div>
        <span className="count">{monthRows.length} registros</span>
      </div>
      <div className="filters">
        <label className="search">
          <Search size={17} />
          <input
            placeholder="Buscar transação..."
            aria-label="Buscar transação"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <label className="type-filter">
          <SlidersHorizontal size={15} />
          <select
            aria-label="Filtrar por tipo"
            value={type}
            onChange={(event) =>
              onTypeChange(event.target.value as TransactionFilter)
            }
          >
            <option value="todos">Todos os tipos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
        </label>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>DESCRIÇÃO</th>
              <th>DATA</th>
              <th className="amount">VALOR</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.slice(0, limit).map((transaction) => (
              <tr key={transaction.id}>
                <td>
                  <div className="transaction-name">
                    <span
                      className={`transaction-icon ${transaction.tipo === "receita" ? "income" : "expense"}`}
                    >
                      {transaction.tipo === "receita" ? (
                        <ArrowDownLeft size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </span>
                    <div>
                      <strong>{transaction.descricao}</strong>
                      <small>
                        {transaction.categoria} <span>· </span>
                        {transaction.tipo === "receita" ? "Receita" : "Despesa"}
                      </small>
                    </div>
                  </div>
                </td>
                <td className="date-cell">
                  {dateFormatter.format(
                    new Date(`${transaction.data}T12:00:00Z`),
                  )}
                </td>
                <td
                  className={`amount ${transaction.tipo === "receita" ? "positive" : ""}`}
                >
                  {transaction.tipo === "receita" ? "+" : "−"}{" "}
                  {money(transaction.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!visibleRows.length && (
        <div className="empty">
          <ArrowLeftRight size={27} />
          <h3>
            {monthRows.length
              ? "Nenhuma transação encontrada"
              : "Um novo mês, novas possibilidades"}
          </h3>
          <p>
            {monthRows.length
              ? "Experimente outra busca ou filtro."
              : "Adicione sua primeira receita ou despesa."}
          </p>
          <Link href="/dashboard/nova-transacao">
            Adicionar transação <ArrowRight size={14} />
          </Link>
        </div>
      )}
      <div className="table-footer">
        <span>
          Mostrando {Math.min(limit, visibleRows.length)} de{" "}
          {visibleRows.length} transações
        </span>
        {visibleRows.length > limit && (
          <button onClick={onShowMore}>
            Ver mais <ArrowRight size={14} />
          </button>
        )}
      </div>
    </section>
  );
}
