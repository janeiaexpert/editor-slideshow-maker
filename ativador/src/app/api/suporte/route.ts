import { NextRequest, NextResponse } from "next/server"
import { GATE_COOKIE, lerEmailGate, verifyGateToken } from "@/lib/gate"

// E-mail que recebe os chamados de suporte (confirmar com a dona).
const EMAIL_SUPORTE = "janesantanaia@gmail.com"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type RespostaSuporte = { texto: string; data: string; de: "suporte" }

export type Chamado = {
  id: string
  email: string
  mensagem: string
  print: string | null
  data: string
  status: "aberto" | "respondido"
  token: string
  respostas: RespostaSuporte[]
  vistoEm: string | null
}

function rand(n: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let s = ""
  const buf = new Uint8Array(n)
  crypto.getRandomValues(buf)
  for (const b of buf) s += chars[b % chars.length]
  return s
}

function baseUrl(req: NextRequest): string {
  const proto = req.headers.get("x-forwarded-proto") || "https"
  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    "ativador-produto-v2.vercel.app"
  return `${proto}://${host}`
}

function temBlob(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

async function salvarChamado(c: Chamado): Promise<boolean> {
  try {
    if (!temBlob()) return false
    const { put } = await import("@vercel/blob")
    await put(`suporte/${c.id}.json`, JSON.stringify(c), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    })
    return true
  } catch (e) {
    console.error("[suporte] falha ao salvar:", (e as Error)?.message)
    return false
  }
}

async function buscarPorId(id: string): Promise<Chamado | null> {
  try {
    if (!temBlob() || !/^tkt_[a-z0-9]+$/i.test(id)) return null
    const { list } = await import("@vercel/blob")
    const { blobs } = await list({ prefix: `suporte/${id}.json`, limit: 1 })
    if (!blobs || blobs.length === 0) return null
    const res = await fetch(blobs[0].url, { cache: "no-store" })
    if (!res.ok) return null
    const d = (await res.json()) as Chamado
    if (!d || d.id !== id) return null
    return d
  } catch {
    return null
  }
}

async function buscarPorToken(token: string): Promise<Chamado | null> {
  try {
    if (!temBlob() || !/^[a-z0-9]{10,64}$/i.test(token)) return null
    const { list } = await import("@vercel/blob")
    const { blobs } = await list({ prefix: "suporte/", limit: 200 })
    for (const b of blobs || []) {
      try {
        const res = await fetch(b.url, { cache: "no-store" })
        if (!res.ok) continue
        const d = (await res.json()) as Chamado
        if (d && d.token === token && d.id) return d
      } catch {}
    }
    return null
  } catch {
    return null
  }
}

async function listarPorEmail(email: string): Promise<Chamado[]> {
  try {
    if (!temBlob()) return []
    const { list } = await import("@vercel/blob")
    const { blobs } = await list({ prefix: "suporte/", limit: 200 })
    const out: Chamado[] = []
    await Promise.all(
      (blobs || []).map(async b => {
        try {
          const res = await fetch(b.url, { cache: "no-store" })
          if (!res.ok) return
          const d = (await res.json()) as Chamado
          if (d && d.email === email && d.id) out.push(d)
        } catch {}
      })
    )
    return out.sort((a, b) => (a.data < b.data ? 1 : -1)).slice(0, 50)
  } catch {
    return []
  }
}

// Avisa a dona por e-mail (melhor esforço: nunca bloqueia o chamado).
async function avisarPorEmail(c: Chamado, base: string): Promise<boolean> {
  try {
    const link = `${base}/suporte/responder?token=${c.token}`
    const form = new FormData()
    form.append("E-mail do usuário", c.email)
    form.append("Mensagem", c.mensagem)
    form.append("Responder em", link)
    form.append("_subject", `Suporte: chamado ${c.id} (${c.email})`)
    form.append("_template", "table")
    form.append("_replyto", c.email)
    if (c.print) {
      try {
        const b = await (await fetch(c.print)).blob()
        if (b.size > 0 && b.size < 2_500_000) {
          form.append("print", b, "print.png")
        }
      } catch {}
    }
    const res = await fetch(`https://formsubmit.co/ajax/${EMAIL_SUPORTE}`, {
      method: "POST",
      body: form,
    })
    return res.ok
  } catch (e) {
    console.error("[suporte] falha no e-mail:", (e as Error)?.message)
    return false
  }
}

