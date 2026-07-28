export function sanitizeUrl(url: string): string {
  if (!url || url.trim() === "") return "#"
  const trimmed = url.trim()
  if (trimmed === "#") return "#"
  try {
    const parsed = new URL(trimmed)
    const allowed = ["http:", "https:", "mailto:", "tel:"]
    if (allowed.includes(parsed.protocol)) return parsed.href
    return "#"
  } catch {
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    if (/^mailto:/i.test(trimmed)) return trimmed
    if (/^tel:/i.test(trimmed)) return trimmed
    if (trimmed.startsWith("//")) return "https:" + trimmed
    if (/^[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(trimmed)) return "https://" + trimmed
    return "#"
  }
}

export function sanitizeText(text: string): string {
  let result = text
    .replace(/vocêê/g, "voc\u00EA")
    .replace(/vocêsê/g, "voc\u00EAs")
    .replace(/entregaa/g, "entrega")
    .replace(/vendaa/g, "venda")
    .replace(/tambémm/g, "tamb\u00E9m")
    .replace(/atéé/g, "at\u00E9")
    .replace(/jáá/g, "j\u00E1")
    .replace(/entããoo/g, "ent\u00E3o")
    .replace(/máá/g, "m\u00E1")
    .replace(/éé/g, "\u00E9")
    .replace(/ãã/g, "\u00E3")
    .replace(/õõ/g, "\u00F5")
    .replace(/çç/g, "\u00E7")
    .replace(/óó/g, "\u00F3")
    .replace(/úú/g, "\u00FA")
    .replace(/íí/g, "\u00ED")
    .replace(/ââ/g, "\u00E2")
    .replace(/êê/g, "\u00EA")
    .replace(/ôô/g, "\u00F4")

  result = result.replace(/R\$\s*(\d{1,3}(?:,\d{3})+\.\d{2})\b/g, (_m, p1) => {
    const num = parseFloat(p1.replace(/,/g, ""))
    if (!isNaN(num)) return `R$ ${num.toLocaleString("pt-BR")}`
    return _m
  })

  return result
}

export function sanitizeSvg(svg: string): string {
  const dangerous = /<script[\s>]/i
  if (dangerous.test(svg)) svg = svg.replace(/<script[\s\S]*?<\/script>/gi, "")

  svg = svg.replace(/(<svg[^>]*?)\s+width="[^"]*"/gi, "$1")
  svg = svg.replace(/(<svg[^>]*?)\s+height="[^"]*"/gi, "$1")
  const vbMatch = svg.match(/viewBox="0 0 (\d+) (\d+)"/)
  const ar = vbMatch ? `${vbMatch[1]}/${vbMatch[2]}` : "4/5"
  if (!/style="[^"]*max-width/i.test(svg)) {
    svg = svg.replace(/<svg/, `<svg style="max-width:100%;width:100%;height:auto;display:block;aspect-ratio:${ar}"`)
  } else {
    svg = svg.replace(/style="([^"]*)"/, `style="$1;aspect-ratio:${ar}"`)
  }

  return svg
}
