import { NextRequest, NextResponse } from "next/server"

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

    const product: ProductData = {
      ideia: body.ideia || "",
      tom: body.tom || "",
      lucro: body.lucro || 0,
      name: body.name || "Produto",
      ctaLink: body.ctaLink || "#",
      ctaText: body.ctaText || "Quero Meu Acesso Agora",
      steps: body.steps || {},
    }

    try {
      const { supabase } = await import("@/lib/supabase")
      const { error } = await supabase.from("published_products").upsert({
        id,
        ideia: product.ideia,
        tom: product.tom,
        lucro: product.lucro,
        name: product.name,
        cta_link: product.ctaLink,
        cta_text: product.ctaText,
        steps: product.steps,
      })
      if (error) throw error
      return NextResponse.json({ id })
    } catch {
      return NextResponse.json({ id, data: product })
    }
  } catch {
    return NextResponse.json({ error: "Falha ao salvar" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id é obrigatório" }, { status: 400 })

  try {
    const { supabase } = await import("@/lib/supabase")
    const { data, error } = await supabase.from("published_products").select("*").eq("id", id).single()
    if (!error && data) {
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
  } catch {}

  return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
}
