import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

type ProductData = {
  ideia: string
  tom: string
  lucro: number
  name: string
  ctaLink: string
  ctaText: string
  steps: Record<string, Record<string, string>>
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ProductData & { id?: string }
    const id = body.id || "prod_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

    const { error } = await supabase.from("published_products").upsert({
      id,
      ideia: body.ideia || "",
      tom: body.tom || "",
      lucro: body.lucro || 0,
      name: body.name || "Produto",
      cta_link: body.ctaLink || "#",
      cta_text: body.ctaText || "Quero Meu Acesso Agora",
      steps: body.steps || {},
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ id })
  } catch {
    return NextResponse.json({ error: "Falha ao salvar" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id é obrigatório" }, { status: 400 })

  const { data, error } = await supabase.from("published_products").select("*").eq("id", id).single()

  if (error || !data) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })

  return NextResponse.json({
    ideia: data.ideia,
    tom: data.tom,
    lucro: data.lucro,
    name: data.name,
    ctaLink: data.cta_link,
    ctaText: data.cta_text,
    steps: data.steps,
  })
}
