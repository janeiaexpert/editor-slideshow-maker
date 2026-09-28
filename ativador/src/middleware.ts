import { NextResponse } from "next/server"

// Bloqueio de acesso DESATIVADO por decisão da dona (sistema aberto).
// Mantido o arquivo para reativar no futuro se precisar.
export async function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
