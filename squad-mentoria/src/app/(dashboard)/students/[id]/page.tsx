"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface StudentDetail {
  id: number;
  full_name: string;
  email: string;
  telegram_id: string | null;
  current_stage: string;
  status: string;
  health_score: number;
  churn_risk: string;
  renewal_probability: string;
  lifetime_value: number;
  renewal_count: number;
  total_time_inside: number;
  incubator_progress: number;
  learning_progress: number;
  telegram_activity: number;
  event_attendance: number;
  entry_date: string;
  contracts: any[];
  metrics: { id: number; name: string; value: number; area: string; recorded_at: string }[];
  tasks: any[];
}

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setStudent(await apiFetch(`/students/${id}`));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!student) return (
    <div className="text-center py-16">
      <p className="text-zinc-500">Aluno não encontrado</p>
      <Link href="/students" className="text-emerald-400 text-sm mt-2 inline-block hover:underline">Voltar</Link>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/students" className="text-sm text-zinc-500 hover:text-zinc-300 mb-2 inline-block">← Voltar</Link>
          <h1 className="text-2xl font-bold">{student.full_name}</h1>
          <p className="text-zinc-500 text-sm">{student.email}</p>
        </div>
        <div className="flex gap-2 items-start">
          <HealthScore score={student.health_score} />
          <ChurnBadge risk={student.churn_risk} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard label="Saúde" value={student.health_score.toString()} />
        <InfoCard label="Risco de Evasão" value={student.churn_risk} />
        <InfoCard label="Renovação" value={student.renewal_probability} />
        <InfoCard label="Renovações" value={student.renewal_count.toString()} />
        <InfoCard label="Dias na Mentoria" value={student.total_time_inside.toString()} />
        <InfoCard label="Valor Vitalício" value={`$${student.lifetime_value}`} />
        <InfoCard label="Progresso Incubadora" value={`${student.incubator_progress}%`} />
        <InfoCard label="Progresso Aprendizado" value={`${student.learning_progress}%`} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Métricas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {student.metrics?.slice(0, 8).map((m) => (
            <div key={m.id} className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
              <p className="text-xs text-zinc-500">{m.name}</p>
              <p className="text-xl font-bold mt-1">{m.value}</p>
            </div>
          )) || <p className="text-zinc-600 text-sm col-span-full">Nenhuma métrica.</p>}
        </div>
      </div>
    </div>
  );
}

function HealthScore({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-400 border-emerald-800/30 bg-emerald-950/20" :
                score >= 60 ? "text-amber-400 border-amber-800/30 bg-amber-950/20" :
                score >= 40 ? "text-orange-400 border-orange-800/30 bg-orange-950/20" :
                "text-red-400 border-red-800/30 bg-red-950/20";
  return (
    <div className={`rounded-lg border px-4 py-2 text-center ${color}`}>
      <p className="text-xs">Saúde</p>
      <p className="text-xl font-bold">{score}</p>
    </div>
  );
}

function ChurnBadge({ risk }: { risk: string }) {
  const colors: Record<string, string> = {
    low: "text-emerald-400 border-emerald-800/30",
    medium: "text-amber-400 border-amber-800/30",
    high: "text-orange-400 border-orange-800/30",
    critical: "text-red-400 border-red-800/30",
  };
  return (
    <div className={`rounded-lg border px-4 py-2 text-center ${colors[risk] || ""}`}>
      <p className="text-xs">Evasão</p>
      <p className="text-xl font-bold capitalize">{risk}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-sm font-bold mt-1">{value}</p>
    </div>
  );
}
