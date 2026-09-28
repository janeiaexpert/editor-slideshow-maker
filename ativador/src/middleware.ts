import { NextRequest, NextResponse } from "next/server"
import { GATE_COOKIE, verifyGateToken } from "./lib/gate"

const PROTECTED_API = ["/api/chat", "/api/generate", "/api/publish"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ok = await verifyGateToken(req.cookies.get(GATE_COOKIE)?.value)
  if (ok) return NextResponse.next()

  // APIs protegidas respondem 401 (páginas de vendas continuam públicas)
  if (PROTECTED_API.some(p => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  // Páginas protegidas redirecionam para o login (só Google)
  const url = req.nextUrl.clone()
  url.pathname = "/login"
  url.searchParams.set("next", pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/chat/:path*", "/api/generate/:path*", "/api/publish/:path*"],
}
