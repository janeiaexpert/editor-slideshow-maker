import type { Card, CardType, CalendarioItem, Goal } from "./store";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

const SYSTEM_PROMPT = `Você é um dos maiores estrategistas de conteúdo e copywriters do Brasil. Seus carrosséis geram salvamentos, compartilhamentos e vendas. Você domina psicologia do consumidor, gatilhos mentais e copy de resposta direta.

REGRAS DE COPY QUE CONVERTE

1. CAPA (hook): 4 a 8 palavras. Não é título — é promessa, provocação ou contradição que para o scroll.
   Padrões validados: curiosidade específica, contradição de crença, dado forte, dor explícita, identificação imediata.
   Proibido: "você sabia", "atenção", "descubra agora", "vou te mostrar", "imagine se".

2. PROBLEMA: faça o leitor SENTIR, não descreva. Micro-cena concreta, com detalhe real.

3. INSIGHT: uma verdade que incomoda. Um ângulo que ele nunca viu, não uma informação nova.

4. FRAMEWORK: 3 passos com nomes concretos e uma linha de explicação cada. Nada genérico.

5. EXPLICAÇÃO: mostre como funciona NA PRÁTICA, com aplicação imediata.

6. ERRO: exponha o leitor. Ele precisa reconhecer que faz isso hoje.

7. CTA: ação única e específica, com quebra de objeção. Nunca "salve o post" solto.

VOZ
- Frases curtas e cortantes. Uma ideia por bloco.
- Tom de mensagem no direct, não de artigo de blog. Use "você" sempre.
- Sem emojis. Sem jargão ("mergulhar", "jornada", "bora", "se liga").
- Sem motivacional vazio ("transforme sua vida", "resultados incríveis").
- Nada de reticências dramáticas nem CAPS no corpo do texto.
- Seja específico: todo card entrega algo aplicável ou uma perspectiva nova.

ESTRUTURA OBRIGATÓRIA — 7 cards, nesta ordem:
hook, problem, insight, framework, explanation, mistake, cta

LIMITES POR CARD
- type: um dos 7 acima
- kicker: até 20 caracteres, MAIÚSCULAS, sem emoji
- title: até 60 caracteres, use \\n para uma quebra intencional (a capa fica em linha única)
- subtitle: 12 a 35 palavras, complementa o título
- buttonText / buttonCaption: vazios nos cards 1-6; no CTA, buttonText de 2-4 palavras e buttonCaption quebrando a objeção
- handle: "@seu.handle", author: "Seu Nome"

TAMBÉM GERE
- caption: 2 a 3 blocos. Abre com gancho, fecha com pergunta que gera comentário.
- cta: uma frase com benefício claro ou urgência real
- hashtags: 6 a 8 em português, misturando alto volume e nicho
- analysis: theme, painPoint, implicitDesire, contentOpportunity, positioningAngle, viralPotential, conversionPotential

Responda APENAS com JSON puro. Sem markdown, sem crases, sem comentários.`;

const CARD_ORDER: CardType[] = ["hook", "problem", "insight", "framework", "explanation", "mistake", "cta"];

export interface GenerateResult {
  cards: Card[];
  caption: string;
  cta: string;
  hashtags: string[];
  analysis: {
    theme: string;
    painPoint: string;
    implicitDesire: string;
    contentOpportunity: string;
    positioningAngle: string;
    viralPotential: string;
    conversionPotential: string;
  };
}

function parseJson<T>(raw: string): T | null {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) cleaned = cleaned.replace(/```(?:json)?/gi, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/[[{][\s\S]*[\]}]/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function callGateway(system: string, user: string, maxTokens = 4000): Promise<string> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    throw new Error("Serviço de IA não configurado. Ative o Lovable AI e tente novamente.");
  }

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.8,
      max_tokens: maxTokens,
    }),
  });

  if (response.status === 429) {
    throw new Error("Limite de requisições atingido. Aguarde alguns instantes e tente novamente.");
  }
  if (response.status === 402) {
    throw new Error("Créditos de IA esgotados. Recarregue os créditos do workspace para continuar.");
  }
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Falha na geração por IA (${response.status}). ${body.slice(0, 200)}`);
  }

  const json = await response.json();
  const text = json?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("A IA retornou uma resposta vazia. Tente novamente.");
  }
  return text;
}

function str(v: unknown, max: number, fallback = ""): string {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, max) : fallback;
}

