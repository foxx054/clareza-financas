"use client";
import { useActionState, useState } from "react";
import { createTransaction } from "@/app/actions";
import { categories } from "@/lib/finance";
import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";

export default function TransactionForm({ demo }: { demo: boolean }) {
  // useActionState conecta o formulário à Server Action e mantém erro e carregamento no cliente.
  const [state, action, pending] = useActionState(createTransaction, {});
  const [type, setType] = useState("despesa");
  return (
    <form action={action} className="entry-form">
      <fieldset>
        <legend>Tipo de movimentação</legend>
        <div className="type-options">
          {["despesa", "receita"].map((value) => (
            <label key={value} className={type === value ? "selected" : ""}>
              <input
                type="radio"
                name="tipo"
                value={value}
                checked={type === value}
                onChange={() => setType(value)}
              />
              {value === "despesa" ? (
                <ArrowUpRight size={18} />
              ) : (
                <ArrowDownLeft size={18} />
              )}{" "}
              {value === "despesa" ? "Despesa" : "Receita"}
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        Descrição
        <input
          name="descricao"
          placeholder="Ex.: Compras da semana"
          minLength={2}
          maxLength={120}
          required
        />
      </label>
      <div className="form-row">
        <label>
          Valor (R$)
          <input
            name="valor"
            inputMode="decimal"
            placeholder="0,00"
            pattern="[0-9]{1,9}([.,][0-9]{1,2})?"
            required
          />
          <small>Use vírgula ou ponto, sem separador de milhar.</small>
        </label>
        <label>
          Data
          <input
            name="data"
            type="date"
            defaultValue={new Date().toLocaleDateString("en-CA")}
            required
          />
        </label>
      </div>
      <label>
        Categoria
        <select name="categoria" defaultValue="Outros">
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      {demo && (
        <p className="notice">
          Modo demonstração: configure o Supabase seguindo o README para salvar
          suas transações.
        </p>
      )}
      {state.error && (
        <p role="alert" className="error-message">
          {state.error}
        </p>
      )}
      <button className="primary full" disabled={pending || demo}>
        <Plus size={18} />
        {pending ? "Salvando..." : "Salvar transação"}
      </button>
    </form>
  );
}
