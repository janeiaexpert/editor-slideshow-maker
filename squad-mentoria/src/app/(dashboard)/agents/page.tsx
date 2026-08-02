"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/date";

interface AgentLog {
  id: number;
  agentName: string;
  area: string;
  action: string;
  createdAt: string;
}

interface StatusData {
  openBottlenecks: number;
  totalBottlenecks: number;
  recentLogs: AgentLog[];
}

interface AgentResult {
  agent: string;
  result: Record<string, unknown>;
}

interface RunAllResponse {
  processed: number;
  results: AgentResult[];
}

const areaLabels: Record<string, string> = {
  ceo: "CEO", coo: "COO", incubator: "Incubadora", learning: "Aprendizado",
  telegram: "Telegram", event: "Eventos", acceleration: "Aceleração",
  support: "Suporte", churn: "Risco", auditor: "Auditor",
  renewal: "Renovação", student_success: "Sucesso",
};

const areaEmojis: Record<string, string> = {
  ceo: "👔", coo: "⚙️", incubator: "🏗️", learning: "📚",
  telegram: "💬", event: "📅", acceleration: "🚀", support: "🎧",
  churn: "⚠️", auditor: "🔍", renewal: "🔄", student_success: "⭐",
};

const keyMap: Record<string, string> = {
  bottlenecks: "gargalos", executive_summary: "resumo executivo", priorities: "prioridades",
  decisions: "decisões", analyses: "análises", critical_students: "alunos críticos",
  summary: "resumo", patterns: "padrões", recovery_plans: "planos de recuperação",
  expiring_soon: "expiração próxima", engagement_plans: "planos de engajamento",
  recovery_tasks: "tarefas de recuperação", sales_alerts: "alertas de vendas",
  module_analysis: "análise de módulos", most_abandoned: "mais abandonado",
  dropout_rate: "taxa de evasão", suggestions: "sugestões",
  low_engagement: "baixo engajamento", stuck_students: "alunos travados",
  progress_summary: "resumo do progresso", recommendations: "recomendações",
  tickets: "chamados", ai_resolved: "resolvidos por IA", human_needed: "humano necessário",
  classified_messages: "mensagens classificadas", escalated: "escalonados",
  interventions: "intervenções", success_plan: "plano de sucesso",
  observations: "observações", title: "título", description: "descrição",
  estimated_impact: "impacto estimado", recommendation: "recomendação",
  action: "ação", reason: "motivo", impact: "impacto",
  student: "aluno", days_left: "dias restantes", priority: "prioridade",
  health_score: "score de saúde", churn_risk: "risco de evasão",
  students_to_recover: "alunos a recuperar", escalations: "escalonamentos",
};

function formatReport(data: Record<string, unknown>, depth = 0): string {
  if (!data || typeof data !== "object") return String(data ?? "—");
  const lines: string[] = [];
  for (const [key, val] of Object.entries(data)) {
    const label = keyMap[key] ?? key.replace(/_/g, " ");
    if (Array.isArray(val)) {
      if (val.length === 0) continue;
      lines.push(`${"  ".repeat(depth)}▪ ${label}: ${val.map((v) => typeof v === "object" ? formatReport(v, depth + 1) : String(v)).join(", ")}`);
    } else if (typeof val === "object" && val !== null) {
      lines.push(`${"  ".repeat(depth)}▪ ${label}:`);
      lines.push(formatReport(val as Record<string, unknown>, depth + 1));
    } else if (val !== null && val !== "" && val !== 0) {
      lines.push(`${"  ".repeat(depth)}▪ ${label}: ${String(val).slice(0, 200)}`);
    }
  }
  return lines.join("\n") || "—";
}

