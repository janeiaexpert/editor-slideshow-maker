// Histórico de acessos (quem entrou, quando, como).
// Salvo no Vercel Blob (permanente). Se o Blob não estiver configurado,
// cai para console.log (visível nos Logs do Vercel).
export type Acesso = {
  email: string
  metodo: "google" | "senha"
  data: string
}

export async function registrarAcesso(acesso: Acesso): Promise<void> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log(`[acesso] ${acesso.email} via ${acesso.metodo} em ${acesso.data}`)
      return
    }
    const { put } = await import("@vercel/blob")
    const dia = acesso.data.slice(0, 10)
    const stamp = `${acesso.data.replace(/[:.]/g, "-")}-${Math.random().toString(36).slice(2, 7)}`
    await put(`acessos/${dia}/${stamp}.json`, JSON.stringify(acesso), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    })
  } catch (e) {
    console.error("[acessos] falha ao registrar:", (e as Error)?.message)
  }
}

export async function listarAcessos(limite = 100): Promise<Acesso[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return []
  const { list } = await import("@vercel/blob")
  const { blobs } = await list({ prefix: "acessos/", limit: Math.min(limite, 100) })
  const ordenados = [...(blobs || [])].sort((a, b) => (a.pathname < b.pathname ? 1 : -1)).slice(0, limite)
  const resultados: Acesso[] = []
  await Promise.all(
    ordenados.map(async b => {
      try {
        const res = await fetch(b.url, { cache: "no-store" })
        if (!res.ok) return
        const d = (await res.json()) as Acesso
        if (d && d.email && d.data) resultados.push(d)
      } catch {}
    })
  )
  return resultados.sort((a, b) => (a.data < b.data ? 1 : -1))
}
