import type { Card, CardType } from "./store";

const SYSTEM_PROMPT = `Voce e um dos maiores estrategistas de conteudo do Brasil. Seus carrosseis geram milhares de salvos e compartilhamentos. Voce entende de psicologia do consumidor, gatilhos mentais e copywriting de alta conversao. Sua escrita e direta, sem rodeios, e cada palavra e calculada para fazer o leitor agir.

REGRAS DE COPY QUE CONVERTE:

1. CAPA (HOOK): 4-7 palavras. Nao e um titulo — e uma promessa ou provocacao que para o scroll. Use:
   • Curiosidade: "O que a Meta esconde de voce"
   • Contrariedade: "Por que seus posts nao vendem"
   • Identificacao: "Se voce faz isso, pare agora"
   • Dado forte: "80% desiste na primeira semana"
   • Dor explicita: "Voce esta perdendo seguidores"
   NUNCA: "Voce sabia", "Atencao", "Descubra agora", "Vou te mostrar"

2. PROBLEMA: Nao descreva o problema — faca o leitor SENTIR. Micro-cena. Ex: "Sao 3 da manha. Voce postou, engajou, mas nada de cliente. O algoritmo nao e o culpado."

3. INSIGHT: Uma verdade que incomoda. Nao e informacao nova — e um angulo que ele nunca viu. Ex: "Quanto mais voce tenta vender, menos vende. Porque confianca nao se pede — se constroi."

4. FRAMEWORK: 3 passos. Nao gen erico. Nomes concretos. Ex: "1. Diagnostico 2. Correcao 3. Escala" — cada um com micro-explicacao de uma linha.

5. EXPLICACAO: Nao explique o conceito — mostre como ele funciona NA PRATICA. Ex: "Storytelling nao e contar historia. E fazer o cliente se enxergar nela. Sem isso, e so entretenimento."

6. ERRO (URGENCIA): Nao aponte o erro — faca o leitor se sentir EXPOS TO. Ex: "Se voce ainda faz post generico esperando vender, pare. Isso nao funciona desde 2022."

7. CTA: Acao especifica. Nao "salve o post". Ex: "Salve e reenvie pro seu amigo que ainda acha que alcance organico morreu."

REGRAS DE VOZ:
• Frases curtas. Cortantes. Como um soco.
• Uma ideia por paragrafo.
• Tom de conversa real — nao parece texto de blog, parece uma mensagem no direct.
• Use "voce" o tempo todo. O leitor precisa sentir que e sobre ele.
• Nao use jargoes: "mergulhar", "jornada", "bora", "se liga", "de quebra", "ta ligado"
• Nao use emojis.
• Nao use frases motivacionais vazias: "transforme sua vida", "resultados incriveis"
• Nao use perguntas retoricas no hook: "Voce sabia?", "Ja pensou nisso?"
• Seja especifico. Todo card deve conter algo que o leitor possa APLICAR ou uma PERSPECTIVA que ele nao TINHA.

REGRA DOS 7 CARDS (ordem obrigatoria):
hook, problem, insight, framework, explanation, mistake, cta

Nao crie card de Exemplo/Caso. Sem fonte verificavel, nao inclua.

Maximo 30-40 palavras por slide. Texto denso vai pra legenda.

Para cada card:
- type: "hook" | "problem" | "insight" | "framework" | "explanation" | "mistake" | "cta"
- kicker: ate 20 caracteres, MAIUSCULAS, sem emojis
- title: maximo 60 caracteres, use \\n para quebrar linha
- subtitle: complementa o titulo com micro-explicacao
- buttonText: vazio cards 1-6, no CTA texto de acao (ex: "Quero aplicar", "Baixar agora", "Falar comigo")
- buttonCaption: vazio cards 1-6, no CTA quebra objecao (ex: "Envio o link no direct", "Gratuito por tempo limitado")
- handle: "@seu.handle", author: "Seu Nome"

Gere tambem:
- caption: 2-3 paragrafos. Abra com gancho forte que pare o scroll. Termine com CTA sutil ou pergunta que gere comentario.
- cta: frase curta com urgencia ou beneficio claro
- hashtags: 5-8 em portugues, mesclando alto volume e nicho
- analysis: theme, painPoint, implicitDesire, contentOpportunity, positioningAngle, viralPotential, conversionPotential

Responda APENAS com JSON puro, sem markdown, sem \`\`\`, sem explicacoes.`;

