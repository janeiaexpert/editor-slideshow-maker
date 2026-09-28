"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/dashboard"
  const urlError = searchParams.get("error")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState("")

  const GOOGLE_ERRORS: Record<string, string> = {
    "google-cancelado": "Login com Google cancelado.",
    "google-nao-autorizado": "Este e-mail Google não tem acesso. Fale com a administradora.",
    "google-nao-configurado": "Login com Google ainda não configurado.",
    "google-token": "Falha ao validar com o Google. Tente de novo.",
    "google-invalido": "Resposta do Google inválida. Tente de novo.",
    "google-erro": "Erro no login com Google. Tente de novo.",
  }

  useEffect(() => {
    fetch("/api/auth/login", { cache: "no-store" })
      .then(res => res.json())
      .then(d => { if (d?.ok) router.replace(next) })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [router, next])

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const clean = password.trim()
    if (!clean || loading) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: clean }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || "Não foi possível entrar.")
        return
      }
      router.replace(next)
      router.refresh()
    } catch {
      setError("Falha de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F5EFE8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D9CEC2] border-t-[#8B5E3C] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5EFE8] flex items-center justify-center px-4">
      <div className="w-full max-w-[360px] bg-white border border-[#D9CEC2] rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="w-12 h-12 rounded-2xl bg-[#8B5E3C] flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-center text-lg font-bold text-[#1A1A1A]">
          Ativador <span className="text-[#8B5E3C]">Automático</span>
        </h1>
        <p className="text-center text-xs text-[#5C5146] mt-1 mb-6">Escolha como entrar na área restrita</p>

        <a
          href={`/api/auth/google?next=${encodeURIComponent(next)}`}
          className="flex items-center justify-center gap-2.5 w-full bg-white border-2 border-[#D9CEC2] hover:border-[#8B5E3C] text-[#1A1A1A] font-bold text-sm rounded-lg px-4 py-3.5 mb-3 transition-colors"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.8-5 3.8-8.7z" />
            <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.1.1-3.6 2.8v.1C3.5 21.4 7.5 24 12 24z" />
            <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3.6-2.8-.1.1C.5 8.6 0 10.2 0 12s.5 3.4 1.4 4.9l3.8-2.5z" />
            <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.5 0 3.5 2.6 1.4 6.8l3.8 2.9c1-2.9 3.7-5 6.8-5z" />
          </svg>
          Entrar com Google
        </a>

        <div className="flex items-center gap-3 mb-3">
          <div className="h-px flex-1 bg-[#D9CEC2]" />
          <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">ou senha</span>
          <div className="h-px flex-1 bg-[#D9CEC2]" />
        </div>

        {urlError && GOOGLE_ERRORS[urlError] && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{GOOGLE_ERRORS[urlError]}</p>
        )}

        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Senha de acesso"
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoFocus
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A67C52] hover:text-[#8B5E3C]"
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] text-white font-bold py-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5EFE8] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#D9CEC2] border-t-[#8B5E3C] rounded-full animate-spin" /></div>}>
      <LoginInner />
    </Suspense>
  )
}