// POST: abrir chamado (precisa estar logado; e-mail vem do login ou do formulário)
export async function POST(req: NextRequest) {
  try {
    const logado = await verifyGateToken(req.cookies.get(GATE_COOKIE)?.value)
    if (!logado) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
    }
    const emailCookie = await lerEmailGate(req.cookies.get(GATE_COOKIE)?.value)
    const body = (await req.json()) as { mensagem?: string; print?: string; email?: string }
    const mensagem = String(body.mensagem || "").trim().slice(0, 3000)
    if (!mensagem) {
      return NextResponse.json({ error: "Descreva o problema." }, { status: 400 })
    }
    const emailForm = String(body.email || "").trim().toLowerCase()
    const email = emailCookie || (EMAIL_RE.test(emailForm) ? emailForm : "")
    if (!email) {
      return NextResponse.json(
        { error: "Informe seu e-mail para receber a resposta." },
        { status: 400 }
      )
    }
    let print: string | null = null
    if (
      typeof body.print === "string" &&
      body.print.startsWith("data:image/") &&
      body.print.length < 4_000_000
    ) {
      print = body.print
    }
    const agora = new Date().toISOString()
    const chamado: Chamado = {
      id: "tkt_" + Date.now().toString(36) + rand(4),
      email,
      mensagem,
      print,
      data: agora,
      status: "aberto",
      token: rand(24),
      respostas: [],
      vistoEm: null,
    }
    const salvo = await salvarChamado(chamado)
    if (!salvo) {
      return NextResponse.json(
        { error: "Suporte indisponível no momento. Tente de novo." },
        { status: 500 }
      )
    }
    const emailOk = await avisarPorEmail(chamado, baseUrl(req))
    return NextResponse.json({ ok: true, id: chamado.id, emailOk })
  } catch {
    return NextResponse.json({ error: "Falha ao enviar." }, { status: 500 })
  }
}

// GET: ?token= (página de resposta da dona, pública via token) ou meus chamados (logado)
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token") || ""
    if (token) {
      const t = await buscarPorToken(token)
      if (!t) return NextResponse.json({ error: "Chamado não encontrado." }, { status: 404 })
      return NextResponse.json({
        id: t.id,
        email: t.email,
        mensagem: t.mensagem,
        print: t.print,
        data: t.data,
        status: t.status,
        respostas: t.respostas,
      })
    }
    const email = await lerEmailGate(req.cookies.get(GATE_COOKIE)?.value)
    if (!email) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
    }
    const meus = await listarPorEmail(email)
    return NextResponse.json({
      chamados: meus.map(t => ({
        id: t.id,
        data: t.data,
        mensagem: t.mensagem.slice(0, 200),
        status: t.status,
        respostas: t.respostas,
        vistoEm: t.vistoEm,
        naoLidas: t.respostas.filter(r => !t.vistoEm || r.data > t.vistoEm).length,
      })),
    })
  } catch {
    return NextResponse.json({ error: "Falha ao carregar." }, { status: 500 })
  }
}

// PATCH: { action: "ver", id } (logado, marca como lido) ou
// { action: "responder", token, texto } (público via token, resposta da dona)
export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as { action?: string; id?: string; token?: string; texto?: string }
    if (body.action === "responder") {
      const token = String(body.token || "")
      const texto = String(body.texto || "").trim().slice(0, 3000)
      if (!token || !texto) {
        return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })
      }
      const t = await buscarPorToken(token)
      if (!t) return NextResponse.json({ error: "Chamado não encontrado." }, { status: 404 })
      t.respostas.push({ texto, data: new Date().toISOString(), de: "suporte" })
      t.status = "respondido"
      await salvarChamado(t)
      return NextResponse.json({ ok: true })
    }
    if (body.action === "ver") {
      const email = await lerEmailGate(req.cookies.get(GATE_COOKIE)?.value)
      if (!email) {
        return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
      }
      const t = await buscarPorId(String(body.id || ""))
      if (!t || t.email !== email) {
        return NextResponse.json({ error: "Chamado não encontrado." }, { status: 404 })
      }
      t.vistoEm = new Date().toISOString()
      await salvarChamado(t)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: "Ação inválida." }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Falha ao salvar." }, { status: 500 })
  }
}
