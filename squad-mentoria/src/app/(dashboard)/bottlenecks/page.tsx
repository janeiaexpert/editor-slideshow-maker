"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { formatDateShort } from "@/lib/date";

interface Bottleneck {
  id: number;
  title: string;
  description: string;
  area: string;
  severity: number;
  status: string;
  estimated_impact: string | null;
  recommendation: string | null;
  detected_by: string;
  detected_at: string;
  student_id?: number;
}

const areaLabels: Record<string, string> = {
  ceo: "CEO", coo: "COO", incubator: "Incubadora", learning: "Aprendizado",
  telegram: "Telegram", event: "Eventos", acceleration: "Aceleração",
  support: "Suporte",   churn: "Risco", auditor: "Auditor",
  renewal: "Renovação", student_success: "Sucesso",
  marketing: "Marketing", produto: "Produto", presidente: "Presidente",
};

export default function Bottlenecks() {
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        setBottlenecks(await apiFetch("/bottlenecks"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = bottlenecks.filter((b) => {
    if (filter !== "all" && b.area !== filter) return false;
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    return true;
  });

  const openCount = bottlenecks.filter((b) => b.status === "open").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gargalos</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {bottlenecks.length} registrados · {openCount} abertos
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="all">Todas as áreas</option>
          {Object.keys(areaLabels).map((a) => (
            <option key={a} value={a}>{areaLabels[a]}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="all">Todos os status</option>
          <option value="open">Abertos</option>
          <option value="resolved">Resolvidos</option>
        </select>
        <span className="text-xs text-zinc-600 self-center ml-auto">{filtered.length} resultados</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 p-12 text-center">
          <p className="text-zinc-500">Nenhum gargalo encontrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div key={b.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <SeverityDot severity={b.severity} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{b.title}</h3>
                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{b.description}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <AreaBadge area={b.area} />
                      <span className="text-xs text-zinc-500">por {b.detected_by}</span>
                      <span className="text-xs text-zinc-600">
                        {formatDateShort(b.detected_at)}
                      </span>
                      {b.estimated_impact && (
                        <span className="text-xs text-red-400">{b.estimated_impact}</span>
                      )}
                    </div>
                    {b.recommendation && (
                      <p className="text-xs text-emerald-400 mt-2 italic">→ {b.recommendation}</p>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                  b.status === "open"
                    ? "bg-red-500/10 text-red-400 border border-red-800/30"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-800/30"
                }`}>
                  {b.status === "open" ? "Aberto" : "Resolvido"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SeverityDot({ severity }: { severity: number }) {
  const color = severity >= 8 ? "bg-red-500" : severity >= 5 ? "bg-amber-500" : "bg-emerald-500";
  return <div className={`h-3 w-3 rounded-full ${color} mt-0.5 shrink-0`} />;
}

function AreaBadge({ area }: { area: string }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
      {areaLabels[area] || area}
    </span>
  );
}
