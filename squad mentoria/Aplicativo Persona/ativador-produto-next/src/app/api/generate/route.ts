import { NextRequest, NextResponse } from "next/server"

const GROQ_API_KEY = process.env.GROQ_API_KEY

const STEP_PROMPTS: Record<string, string> = {
  headline: `Gere headline e subtítulo para um produto digital.
Retorne APENAS um JSON com as chaves: "Headline", "Subtítulo", "Benefício Central", "Prova Social".
Headline e Subtítulo: textos prontos para publicar, específicos para o nicho.
ATENÇÃO: NÃO invente números, prazos, métricas ou promessas específicas (ex: "21 dias", "8 semanas", "resultados incríveis"). Headline e subtítulo devem ser baseados APENAS no tema do produto, sem promessas quantificáveis não verificadas.
Prova Social: APENAS o texto "[INSIRA AQUI SEUS DEPOIMENTOS E DADOS REAIS DE ALUNOS]".
Não invente absolutamente nenhuma frase, depoimento, número ou dado de prova social. O valor de Prova Social deve ser exatamente o placeholder acima.`,

  modulos: `Gere 5 módulos completos para um curso/produto digital.
Retorne APENAS um JSON com as chaves: "Módulo 1 — Fundação", "Módulo 2 — Estrutura", "Módulo 3 — Execução", "Módulo 4 — Otimização", "Módulo 5 — Domínio".
Cada valor deve ser a DESCRIÇÃO COMPLETA do módulo com nome e conteúdo.
Não use emojis.`,

  entregaveis: `Gere 5 entregáveis para um produto digital.
Retorne APENAS um JSON com 5 chaves (ex: "Videoaulas", "Templates", "Planilha", "Comunidade", "Certificado").
Cada valor deve ser DESCRIÇÃO COMPLETA do entregável.
Não use emojis.`,

  bonus: `Gere 4 bônus exclusivos para um produto digital.
Retorne APENAS um JSON com as chaves: "Bônus 1", "Bônus 2", "Bônus 3", "Bônus 4".
Cada valor deve ser DESCRIÇÃO COMPLETA do bônus.
Não use emojis.`,

  vsl: `Gere um script completo de VSL (Vídeo de Vendas).
Retorne APENAS um JSON com as chaves: "Abertura", "Problema", "Solução", "Prova Social", "Oferta", "Script Completo".
Cada valor deve ser TEXTO FALADO COMPLETO, pronto para ler em voz alta.
O script completo deve unir todas as seções em texto corrido com marcações de cena.
Não use emojis.
ATENÇÃO — Prova Social: escreva APENAS "[INSIRA AQUI SEUS DEPOIMENTOS E DADOS REAIS DE ALUNOS]". Não invente absolutamente nenhum depoimento, número, dado, frase ou história de prova social.`,

  anuncios: `Gere anúncios para múltiplas plataformas.
Retorne APENAS um JSON com as chaves: "Instagram", "Facebook", "Google Ads", "TikTok", "Hook Topo", "Hook Meio", "Hook Fundo".
Cada valor deve ser TEXTO COMPLETO DO ANÚNCIO, pronto para copiar e usar.
Não use emojis.
ATENÇÃO: Não invente números ou provas sociais falsas. Use linguagem que o usuário preenche com dados reais.`,

  conteudo: `Gere um plano de conteúdo de 14 dias.
Retorne APENAS um JSON com 14 chaves: "Semana 1 — Dia 1" até "Semana 2 — Dia 14".
Cada valor deve seguir o formato: "FORMATO: Tema do conteúdo — descrição".
Não use emojis.`,

  oferta: `Gere uma oferta completa com precificação inteligente.
Retorne APENAS um JSON com as chaves: "Valor Ideal", "Ancoragem", "Parcelamento", "Garantia", "Escassez", "Oferta Principal".
Cada valor deve ser TEXTO COMPLETO E PRONTO PARA PUBLICAR.
Não use emojis.
REGRAS DE PREÇO:
- O valor informado pelo usuário já é o preço FINAL de venda (sem desconto)
- Na Ancoragem: invente um valor cheio MAIOR (ex: se o produto vale R$ 497,Ancore de R$ 997)
- No Parcelamento: DIVIDA o valor informado por 12 para mostrar a parcela (ex: R$ 497 → 12x de R$ 41,42). NUNCA repita o valor integral como parcela
- Escreva R$ uma única vez (ex: "R$ 497", nunca "R$ R$ 497")
- Na Escassez: use números realistas (ex: 50 vagas, 100 vagas), NUNCA use o número 12
- Na Garantia: use 7 dias (padrão do mercado)
- Não invente valores numéricos diferentes do informado. Use o valor informado como base para todos os cálculos.`,

  funil: `Gere um funil de vendas completo.
Retorne APENAS um JSON com as chaves: "Checkout", "Order Bump", "Upsell 1", "Upsell 2", "Downsell", "Obrigado".
Cada valor deve ser TEXTO COMPLETO com plataforma, valores e estratégia.
Não use emojis.`,

  automacao: `Gere uma estratégia de automação de marketing.
Retorne APENAS um JSON com as chaves: "Email 1 — Boas-Vindas", "Email 2 — Dica", "Email 3 — Case", "WhatsApp", "Recuperação Carrinho".
Cada valor deve ser TEXTO COMPLETO com roteiro do email ou mensagem.
Não use emojis.`,

  monetizacao: `Gere estratégias de monetização para um produto digital.
Retorne APENAS um JSON com as chaves: "Assinatura", "Licenciamento", "Mentoria", "Afiliados", "White Label".
Cada valor deve ser TEXTO COMPLETO com preços e descrição do modelo.
Não use emojis.
ATENÇÃO: Não invente preços ou números. Use [VALOR] como placeholder.`,

  dashboard: `Gere um dashboard de KPIs para um produto digital.
Retorne APENAS um JSON com as chaves: "Receita Projetada", "Meta Mensal", "Ticket Médio", "Conversão", "CAC", "ROI", "ROAS", "LTV".
Cada valor deve ser TEXTO COMPLETO com explicação do que cada métrica significa.
ATENÇÃO: Não invente números. Explique o conceito e deixe espaços para o usuário preencher dados reais.
Não use emojis.`,

  escala: `Gere estratégias de escala para um produto digital.
Retorne APENAS um JSON com as chaves: "Próximo Produto", "Cross Sell", "Linha de Produtos", "Tráfego Pago", "Afiliados", "Recorrência".
Cada valor deve ser TEXTO COMPLETO com estratégia detalhada.
Não use emojis.
ATENÇÃO: Não invente números de preços ou métricas. Use [VALOR] ou [N] como placeholder.`,

  logo: `Gere um logotipo profissional em SVG para um produto digital.

CRITÉRIOS DE QUALIDADE (obrigatório):
- Design sofisticado e moderno, com visual hierarchy clara
- Elemento marcante: um ícone/forma que comunique o tema do produto (círculo, hexágono, escudo, etc.)
- Tipografia de alto contraste entre nome (bold, grande) e subtítulo (leve, uppercase, letter-spaced)
- Paleta de cores premium: marrom #8B5E3C (primária), D4B896 (dourada), F5EFE8 (fundo claro), 1A1A1A (texto escuro)
- Fundo com acabamento limpo (canto arredondado 12px), layout horizontal 500x180
- Duas versões: uma em fundo claro (F5EFE8) e uma em fundo escuro (1A1A1A)
- Use <defs> com <linearGradient> para dar profundidade
- Substitua dados do usuário por placeholders: [NOME], [SUBTÍTULO]

Retorne APENAS um JSON com as chaves: "Logo Principal SVG", "Logo Alternativo SVG", "Cores da Marca", "Usos do Logo".
Não use emojis.`,

  capa: `Gere capas profissionais para redes sociais em SVG para um produto digital.

CRITÉRIOS DE QUALIDADE (obrigatório):
- Design editorial premium com fundo gradiente escuro (#1A1A1A → #2D2D2D)
- Elementos decorativos sutis: círculos grandes semi-transparentes como textura de fundo
- Headline em destaque com 88-120px, weight 800, letter-spacing -1 a -2
- Palavra de destaque na cor dourada #D4B896
- Linha divisória fina (#8B5E3C) entre headline e subtítulo
- Barra semi-transparente na parte inferior com nome do produto e oferta
- Proporções exatas: Feed 1080x1350 (4:5), Reels 1080x1920 (9:16)
- Use <defs> com <linearGradient> para profundidade
- Substitua por placeholders: [HEADLINE], [SUBTÍTULO], [NOME DO PRODUTO], [OFERTA]

Retorne APENAS um JSON com as chaves: "Feed 1080x1350 SVG", "Reels 1080x1920 SVG", "Dicas de Uso".
Não use emojis.`,

  card_oferta: `Gere um card de oferta promocional profissional em SVG.

CRITÉRIOS DE QUALIDADE (obrigatório):
- Design dark premium: fundo gradiente #1A1A1A → #0D0D0D
- Borda elegante com outline sutil (#8B5E3C, opacidade 0.3)
- Círculo decorativo grande semi-transparente ao centro como profundidade
- Selo "OFERTA ESPECIAL" em uppercase, letter-spacing 8px, cor #D4B896
- Preço antigo riscado (opacidade 0.5)
- Preço novo GIGANTE 120px, weight 800, cor branca
- Botão CTA com gradiente marrom (#8B5E3C → #5C3A1E), border-radius 35px
- Selo de garantia e urgência abaixo do CTA
- Proporção 1080x1350 (vertical para Stories)
- Use <defs> com <linearGradient>
- Substitua por placeholders: [VALOR], [VALOR CHEIO], [N], [PARCELA]

Retorne APENAS um JSON com as chaves: "Card Oferta SVG", "Indicado para", "Copy para Legenda".
Não use emojis.`,

  certificado: `Gere um template de certificado de conclusão profissional em SVG.

CRITÉRIOS DE QUALIDADE (obrigatório):
- Formato paisagem 842x595 (A4 landscape)
- Fundo off-white #F5EFE8 com acabamento limp
- Moldura dupla: borda externa com gradiente marrom (#8B5E3C → #D4B896), interna fina (#D4B896)
- Círculo decorativo semi-transparente no topo
- Título "CERTIFICADO" em Georgia, 40px, cor marrom
- Subtítulo "DE CONCLUSÃO" em uppercase com letter-spacing 6px
- Nome do aluno em Georgia 32px bold com linha abaixo
- Nome do curso em Georgia 22px bold marrom
- Linhas de assinatura e data na parte inferior
- Substitua por placeholders: [NOME DO ALUNO], [NOME DO CURSO], [CARGA], [DATA]

Retorne APENAS um JSON com as chaves: "Certificado SVG", "Instruções", "Personalização".
Não use emojis.`,

  landing: `Gere uma landing page HTML/CSS completa e profissional para captura de leads/vendas.

CRITÉRIOS DE QUALIDADE (obrigatório):
- Design moderno e limpo, tipografia Inter do Google Fonts
- Hero com gradiente escuro (#1A1A1A → #2D2D2D), headline grande (clamp 32-56px), palavra de destaque em #D4B896
- Subtítulo em branco opacidade 0.7, CTA com gradiente marrom e hover effect (sombra + translateY)
- Seção de benefícios/módulos com grid responsivo (auto-fit, minmax 240px)
- Cards de benefício brancos com borda #D9CEC2, hover sobe 4px e borda muda para #8B5E3C
- Número do benefício em círculo marrom
- Seção de oferta escura com box centralizado, preço em destaque #D4B896, lista de itens com check ✓ verde
- Selo de garantia com texto "Pagamento 100% seguro"
- Footer escuro com direitos reservados
- Totalmente responsivo (mobile first com @media max-width 640px)
- Substitua por placeholders: [NOME DO PRODUTO], [HEADLINE], [PALAVRA DE DESTAQUE], [SUBTÍTULO], [DESCRIÇÃO BREVE DOS MÓDULOS], [MÓDULOS HTML], [VALOR CHEIO], [VALOR], [N], [PARCELA]
- CSS interno completo no <style>

Retorne APENAS um JSON com as chaves: "HTML Landing Page", "Como Usar", "Personalização".
Não use emojis.`,

  story: `Gere um roteiro visual profissional para Instagram Stories / Reels.

CRITÉRIOS DE QUALIDADE (obrigatório):
- 7 slides com estrutura copywriting de alta conversão: Gancho → Dor → Solução → Prova → Benefícios → Oferta → CTA
- Cada slide deve incluir: cena visual, texto na tela, efeito/transição, duração em segundos
- Efeitos visuais e transições realistas para Instagram (fade-in, spotlight, swipe, glow pulsante)
- Sugestão de locução/tom para cada slide
- Duração total aproximada de 30 segundos
- Dicas de produção: cortes secos, legenda automática, tipo de música (instrumental crescente)
- Substitua por placeholders: [NOME DO PRODUTO], [PROBLEMA], [BENEFÍCIO 1-3], [DEPOIMENTO], [VALOR], [VALOR CHEIO]

Retorne APENAS um JSON com as chaves: "Slide 1 — Gancho", "Slide 2 — Dor", "Slide 3 — Solução", "Slide 4 — Prova", "Slide 5 — Benefícios", "Slide 6 — Oferta", "Slide 7 — CTA Final", "Dicas de Produção".
Não use emojis.`,
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { ideia, tom, lucro, step } = body

    if (!ideia) {
      return NextResponse.json({ error: "Ideia é obrigatória" }, { status: 400 })
    }

    // Se for um step especifico, gerar apenas ele
    if (step && STEP_PROMPTS[step]) {
      const systemPrompt = STEP_PROMPTS[step]
      const userPrompt = `Crie conteúdo COMPLETO E PRONTO PARA PUBLICAR para:
IDEIA: ${ideia}
TOM: ${tom || "Persuasivo e direto"}
LUCRO DESEJADO: R$ ${lucro || "60000"}

${systemPrompt}

IMPORTANTE: Gere textos COMPLETOS e PRONTOS PARA COPIAR E USAR. Não use emojis. Não use colchetes. Seja específico para o nicho.`

      // Try Groq first
      if (GROQ_API_KEY) {
        try {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              temperature: 0.8,
              max_tokens: 4000,
            }),
          })

          if (res.ok) {
            const data = await res.json()
            const content = data.choices?.[0]?.message?.content
            if (content) {
              try {
                const parsed = JSON.parse(content)
                return NextResponse.json(parsed)
              } catch {
                const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
                if (jsonMatch) {
                  try {
                    const parsed = JSON.parse(jsonMatch[1])
                    return NextResponse.json(parsed)
                  } catch {}
                }
              }
            }
          }
        } catch {}
      }

      // Fallback: return null so the frontend uses local fallback
      return NextResponse.json(null)
    }

    // Full product generation (no step specified) - use the old generate.js logic
    const systemPrompt = `Você é um estrategista de produtos digitais e copywriter sênior.

Gere SEMPRE em português brasileiro, com tom persuasivo e direto.

IMPORTANTE: Todos os textos devem ser COMPLETOS e PRONTOS PARA PUBLICAR.

Retorne APENAS um JSON válido (sem markdown, sem texto extra).

CAMPOS OBRIGATÓRIOS:
{
  "name": "Nome do Produto",
  "desc": "Descrição curta em 1 linha",
  "validated": "[INSIRA AQUI SEUS DEPOIMENTOS E DADOS REAIS DE ALUNOS]",
  "headline": "Headline impactante com benefício claro",
  "sub": "Subtítulo que reforça o benefício",
  "benef": "Benefício central em 1 linha",
  "hook1": "Hook topo de funil completo",
  "hook2": "Hook meio de funil completo",
  "hook3": "Hook fundo de funil completo",
  "mods": ["Módulo 1 — descrição", "Módulo 2 — descrição", "Módulo 3 — descrição", "Módulo 4 — descrição", "Módulo 5 — descrição"],
  "criativos": ["Ideia 1", "Ideia 2", "Ideia 3", "Ideia 4", "Ideia 5"],
  "salesPage": "Página de vendas COMPLETA — 3-4 parágrafos",
  "entregaveis": ["Entregável 1", "Entregável 2", "Entregável 3", "Entregável 4", "Entregável 5"]
}

CAMPOS OBRIGATÓRIOS TAMBÉM (gere TODOS com conteúdo COMPLETO, nenhum pode ser null):
{
  "vsl": { "abertura_gancho": "", "problema": "", "solucao": "", "prova_social": "", "oferta": "", "cta": "", "script_completo": "" },
  "anuncios_plataformas": { "instagram": { "ideia": "", "imagem": "", "prompt": "" }, "facebook": { "ideia": "", "imagem": "", "prompt": "" }, "google": { "ideia": "", "imagem": "", "prompt": "" }, "tiktok": { "ideia": "", "imagem": "", "prompt": "" } },
  "plano_conteudo": { "semana_1": [{ "dia": 1, "formato": "Reels", "tema": "", "roteiro": "" }], "semana_2": [{ "dia": 8, "formato": "Reels", "tema": "", "roteiro": "" }] },
  "oferta_precificacao": { "valor_ideal": "", "ancoragem": "", "parcelamento": "", "garantia": "", "escassez": "", "oferta_principal": "" },
  "funil_automacao": { "checkout": "", "order_bump": "", "upsell": "", "downsell": "", "emails_pos_venda": "", "whatsapp": "", "recuperacao_carrinho": "", "automacao_visao_geral": "" },
  "escala_monetizacao": { "trafego_pago": "", "afiliados": "", "indicacao": "", "recorrencia": "", "assinatura": "", "licenciamento": "", "white_label": "", "franquia_digital": "", "metricas": [] },
  "dashboard_operacao": { "receita_projetada": "", "meta_mensal": "", "ticket_medio": "", "conversao": "", "cac": "", "roi": "", "escala": "" },
  "proximo_produto": { "ideia": "", "linha_produtos": [], "cross_sell": "", "ascensao_valor": "" },
  "ia_otimizadora": { "analise_anuncios": "", "analise_vsl": "", "analise_pagina": "", "analise_funil": "", "melhorias_auto": "", "testes_ab": "" }
}

REGRAS: Personalize 100% para o nicho. NUNCA use colchetes. NUNCA use emojis.
ATENÇÃO: NUNCA invente números, dados, métricas, depoimentos ou qualquer prova social. Todo campo de prova social deve conter exatamente o texto "[INSIRA AQUI SEUS DEPOIMENTOS E DADOS REAIS DE ALUNOS]". Não escreva nenhuma frase genérica como "alunos reais", "resultados comprovados" ou "depoimentos verdadeiros" — isso também é conteúdo fabricado. O usuário deve inserir os dados reais manualmente.`

    const userPrompt = `Crie um produto digital COMPLETO para:
IDEIA: ${ideia}
TOM: ${tom || "Persuasivo e direto"}
LUCRO DESEJADO: R$ ${lucro || "60000"}

Gere TODOS os campos com conteúdo COMPLETO. Não use emojis. Não use colchetes.`

    if (GROQ_API_KEY) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.8,
            max_tokens: 7800,
          }),
        })

        if (!res.ok) {
          return NextResponse.json({ error: "Erro na API Groq" }, { status: 502 })
        }

        const data = await res.json()
        const content = data.choices?.[0]?.message?.content

        if (!content) {
          return NextResponse.json({ error: "Resposta vazia da Groq" }, { status: 502 })
        }

        try {
          const parsed = JSON.parse(content)
          return NextResponse.json(parsed)
        } catch {
          const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[1])
            return NextResponse.json(parsed)
          }
          return NextResponse.json({ error: "Formato invalido", raw: content }, { status: 502 })
        }
      } catch (error: unknown) {
        return NextResponse.json({ error: "Erro interno", detail: (error as Error).message }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "GROQ_API_KEY não configurada" }, { status: 500 })
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })
  }
}
