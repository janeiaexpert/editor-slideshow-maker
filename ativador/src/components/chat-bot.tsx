"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Lightbulb, Trash2, BookOpen, LifeBuoy, ImagePlus } from "lucide-react"
import { toast } from "sonner"
import { sanitizeText } from "@/lib/security"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

type StepContent = Record<string, string>

type ChatBotProps = {
  ideia?: string
  tom?: string
  lucro?: number
  steps?: Record<string, StepContent>
  paleta?: string
  fonte?: string
}

const SUGGESTIONS = [
  "Como melhorar minha headline?",
  "Sugira um bonus irrecusavel",
  "Qual preco ideal para meu produto?",
  "Me ajude com o roteiro da VSL",
  "Como estruturar os modulos?",
  "O que e upsell e downsell?",
]

const STORAGE_KEY = "ativador_chat_history"

function hashIdeia(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return h.toString(36)
}

// Histórico separado por produto (a conversa de um produto não mistura na outra)
function chaveHistorico(ideia?: string): string {
  const base = (ideia || "").trim()
  return base ? `${STORAGE_KEY}_${hashIdeia(base)}` : STORAGE_KEY
}

function loadHistory(ideia?: string): ChatMessage[] {
  if (typeof window === "undefined") return []
  try {
    const saved = localStorage.getItem(chaveHistorico(ideia))
    if (saved) {
      const arr = JSON.parse(saved)
      if (Array.isArray(arr)) {
        return arr.filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      }
    }
  } catch {}
  return []
}

function saveHistory(messages: ChatMessage[], ideia?: string) {
  try {
    localStorage.setItem(chaveHistorico(ideia), JSON.stringify(messages.slice(-30)))
  } catch {}
}

