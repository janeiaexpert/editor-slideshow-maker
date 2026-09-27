// Gate de acesso simples (sem banco de dados).
// Token HMAC-SHA256 via Web Crypto — funciona no Edge (middleware) e no Node.
export const GATE_COOKIE = "ativador_auth"
const TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000 // 30 dias

function getSecret(): string {
  return (
    process.env.GATE_SECRET ||
    process.env.JWT_SECRET ||
    "dev-secret-change-in-production"
  )
}

function b64urlEncode(data: string | ArrayBuffer): string {
  const bytes =
    typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data)
  let bin = ""
  bytes.forEach(b => { bin += String.fromCharCode(b) })
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function b64urlDecode(b64: string): string {
  const s = b64.replace(/-/g, "+").replace(/_/g, "/")
  const bin = atob(s)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

async function hmacHex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message))
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function createGateToken(): Promise<string> {
  const payload = b64urlEncode(JSON.stringify({ v: 1, t: Date.now() }))
  const sig = await hmacHex(payload, getSecret())
  return `${payload}.${sig}`
}

export async function verifyGateToken(token: string | undefined | null): Promise<boolean> {
  if (!token || !token.includes(".")) return false
  const [payload, sig] = token.split(".")
  if (!payload || !sig) return false
  const expected = await hmacHex(payload, getSecret())
  if (sig.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i)
  if (diff !== 0) return false
  try {
    const data = JSON.parse(b64urlDecode(payload)) as { v?: number; t?: number }
    if (data.v !== 1 || typeof data.t !== "number") return false
    if (Date.now() - data.t > TOKEN_MAX_AGE_MS) return false
    return true
  } catch {
    return false
  }
}

function sha256Hex(text: string): Promise<string> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(buf =>
    Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("")
  )
}

// Compara senhas sem vazar tamanho/tempo (aceita segredo não configurado = nega tudo)
export async function checkAccessPassword(input: string): Promise<boolean> {
  const expected = process.env.APP_PASSWORD || ""
  if (!expected || !input) return false
  const [a, b] = await Promise.all([sha256Hex(input), sha256Hex(expected)])
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
