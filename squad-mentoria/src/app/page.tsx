import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(5,150,105,0.15),transparent_50%)]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800 bg-emerald-950/50 px-4 py-1.5 text-sm text-emerald-300 mb-8">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Incubadora Sempre Aberta
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Squad{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Mentoria
          </span>
        </h1>

        <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
          Plataforma com <strong className="text-zinc-200">agentes autônomos de IA</strong> que analisam
          Marketing/Vendas, Produto e Presidência para detectar gargalos
          nos alunos da incubadora em tempo real.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-emerald-600 px-8 py-3.5 font-semibold text-base hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/30"
          >
            Acessar Painel
          </Link>
          <Link
            href="/students"
            className="rounded-lg border border-zinc-700 px-8 py-3.5 font-semibold text-base hover:bg-zinc-800 transition-all"
          >
            Ver Alunos
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl px-6">
        {[
          { area: "Marketing / Vendas", desc: "Leads, conversão e funil", agent: "🤖" },
          { area: "Produto", desc: "Entrega, qualidade e NPS", agent: "🤖" },
          { area: "Presidência", desc: "Estratégia, finanças e crescimento", agent: "🤖" },
        ].map((item) => (
          <div
            key={item.area}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 text-center backdrop-blur-sm"
          >
            <span className="text-2xl mb-2 block">{item.agent}</span>
            <h3 className="font-semibold text-zinc-200">{item.area}</h3>
            <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
