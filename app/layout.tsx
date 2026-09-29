import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Clareza • Suas finanças, em equilíbrio",
  description: "Organize suas receitas e despesas em um só lugar.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
