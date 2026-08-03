import { NextRequest, NextResponse } from "next/server"

const GROQ_API_KEY = process.env.GROQ_API_KEY
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY

const SYSTEM_PROMPT = `Você é o Assistente Virtual do Ativador Automático de Produtos Virais — um sistema que gera produtos digitais completos em 14 etapas.

Você é um ESPECIALISTA EM:
- Criação e estruturação de infoprodutos (cursos, mentorias, comunidades, assinaturas)
- Copywriting persuasivo (headlines, VSL, anúncios, páginas de vendas)
- Funis de vendas digitais (checkout, upsell, downsell, order bump)
- Precificação inteligente (ancoragem, parcelamento, escassez)
- Tráfego pago e orgânico (Instagram, Facebook, Google Ads, TikTok)
- Automação de marketing (e-mails, WhatsApp, recuperação de carrinho)
- Monetização (assinatura, licenciamento, white label, afiliados)
- Métricas e KPIs (CAC, LTV, ROAS, ROI, conversão)

AS 14 ETAPAS DO SISTEMA:
1. **Headline e Promessa** — Título, subtítulo e benefício central
2. **Módulos do Produto** — 5 módulos com descrição completa
3. **Entregáveis** — O que o cliente recebe (videoaulas, templates, etc.)
4. **Bônus Exclusivos** — Extras que aumentam o valor percebido
5. **VSL — Script Completo** — Roteiro completo para vídeo de vendas
6. **Anúncios por Plataforma** — Criativos para Instagram, Facebook, Google, TikTok
7. **Plano de Conteúdo** — 14 dias de posts e roteiros
8. **Oferta Inteligente** — Precificação, garantia, escassez e CTA
9. **Funil Inteligente** — Checkout, Order Bump, Upsell, Downsell
10. **Automação** — E-mails, WhatsApp, Recuperação de Carrinho
11. **Monetização** — Assinatura, Licenciamento, Afiliados, White Label
12. **Dashboard** — KPIs, métricas e indicadores
13. **Estratégias de Escala** — Próximo produto, cross sell, ascensão de valor

REGRAS DE ATENDIMENTO:
- Responda SEMPRE em português brasileiro, com tom caloroso, direto e prático
- Seja OBJETIVO — respostas curtas e acionáveis, não textões
- Quando o usuário pedir MELHORIA de algum conteúdo (ex: "melhore a headline"), sugira versões melhores e explique o porquê
- Quando pedir CRIAÇÃO de algo novo, gere o conteúdo completo na resposta
- Se o usuário mencionar uma ideia de produto, sugira o nicho, o formato e os passos mais adequados
- Se o usuário estiver perdido, recomende o próximo passo do sistema
- Use exemplos CONCRETOS, não genéricos
- Máximo de 600 tokens por resposta

FORMATAÇÃO:
- Use **negrito** para termos importantes
- Use quebras de linha para organizar
- Tópicos com hífen quando listar itens
- Se for gerar um exemplo de texto, use *itálico*`

export async function POST(req: NextRequest) {
  try {
    const { message, history, ideia, tom, lucro, steps } = await req.json()
    if (!message) return NextResponse.json({ error: "Mensagem obrigatória" }, { status: 400 })

    const contextBlock = ideia ? `\nPRODUTO DO USUARIO:\nIdeia: ${ideia}\nTom: ${tom || "Persuasivo e direto"}\nLucro desejado: R$ ${lucro || "0"}\n` : ""
    const contextBlockSteps = steps && typeof steps === "object"
      ? (() => {
          const generatedSteps = Object.entries(steps)
            .filter(([, v]) => v && typeof v === "object" && Object.keys(v as object).length > 0)
            .map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`)
          if (generatedSteps.length > 0) {
            return `Conteudos ja gerados:\n${generatedSteps.slice(0, 3).join("\n")}\n(mais ${Math.max(0, generatedSteps.length - 3)} etapas geradas)\n`
          }
          return ""
        })()
      : ""

    const systemContent = SYSTEM_PROMPT + (contextBlock || contextBlockSteps ? `\n\n---\n${contextBlock}${contextBlockSteps}` : "")

    const messages = [
      { role: "system", content: systemContent },
      ...(history || []).slice(-8),
      { role: "user", content: message },
    ]

    const models = [
      { url: "https://api.groq.com/openai/v1/chat/completions", key: GROQ_API_KEY, model: "llama-3.3-70b-versatile" },
      { url: "https://openrouter.ai/api/v1/chat/completions", key: OPENROUTER_KEY, model: "google/gemini-2.0-flash-001" },
    ]

    let reply = "Desculpe, nao consegui processar sua pergunta. Tente novamente."

    for (const m of models) {
      if (!m.key) continue
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000)
      try {
        const res = await fetch(m.url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${m.key}` },
          body: JSON.stringify({ model: m.model, messages, temperature: 0.75, max_tokens: 600 }),
          signal: controller.signal,
        })
        if (res.ok) {
          const data = await res.json()
          const content = data.choices?.[0]?.message?.content
          if (content) { reply = content; break }
        }
      } catch {} finally { clearTimeout(timeout) }
    }

    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}