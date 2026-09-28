import { NextRequest, NextResponse } from "next/server"
import { baseUrl } from "@/lib/google-auth"

// Etapa 1: redireciona para o Google
export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json(
      { error: "Login com Google não configurado (GOOGLE_CLIENT_ID)." },
      { status: 500 }
    )
  }
  const next = req.nextUrl.searchParams.get("next") || "/dashboard"
  const redirectUri = `${baseUrl(req)}/api/auth/google/callback`
  const state = Buffer.from(JSON.stringify({ next })).toString("base64url")
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state,
  })
  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
}
