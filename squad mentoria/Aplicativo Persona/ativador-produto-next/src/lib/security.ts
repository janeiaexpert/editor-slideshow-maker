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

export function sanitizeSvg(svg: string): string {
  const dangerous = /<script[\s>]/i
  if (dangerous.test(svg)) return svg.replace(/<script[\s\S]*?<\/script>/gi, "")
  return svg
}
