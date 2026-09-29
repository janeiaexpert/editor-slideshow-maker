import { NextRequest, NextResponse } from "next/server"
import { GATE_COOKIE, checkAccessPassword, createGateToken, verifyGateToken } from "@/lib/gate"
import { registrarAcesso } from "@/lib/acessos"

export async function GET(req: NextRequest) {
  const ok = await verifyGateToken(req.cookies.get(GATE_COOKIE)?.value)
  return NextResponse.json({ ok })
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { password, email, remember } = (await req.json()) as {
      password?: string
      email?: string
      remember?: boolean
    }
    if (!process.env.APP_PASSWORD) {
      return NextResponse.json(
        { error: "Acesso não configurado. Defina APP_PASSWORD nas variáveis de ambiente." },
        { status: 500 }
      )
    }
    const cleanEmail = (email || "").trim().toLowerCase()
    // E-mail é OPCIONAL (privacidade): se informado, precisa ser válido e é
    // registrado no histórico; se vazio, entra só com a senha, sem registro.
    if (cleanEmail && !EMAIL_RE.test(cleanEmail)) {
      return NextResponse.json({ error: "Digite um e-mail válido ou deixe em branco." }, { status: 400 })
    }
    const ok = await checkAccessPassword((password || "").trim())
    if (!ok) {
      // Resposta genérica + pequeno atraso contra força bruta
      await new Promise(r => setTimeout(r, 800))
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 })
    }
    const token = await createGateToken(cleanEmail)
    // Registra o acesso (não bloqueia o login se falhar)
    registrarAcesso({ email: cleanEmail, metodo: "senha", data: new Date().toISOString() }).catch(() => {})
    const res = NextResponse.json({ ok: true })
    res.cookies.set(GATE_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(remember ? { maxAge: 30 * 24 * 60 * 60 } : {}),
    })
    return res
  } catch {
    return NextResponse.json({ error: "Falha no login." }, { status: 400 })
  }
}
