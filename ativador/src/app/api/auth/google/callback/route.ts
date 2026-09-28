import { NextRequest, NextResponse } from "next/server"
import { GATE_COOKIE, createGateToken } from "@/lib/gate"
import { registrarAcesso } from "@/lib/acessos"
import { allowedEmails, baseUrl } from "@/lib/google-auth"

// Etapa 2: o Google devolve o código aqui
export async function GET(req: NextRequest) {
  const fail = (msg: string) => {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.search = ""
    url.searchParams.set("error", msg)
    return NextResponse.redirect(url)
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) return fail("google-nao-configurado")

  const code = req.nextUrl.searchParams.get("code")
  const rawState = req.nextUrl.searchParams.get("state")
  if (!code) return fail("google-cancelado")

  let next = "/dashboard"
  try {
    const parsed = JSON.parse(Buffer.from(rawState || "", "base64url").toString()) as { next?: string }
    if (parsed?.next && parsed.next.startsWith("/")) next = parsed.next
  } catch {}

  try {
    // Troca o código por tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${baseUrl(req)}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }).toString(),
    })
    if (!tokenRes.ok) return fail("google-token")
    const tokens = (await tokenRes.json()) as { id_token?: string }
    if (!tokens.id_token) return fail("google-token")

    // Valida o id_token direto no Google e obtém o e-mail
    const infoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokens.id_token)}`
    )
    if (!infoRes.ok) return fail("google-invalido")
    const info = (await infoRes.json()) as { email?: string; aud?: string }
    if (!info.email || info.aud !== clientId) return fail("google-invalido")

    // Só e-mails autorizados entram
    const allowed = allowedEmails()
    if (allowed.length > 0 && !allowed.includes(info.email.toLowerCase())) {
      return fail("google-nao-autorizado")
    }

    const gate = await createGateToken(info.email.toLowerCase())
    registrarAcesso({ email: info.email.toLowerCase(), metodo: "google", data: new Date().toISOString() }).catch(() => {})
    const url = req.nextUrl.clone()
    url.pathname = next
    url.search = ""
    const res = NextResponse.redirect(url)
    res.cookies.set(GATE_COOKIE, gate, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    })
    return res
  } catch {
    return fail("google-erro")
  }
}
