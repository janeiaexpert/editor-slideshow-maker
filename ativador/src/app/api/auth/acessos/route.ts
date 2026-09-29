import { NextRequest, NextResponse } from "next/server"
import { GATE_COOKIE, verifyGateToken } from "@/lib/gate"
import { listarAcessos } from "@/lib/acessos"

// Histórico de acessos — só com sessão válida
export async function GET(req: NextRequest) {
  const ok = await verifyGateToken(req.cookies.get(GATE_COOKIE)?.value)
  if (!ok) return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  try {
    const acessos = await listarAcessos(100)
    return NextResponse.json({ acessos })
  } catch {
    return NextResponse.json({ error: "Falha ao listar." }, { status: 500 })
  }
}
