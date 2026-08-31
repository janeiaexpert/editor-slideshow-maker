import { NextRequest, NextResponse } from "next/server"
import { aiChat } from "@/lib/ai"

const SYSTEM_PROMPT = `Voce e o Assistente Virtual do **Ativador Automatico de Produtos Virais** — um sistema completo que transforma ideias em produtos digitais prontos para vender.

## O QUE E O SISTEMA
O Ativador e uma ferramenta que gera automaticamente toda a estrutura de um produto digital em 19 passos organizados em 4 abas:
- **Produto**: Headline, Modulos, Entregaveis, Bonus, VSL, Anuncios, Conteudo (30 dias)
- **Vendas**: Oferta, Funil (Checkout/Upsell/Downsell), Automacao (emails/WhatsApp), Monetizacao
- **Operacao**: Dashboard de KPIs, Estrategias de Escala
- **Artefatos**: Logo SVG, Capas para Redes Sociais, Card de Oferta, Certificado, Landing Page HTML, Roteiro para Story/Reel

## COMO FUNCIONA
1. Usuario descreve sua ideia OU escolhe um produto da vitrine
2. O sistema gera automaticamente todos os 19 passos
3. Cada passo pode ser regenerado, editado e exportado (PDF, DOCX, MD, PNG)
4. O chat (voce) ajuda a refinar, melhorar e tirar duvidas

## AS 19 ABAS DO SISTEMA
1. Headline e Promessa
2. Modulos do Produto (5 modulos)
3. Entregaveis (videoaulas, PDFs, etc)
4. Bonus Exclusivos
5. Script de VSL
6. Anuncios por Plataforma (Instagram, Facebook, Google, TikTok)
7. Plano de Conteudo (30 dias)
8. Oferta Inteligente (precificacao, garantia, escassez)
9. Funil Inteligente (checkout, upsell, downsell)
10. Automacao (emails, WhatsApp, recuperacao de carrinho)
11. Monetizacao (assinatura, licenciamento, afiliados)
12. Dashboard (KPIs, metricas, ROI, CAC, LTV)
13. Estrategias de Escala
14. Logo SVG
15. Capa para Redes Sociais
16. Card de Oferta
17. Certificado
18. Landing Page HTML
19. Roteiro para Story/Reel

## REGRAS DE ATENDIMENTO
- Responda SEMPRE em portugues brasileiro, tom caloroso, direto e pratico
- Seja OBJETIVO — respostas curtas e acionaveis
- Use **negrito** para termos importantes
- Quando pedir MELHORIA, sugira versoes melhores e explique o porquê
- Quando pedir CRIAÇÃO, gere o conteudo completo
- Se o usuario estiver perdido, recomende o proximo passo
- Use exemplos CONCRETOS, nao genericos
- Maximo de 500 tokens por resposta
- O usuario e seu parceiro — fale como um consultor, nao como um robô

## FRASES UTIIS
- "Posso te ajudar com headlines, modulos, precos, VSL, anuncios e mais"
- "Se quiser, posso regenerar qualquer passo com informacoes mais especificas"
- "Quer que eu melhore algum conteudo ja gerado?"
- "Posso sugerir proximos passos para escalar seu produto"

FORMATAÇÃO:
- Use **negrito** para termos importantes
- Use quebras de linha para organizar
- Topicols com hifem quando listar itens
- Se for gerar exemplo de texto, use *itálico*`

