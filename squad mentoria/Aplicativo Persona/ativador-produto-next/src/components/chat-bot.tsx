"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Sparkles, Lightbulb, TrendingUp, HelpCircle } from "lucide-react"
import { toast } from "sonner"

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
}

const SUGGESTIONS = [
  "Como melhorar minha headline?",
  "Sugira um bônus irrecusável",
  "Qual preço ideal para meu produto?",
  "Me ajude com o roteiro da VSL",
  "Como estruturar os módulos?",
  "O que é upsell e downsell?",
]

const STORAGE_KEY = "ativador_chat_history"

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return []
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return [
    { role: "assistant", content: "Olá! Sou o assistente virtual do **Ativador de Produtos**. Posso ajudar com suas headlines, módulos, preços, VSL, anúncios e muito mais. Me pergunte o que quiser!" },
  ]
}

function saveHistory(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)))
  } catch {}
}

export function ChatBot({ ideia, tom, lucro, steps }: ChatBotProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    saveHistory(messages)
  }, [messages])

  const send = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput("")
    setShowSuggestions(false)
    const userMsg: ChatMessage = { role: "user", content: msg }
    setMessages(p => [...p, userMsg])
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: messages.slice(-8).map(m => ({ role: m.role, content: m.content })),
          ideia,
          tom,
          lucro,
          steps,
        }),
      })
      const data = await res.json()
      setMessages(p => [...p, { role: "assistant", content: data.reply || "Desculpe, não consegui processar." }])
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "Desculpe, ocorreu um erro. Tente novamente." }])
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    setMessages([
      { role: "assistant", content: "Olá! Sou o assistente virtual do **Ativador de Produtos**. Posso ajudar com suas headlines, módulos, preços, VSL, anúncios e muito mais. Me pergunte o que quiser!" },
    ])
    setShowSuggestions(true)
    toast("Histórico limpo!")
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
              <span className="text-sm font-bold">Assistente Virtual</span>
            </div>
            <button onClick={clearHistory} className="text-white/60 hover:text-white text-xs transition-colors" title="Limpar conversa">
              Limpar
            </button>
          </div>

          <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[420px] min-h-[220px]">
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
                  <span className="animate-pulse">Digitando</span>
                  <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>.</span>
                  <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>.</span>
                  <span className="animate-pulse" style={{ animationDelay: "0.6s" }}>.</span>
                </div>
              </div>
            )}

            {showSuggestions && messages.length <= 1 && (
              <div className="mt-3">
                <p className="text-[10px] text-[#A67C52] uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" /> Perguntas rápidas
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
              placeholder="Digite sua dúvida..."
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