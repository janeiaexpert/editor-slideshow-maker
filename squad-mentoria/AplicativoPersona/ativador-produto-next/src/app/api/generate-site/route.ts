import { NextRequest, NextResponse } from "next/server"

const GROQ_API_KEY = process.env.GROQ_API_KEY
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY

async function callAI(systemPrompt: string, userPrompt: string): Promise<string | null> {
  const models = [
    { url: "https://api.groq.com/openai/v1/chat/completions", key: GROQ_API_KEY, model: "llama-3.3-70b-versatile" },
    { url: "https://openrouter.ai/api/v1/chat/completions", key: OPENROUTER_KEY, model: "google/gemini-2.0-flash-001" },
  ]
  for (const m of models) {
    if (!m.key) continue
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    try {
      const res = await fetch(m.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${m.key}` },
        body: JSON.stringify({
          model: m.model,
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          temperature: 0.8,
          max_tokens: 4000,
        }),
        signal: controller.signal,
      })
      if (res.ok) {
        const data = await res.json()
        const content = data.choices?.[0]?.message?.content
        if (content) return content
      }
    } catch {} finally { clearTimeout(timeout) }
  }
  return null
}

const COPYWRITER_SYSTEM = `Voce e um COPYWRITER e DESIGNER UI/UX especialista em paginas de alta conversao para o mercado brasileiro.

REGRAS OBRIGATORIAS:
- Gere HTML/CSS completo e funcional
- Use a paleta de cores: marrom #8B5E3C, dourado #D4B896, fundo #F5EFE8, texto #1A1A1A, bordas #D9CEC2
- Tipografia Inter do Google Fonts
- Design responsivo (mobile-first)
- ACENTOS OBRIGATORIOS: use sempre acentos corretos do portugues (acao, funcao, informacao, otimo, etc.)
- Textos persuasivos e prontos para publicar
- Headlines com gatilhos mentais (escassez, prova social, autoridade)
- CTAs claros e diretos
- Nunca invente numeros ou provas sociais falsas
- Use placeholders [NOME], [PRECO], [DEPOIMENTO] para dados do usuario

ESTRUTURA OBRIGATORIA DO HTML:
- <!DOCTYPE html> com lang="pt-BR"
- Meta viewport responsivo
- Google Fonts Inter
- Hero section com headline + subtitulo + CTA
- Secao de beneficios com cards
- Secao de prova social (depoimentos ou dados)
- Secao de oferta com preco e CTA
- Footer com direitos reservados
- CSS inline completo no <style>
- Design premium e moderno

Retorne APENAS o HTML completo, sem markdown, sem explicacao.`

const COPYWRITER_USER = (prompt: string, template: string) => `Gere uma pagina web COMPLETA e PRONTA PARA PUBLICAR para:

PROMPT DO USUARIO: ${prompt}
TIPO DE PAGINA: ${template}

Gere o HTML/CSS COMPLETO com:
- Design responsivo e moderno
- Textos persuasivos em portugues brasileiro com acentos corretos
- Headline com gancho emocional
- Secoes de beneficios, prova social e oferta
- CTAs de alta conversao
- Paleta marrom/dourada (#8B5E3C, #D4B896, #F5EFE8)
- CSS completo inline
- Sem dependencias externas exceto Google Fonts Inter

Retorne APENAS o codigo HTML completo.`

export async function POST(req: NextRequest) {
  try {
    const { prompt, template } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt e obrigatorio" }, { status: 400 })
    }

    const content = await callAI(COPYWRITER_SYSTEM, COPYWRITER_USER(prompt, template))

    if (content) {
      const htmlMatch = content.match(/<!DOCTYPE[\s\S]*<\/html>/i)
      const html = htmlMatch ? htmlMatch[0] : content
      return NextResponse.json({ html })
    }

    return NextResponse.json({ html: null })
  } catch {
    return NextResponse.json({ error: "Requisicao invalida" }, { status: 400 })
  }
}