export function ChatBot({ ideia, tom, lucro, steps, paleta, fonte }: ChatBotProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadHistory(ideia))
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(messages.length === 0)
  const [provider, setProvider] = useState<string | null>(null)
  const [guiaAberto, setGuiaAberto] = useState(false)
  const [suporteAberto, setSuporteAberto] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const ideiaRef = useRef(ideia)

  // Trocou de produto: carrega a conversa dele (não mistura com a anterior)
  useEffect(() => {
    if (ideiaRef.current !== ideia) {
      ideiaRef.current = ideia
      setMessages(loadHistory(ideia))
      setShowSuggestions(true)
      setProvider(null)
    }
  }, [ideia])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    saveHistory(messages, ideia)
  }, [messages, ideia])

  const getWelcomeMessage = (): string => {
    if (ideia) {
      const nomeProduto = (ideia.split(".")[0] || "seu produto").slice(0, 60)
      return `Ola! Sou o assistente do **Ativador de Produtos**. Vi que voce esta trabalhando em **${nomeProduto}**. Posso ajudar com headlines, modulos, precos, VSL, anuncios e muito mais. O que precisa?`
    }
    return "Ola! Sou o assistente do **Ativador de Produtos**. Posso ajudar com suas headlines, modulos, precos, VSL, anuncios e muito mais. Me pergunte o que quiser!"
  }

  const send = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput("")
    setShowSuggestions(false)

    // Se nao tem mensagens, adiciona a de boas-vindas primeiro
    let allMessages = messages
    if (messages.length === 0) {
      const welcome: ChatMessage = { role: "assistant", content: getWelcomeMessage() }
      allMessages = [welcome]
      setMessages([welcome])
    }

    const userMsg: ChatMessage = { role: "user", content: msg }
    setMessages(p => [...p, userMsg])
    setLoading(true)

    // Calcular progresso
    const progresso: Record<string, boolean> = {}
    if (steps) {
      for (const [k, v] of Object.entries(steps)) {
        progresso[k] = v && typeof v === "object" && Object.keys(v).length > 0
      }
    }

    try {
      const controller = new AbortController()
      const cronometro = setTimeout(() => controller.abort(), 60000)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: msg,
          history: allMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          ideia,
          tom,
          lucro,
          steps: steps ? Object.fromEntries(
            Object.entries(steps)
              .filter(([, v]) => v && typeof v === "object" && Object.keys(v).length > 0)
              .slice(0, 8)
              .map(([k, v]) => [k, Object.values(v)
                .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
                .map(x => x.slice(0, 250))
                .join(" | ").slice(0, 800)])
          ) : undefined,
          paleta,
          fonte,
          progresso,
        }),
      })
      clearTimeout(cronometro)
      const data = await res.json()
      if (data.provider) setProvider(data.provider)
      if (!res.ok && !data.reply) {
        setMessages(p => [...p, { role: "assistant", content: "**Modo offline** — A IA estara disponivel em breve. Enquanto isso, posso ajudar com sugestoes basicas." }])
      } else {
        setMessages(p => [...p, { role: "assistant", content: sanitizeText(data.reply || "Desculpe, nao consegui processar.") }])
      }
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "**Modo offline** — Sem conexao no momento. Tente novamente em instantes." }])
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    setMessages([])
    setShowSuggestions(true)
    setProvider(null)
    toast("Historico limpo!")
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#8B5E3C] text-white shadow-lg flex items-center justify-center hover:bg-[#6B4226] transition-all active:scale-95"
        aria-label="Abrir chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-20 inset-x-4 z-50 sm:inset-x-auto sm:right-5 sm:w-[360px] sm:max-w-[calc(100vw-40px)] bg-white border border-[#D9CEC2] rounded-xl shadow-xl flex flex-col overflow-hidden">
          <div className="bg-[#8B5E3C] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <span className="text-sm font-bold block">Assistente Virtual</span>
                {provider && (
                  <span className="text-[10px] text-white/60">
                    {provider === "local" ? "Modo offline" : `Via ${provider}`}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setGuiaAberto(true)} className="text-white/60 hover:text-white transition-colors" title="Como usar o sistema">
                <BookOpen className="w-4 h-4" />
              </button>
              <button onClick={() => setSuporteAberto(true)} className="text-white/60 hover:text-white transition-colors" title="Suporte técnico">
                <LifeBuoy className="w-4 h-4" />
              </button>
              <button onClick={clearHistory} className="text-white/60 hover:text-white transition-colors" title="Limpar conversa">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 space-y-3 overflow-y-auto overflow-x-hidden max-h-[420px] min-h-[220px]">
            {messages.length === 0 && (
              <div className="text-center py-8 text-[#A67C52]">
                <Bot className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Como posso ajudar?</p>
                <p className="text-xs text-[#5C5146] mt-1">Pergunte sobre seu produto digital</p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 min-w-0 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-[#8B5E3C]" : "bg-[#EDE6DC]"}`}>
                  {m.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-[#8B5E3C]" />}
                </div>
                <div className={`max-w-[85%] min-w-0 rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${m.role === "user" ? "bg-[#8B5E3C] text-white" : "bg-[#EDE6DC] text-[#1A1A1A]"}`}>
                  {renderMessage(m.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#EDE6DC] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#8B5E3C]" />
                </div>
                <div className="bg-[#EDE6DC] rounded-lg px-3 py-2 text-sm text-[#5C5146]">
                  <span className="animate-pulse">Pensando</span>
                  <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>.</span>
                  <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>.</span>
                  <span className="animate-pulse" style={{ animationDelay: "0.6s" }}>.</span>
                </div>
              </div>
            )}

            {showSuggestions && messages.length <= 1 && (
              <div className="mt-3">
                <p className="text-[10px] text-[#A67C52] uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" /> Perguntas rapidas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => send(s)}
                      className="text-xs bg-white border border-[#D9CEC2] text-[#5C5146] px-2.5 py-1.5 rounded-full hover:border-[#8B5E3C] hover:text-[#8B5E3C] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div className="border-t border-[#D9CEC2] p-3 flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Digite sua duvida..."
              className="flex-1 text-sm"
            />
            <Button size="icon" onClick={() => send()} disabled={loading || !input.trim()} className="bg-[#8B5E3C] hover:bg-[#6B4226] shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {guiaAberto && <GuiaSistemaModal onFechar={() => setGuiaAberto(false)} />}
      {suporteAberto && <SuporteModal onFechar={() => setSuporteAberto(false)} />}
    </>
  )
}

function GuiaSistemaModal({ onFechar }: { onFechar: () => void }) {
  const passos = [
    { t: "1. Escolha o produto", d: "Na home use a Vitrine, ou no painel use a Biblioteca. Pode também criar do zero com sua própria ideia." },
    { t: "2. Gere por abas", d: "Siga a ordem: Produto → Vendas → Operação → Artefatos. Use o botão Gerar Todos ou gere um passo por vez." },
    { t: "3. Ajuste o que precisar", d: "Cada card tem Editar e Regenerar. Antes de gerar, escolha a paleta de cores e a fonte." },
    { t: "4. Exporte e publique", d: "Baixe os arquivos (PDF, imagem, HTML) ou publique a Página de Vendas e compartilhe o link." },
  ]
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={onFechar}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="bg-[#8B5E3C] px-4 py-3 flex items-center justify-between sticky top-0">
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Como usar o sistema
          </span>
          <button onClick={onFechar} className="text-white/70 hover:text-white" aria-label="Fechar">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          {passos.map((p, i) => (
            <div key={i} className="flex gap-3 bg-[#F5EFE8] border border-[#D9CEC2] rounded-xl p-3">
              <div className="w-7 h-7 rounded-full bg-[#8B5E3C] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div>
                <p className="text-xs font-bold text-[#1A1A1A]">{p.t}</p>
                <p className="text-xs text-[#5C5146] mt-0.5 leading-relaxed">{p.d}</p>
              </div>
            </div>
          ))}
          <p className="text-[11px] text-[#5C5146] leading-relaxed">
            Dicas: preencha os números reais da página (sem inventar); o selo <strong>Modelo padrão</strong> significa que a IA falhou — clique em Regenerar. Dúvidas? Use o botão <strong>Suporte técnico</strong> (resposta em até 48h úteis).
          </p>
        </div>
      </div>
    </div>
  )
}

function SuporteModal({ onFechar }: { onFechar: () => void }) {
  const [texto, setTexto] = useState("")
  const [email, setEmail] = useState("")
  const [print, setPrint] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")

  const anexar = (f: File | undefined) => {
    if (!f) return
    if (!f.type.startsWith("image/")) { setErro("Anexe uma imagem (print da tela)."); return }
    if (f.size > 3 * 1024 * 1024) { setErro("Imagem muito grande (máx 3MB)."); return }
    const r = new FileReader()
    r.onload = () => { setPrint(r.result as string); setErro("") }
    r.onerror = () => setErro("Não consegui ler a imagem.")
    r.readAsDataURL(f)
  }

  const enviar = async () => {
    if (!texto.trim()) { setErro("Descreva o problema."); return }
    setEnviando(true)
    setErro("")
    try {
      const res = await fetch("/api/suporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: texto.trim(), print, email: email.trim() || undefined }),
      })
      const data = await res.json().catch(() => ({} as { error?: string }))
      if (!res.ok) { setErro(data.error || "Não foi possível enviar. Tente de novo."); return }
      toast("Chamado enviado! Resposta em até 48h úteis.")
      onFechar()
    } catch {
      setErro("Sem conexão. Tente de novo.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={onFechar}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="bg-[#8B5E3C] px-4 py-3 flex items-center justify-between sticky top-0">
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <LifeBuoy className="w-4 h-4" /> Suporte técnico
          </span>
          <button onClick={onFechar} className="text-white/70 hover:text-white" aria-label="Fechar">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-[#5C5146] leading-relaxed">
            Descreva o problema e anexe um print da tela. Respondemos em <strong>até 48h úteis</strong> na sua caixa de notificações (sino no topo do painel).
          </p>
          <div>
            <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">O que aconteceu? *</label>
            <textarea
              value={texto}
              onChange={e => setTexto(e.target.value)}
              rows={4}
              placeholder="Ex.: cliquei em Gerar na Capa e deu erro..."
              className="mt-1.5 w-full text-sm text-[#1A1A1A] bg-white border border-[#D9CEC2] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 resize-y"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Print da tela</label>
            <div className="mt-1.5 flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#8B5E3C] bg-[#F5EFE8] border border-[#D9CEC2] rounded-lg px-3 py-2 cursor-pointer hover:bg-[#EDE6DC]">
                <ImagePlus className="w-4 h-4" /> Anexar imagem
                <input type="file" accept="image/*" className="hidden" onChange={e => anexar(e.target.files?.[0])} />
              </label>
              {print && (
                <button onClick={() => setPrint(null)} className="text-xs text-red-500 hover:underline">Remover</button>
              )}
            </div>
            {print && (
              <img src={print} alt="Print anexado" className="mt-2 w-full max-h-40 object-contain rounded-lg border border-[#D9CEC2] bg-[#F5EFE8]" />
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Seu e-mail (se não entrou com Google)</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className="mt-1.5 w-full text-sm text-[#1A1A1A] bg-white border border-[#D9CEC2] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30"
            />
          </div>
          {erro && <p className="text-xs text-red-600 font-medium">{erro}</p>}
          <button
            onClick={enviar}
            disabled={enviando}
            className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] disabled:opacity-60 text-white text-sm font-bold rounded-lg px-4 py-3 transition-colors"
          >
            {enviando ? "Enviando..." : "Enviar chamado"}
          </button>
        </div>
      </div>
    </div>
  )
}

function renderMessage(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}
