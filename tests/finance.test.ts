import assert from "node:assert/strict";
import { test } from "node:test";
import { parseAmount, totals, type Transaction } from "../lib/finance.ts";
test("valores monetários aceitam vírgula ou ponto e rejeitam entradas ambíguas", () => {
  assert.equal(parseAmount("123,45"), 12345);
  assert.equal(parseAmount("0.01"), 1);
  assert.equal(parseAmount("999999999.99"), 99999999999);
  for (const value of [
    "0",
    "-1",
    "1.001",
    "1.000,00",
    "NaN",
    "Infinity",
    "1e3",
    "",
    "1000000000",
  ])
    assert.equal(parseAmount(value), null, value);
});
test("saldos somam centavos sem acumular arredondamentos de ponto flutuante", () => {
  const rows = [
    { valor: 0.1, tipo: "receita" },
    { valor: 0.2, tipo: "receita" },
    { valor: 0.3, tipo: "despesa" },
  ] as Transaction[];
  assert.deepEqual(totals(rows), { income: 0.3, expense: 0.3, balance: 0 });
  assert.deepEqual(totals([]), { income: 0, expense: 0, balance: 0 });
});
