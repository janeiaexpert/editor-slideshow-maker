"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Lightbulb, Trash2 } from "lucide-react"
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

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return []
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return []
}

function saveHistory(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)))
  } catch {}
}

export function ChatBot({ ideia, tom, lucro, steps, paleta, fonte }: ChatBotProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(messages.length === 0)
  const [provider, setProvider] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    saveHistory(messages)
  }, [messages])

  const getWelcomeMessage = (): string => {
    if (ideia) {
      const nomeProduto = ideia.split(".")[0] || "seu produto"
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: allMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          ideia,
          tom,
          lucro,
          steps: steps ? Object.fromEntries(
            Object.entries(steps)
              .filter(([, v]) => v && typeof v === "object" && Object.keys(v).length > 0)
              .map(([k, v]) => [k, Object.keys(v)])
          ) : undefined,
          paleta,
          fonte,
          progresso,
        }),
      })
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
        <div className="fixed bottom-20 right-5 z-50 w-[360px] max-w-[calc(100vw-40px)] bg-white border border-[#D9CEC2] rounded-xl shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
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
              <button onClick={clearHistory} className="text-white/60 hover:text-white transition-colors" title="Limpar conversa">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[420px] min-h-[220px]">
            {messages.length === 0 && (
              <div className="text-center py-8 text-[#A67C52]">
                <Bot className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Como posso ajudar?</p>
                <p className="text-xs text-[#5C5146] mt-1">Pergunte sobre seu produto digital</p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-[#8B5E3C]" : "bg-[#EDE6DC]"}`}>
                  {m.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-[#8B5E3C]" />}
                </div>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-[#8B5E3C] text-white" : "bg-[#EDE6DC] text-[#1A1A1A]"}`}>
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
    </>
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
