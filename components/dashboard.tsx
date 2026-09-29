"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  expenseGradient,
  filterTransactions,
  groupExpenses,
  shiftMonth,
  totals,
  transactionsFromMonth,
  type Transaction,
  type TransactionFilter,
} from "@/lib/finance";
import { Sidebar, type DashboardView } from "@/components/dashboard/sidebar";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TransactionsPanel } from "@/components/dashboard/transactions-panel";
import { SpendingInsights } from "@/components/dashboard/spending-insights";

const INITIAL_LIMIT = 7;

export default function Dashboard({
  transactions,
  demo = false,
  email,
  saved = false,
  initialMonth,
}: {
  transactions: Transaction[];
  demo?: boolean;
  email?: string;
  saved?: boolean;
  initialMonth?: string;
}) {
  const [month, setMonth] = useState(
    initialMonth ?? new Date().toISOString().slice(0, 7),
  );
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TransactionFilter>("todos");
  const [view, setView] = useState<DashboardView>("dashboard");
  const [limit, setLimit] = useState(INITIAL_LIMIT);

  // O servidor entrega os dados; o cliente deriva filtros, totais e gráfico sem novas requisições.
  const monthRows = useMemo(
    () => transactionsFromMonth(transactions, month),
    [transactions, month],
  );
  const visibleRows = useMemo(
    () => filterTransactions(monthRows, search, type),
    [monthRows, search, type],
  );
  const monthlyTotals = useMemo(() => totals(monthRows), [monthRows]);
  const overallTotals = useMemo(() => totals(transactions), [transactions]);
  const expenseGroups = useMemo(() => groupExpenses(monthRows), [monthRows]);

  function resetList() {
    setLimit(INITIAL_LIMIT);
  }

  function selectMonth(nextMonth: string) {
    setMonth(nextMonth);
    resetList();
  }

  return (
    <div className="app-shell">
      <Sidebar view={view} onViewChange={setView} demo={demo} email={email} />
      <div className="main-area">
        <header className="topbar">
          <span>
            Meu painel <span className="slash">/</span>{" "}
            <strong>
              {view === "dashboard" ? "Visão geral" : "Transações"}
            </strong>
          </span>
          <span className="private-badge">
            <span /> {demo ? "Modo demonstração" : "Seu espaço privado"}
          </span>
        </header>
        <main className="content">
          {saved && (
            <p className="notice" role="status" style={{ marginBottom: 20 }}>
              Transação salva com sucesso. Seu saldo foi atualizado.
            </p>
          )}
          {demo && (
            <div className="demo-banner">
              <span>
                Você está explorando dados de exemplo. Conecte o Supabase para
                começar sua história.
              </span>
              <Link href="/login">
                Começar <ArrowRight size={14} />
              </Link>
            </div>
          )}
          <section className="page-heading">
            <div>
              <div className="eyebrow">MAIS CONTROLE, MAIS TRANQUILIDADE</div>
              <h1>
                {view === "dashboard"
                  ? "Seu dinheiro, com clareza"
                  : "Suas movimentações"}
                <span>.</span>
              </h1>
              <p>Acompanhe suas finanças e faça espaço para o que importa.</p>
            </div>
            <Link className="primary" href="/dashboard/nova-transacao">
              <Plus size={18} /> Nova transação
            </Link>
          </section>
          <div className="period-row">
            <h2>
              {view === "dashboard"
                ? "Resumo financeiro"
                : "Histórico financeiro"}
            </h2>
            <div className="month-picker">
              <button
                onClick={() => selectMonth(shiftMonth(month, -1))}
                aria-label="Mês anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <input
                aria-label="Mês de referência"
                type="month"
                value={month}
                onChange={(event) => {
                  if (event.target.value) selectMonth(event.target.value);
                }}
              />
              <button
                onClick={() => selectMonth(shiftMonth(month, 1))}
                aria-label="Próximo mês"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <SummaryCards
            balance={overallTotals.balance}
            income={monthlyTotals.income}
            expense={monthlyTotals.expense}
            incomeCount={
              monthRows.filter((transaction) => transaction.tipo === "receita")
                .length
            }
            expenseCount={
              monthRows.filter((transaction) => transaction.tipo === "despesa")
                .length
            }
          />
          <div
            className={
              view === "history" ? "lower-grid history-only" : "lower-grid"
            }
          >
            <TransactionsPanel
              monthRows={monthRows}
              visibleRows={visibleRows}
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                resetList();
              }}
              type={type}
              onTypeChange={(value) => {
                setType(value);
                resetList();
              }}
              limit={limit}
              onShowMore={() => setLimit((current) => current + 10)}
            />
            {view === "dashboard" && (
              <SpendingInsights
                income={monthlyTotals.income}
                expense={monthlyTotals.expense}
                balance={monthlyTotals.balance}
                groups={expenseGroups}
                gradient={expenseGradient(expenseGroups)}
              />
            )}
          </div>
          <footer className="footer">
            <span>
              clareza<span>.</span>{" "}
              <span>Finanças leves. Escolhas conscientes.</span>
            </span>
            <span>Feito para o seu dia a dia.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
