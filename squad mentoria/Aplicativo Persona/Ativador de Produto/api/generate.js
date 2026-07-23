export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { ideia, tom, lucro } = req.body;
  if (!ideia || !ideia.trim()) return res.status(400).json({ error: 'A ideia é obrigatória' });

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) return res.status(500).json({ error: 'API key não configurada' });

  const systemPrompt = `Voce e um estrategista de produtos digitais e copywriter senior especialista em marketing multicanal.

Gere SEMPRE em portugues brasileiro, com tom persuasivo e direto.

IMPORTANTE: Todos os textos gerados devem ser COMPLETOS e PRONTOS PARA PUBLICAR. Nao gere ideias, sugestoes ou descricoes — gere o conteudo final que o usuario pode copiar e usar imediatamente. Cada campo deve conter texto completo, nao um resumo ou placeholder.

Retorne APENAS um JSON valido (sem markdown, sem texto extra). Resposta deve ter no maximo 7800 tokens.

CAMPOS OBRIGATORIOS (preencha todos):
{
  "name": "Nome do Produto (criativo, sem emoji)",
  "desc": "Descricao curta em 1 linha (pronta para publicar)",
  "validated": "Frase de prova social com numeros (ex: 'Mais de 12 mil alunos em 27 paises')",
  "headline": "Headline impactante com beneficio claro (completa, pronta para anuncio)",
  "sub": "Subtitulo que reforca o beneficio (completo, pronto para anuncio)",
  "benef": "Beneficio central em 1 linha (pronto para usar em copy)",
  "hook1": "Hook topo de funil completo — frase pronta para anuncio (atencao: pergunta ou afirmacao impactante)",
  "hook2": "Hook meio de funil completo — frase pronta para anuncio (engajamento: comparacao ou prova social)",
  "hook3": "Hook fundo de funil completo — frase pronta para anuncio (conversao: urgencia ou visao de futuro)",
  "mods": ["Modulo 1 — nome: descricao do conteudo completo", "Modulo 2 — nome: descricao do conteudo completo", "Modulo 3 — nome: descricao do conteudo completo", "Modulo 4 — nome: descricao do conteudo completo", "Modulo 5 — nome: descricao do conteudo completo"],
  "criativos": ["Ideia de criativo 1", "Ideia de criativo 2", "Ideia de criativo 3", "Ideia de criativo 4", "Ideia de criativo 5"],
  "salesPage": "Pagina de vendas COMPLETA — texto longo de 3-4 paragrafos com headline, sub, prova social, oferta, bonus, garantia e CTA. Pronto para copiar e colar.",
  "entregaveis": ["Entregavel 1 completo com descricao", "Entregavel 2 completo com descricao", "Entregavel 3 completo com descricao", "Entregavel 4 completo com descricao", "Entregavel 5 completo com descricao"]
}

CAMPOS OBRIGATORIOS TAMBEM (gere TODOS com conteudo COMPLETO). NENHUM campo pode ser null. Cada campo deve conter CONTEUDO COMPLETO E PRONTO PARA PUBLICAR, nao apenas uma ideia ou descricao. Textos de anuncios, roteiros e scripts devem estar escritos por extenso, prontos para copiar e usar:
{
  "anuncios_plataformas": {
    "instagram": { "ideia": "CONTEUDO COMPLETO do anuncio para Instagram", "prompt": "Prompt de imagem descritivo e completo em portugues (estilo Midjourney)", "imagem": "Descricao completa da imagem viral" },
    "linkedin": { "ideia": "...", "prompt": "...", "imagem": "..." },
    "facebook": { "ideia": "...", "prompt": "...", "imagem": "..." },
    "google": { "ideia": "...", "prompt": "...", "imagem": "..." },
    "tiktok": { "ideia": "...", "prompt": "...", "imagem": "..." }
  },
  "plano_conteudo": {
    "semana_1": [{ "dia":1, "formato":"Reels", "tema":"...", "roteiro":"Roteiro COMPLETO para gravar — texto falado por extenso" }, { "dia":2, "formato":"Post Estatico", "tema":"...", "roteiro":"... COMPLETO" }, { "dia":3, "formato":"Carrossel", "tema":"...", "roteiro":"... COMPLETO" }, { "dia":4, "formato":"Reels", "tema":"...", "roteiro":"... COMPLETO" }, { "dia":5, "formato":"Post Estatico", "tema":"...", "roteiro":"... COMPLETO" }, { "dia":6, "formato":"Carrossel", "tema":"...", "roteiro":"... COMPLETO" }, { "dia":7, "formato":"Reels", "tema":"...", "roteiro":"... COMPLETO" } ],
    "semana_2": [{ "dia":8, "formato":"Reels", "tema":"...", "roteiro":"Roteiro COMPLETO para gravar" }, { "dia":9, "formato":"Post Estatico", "tema":"...", "roteiro":"... COMPLETO" }, { "dia":10, "formato":"Carrossel", "tema":"...", "roteiro":"... COMPLETO" }, { "dia":11, "formato":"Reels", "tema":"...", "roteiro":"... COMPLETO" }, { "dia":12, "formato":"Post Estatico", "tema":"...", "roteiro":"... COMPLETO" }, { "dia":13, "formato":"Carrossel", "tema":"...", "roteiro":"... COMPLETO" }, { "dia":14, "formato":"Reels", "tema":"...", "roteiro":"... COMPLETO" } ]
  },
  "vsl": {
    "abertura_gancho": "Frase de abertura COMPLETA que prende atencao (5-10s) — pronta para falar",
    "problema": "Descricao COMPLETA do problema (15-30s) — texto falado pronto",
    "solucao": "Produto como solucao COMPLETO (30-60s) — texto falado pronto",
    "prova_social": "Depoimentos e dados COMPLETOS (15-30s) — texto falado pronto",
    "oferta": "Oferta COMPLETA com bonus e garantia (20-40s) — texto falado pronto",
    "cta": "Chamada para acao COMPLETA (10-15s) — texto falado pronto",
    "script_completo": "Script COMPLETO da VSL em texto corrido para gravar — pronto para ler em voz alta"
  },
  "oferta_precificacao": {
    "valor_ideal": "R$ 197 (preco sugerido com base no valor percebido — incluir justificativa do valor)",
    "ancoragem": "De R$ 597 por apenas R$ 197 — texto COMPLETO da ancora de precos",
    "parcelamento": "12x de R$ 19,70 — texto COMPLETO da condicao de pagamento",
    "garantia": "7 dias de garantia incondicional — texto COMPLETO da politica de risco zero",
    "escassez": "Ultimas X vagas com bonus exclusivos — texto COMPLETO de urgencia",
    "oferta_principal": "Descricao COMPLETA da oferta principal com todos os bonus, condicoes e CTA — pronta para pagina de vendas"
  },
  "funil_automacao": {
    "checkout": "Plataforma de checkout recomendada e configuracao — descricao COMPLETA",
    "order_bump": "Oferta COMPLETA de order bump (texto pronto para checkout)",
    "upsell": "Pagina de upsell COMPLETA com texto, valor e bonus",
    "downsell": "Pagina de downsell COMPLETA com texto e valor",
    "emails_pos_venda": "Sequencia COMPLETA de e-mails automaticos pos-compra (dias 1, 3, 7, 14, 30) — cada email escrito por extenso",
    "whatsapp": "Estrategia de automacao no WhatsApp com textos COMPLETOS prontos",
    "recuperacao_carrinho": "Sequencia COMPLETA de recuperacao de carrinho abandonado com textos prontos",
    "automacao_visao_geral": "Visao geral COMPLETA de toda a automacao de vendas"
  },
  "escala_monetizacao": {
    "trafego_pago": "Estrategia COMPLETA de trafego pago (plataformas, orcamento, segmentacao) com recomendacoes especificas",
    "afiliados": "Programa de afiliados COMPLETO (comissao, plataforma, recrutamento) com texto de convite",
    "indicacao": "Programa de indicacao COMPLETO (incentivos para clientes indicarem) com textos prontos",
    "recorrencia": "Modelo de recorrencia COMPLETO (mensalidades, beneficios de cada nivel)",
    "assinatura": "Assinatura ou clube COMPLETO (conteudo exclusivo mensal com descricao de cada mes)",
    "licenciamento": "Licenciamento COMPLETO do conteudo para terceiros (termos e precos)",
    "white_label": "White label COMPLETO (revenda do produto por terceiros — precos e condicoes)",
    "franquia_digital": "Franquia digital COMPLETA (modelo de negocio replicavel — descricao do sistema)",
    "metricas": ["CAC: R$ X (calculado)", "LTV: R$ X (calculado)", "ROAS: X:1", "ROI: X%", "Taxa de conversao: X%"]
  },
  "dashboard_operacao": {
    "receita_projetada": "R$ X/mes (projecao realista com explicacao)",
    "meta_mensal": "X vendas por mes para atingir a receita (calculo detalhado)",
    "ticket_medio": "R$ X (ticket medio esperado com explicacao)",
    "conversao": "X% (taxa de conversao estimada com referencia)",
    "cac": "R$ X (custo de aquisicao por cliente com calculo)",
    "roi": "X% (retorno sobre investimento projetado)",
    "escala": "Estrategia COMPLETA para escalar o negocio (proximos passos detalhados)"
  },
  "proximo_produto": {
    "ideia": "Ideia COMPLETA para o proximo produto digital (complementar ao atual) — com nome, descricao e precificacao",
    "linha_produtos": ["Produto 1: nome e descricao COMPLETA", "Produto 2: nome e descricao COMPLETA", "Produto 3: nome e descricao COMPLETA"],
    "cross_sell": "Estrategia COMPLETA de cross sell entre produtos da linha — com textos prontos",
    "ascensao_valor": "Estrategia COMPLETA de ascensao de valor (entry -> medio -> premium) com precos"
  },
  "ia_otimizadora": {
    "analise_anuncios": "Analise COMPLETA e sugestoes de otimizacao para os anuncios — com recomendacoes especificas",
    "analise_vsl": "Analise COMPLETA e sugestoes para melhorar a VSL — com ajustes especificos no roteiro",
    "analise_pagina": "Analise COMPLETA e sugestoes para a pagina de vendas — com elementos a testar",
    "analise_funil": "Analise COMPLETA e sugestoes para o funil completo — com pontos de melhoria",
    "melhorias_auto": "Melhorias automaticas COMPLETAS sugeridas — acoes especificas para implementar",
    "testes_ab": "Testes A/B COMPLETOS sugeridos para otimizar conversao — cada teste com hipotese, variacao e metrica"
  }
}

REGRAS IMPORTANTES:
- Personalize 100% para o nicho. Seja especifico, com dados e exemplos reais.
- NUNCA use colchetes como [Tema] ou [Nome] — substitua sempre pelo conteudo real.
- NUNCA use emojis no JSON gerado.
- Os textos de anuncios, roteiros, scripts, emails e copias devem estar COMPLETOS e PRONTOS PARA COPIAR E USAR — nao apenas descricoes ou ideias.
- Os prompts das imagens devem ser descritivos em portugues, prontos para copiar e colar.
- Os roteiros devem ter linguagem natural para ser falada, com marcacoes de cena.
- Formatos alternados: Reels (segunda/quinta/domingo), Post Estatico (terca/sexta), Carrossel (quarta/sabado).`;

  const userPrompt = `Crie um produto digital COMPLETO e PRONTO PARA PUBLICAR para:
IDEIA/NICHO: ${ideia}
TOM/COMUNICACAO: ${tom || "Persuasivo e direto"}
LUCRO DESEJADO: R$ ${lucro || "10000"}

Importante: Gere TODOS os campos do JSON — obrigatorios e obrigatorios tambem. Cada campo deve conter textos COMPLETOS e PRONTOS PARA COPIAR E USAR, nao apenas ideias ou descricoes. Cada copy, roteiro, email e script deve estar escrito por extenso como se fosse publicado. Nao use emojis. NENHUM campo pode ser null.

Inclua TODOS os campos: criativos por plataforma (instagram, facebook, google, tiktok), plano de conteudo de 14 dias, VSL completa, oferta/precificacao completa, funil de automacao completo, escala/monetizacao completa, dashboard de operacao, proximo produto e IA otimizadora.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 7800,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: `Erro Groq: ${response.status}`, detail: errText });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return res.status(502).json({ error: 'Resposta vazia da Groq' });

    let product;
    try {
      product = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        product = JSON.parse(jsonMatch[1]);
      } else {
        return res.status(502).json({ error: 'Formato inválido', raw: content });
      }
    }

    const required = ['name', 'headline', 'sub', 'benef', 'mods', 'criativos', 'salesPage', 'entregaveis', 'vsl', 'anuncios_plataformas', 'plano_conteudo', 'oferta_precificacao', 'funil_automacao', 'escala_monetizacao', 'dashboard_operacao', 'proximo_produto', 'ia_otimizadora'];
    const missing = required.filter(f => !product[f]);
    if (missing.length) {
      return res.status(502).json({ error: `Campos faltando: ${missing.join(', ')}`, raw: content });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno', detail: error.message });
  }
}
