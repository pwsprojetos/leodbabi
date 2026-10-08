import type { Metadata } from "next";
import "./globals.css";
import { AuthGate } from "./auth";

export const metadata: Metadata = {
  title: "Mercado Liverpoll | Gestão de vendas",
  description: "Painel de vendas para redes de supermercado",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body><AuthGate>{children}</AuthGate></body>
    </html>
  );
}