const CARD_ORDER: CardType[] = ["hook", "problem", "insight", "framework", "explanation", "mistake", "cta"];

function parseResponse(raw: string): GenerateResult | null {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/```(?:json)?\n?/gi, "").trim();
  }
  try {
    const json = JSON.parse(cleaned);
    return json as GenerateResult;
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as GenerateResult;
      } catch {}
    }
    return null;
  }
}

function validateAndFixCards(cards: unknown[]): Card[] {
  const validTypes: CardType[] = ["hook", "problem", "insight", "framework", "explanation", "example", "mistake", "cta"];
  const validDir = ["top", "bottom", "left", "right"];
  return cards.slice(0, 7).map((c, i) => {
    const card = (c || {}) as Record<string, unknown>;
    return {
      type: validTypes.includes(card.type as CardType) ? (card.type as CardType) : CARD_ORDER[i] || "hook",
      kicker: typeof card.kicker === "string" ? card.kicker.slice(0, 25) : "",
      title: typeof card.title === "string" ? card.title.slice(0, 90) : "",
      subtitle: typeof card.subtitle === "string" ? card.subtitle.slice(0, 200) : "",
      buttonText: typeof card.buttonText === "string" ? card.buttonText : "",
      buttonCaption: typeof card.buttonCaption === "string" ? card.buttonCaption : "",
      handle: typeof card.handle === "string" ? card.handle : "@seu.handle",
      author: typeof card.author === "string" ? card.author : "Seu Nome",
      image: typeof card.image === "string" ? card.image : null,
      imagePosition: "top" as const,
      imageZoom: 100,
      gradientOpacity: 70,
      gradientDirection: validDir.includes(card.gradientDirection as string) ? (card.gradientDirection as "top" | "bottom" | "left" | "right") : "bottom",
      textAlign: "left" as const,
      textVerticalAlign: "bottom" as const,
      highlights: Array.isArray(card.highlights) ? card.highlights.filter((h: unknown) => h && typeof h === "object" && typeof (h as Record<string, unknown>).word === "string").map((h: unknown) => ({ word: (h as Record<string, unknown>).word as string, color: (h as Record<string, unknown>).color as string || "#ffeb3b", shape: (h as Record<string, unknown>).shape as "rect" | "oval" | "marker" | "tilt" || "rect" })) : [],
    };
  });
}

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

export async function generateFromInsight(
  insight: string,
  options?: {
    goal?: string;
    tone?: string;
    brand?: { primaryColor?: string; fontTitle?: string; fontBody?: string };
  }
): Promise<GenerateResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY não configurada. Adicione ao .env ou variável de ambiente.");
  }

  const userPrompt = [
    `INSIGHT DO USUÁRIO:`,
    insight,
    "",
    options?.goal ? `OBJETIVO: ${options.goal}` : "",
    options?.tone ? `TOM: ${options.tone}` : "",
    options?.brand?.primaryColor ? `COR PRIMÁRIA DA MARCA: ${options.brand.primaryColor}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const body = JSON.stringify({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body,
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`Groq API error (${response.status}): ${errBody}`);
  }

  const json = await response.json();
  const raw = json?.choices?.[0]?.message?.content || "";
  const parsed = parseResponse(raw);

  if (!parsed || !Array.isArray(parsed.cards) || parsed.cards.length === 0) {
    throw new Error("Resposta da IA inválida. Tente novamente.");
  }

  return {
    cards: validateAndFixCards(parsed.cards),
    caption: typeof parsed.caption === "string" ? parsed.caption : "",
    cta: typeof parsed.cta === "string" ? parsed.cta : "",
    hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.filter((h): h is string => typeof h === "string").slice(0, 10) : [],
    analysis: {
      theme: typeof parsed.analysis?.theme === "string" ? parsed.analysis.theme : "",
      painPoint: typeof parsed.analysis?.painPoint === "string" ? parsed.analysis.painPoint : "",
      implicitDesire: typeof parsed.analysis?.implicitDesire === "string" ? parsed.analysis.implicitDesire : "",
      contentOpportunity: typeof parsed.analysis?.contentOpportunity === "string" ? parsed.analysis.contentOpportunity : "",
      positioningAngle: typeof parsed.analysis?.positioningAngle === "string" ? parsed.analysis.positioningAngle : "",
      viralPotential: typeof parsed.analysis?.viralPotential === "string" ? parsed.analysis.viralPotential : "",
      conversionPotential: typeof parsed.analysis?.conversionPotential === "string" ? parsed.analysis.conversionPotential : "",
    },
  };
}