export default function Agents() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [generalReport, setGeneralReport] = useState<string | null>(null);
  const [generalOpen, setGeneralOpen] = useState(false);

  useEffect(() => { loadStatus(); }, []);

  async function loadStatus() {
    setLoading(true);
    try {
      setStatus(await apiFetch("/agents/status"));
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  async function runOne(key: string) {
    setRunning(key);
    setSelected(key);
    setReport(null);
    try {
      const res = await apiFetch("/agents/run", {
        method: "POST",
        body: JSON.stringify({ agent_type: key }),
      });
      const data = res.result?.result ?? res.result ?? res;
      setReport(formatReport(data));
      await loadStatus();
    } catch { setReport("Erro ao executar agente."); } finally { setRunning(null); }
  }

  async function runAll() {
    setRunning("all");
    setGeneralOpen(true);
    setGeneralReport(null);
    try {
      const res: RunAllResponse = await apiFetch("/agents/run-all", { method: "POST" });
      const blocks = res.results.map((r) => {
        const key = Object.entries(areaLabels).find(([, v]) => r.agent.toLowerCase().includes(v.toLowerCase()))?.[0] ?? "";
        const emoji = areaEmojis[key] || "🤖";
        return `╔══ ${emoji} ${r.agent} ══╗\n${formatReport(r.result)}\n`;
      });
      setGeneralReport(blocks.join("\n"));
      await loadStatus();
    } catch { setGeneralReport("Erro ao executar agentes."); } finally { setRunning(null); }
  }

  async function runSquadCycle() {
    setRunning("cycle");
    try {
      await apiFetch("/agents/squad-cycle", { method: "POST" });
      setTimeout(loadStatus, 5000);
    } catch { /* ignore */ } finally { setRunning(null); }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agentes Autônomos</h1>
          <p className="text-zinc-500 text-sm mt-1">12 agentes de IA — clique em um card para ver o relatório</p>
        </div>
        <div className="flex gap-3">
          <button onClick={runSquadCycle} disabled={!!running}
            className="rounded-lg border border-emerald-700 px-5 py-2.5 text-sm font-semibold hover:bg-zinc-800 transition-all"
          >Ciclo Completo</button>
          <button onClick={runAll} disabled={!!running}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all flex items-center gap-2 ${
              running === "all" ? "bg-zinc-800 text-zinc-500" : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >{running === "all" ? "Analisando..." : "▶ Rodar Todos"}</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Object.entries(areaLabels).map(([key, label]) => {
          const isSelected = selected === key;
          const isLoading = running === key;
          return (
            <button key={key} onClick={() => runOne(key)} disabled={!!running}
              className={`rounded-xl border p-4 text-center transition-all cursor-pointer hover:bg-zinc-800/50 ${
                isSelected ? "border-emerald-500 bg-zinc-800/70" : "border-zinc-800 bg-zinc-900/50"
              } ${isLoading ? "opacity-50" : ""}`}
            >
              <span className="text-2xl block">{isLoading ? "⏳" : areaEmojis[key] || "🤖"}</span>
              <p className="text-xs font-medium mt-2">{label}</p>
            </button>
          );
        })}
      </div>

      {report && selected && (
        <div className="rounded-xl border border-emerald-800/30 bg-emerald-950/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{areaEmojis[selected]}</span>
            <h2 className="text-lg font-semibold">{areaLabels[selected]}</h2>
          </div>
          <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">{report}</pre>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button onClick={() => setGeneralOpen(!generalOpen)}
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >{generalOpen ? "▾" : "▸"} Relatório Geral</button>
        {running === "all" && <span className="text-sm text-emerald-400 animate-pulse">Analisando...</span>}
      </div>
      {generalOpen && generalReport && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">{generalReport}</pre>

        </div>
      )}
      {generalOpen && !generalReport && running !== "all" && (
        <p className="text-sm text-zinc-600">Clique em "Rodar Todos" para gerar o relatório geral.</p>
      )}

      <div>
          <h2 className="text-lg font-semibold mb-4">Registros dos Agentes</h2>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        ) : (status?.recentLogs ?? []).length === 0 ? (
          <div className="rounded-xl border border-zinc-800 p-12 text-center">
            <p className="text-zinc-500">Nenhum registro ainda. Execute os agentes.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {(status?.recentLogs ?? []).map((log) => (
              <div key={log.id} className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-5 py-3 flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-emerald-400">{log.agentName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">
                      {areaLabels[log.area] || log.area}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-0.5">{log.action}</p>
                  <p className="text-xs text-zinc-600 mt-1">{formatDate(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
