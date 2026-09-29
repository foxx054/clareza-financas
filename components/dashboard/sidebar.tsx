import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
  Sprout,
} from "lucide-react";
import { signOut } from "@/app/actions";

export type DashboardView = "dashboard" | "history";

export function Sidebar({
  view,
  onViewChange,
  demo,
  email,
}: {
  view: DashboardView;
  onViewChange: (view: DashboardView) => void;
  demo: boolean;
  email?: string;
}) {
  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="brand">
        <span className="brand-symbol">◈</span> clareza
        <span className="brand-dot">.</span>
      </Link>
      <div className="workspace-label">SEU ESPAÇO FINANCEIRO</div>
      <nav>
        <button
          className={view === "dashboard" ? "nav active" : "nav"}
          onClick={() => onViewChange("dashboard")}
        >
          <LayoutDashboard size={19} /> Visão geral
        </button>
        <button
          className={view === "history" ? "nav active" : "nav"}
          onClick={() => onViewChange("history")}
        >
          <ArrowLeftRight size={19} /> Transações
        </button>
      </nav>
      <div className="sidebar-tip">
        <div className="tip-icon">
          <Sprout size={25} />
        </div>
        <strong>
          Pequenos passos.
          <br />
          Grandes conquistas.
        </strong>
        <p>Cuidar do seu dinheiro é cuidar do seu futuro.</p>
        <span>
          Um dia de cada vez <ArrowUpRight size={15} />
        </span>
      </div>
      <div className="profile">
        <div className="avatar">
          {demo ? "D" : email?.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <strong>{demo ? "Conta demonstração" : email?.split("@")[0]}</strong>
          <small>{demo ? "Explore o Clareza" : "Seu espaço pessoal"}</small>
        </div>
        {!demo && (
          <form action={signOut}>
            <button className="icon-button" aria-label="Sair">
              <LogOut size={17} />
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}
