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

function estimateTextWidth(text: string, fontSize: number): number {
  let narrow = 0
  let wide = 0
  for (const ch of text) {
    if ("ijltI1!.,;:|".includes(ch)) narrow++
    if ("mwMWQOUG@".includes(ch)) wide++
  }
  const avg = fontSize * 0.58
  return text.length * avg - narrow * fontSize * 0.15 + wide * fontSize * 0.1
}

function splitIntoLines(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let cur = ""
  for (const word of words) {
    const test = cur ? cur + " " + word : word
    if (test.length > maxChars && cur) {
      lines.push(cur)
      cur = word
    } else {
      cur = test
    }
  }
  if (cur) lines.push(cur)
  return lines.length ? lines : [text]
}

function calcTextBlockHeight(lineCount: number, fontSize: number): number {
  return lineCount * fontSize * 1.35
}

export function sanitizeSvg(svg: string): string {
  const dangerous = /<script[\s>]/i
  if (dangerous.test(svg)) svg = svg.replace(/<script[\s\S]*?<\/script>/gi, "")

  svg = svg.replace(/(<svg[^>]*?)\s+width="[^"]*"/gi, "$1")
  svg = svg.replace(/(<svg[^>]*?)\s+height="[^"]*"/gi, "$1")
  if (!/style="[^"]*max-width/i.test(svg)) {
    svg = svg.replace(/<svg/, '<svg style="width:100%;max-width:100%;height:auto;display:block"')
  }

  const vbMatch = svg.match(/viewBox="[\s]*(\d+)[\s]+(\d+)/)
  const vbW = vbMatch ? parseInt(vbMatch[1]) : 1080
  const vbH = vbMatch ? parseInt(vbMatch[2]) : 1350
  const safeW = vbW * 0.88

  const textRegex = /<text\b([^>]*)>([\s\S]*?)<\/text>/gi
  let match: RegExpExecArray | null
  const entries: { match: RegExpExecArray; y: number; fs: number; text: string; attrs: string; inner: string }[] = []

  while ((match = textRegex.exec(svg)) !== null) {
    const attrs = match[1]
    const inner = match[2]
    if (inner.includes("<tspan")) continue

    const fsMatch = attrs.match(/font-size=["'](\d+)["']/i)
    const yMatch = attrs.match(/y=["']([\d.]+)["']/)
    if (!fsMatch || !yMatch) continue

    const fs = parseInt(fsMatch[1])
    const y = parseFloat(yMatch[1])
    const text = inner.replace(/<[^>]+>/g, "").trim()
    if (!text || fs < 20) continue

    entries.push({ match, y, fs, text, attrs, inner })
  }

  entries.sort((a, b) => a.y - b.y)

  const replacements: { orig: string; rep: string }[] = []
  let accumulatedExtra = 0

  for (const entry of entries) {
    const origY = entry.y
    const textW = estimateTextWidth(entry.text, entry.fs)

    if (textW <= safeW) {
      const newY = origY + accumulatedExtra
      if (newY !== origY) {
        const newAttrs = entry.attrs.replace(/y=["'][\d.]+["']/, `y="${newY}"`)
        replacements.push({
          orig: entry.match[0],
          rep: `<text${newAttrs}>${entry.inner}</text>`
        })
      }
      continue
    }

    const ratio = safeW / textW
    let newFs = Math.round(entry.fs * ratio)
    if (newFs < entry.fs * 0.35) newFs = Math.round(entry.fs * 0.35)

    const newW = estimateTextWidth(entry.text, newFs)

    const cleanAttrs = entry.attrs
      .replace(/\s*textLength="[^"]*"/gi, "")
      .replace(/\s*lengthAdjust="[^"]*"/gi, "")

    const newY = origY + accumulatedExtra
    const xMatch = entry.attrs.match(/x=["']([\d.]+)["']/)
    const x = xMatch?.[1] || String(vbW / 2)

    if (newW <= safeW) {
      const newAttrs = cleanAttrs
        .replace(/y=["'][\d.]+["']/, `y="${newY}"`)
        .replace(/font-size=["'][\d.]+["']/, `font-size="${newFs}"`)
      replacements.push({
        orig: entry.match[0],
        rep: `<text${newAttrs}>${entry.text}</text>`
      })
      continue
    }

    const maxChars = Math.max(Math.floor(entry.text.length * 0.4), 8)
    const lines = splitIntoLines(entry.text, maxChars)
    const lineH = newFs * 1.35
    const startY = newY - ((lines.length - 1) * lineH) / 2

    const tspans = lines.map((line, i) =>
      `<tspan x="${x}" y="${startY + i * lineH}">${line}</tspan>`
    ).join("")

    const newAttrs = cleanAttrs
      .replace(/y=["'][\d.]+["']/, `y="${newY}"`)
      .replace(/font-size=["'][\d.]+["']/, `font-size="${newFs}"`)

    replacements.push({
      orig: entry.match[0],
      rep: `<text${newAttrs}>${tspans}</text>`
    })

    const origBlockH = calcTextBlockHeight(1, entry.fs)
    const newBlockH = calcTextBlockHeight(lines.length, newFs)
    accumulatedExtra += newBlockH - origBlockH
  }

  for (const r of replacements) {
    svg = svg.replace(r.orig, r.rep)
  }

  svg = svg.replace(/R\$\s*R\$/g, "R$")
  svg = svg.replace(/R\$\s+/g, "R$ ")

  return svg
}

export function sanitizeText(text: string): string {
  if (!text) return text

  let result = text

  result = result.replace(/R\$\s*R\$\s*/g, "R$ ")
  result = result.replace(/R\$\s+/g, "R$ ")
  result = result.replace(/\s+R\$/g, " R$")

  return result
}
