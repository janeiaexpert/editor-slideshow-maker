import { NextRequest, NextResponse } from "next/server"

type Paleta = {
  id?: string
  nome?: string
  cores?: string[]
}

type ProductData = {
  ideia: string
  tom: string
  lucro: number
  name: string
  ctaLink: string
  ctaText: string
  steps: Record<string, Record<string, string>>
  paleta?: Paleta | null
}

function sanitizePaleta(p: unknown): Paleta | null {
  if (!p || typeof p !== "object") return null
  const obj = p as Record<string, unknown>
  const cores = Array.isArray(obj.cores)
    ? obj.cores.filter((c): c is string => typeof c === "string" && /^#[0-9a-fA-F]{6}$/.test(c)).slice(0, 5)
    : []
  if (cores.length < 5 && typeof obj.id !== "string" && typeof obj.nome !== "string") return null
  return {
    ...(typeof obj.id === "string" ? { id: obj.id } : {}),
    ...(typeof obj.nome === "string" ? { nome: obj.nome } : {}),
    ...(cores.length > 0 ? { cores } : {}),
  }
}

async function saveToBlob(id: string, product: ProductData): Promise<boolean> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return false
    const { put } = await import("@vercel/blob")
    await put(`ativador/${id}.json`, JSON.stringify(product), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    })
    return true
  } catch (e) {
    console.error("[publish] Blob save failed:", (e as Error)?.message)
    return false
  }
}

async function loadFromBlob(id: string): Promise<ProductData | null> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return null
    if (!/^prod_[a-z0-9]+$/i.test(id)) return null
    const { list } = await import("@vercel/blob")
    const { blobs } = await list({ prefix: `ativador/${id}.json`, limit: 1 })
    if (!blobs || blobs.length === 0) return null
    const res = await fetch(blobs[0].url, { cache: "no-store" })
    if (!res.ok) return null
    const data = await res.json()
    if (!data || typeof data !== "object" || !data.steps) return null
    return data as ProductData
  } catch (e) {
    console.error("[publish] Blob load failed:", (e as Error)?.message)
    return null
  }
}

async function saveToSupabase(id: string, product: ProductData): Promise<boolean> {
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
      paleta: product.paleta || null,
    })
    if (error) throw error
    return true
  } catch {
    return false
  }
}

async function loadFromSupabase(id: string): Promise<ProductData | null> {
  try {
    const { supabase } = await import("@/lib/supabase")
    const { data, error } = await supabase.from("published_products").select("*").eq("id", id).single()
    if (error || !data) return null
    return {
      ideia: data.ideia,
      tom: data.tom,
      lucro: data.lucro,
      name: data.name,
      ctaLink: data.cta_link,
      ctaText: data.cta_text,
      steps: data.steps,
      paleta: (data as Record<string, unknown>).paleta as Paleta | undefined,
    }
  } catch {
    return null
  }
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
      paleta: sanitizePaleta(body.paleta),
    }

    // Tenta persistir no servidor (Blob primeiro, Supabase como alternativa).
    // Se nenhum backend estiver configurado, devolve os dados para o
    // sessionStorage do navegador (funciona só no mesmo aparelho).
    const saved = (await saveToBlob(id, product)) || (await saveToSupabase(id, product))
    if (saved) return NextResponse.json({ id, persistent: true })
    return NextResponse.json({ id, data: product, persistent: false })
  } catch {
    return NextResponse.json({ error: "Falha ao salvar" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id é obrigatório" }, { status: 400 })

  const fromBlob = await loadFromBlob(id)
  if (fromBlob) return NextResponse.json(fromBlob)

  const fromSupabase = await loadFromSupabase(id)
  if (fromSupabase) return NextResponse.json(fromSupabase)

  return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
}