export async function POST(req: NextRequest) {
  try {
    const { message, history, ideia, tom, lucro, steps, paleta, fonte, progresso } = await req.json()
    if (!message) return NextResponse.json({ error: "Mensagem obrigatoria" }, { status: 400 })

    let contextBlock = ""

    // Contexto do produto do usuario
    if (ideia) {
      contextBlock += `\n## PRODUTO DO USUARIO\n`
      contextBlock += `Ideia: ${ideia}\n`
      if (tom) contextBlock += `Tom: ${tom}\n`
      if (lucro) contextBlock += `Meta de faturamento: R$ ${lucro.toLocaleString("pt-BR")}\n`
      if (paleta) contextBlock += `Paleta de cores: ${paleta}\n`
      if (fonte) contextBlock += `Tipografia: ${fonte}\n`
    }

    // Progresso do usuario (quais passos ja foram gerados)
    if (progresso && typeof progresso === "object") {
      const gerados = Object.keys(progresso).filter(k => progresso[k])
      const total = 19
      if (gerados.length > 0) {
        contextBlock += `\n## PROGRESSO\n`
        contextBlock += `${gerados.length}/${total} passos gerados\n`
        contextBlock += `Abas completas: ${gerados.join(", ")}\n`
      }
    }

    // Conteudos ja gerados (resumo)
    if (steps && typeof steps === "object") {
      const entries = Object.entries(steps).filter(([, v]) => v && typeof v === "object" && Object.keys(v as object).length > 0)
      if (entries.length > 0) {
        contextBlock += `\n## CONTEUDOS GERADOS\n`
        for (const [stepId, content] of entries.slice(0, 5)) {
          const keys = Object.keys(content as object)
          contextBlock += `- ${stepId}: ${keys.join(", ")}\n`
        }
        if (entries.length > 5) {
          contextBlock += `(mais ${entries.length - 5} etapas)\n`
        }
      }
    }

    const systemContent = SYSTEM_PROMPT + (contextBlock ? `\n\n--- CONTEXTO DO USUARIO ---${contextBlock}` : "")

    const messages = [
      { role: "system" as const, content: systemContent },
      ...(history || []).slice(-10),
      { role: "user" as const, content: message },
    ]

    const result = await aiChat({
      messages,
      temperature: 0.75,
      maxTokens: 500,
    })

    if (!result) {
      // Fallback local se todas as APIs falharem
      const reply = generateLocalReply(message, ideia)
      return NextResponse.json({ reply, provider: "local" })
    }

    const reply = result.content || "Desculpe, nao consegui processar sua pergunta."

    return NextResponse.json({ reply, provider: result.provider })
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

function generateLocalReply(msg: string, ideia?: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes("preco") || lower.includes("preço") || lower.includes("valor"))
    return "**Sugestao de preco:** Para produto digital, comece entre R$27-R$97. Use ancoragem (mostrar valor 3x maior), parcelamento em 12x e garantia de 7 dias. Quer que eu gere a oferta completa?"
  if (lower.includes("headline") || lower.includes("titulo"))
    return "**Dica de headline:** Use a formula: [Resultado Desejado] + [Prazo] + [Sem dor]. Ex: 'Crie seu primeiro produto digital em 7 dias sem precisar de audiencia'. Quer que eu gere uma headline personalizada?"
  if (lower.includes("modulo") || lower.includes("aula"))
    return "**Estrutura de modulos:** Organize em 5 modulos progressivos: Fundamentos → Estrategia → Execucao → Avancado → Bonus. Cada modulo com 3-5 aulas de 10-20min. Quer que eu gere os modulos?"
  if (lower.includes("vsl") || lower.includes("video"))
    return "**Estrutura de VSL:** 1) Hook (10s) 2) Problema (30s) 3) Solucao (30s) 4) Prova social (20s) 5) Oferta (20s) 6) Urgencia (10s). Quer que eu gere o script completo?"
  if (lower.includes("anuncio") || lower.includes("trafego"))
    return "**Dica de anuncio:** Use copy AIDA (Atencao, Interesse, Desejo, Acao). Teste 3-5 variacoes de criativo. Comece com orcamento de R$20-50/dia. Quer que eu gere anuncios para todas as plataformas?"
  if (lower.includes("publico") || lower.includes("alvo"))
    return "**Definicao de publico:** Crie uma persona com: Nome, idade, profissao, dores, desejos, medos e objecoes. Quanto mais especifico, melhor. Me conte mais sobre seu publico!"
  if (lower.includes("funil") || lower.includes(" upsell"))
    return "**Funil de vendas:** Checkout → Order Bump (30% do valor) → Upsell 1 (60%) → Upsell 2 (120%) → Downsell (40%). Quer que eu gere o funil completo?"
  if (lower.includes("automacao") || lower.includes("email"))
    return "**Automacao:** Sequencia de 5 emails: Boas-vindas (dia 1), Conteudo (dia 3), Prova social (dia 7), Oferta (dia 10), Urgencia (dia 14). Quer que eu gere a automacao completa?"
  if (ideia)
    return `**Modo offline** — Estou funcionando sem conexao com a IA. Posso ajudar com sugestoes basicas sobre seu produto. Para gerar conteudo completo, a IA estara disponivel em breve.`
  return "**Modo offline** — Posso ajudar com: precos, titulos, modulos, VSL, anuncios, publico-alvo ou transformacao. Pergunte sobre um desses temas!"
}