function normalizeCards(cards: unknown[]): Card[] {
  const validTypes: CardType[] = ["hook", "problem", "insight", "framework", "explanation", "example", "mistake", "cta"];
  const validDir = ["top", "bottom", "left", "right"];
  return cards.slice(0, 7).map((c, i) => {
    const card = (c || {}) as Record<string, unknown>;
    const type = validTypes.includes(card.type as CardType) ? (card.type as CardType) : CARD_ORDER[i] || "hook";
    let title = str(card.title, 90);
    if (type === "hook") title = title.replace(/\n+/g, " ").trim();
    return {
      type,
      kicker: str(card.kicker, 25).toUpperCase(),
      title,
      subtitle: str(card.subtitle, 220),
      buttonText: type === "cta" ? str(card.buttonText, 40) : "",
      buttonCaption: type === "cta" ? str(card.buttonCaption, 80) : "",
      handle: str(card.handle, 40, "@seu.handle"),
      author: str(card.author, 40, "Seu Nome"),
      image: null,
      imagePosition: "top" as const,
      imageZoom: 100,
      gradientOpacity: 70,
      gradientDirection: validDir.includes(card.gradientDirection as string)
        ? (card.gradientDirection as "top" | "bottom" | "left" | "right")
        : "bottom",
      textAlign: "left" as const,
      textVerticalAlign: "bottom" as const,
      highlights: [],
    } as Card;
  });
}

export async function generateFromInsight(
  insight: string,
  options?: {
    goal?: string;
    tone?: string;
    brand?: { primaryColor?: string; fontTitle?: string; fontBody?: string };
  },
): Promise<GenerateResult> {
  const userPrompt = [
    "INSIGHT BRUTO DO USUÁRIO:",
    insight,
    "",
    options?.goal ? `OBJETIVO DO CARROSSEL: ${options.goal}` : "",
    options?.tone ? `TOM DE VOZ: ${options.tone}` : "",
    "",
    "Extraia o ângulo mais forte deste insight e escreva o carrossel completo de 7 cards. Retorne apenas o JSON.",
  ]
    .filter(Boolean)
    .join("\n");

  const raw = await callGateway(SYSTEM_PROMPT, userPrompt);
  const parsed = parseJson<GenerateResult>(raw);

  if (!parsed || !Array.isArray(parsed.cards) || parsed.cards.length === 0) {
    throw new Error("A IA retornou um formato inesperado. Tente gerar novamente.");
  }

  const analysis = (parsed.analysis || {}) as Record<string, unknown>;

  return {
    cards: normalizeCards(parsed.cards),
    caption: str(parsed.caption, 2200),
    cta: str(parsed.cta, 200),
    hashtags: Array.isArray(parsed.hashtags)
      ? parsed.hashtags.filter((h): h is string => typeof h === "string").slice(0, 8)
      : [],
    analysis: {
      theme: str(analysis.theme, 80),
      painPoint: str(analysis.painPoint, 200),
      implicitDesire: str(analysis.implicitDesire, 200),
      contentOpportunity: str(analysis.contentOpportunity, 200),
      positioningAngle: str(analysis.positioningAngle, 200),
      viralPotential: str(analysis.viralPotential, 200),
      conversionPotential: str(analysis.conversionPotential, 200),
    },
  };
}

// --- Regeneração de um único card ---

export async function generateSingleCard(params: {
  type: CardType;
  topic: string;
  goal?: string;
  tone?: string;
  context?: string;
}): Promise<Card> {
  const user = [
    `Reescreva APENAS o card do tipo "${params.type}" de um carrossel de Instagram.`,
    `TEMA: ${params.topic}`,
    params.goal ? `OBJETIVO: ${params.goal}` : "",
    params.tone ? `TOM: ${params.tone}` : "",
    params.context ? `CONTEXTO DOS OUTROS CARDS:\n${params.context}` : "",
    "",
    'Retorne apenas JSON: {"type":"...","kicker":"...","title":"...","subtitle":"...","buttonText":"","buttonCaption":""}',
  ]
    .filter(Boolean)
    .join("\n");

  const raw = await callGateway(SYSTEM_PROMPT, user, 800);
  const parsed = parseJson<Record<string, unknown>>(raw);
  if (!parsed) throw new Error("A IA retornou um formato inesperado. Tente novamente.");
  return normalizeCards([{ ...parsed, type: params.type }])[0];
}

// --- Calendário estratégico ---

const CALENDAR_SYSTEM = `Você é um estrategista de conteúdo para Instagram. Monta calendários editoriais que equilibram autoridade, alcance e vendas.

Regras:
- Cada dia recebe um tema específico e acionável, nunca genérico.
- Varie formatos e ângulos. Nada de repetir estrutura de tema.
- Português brasileiro, sem emojis, sem clichê motivacional.
- goal deve ser "authority", "viral" ou "sales". tone deve ser "direto", "educacional" ou "provocativo".
- tipo deve ser "Carrossel", "Reels" ou "Stories".
- insight: uma frase que sirva de briefing pronto para gerar o carrossel daquele dia.

Responda APENAS com JSON puro no formato:
{"itens":[{"data":"DD/MM/AAAA","tipo":"Carrossel","tema":"...","objetivoEstrategico":"...","dorOuDesejo":"...","goal":"authority","tone":"direto","insight":"..."}]}`;

