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
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/auth/login", { cache: "no-store" })
      .then(res => res.json())
      .then(d => { if (d?.ok) router.replace(next) })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [router, next])

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!password || loading) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
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
        <p className="text-center text-xs text-[#5C5146] mt-1 mb-6">Área restrita — digite a senha de acesso</p>

        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Senha de acesso"
              autoComplete="current-password"
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
