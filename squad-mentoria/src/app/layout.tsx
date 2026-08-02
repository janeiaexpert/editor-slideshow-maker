import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Squad Mentoria",
  description: "Incubadora com agentes autônomos de IA",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
