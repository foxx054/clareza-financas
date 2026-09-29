import { Sprout } from "lucide-react";
import { money, type ExpenseGroup } from "@/lib/finance";

export function SpendingInsights({
  income,
  expense,
  balance,
  groups,
  gradient,
}: {
  income: number;
  expense: number;
  balance: number;
  groups: ExpenseGroup[];
  gradient: string;
}) {
  return (
    <aside className="insights">
      <section className="panel spending">
        <h2>Para onde vai seu dinheiro?</h2>
        <p>Despesas por categoria neste mês.</p>
        <div
          className="donut"
          role="img"
          aria-label={`Total de despesas: ${money(expense)}. Detalhes por categoria abaixo.`}
          style={{
            background: expense ? `conic-gradient(${gradient})` : "#eeedf2",
          }}
        >
          <div>
            <small>Total de despesas</small>
            <strong>{money(expense)}</strong>
          </div>
        </div>
        <div className="legend">
          {groups.length ? (
            groups.map((group) => (
              <div key={group.category}>
                <span>
                  <i style={{ background: group.color }} />
                  {group.category}
                </span>
                <strong>
                  {group.percentage.toFixed(1).replace(".", ",")}%
                </strong>
              </div>
            ))
          ) : (
            <p>Nenhuma despesa neste período.</p>
          )}
        </div>
      </section>
      <section className="insight-card">
        <span>
          <Sprout size={18} /> UM OLHAR PARA O MÊS
        </span>
        <h3>
          {income > 0 && balance >= 0
            ? "Seu futuro agradece."
            : "Clareza é o primeiro passo."}
        </h3>
        <p>
          {income > 0 && balance >= 0 ? (
            <>
              Você manteve{" "}
              <strong>
                {Math.round((balance / income) * 100)}% das suas receitas
              </strong>{" "}
              neste mês. Continue acompanhando seus hábitos.
            </>
          ) : (
            "Registre suas movimentações para entender seus hábitos e planejar os próximos passos."
          )}
        </p>
      </section>
    </aside>
  );
}
