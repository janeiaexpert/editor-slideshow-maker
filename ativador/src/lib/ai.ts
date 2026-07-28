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

async function callGroq(opts: CallOptions): Promise<string | null> {
  if (!GROQ_KEY) return null
  const { messages, temperature = 0.8, maxTokens = 4000 } = opts
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 90000)
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, temperature, max_tokens: Math.min(maxTokens, 8000) }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) {
      console.error(`[Groq] ${res.status}: ${res.statusText}`)
      return null
    }
    const data = await res.json()
    return data.choices?.[0]?.message?.content || null
  } catch (e: any) {
    console.error("[Groq] Error:", e?.name === "AbortError" ? "TIMEOUT 90s" : e?.message)
    return null
  }
}

async function callGemini(opts: CallOptions): Promise<string | null> {
  if (!GEMINI_KEY) return null
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
    const timeout = setTimeout(() => controller.abort(), 90000)
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents, generationConfig: { temperature, maxOutputTokens: Math.min(maxTokens, 8000) } }), signal: controller.signal }
    )
    clearTimeout(timeout)
    if (!res.ok) {
      console.error(`[Gemini] ${res.status}: ${res.statusText}`)
      return null
    }
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null
  } catch (e: any) {
    console.error("[Gemini] Error:", e?.name === "AbortError" ? "TIMEOUT 90s" : e?.message)
    return null
  }
}

async function callOpenRouter(opts: CallOptions): Promise<string | null> {
  if (!OPENROUTER_KEY) return null
  const { messages, temperature = 0.8, maxTokens = 4000 } = opts
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 90000)
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENROUTER_KEY}` },
      body: JSON.stringify({ model: "meta-llama/llama-3.3-70b-instruct:free", messages, temperature, max_tokens: Math.min(maxTokens, 4000) }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) {
      console.error(`[OpenRouter] ${res.status}: ${res.statusText}`)
      return null
    }
    const data = await res.json()
    return data.choices?.[0]?.message?.content || null
  } catch (e: any) {
    console.error("[OpenRouter] Error:", e?.name === "AbortError" ? "TIMEOUT 90s" : e?.message)
    return null
  }
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)) }

export async function aiChat(opts: CallOptions): Promise<{ content: string; provider: string } | null> {
  const groq = await callGroq(opts)
  if (groq) return { content: groq, provider: "groq" }

  await delay(1000)

  const gemini = await callGemini(opts)
  if (gemini) return { content: gemini, provider: "gemini" }

  await delay(1000)

  const openrouter = await callOpenRouter(opts)
  if (openrouter) return { content: openrouter, provider: "openrouter" }

  return null
}
