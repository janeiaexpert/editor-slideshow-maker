"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

type Resposta = { texto: string; data: string; de: string }

function formatarData(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
  } catch {
    return iso
  }
}

function ResponderInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const [estado, setEstado] = useState<"carregando" | "ok" | "erro" | "enviado">("carregando")
  const [email, setEmail] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [print, setPrint] = useState<string | null>(null)
  const [data, setData] = useState("")
  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [texto, setTexto] = useState("")
  const [erro, setErro] = useState("")
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!token) { setEstado("erro"); return }
    fetch(`/api/suporte?token=${encodeURIComponent(token)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!d || !d.mensagem) { setEstado("erro"); return }
        setEmail(d.email || "")
        setMensagem(d.mensagem || "")
        setPrint(d.print || null)
        setData(d.data || "")
        setRespostas(Array.isArray(d.respostas) ? d.respostas : [])
        setEstado("ok")
      })
      .catch(() => setEstado("erro"))
  }, [token])

  const enviar = async () => {
    if (!texto.trim()) { setErro("Escreva a resposta."); return }
    setEnviando(true)
    setErro("")
    try {
      const res = await fetch("/api/suporte", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "responder", token, texto: texto.trim() }),
      })
      if (!res.ok) { setErro("Não foi possível enviar. Tente de novo."); return }
      setEstado("enviado")
    } catch {
      setErro("Sem conexão. Tente de novo.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5EFE8] flex items-start sm:items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg bg-white border border-[#D9CEC2] rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-[#140C04] via-[#2E1A0B] to-[#5E3E17] px-5 py-4">
          <h1 className="text-white text-base font-bold font-[family-name:var(--font-playfair)]">
            Responder <span className="text-[#E7CD9A]">chamado</span>
          </h1>
          <p className="text-[#F7F1E5]/70 text-xs mt-1">Sua resposta aparece na caixa de notificações do usuário.</p>
        </div>
        <div className="p-5">
          {estado === "carregando" && (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-2 border-[#D9CEC2] border-t-[#8B5E3C] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-[#5C5146]">Carregando chamado...</p>
            </div>
          )}
          {estado === "erro" && (
            <div className="text-center py-8">
              <p className="text-sm font-bold text-[#1A1A1A] mb-1">Link inválido ou expirado</p>
              <p className="text-xs text-[#5C5146]">Confira o link recebido no e-mail.</p>
            </div>
          )}
          {estado === "enviado" && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-green-700 text-xl font-bold">✓</span>
              </div>
              <p className="text-sm font-bold text-[#1A1A1A]">Resposta enviada!</p>
              <p className="text-xs text-[#5C5146] mt-1">O usuário vai ver na caixa de notificações dele.</p>
            </div>
          )}
          {estado === "ok" && (
            <div className="space-y-4">
              <div className="bg-[#F5EFE8] border border-[#D9CEC2] rounded-xl p-3">
                <p className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">
                  {email} • {formatarData(data)}
                </p>
                <p className="text-sm text-[#1A1A1A] mt-1 leading-relaxed whitespace-pre-wrap">{mensagem}</p>
                {print && (
                  <img src={print} alt="Print do usuário" className="mt-2 w-full rounded-lg border border-[#D9CEC2]" />
                )}
              </div>
              {respostas.length > 0 && (
                <div className="space-y-2">
                  {respostas.map((r, i) => (
                    <div key={i} className="bg-[#EDE6DC] border border-[#D9CEC2] rounded-xl p-3">
                      <p className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">
                        Resposta • {formatarData(r.data)}
                      </p>
                      <p className="text-sm text-[#1A1A1A] mt-1 leading-relaxed whitespace-pre-wrap">{r.texto}</p>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Sua resposta</label>
                <textarea
                  value={texto}
                  onChange={e => setTexto(e.target.value)}
                  rows={4}
                  placeholder="Escreva a resposta ao usuário..."
                  className="mt-1.5 w-full text-sm text-[#1A1A1A] bg-white border border-[#D9CEC2] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 resize-y"
                />
              </div>
              {erro && <p className="text-xs text-red-600 font-medium">{erro}</p>}
              <button
                onClick={enviar}
                disabled={enviando}
                className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-60 text-white text-sm font-bold rounded-lg px-4 py-3 transition-colors"
              >
                {enviando ? "Enviando..." : "Enviar resposta"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResponderSuportePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5EFE8] flex items-center justify-center">
        <p className="text-sm text-[#5C5146]">Carregando...</p>
      </div>
    }>
      <ResponderInner />
    </Suspense>
  )
}