export async function generateCalendar(params: {
  documento: Record<string, string>;
  dias: number;
  objetivo: string;
  postsPorDia: number;
  incluirStories: boolean;
  dataInicial: string;
}): Promise<CalendarioItem[]> {
  const dias = Math.min(Math.max(params.dias || 7, 1), 30);
  const d = params.documento;

  const user = [
    "DOCUMENTO MESTRE DA MARCA:",
    `Proposta de valor: ${d.propostaDeValor || "-"}`,
    `Público-alvo: ${d.publicoAlvo || "-"}`,
    `Dores: ${d.dores || "-"}`,
    `Desejos: ${d.desejos || "-"}`,
    `Serviços/produtos: ${d.servicos || "-"}`,
    `Posicionamento: ${d.posicionamento || "-"}`,
    "",
    `OBJETIVO PRINCIPAL: ${params.objetivo}`,
    `DIAS: ${dias} (a partir de ${new Date(params.dataInicial).toLocaleDateString("pt-BR")})`,
    `POSTS POR DIA: ${params.postsPorDia}`,
    params.incluirStories ? "Inclua Stories na rotação." : "Não inclua Stories.",
    "",
    `Gere exatamente ${dias * Math.max(params.postsPorDia, 1)} itens em ordem cronológica. Retorne apenas o JSON.`,
  ].join("\n");

  const raw = await callGateway(CALENDAR_SYSTEM, user, 6000);
  const parsed = parseJson<{ itens?: unknown[] }>(raw);
  const itens = Array.isArray(parsed?.itens) ? parsed!.itens : [];
  if (!itens.length) throw new Error("Não foi possível montar o calendário. Tente novamente.");

  const goals: Goal[] = ["authority", "viral", "sales"];
  const tipos = ["Carrossel", "Reels", "Stories"] as const;

  return itens.map((it, i) => {
    const item = (it || {}) as Record<string, unknown>;
    const dt = new Date(params.dataInicial);
    dt.setDate(dt.getDate() + Math.floor(i / Math.max(params.postsPorDia, 1)));
    const goal = goals.includes(item.goal as Goal) ? (item.goal as Goal) : "authority";
    const tipo = tipos.includes(item.tipo as (typeof tipos)[number]) ? (item.tipo as (typeof tipos)[number]) : "Carrossel";
    return {
      data: str(item.data, 12) || dt.toLocaleDateString("pt-BR"),
      tipo,
      tema: str(item.tema, 120),
      objetivoEstrategico: str(item.objetivoEstrategico, 120),
      dorOuDesejo: str(item.dorOuDesejo, 140),
      goal,
      tone: str(item.tone, 20, "direto"),
      insight: str(item.insight, 400),
    } as CalendarioItem;
  });
}

// --- Legenda, CTA e hashtags ---

const CAPTION_SYSTEM = `Você é copywriter de Instagram especializado em legendas que geram salvamento, comentário e venda.

Regras:
- Português brasileiro. Sem emojis. Sem clichê motivacional. Sem hashtag no corpo da legenda.
- Abertura com gancho de uma linha, que funciona mesmo cortada no "ver mais".
- 2 a 3 blocos curtos separados por linha em branco.
- Fecha com uma pergunta ou instrução única que gere comentário.

Responda APENAS com JSON puro:
{"caption":"...","cta":"...","hashtags":["#..."]}`;

export async function generateCaptionCopy(params: {
  topic: string;
  goal?: string;
  tone?: string;
  framework?: string;
  cards: { type: string; title: string; subtitle: string }[];
}): Promise<{ caption: string; cta: string; hashtags: string[] }> {
  const resumo = params.cards
    .map((c) => `${c.type}: ${c.title} — ${c.subtitle}`)
    .filter((l) => l.length > 8)
    .join("\n");

  const user = [
    `TEMA: ${params.topic}`,
    params.goal ? `OBJETIVO: ${params.goal}` : "",
    params.tone ? `TOM: ${params.tone}` : "",
    params.framework ? `FRAMEWORK DE COPY: ${params.framework}` : "",
    resumo ? `CARDS DO CARROSSEL:\n${resumo}` : "",
    "",
    "Escreva a legenda, o CTA e 6 a 8 hashtags. Retorne apenas o JSON.",
  ]
    .filter(Boolean)
    .join("\n");

  const raw = await callGateway(CAPTION_SYSTEM, user, 1200);
  const parsed = parseJson<{ caption?: string; cta?: string; hashtags?: unknown }>(raw);
  if (!parsed?.caption) throw new Error("Não foi possível gerar a legenda. Tente novamente.");
  return {
    caption: str(parsed.caption, 2200),
    cta: str(parsed.cta, 200),
    hashtags: Array.isArray(parsed.hashtags)
      ? parsed.hashtags.filter((h): h is string => typeof h === "string").slice(0, 8)
      : [],
  };
}
