import { NextRequest, NextResponse } from "next/server"
import { GATE_COOKIE, checkAccessPassword, createGateToken, verifyGateToken } from "@/lib/gate"

export async function GET(req: NextRequest) {
  const ok = await verifyGateToken(req.cookies.get(GATE_COOKIE)?.value)
  return NextResponse.json({ ok })
}

export async function POST(req: NextRequest) {
  try {
    const { password } = (await req.json()) as { password?: string }
    if (!process.env.APP_PASSWORD) {
      return NextResponse.json(
        { error: "Acesso não configurado. Defina APP_PASSWORD nas variáveis de ambiente." },
        { status: 500 }
      )
    }
    const ok = await checkAccessPassword(password || "")
    if (!ok) {
      // Resposta genérica + pequeno atraso contra força bruta
      await new Promise(r => setTimeout(r, 800))
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 })
    }
    const token = await createGateToken()
    const res = NextResponse.json({ ok: true })
    res.cookies.set(GATE_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    })
    return res
  } catch {
    return NextResponse.json({ error: "Falha no login." }, { status: 400 })
  }
}
