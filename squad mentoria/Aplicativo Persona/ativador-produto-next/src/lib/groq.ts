const GROQ_API_KEY = process.env.GROQ_API_KEY || ""
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

export interface GroqMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export async function groqChat(
  messages: GroqMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string | null> {
  if (!GROQ_API_KEY) return null

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: options?.temperature ?? 0.8,
        max_tokens: options?.maxTokens ?? 7800,
      }),
    })

    if (!res.ok) return null

    const data = await res.json()
    return data.choices?.[0]?.message?.content || null
  } catch {
    return null
  }
}

export async function groqJSON<T>(
  messages: GroqMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<T | null> {
  const content = await groqChat(messages, options)
  if (!content) return null

  try {
    return JSON.parse(content) as T
  } catch {
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]) as T
      } catch {
        return null
      }
    }
    return null
  }
}
