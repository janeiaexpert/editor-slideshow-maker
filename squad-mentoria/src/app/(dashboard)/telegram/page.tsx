"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/date";

interface Mensagem {
  id: number;
  agente: string;
  acao: string;
  detalhes: string | null;
  data: string;
}

interface Escalamento {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: number;
  data: string;
}

export default function TelegramPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [escalamentos, setEscalamentos] = useState<Escalamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondendo, setRespondendo] = useState<number | null>(null);
  const [resposta, setResposta] = useState("");

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);
    try {
      const data = await apiFetch("/telegram/mensagens");
      setMensagens(data.mensagens || []);
      setEscalamentos(data.escalamentos || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  function extrairChatId(detalhes: string | null): number | null {
    if (!detalhes) return null;
    const m = detalhes.match(/\[chat:(\d+)\]/);
    return m ? parseInt(m[1]) : null;
  }

  async function responder(taskId: number, chatId: number) {
    if (!resposta.trim()) return;
    try {
      await apiFetch("/telegram/responder", {
        method: "POST",
        body: JSON.stringify({ chat_id: chatId, mensagem: resposta, task_id: taskId }),
      });
      setResposta("");
      setRespondendo(null);
      await carregar();
    } catch { alert("Erro ao enviar resposta."); }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Telegram</h1>
          <p className="text-zinc-500 text-sm mt-1">Mensagens da comunidade e escalamentos</p>
        </div>
        <button onClick={carregar}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 transition-all"
        >Atualizar</button>
      </div>

      {escalamentos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Escalamentos Pendentes ({escalamentos.length})
          </h2>
          <div className="space-y-3">
            {escalamentos.map((e) => {
              const chatId = extrairChatId(e.descricao) || 0;
              return (
                <div key={e.id} className="rounded-xl border border-red-800/30 bg-red-950/10 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-red-400">{e.titulo}</p>
                      <p className="text-sm text-zinc-400 mt-1">{e.descricao}</p>
                      <p className="text-xs text-zinc-600 mt-2">Prioridade: {e.prioridade} — {formatDate(e.data)}</p>
                    </div>
                  </div>
                  {respondendo === e.id ? (
                    <div className="mt-4 space-y-2">
                      <textarea value={resposta} onChange={(e) => setResposta(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        placeholder="Digite a resposta..." rows={3}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => responder(e.id, chatId)}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 transition-all"
                        >Enviar Resposta</button>
                        <button onClick={() => { setRespondendo(null); setResposta(""); }}
                          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 transition-all"
                        >Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setRespondendo(e.id)}
                      className="mt-3 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                    >✎ Responder</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Histórico de Mensagens</h2>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        ) : mensagens.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 p-12 text-center">
            <p className="text-zinc-500">Nenhuma mensagem recebida ainda.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {mensagens.map((m) => (
              <div key={m.id} className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-5 py-3 flex items-start gap-3">
                <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${
                  m.acao.includes("Respondeu") ? "bg-emerald-500" :
                  m.acao.includes("Erro") ? "bg-red-500" :
                  m.acao.includes("Escalar") ? "bg-amber-500" : "bg-blue-500"
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-emerald-400">{m.agente}</span>
                    <span className="text-xs text-zinc-500">{m.acao}</span>
                  </div>
                  {m.detalhes && (
                    <p className="text-sm text-zinc-400 mt-0.5">
                      {m.detalhes.replace(/\[chat:\d+\]\s*/, "")}
                    </p>
                  )}
                  <p className="text-xs text-zinc-600 mt-1">{formatDate(m.data)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
