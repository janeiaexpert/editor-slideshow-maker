"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/date";

interface DashboardData {
  total_students: number;
  active_students: number;
  healthy_count: number;
  attention_count: number;
  risk_count: number;
  critical_count: number;
  total_bottlenecks: number;
  open_bottlenecks: number;
  biggest_bottleneck: { title: string; impact: string } | null;
  expiring_30_days: number;
  expiring_15_days: number;
  average_lifetime: number;
  predicted_renewals: number;
  predicted_churn: number;
}

interface AgentLog {
  id: number;
  agentName: string;
  area: string;
  action: string;
  createdAt: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dash, status] = await Promise.all([
          apiFetch("/dashboard"),
          apiFetch("/agents/status"),
        ]);
        setData(dash);
        setLogs(status.recentLogs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Painel do CEO</h1>
        <p className="text-zinc-500 text-sm mt-1">Visão geral da incubadora</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Alunos Ativos" value={data?.active_students ?? 0} color="emerald" />
        <StatCard label="Gargalos Abertos" value={data?.open_bottlenecks ?? 0} color="red" />
        <StatCard label="Expirando em 30d" value={data?.expiring_30_days ?? 0} color="amber" />
        <StatCard label="Previsão Renovação" value={data?.predicted_renewals ?? 0} color="blue" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <HealthBlock label="Saudáveis" count={data?.healthy_count ?? 0} color="bg-emerald-500" />
        <HealthBlock label="Atenção" count={data?.attention_count ?? 0} color="bg-amber-500" />
        <HealthBlock label="Risco" count={data?.risk_count ?? 0} color="bg-orange-500" />
        <HealthBlock label="Crítico" count={data?.critical_count ?? 0} color="bg-red-500" />
        <HealthBlock label="Risco de Evasão" count={data?.predicted_churn ?? 0} color="bg-red-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="font-semibold">Maior Gargalo</h2>
          </div>
          <div className="p-5">
            {data?.biggest_bottleneck ? (
              <div>
                <p className="font-medium">{data.biggest_bottleneck.title}</p>
                <p className="text-sm text-zinc-400 mt-1">Impacto: {data.biggest_bottleneck.impact}</p>
              </div>
            ) : (
              <p className="text-zinc-600 text-sm">Nenhum gargalo detectado ainda.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="font-semibold">Atividades dos Agentes</h2>
            <Link href="/agents" className="text-xs text-emerald-400 hover:text-emerald-300">
              Ver agentes
            </Link>
          </div>
          <div className="p-5 space-y-3 max-h-[400px] overflow-y-auto">
            {logs.length === 0 && (
              <p className="text-zinc-600 text-sm text-center py-8">Nenhuma atividade ainda.</p>
            )}
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p>
                    <span className="font-medium text-emerald-400">{log.agentName}</span>
                    <span className="text-zinc-500 mx-1">—</span>
                    {log.action}
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    {formatDate(log.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    emerald: "border-emerald-800/30 bg-emerald-950/20 text-emerald-400",
    red: "border-red-800/30 bg-red-950/20 text-red-400",
    amber: "border-amber-800/30 bg-amber-950/20 text-amber-400",
    blue: "border-blue-800/30 bg-blue-950/20 text-blue-400",
  };
  return (
    <div className={`rounded-xl border ${colors[color].split(" ").slice(0, 2).join(" ")} p-5`}>
      <p className="text-zinc-500 text-sm">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${colors[color].split(" ").slice(2).join(" ")}`}>{value}</p>
    </div>
  );
}

function HealthBlock({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
      <div className={`h-3 w-3 rounded-full ${color} mx-auto mb-2`} />
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs text-zinc-500 mt-1">{label}</p>
    </div>
  );
}
