const GEMINI_KEY = process.env.GEMINI_API_KEY
const GROQ_KEY = process.env.GROQ_API_KEY
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface CallOptions {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
}

// Track which providers are rate-limited (reset after cooldown)
const rateLimited: Record<string, number> = {}
const COOLDOWN_MS = 60_000 // 1 minute cooldown

function isRateLimited(provider: string): boolean {
  const until = rateLimited[provider]
  if (!until) return false
  if (Date.now() > until) {
    delete rateLimited[provider]
    return false
  }
  return true
}

function markRateLimited(provider: string) {
  rateLimited[provider] = Date.now() + COOLDOWN_MS
  console.warn(`[AI] ${provider} rate-limited, switching to next provider`)
}

async function callOpenRouter(opts: CallOptions): Promise<string | null> {
  if (!OPENROUTER_KEY) return null
  if (isRateLimited("openrouter")) return null
  const { messages, temperature = 0.8, maxTokens = 4000 } = opts
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000)
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENROUTER_KEY}` },
      body: JSON.stringify({ model: "meta-llama/llama-3.3-70b-instruct:free", messages, temperature, max_tokens: Math.min(maxTokens, 4000) }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (res.status === 429) {
      markRateLimited("openrouter")
      return null
    }
    if (!res.ok) {
      console.error(`[OpenRouter] ${res.status}: ${res.statusText}`)
      return null
    }
    const data = await res.json()
    return data.choices?.[0]?.message?.content || null
  } catch (e: any) {
    console.error("[OpenRouter] Error:", e?.name === "AbortError" ? "TIMEOUT" : e?.message)
    return null
  }
}

async function callGroq(opts: CallOptions): Promise<string | null> {
  if (!GROQ_KEY) return null
  if (isRateLimited("groq")) return null
  const { messages, temperature = 0.8, maxTokens = 4000 } = opts
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000)
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, temperature, max_tokens: Math.min(maxTokens, 4000) }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (res.status === 429) {
      markRateLimited("groq")
      return null
    }
    if (!res.ok) {
      console.error(`[Groq] ${res.status}: ${res.statusText}`)
      return null
    }
    const data = await res.json()
    return data.choices?.[0]?.message?.content || null
  } catch (e: any) {
    console.error("[Groq] Error:", e?.name === "AbortError" ? "TIMEOUT" : e?.message)
    return null
  }
}

async function callGemini(opts: CallOptions): Promise<string | null> {
  if (!GEMINI_KEY) return null
  if (isRateLimited("gemini")) return null
  const { messages, temperature = 0.8, maxTokens = 4000 } = opts
  const systemMsg = messages.find(m => m.role === "system")
  const chatMsgs = messages.filter(m => m.role !== "system")
  const contents = chatMsgs.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))
  if (systemMsg && contents.length > 0 && contents[0].role === "user") {
    contents[0].parts[0].text = systemMsg.content + "\n\n" + contents[0].parts[0].text
  }
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000)
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents, generationConfig: { temperature, maxOutputTokens: Math.min(maxTokens, 4000) } }), signal: controller.signal }
    )
    clearTimeout(timeout)
    if (res.status === 429) {
      markRateLimited("gemini")
      return null
    }
    if (!res.ok) {
      console.error(`[Gemini] ${res.status}: ${res.statusText}`)
      return null
    }
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null
  } catch (e: any) {
    console.error("[Gemini] Error:", e?.name === "AbortError" ? "TIMEOUT" : e?.message)
    return null
  }
}

export async function aiChat(opts: CallOptions): Promise<{ content: string; provider: string } | null> {
  // Try providers in order: OpenRouter -> Groq -> Gemini
  // If one is rate-limited or fails, automatically try the next
  const providers = [
    { name: "openrouter", fn: callOpenRouter },
    { name: "groq", fn: callGroq },
    { name: "gemini", fn: callGemini },
  ]

  for (const provider of providers) {
    try {
      const result = await provider.fn(opts)
      if (result) {
        console.log(`[AI] Response from ${provider.name}`)
        return { content: result, provider: provider.name }
      }
    } catch (e: any) {
      console.error(`[AI] ${provider.name} failed:`, e?.message)
    }
  }

  console.warn("[AI] All providers failed or rate-limited")
  return null
}

export function getAvailableProviders(): string[] {
  const available: string[] = []
  if (OPENROUTER_KEY && !isRateLimited("openrouter")) available.push("openrouter")
  if (GROQ_KEY && !isRateLimited("groq")) available.push("groq")
  if (GEMINI_KEY && !isRateLimited("gemini")) available.push("gemini")
  return available
}