export function getDefaultResult(insight: string): GenerateResult {
  const topic = insight.slice(0, 40);
  return {
    cards: [
      { type: "hook", kicker: "ISSO MUDA TUDO", title: `O que ninguém te conta\nsobre ${topic}`, subtitle: "Você já parou para pensar que a maioria está fazendo exatamente o oposto do que funciona?", buttonText: "", buttonCaption: "", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom" },
      { type: "problem", kicker: "O PROBLEMA REAL", title: "O custo invisível\nde ignorar isso", subtitle: "Todo mundo paga — uns com tempo, outros com dinheiro. Você escolhe como quer pagar.", buttonText: "", buttonCaption: "", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom" },
      { type: "insight", kicker: "A VERDADE", title: "O que separa quem consegue\nde quem só tenta", subtitle: "Nao é esforço. É direção. A maioria gasta energia no lugar errado e culpa o método.", buttonText: "", buttonCaption: "", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom" },
      { type: "framework", kicker: "O MÉTODO", title: `${topic} em 3 passos\n(ninguém pula o segundo)`, subtitle: "Os 3 pilares que sustentam qualquer resultado consistente. O resto é detalhe.", buttonText: "", buttonCaption: "", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom" },
      { type: "explanation", kicker: "NA PRÁTICA", title: `${topic} não é complicado.\nÉ mal explicado.`, subtitle: "O conceito central cabe em duas frases. O que falta é alguém que descomplicue sem perder profundidade.", buttonText: "", buttonCaption: "", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom" },
      { type: "mistake", kicker: "ERRO SILENCIOSO", title: "O erro que 90% cometem\nsem perceber", subtitle: "Você pode estar cometendo agora. E o pior: vai continuar achando que está certo até ver o resultado de quem faz diferente.", buttonText: "", buttonCaption: "", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom" },
      { type: "cta", kicker: "SUA VEZ", title: "O que você vai fazer\ncom esta informação?", subtitle: "Ler e esquecer não muda nada. Aplicar um conceito já te coloca à frente de 90% das pessoas.", buttonText: "Quero aplicar agora", buttonCaption: "Salve este post e compartilhe com alguém", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom" },
    ] as Card[],
    caption: `📌 ${topic.toUpperCase()}\n\nVocê veio até aqui por algum motivo. Talvez já tenha tentado antes. Talvez esteja cansado de informação que não vira resultado.\n\nA diferença entre quem aplica e quem só consome conteúdo é uma só: o próximo passo.\n\nSalva. Aplica. Depois volta aqui e me conta qual card fez mais sentido pra você.`,
    cta: "Salve este carrossel e aplique um conceito hoje mesmo",
    hashtags: [`#${topic.replace(/\s+/g, "")}`, "#carrossel", "#conteudoqueagrega", "#aprendizadocontinuo", "#crescimentopessoal", "#mindset"],
    analysis: {
      theme: topic,
      painPoint: "",
      implicitDesire: "",
      contentOpportunity: "",
      positioningAngle: "",
      viralPotential: "",
      conversionPotential: "",
    },
  };
}
