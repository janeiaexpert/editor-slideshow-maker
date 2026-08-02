"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Student {
  id: number;
  full_name: string;
  email: string;
  telegram_id: string | null;
  current_stage: string;
  status: string;
  health_score: number;
  churn_risk: string;
  entry_date: string;
}

const stages = ["incubator", "recorded_lessons", "community", "acceleration", "ceo_mentoring", "advanced"];
const stageLabels: Record<string, string> = {
  incubator: "Incubadora",
  recorded_lessons: "Aulas Gravadas",
  community: "Comunidade",
  acceleration: "Aceleração",
  ceo_mentoring: "Mentoria CEO",
  advanced: "Avançado",
};
const statusLabels: Record<string, string> = {
  new: "Novo",
  active: "Ativo",
  renewal_pending: "Renovação Pendente",
  renewed: "Renovado",
  paused: "Pausado",
  completed: "Concluído",
  cancelled: "Cancelado",
  vip: "VIP",
};

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", current_plan: "1_month", contract_duration: "1_month" });

  async function load() {
    setLoading(true);
    try {
      setStudents(await apiFetch("/students"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await apiFetch("/students", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ full_name: "", email: "", current_plan: "1_month", contract_duration: "1_month" });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alunos</h1>
          <p className="text-zinc-500 text-sm mt-1">{students.length} alunos cadastrados</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold hover:bg-emerald-500 transition-all"
        >
          {showForm ? "Cancelar" : "+ Novo Aluno"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Nome</label>
              <input
                type="text" required value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="Nome do aluno"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">E-mail</label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Plano</label>
              <select
                value={form.current_plan}
                onChange={(e) => setForm({ ...form, current_plan: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="1_month">1 Mês</option>
                <option value="3_months">3 Meses</option>
                <option value="6_months">6 Meses</option>
                <option value="12_months">12 Meses</option>
                <option value="lifetime">Vitalício</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Duração</label>
              <select
                value={form.contract_duration}
                onChange={(e) => setForm({ ...form, contract_duration: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="1_month">1 Mês</option>
                <option value="3_months">3 Meses</option>
                <option value="6_months">6 Meses</option>
                <option value="12_months">12 Meses</option>
                <option value="lifetime">Vitalício</option>
              </select>
            </div>
          </div>
          <button type="submit" className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold hover:bg-emerald-500 transition-all">
            Cadastrar Aluno
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 p-12 text-center">
          <p className="text-zinc-500">Nenhum aluno cadastrado.</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-sm text-emerald-400 hover:underline">
            Cadastrar primeiro aluno
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s) => (
            <Link
              key={s.id}
              href={`/students/${s.id}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 hover:border-zinc-700 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-400 group-hover:bg-emerald-600/20 group-hover:text-emerald-400 transition-all">
                  {s.full_name.charAt(0)}
                </div>
                <HealthBadge score={s.health_score} />
              </div>
              <h3 className="font-semibold">{s.full_name}</h3>
              <p className="text-sm text-zinc-500 mt-0.5">{s.email}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-800/30">
                  {stageLabels[s.current_stage] || s.current_stage}
                </span>
                <span className="text-xs text-zinc-500">
                  {statusLabels[s.status] || s.status}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  s.churn_risk === "critical" ? "bg-red-500/10 text-red-400" :
                  s.churn_risk === "high" ? "bg-orange-500/10 text-orange-400" :
                  "bg-emerald-500/10 text-emerald-400"
                }`}>
                  Churn: {s.churn_risk}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function HealthBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-400 border-emerald-800/30" :
                score >= 60 ? "text-amber-400 border-amber-800/30" :
                score >= 40 ? "text-orange-400 border-orange-800/30" :
                "text-red-400 border-red-800/30";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${color}`}>
      {score}
    </span>
  );
}
