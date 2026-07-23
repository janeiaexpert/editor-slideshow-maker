import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Goal = "viral" | "authority" | "sales";

export type CardType =
  | "hook"
  | "problem"
  | "insight"
  | "explanation"
  | "example"
  | "framework"
  | "mistake"
  | "cta";

export type DocumentoMestre = {
  propostaDeValor: string;
  publicoAlvo: string;
  dores: string;
  desejos: string;
  servicos: string;
  posicionamento: string;
};

export const DOCUMENTO_CAMPOS: { key: keyof DocumentoMestre; label: string; placeholder: string }[] = [
  { key: "propostaDeValor", label: "Proposta de Valor", placeholder: "O que você oferece e por que é diferente?" },
  { key: "publicoAlvo", label: "Público-Alvo", placeholder: "Para quem você fala? (faixa etária, profissão, interesses)" },
  { key: "dores", label: "Dores do Público", placeholder: "Quais os principais problemas, frustrações e desafios?" },
  { key: "desejos", label: "Desejos do Público", placeholder: "O que eles realmente querem? (resultados, status, alívio)" },
  { key: "servicos", label: "Serviços / Produtos", placeholder: "O que você vende ou entrega?" },
  { key: "posicionamento", label: "Posicionamento", placeholder: "Como você quer ser percebido? (autoridade, acessível, inovador)" },
];

export type PesquisaCalendario = {
  dias: number;
  objetivo: string;
  postsPorDia: number;
  incluirStories: boolean;
  dataInicial: string;
};

export type CalendarioItem = {
  data: string;
  tipo: "Reels" | "Carrossel" | "Stories";
  tema: string;
  objetivoEstrategico: string;
  dorOuDesejo: string;
  goal: Goal;
  tone: string;
  insight: string;
};

export type TextAlign = "left" | "center" | "right";
export type TextVerticalAlign = "top" | "center" | "bottom";

export type Framework = "aida" | "pas" | "bab" | "storytelling" | "autoridade" | "conversao";

export type Card = {
  type: CardType;
  kicker: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonCaption: string;
  handle: string;
  author: string;
  image: string | null;
  imagePosition: "top" | "center" | "bottom" | "left" | "right";
  imageZoom: number;
  gradientOpacity: number;
  gradientDirection: "top" | "bottom" | "left" | "right";
  textAlign: TextAlign;
  textVerticalAlign: TextVerticalAlign;
  highlights: WordHighlight[];
};

export type WordHighlight = {
  word: string;
  color: string;
  shape: "rect" | "oval" | "marker" | "tilt";
};

export type DesignPreset = "minimalista" | "corporativo" | "moderno" | "autoridade" | "tech" | "educacional" | "identidade" | "arialbold" | "clean" | "techbold";
export type ColorTheme = "marrom" | "preto" | "bege" | "azul" | "roxo" | "verde" | "vermelho" | "laranja" | "cinza" | "verdeagua" | "rosa" | "azulclaro";
export type HighlightMode = "off" | "low" | "medium" | "high";
export type HighlightStyle = "bold" | "badge" | "background" | "color" | "uppercase";

export type TypographyConfig = {
  fontTitle: string;
  fontBody: string;
  fontWeightTitle: number;
  fontWeightBody: number;
  fontSizeTitle: number;
  fontSizeBody: number;
  fontSizeKicker: number;
  letterSpacing: number;
  lineHeight: number;
};

export type ThemeColors = {
  background: string;
  text: string;
  accent: string;
  primary: string;
  secondary: string;
};

export type BrandIdentity = {
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  fontTitle: string;
  fontBody: string;
  applyByDefault: boolean;
};

export type HighlightConfig = {
  mode: HighlightMode;
  style: HighlightStyle;
};

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  aida: "AIDA",
  pas: "PAS",
  bab: "BAB",
  storytelling: "Storytelling",
  autoridade: "Autoridade",
  conversao: "Conversão",
};

export const CTA_OPTIONS = [
  "Salvar post",
  "Compartilhar",
  "Comentar",
  "Seguir perfil",
  "Chamar no direct",
  "Baixar material",
  "Entrar no grupo",
  "Conhecer serviço",
];

export const TYPOGRAPHY_PRESETS: Record<DesignPreset, TypographyConfig> = {
  minimalista: { fontTitle: "Georgia, serif", fontBody: "Arial, sans-serif", fontWeightTitle: 400, fontWeightBody: 400, fontSizeTitle: 26, fontSizeBody: 15, fontSizeKicker: 9, letterSpacing: 0.10, lineHeight: 1.4 },
  corporativo: { fontTitle: "'Inter', sans-serif", fontBody: "'Inter', sans-serif", fontWeightTitle: 800, fontWeightBody: 600, fontSizeTitle: 22, fontSizeBody: 11, fontSizeKicker: 8, letterSpacing: 0.02, lineHeight: 1.1 },
  moderno: { fontTitle: "'Montserrat', sans-serif", fontBody: "'Nunito Sans', sans-serif", fontWeightTitle: 500, fontWeightBody: 400, fontSizeTitle: 30, fontSizeBody: 16, fontSizeKicker: 11, letterSpacing: -0.01, lineHeight: 1.2 },
  autoridade: { fontTitle: "'Playfair Display', serif", fontBody: "'Inter', sans-serif", fontWeightTitle: 900, fontWeightBody: 400, fontSizeTitle: 22, fontSizeBody: 12, fontSizeKicker: 8, letterSpacing: 0.06, lineHeight: 1.25 },
  tech: { fontTitle: "'Bebas Neue', sans-serif", fontBody: "'Roboto', sans-serif", fontWeightTitle: 400, fontWeightBody: 400, fontSizeTitle: 30, fontSizeBody: 12, fontSizeKicker: 10, letterSpacing: 0.04, lineHeight: 1.1 },
  educacional: { fontTitle: "'Quicksand', sans-serif", fontBody: "'Nunito', sans-serif", fontWeightTitle: 700, fontWeightBody: 500, fontSizeTitle: 26, fontSizeBody: 14, fontSizeKicker: 10, letterSpacing: 0.05, lineHeight: 1.35 },
  identidade: { fontTitle: "'Cinzel', serif", fontBody: "'Montserrat', sans-serif", fontWeightTitle: 700, fontWeightBody: 300, fontSizeTitle: 28, fontSizeBody: 13, fontSizeKicker: 11, letterSpacing: 0.04, lineHeight: 1.15 },
  arialbold: { fontTitle: "'Anton', sans-serif", fontBody: "'Open Sans', sans-serif", fontWeightTitle: 400, fontWeightBody: 700, fontSizeTitle: 24, fontSizeBody: 13, fontSizeKicker: 9, letterSpacing: 0.02, lineHeight: 1.05 },
  clean: { fontTitle: "'Work Sans', sans-serif", fontBody: "'Work Sans', sans-serif", fontWeightTitle: 500, fontWeightBody: 300, fontSizeTitle: 28, fontSizeBody: 15, fontSizeKicker: 10, letterSpacing: 0.12, lineHeight: 1.45 },
  techbold: { fontTitle: "'Oswald', sans-serif", fontBody: "'Manrope', sans-serif", fontWeightTitle: 700, fontWeightBody: 600, fontSizeTitle: 22, fontSizeBody: 10, fontSizeKicker: 9, letterSpacing: 0.02, lineHeight: 1.08 },
};

export const TYPOGRAPHY_LABELS: Record<DesignPreset, string> = {
  minimalista: "Fino",
  corporativo: "Grosso",
  moderno: "Alto",
  autoridade: "Super Grosso",
  tech: "Largo",
  educacional: "Médio",
  identidade: "Contraste",
  arialbold: "Corpo Grosso",
  clean: "Amplo",
  techbold: "Compacto",
};

export const COLOR_THEMES: Record<ColorTheme, ThemeColors> = {
  marrom: { background: "#3e2723", text: "#efebe9", accent: "#a1887f", primary: "#d7ccc8", secondary: "#ffcc80" },
  preto: { background: "#111111", text: "#ffffff", accent: "#c2a25b", primary: "#ffffff", secondary: "#888888" },
  bege: { background: "#f5f0eb", text: "#3e2723", accent: "#c2a25b", primary: "#3e2723", secondary: "#8d6e63" },
  azul: { background: "#0d1b2a", text: "#e0e1dd", accent: "#415a77", primary: "#778da9", secondary: "#e0e1dd" },
  roxo: { background: "#1a0a2e", text: "#e0d4f5", accent: "#c77dff", primary: "#9d4edd", secondary: "#e0d4f5" },
  verde: { background: "#0f1f12", text: "#e0f2e1", accent: "#4caf50", primary: "#81c784", secondary: "#a5d6a7" },
  vermelho: { background: "#2d0a0a", text: "#ffebee", accent: "#ef5350", primary: "#e57373", secondary: "#ffcdd2" },
  laranja: { background: "#1f0f00", text: "#fff3e0", accent: "#ff8a65", primary: "#ffab91", secondary: "#ffcc02" },
  cinza: { background: "#1a1a1a", text: "#fafafa", accent: "#6b7280", primary: "#9ca3af", secondary: "#d1d5db" },
  verdeagua: { background: "#002b2b", text: "#e0f2f1", accent: "#26a69a", primary: "#4db6ac", secondary: "#80cbc4" },
  rosa: { background: "#2d0f1f", text: "#fce4ec", accent: "#f06292", primary: "#f48fb1", secondary: "#f8bbd0" },
  azulclaro: { background: "#001a33", text: "#e3f2fd", accent: "#42a5f5", primary: "#64b5f6", secondary: "#90caf9" },
};

export const HIGHLIGHT_KEYWORDS: Record<string, string[]> = {
  problema: ["problema", "dor", "desafio", "dificuldade", "erro", "falha", "perda", "risco"],
  solucao: ["solução", "resposta", "ferramenta", "método", "sistema", "estratégia", "técnica"],
  resultado: ["resultado", "transformação", "crescimento", "lucro", "economia", "ganho", "sucesso"],
  autoridade: ["expert", "especialista", "autoridade", "profissional", "consultor", "mentor"],
  urgencia: ["agora", "hoje", "urgente", "limitado", "exclusivo", "última chance"],
  acao: ["faça", "comece", "descubra", "aprenda", "domine", "transforme", "aplique"],
};

export const HIGHLIGHT_STYLE_LABELS: Record<HighlightStyle, string> = {
  bold: "Negrito",
  badge: "Badge",
  background: "Fundo",
  color: "Cor",
  uppercase: "CAIXA ALTA",
};

export const HIGHLIGHT_MODE_LABELS: Record<HighlightMode, string> = {
  off: "Desligado",
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
};

export const FONT_WEIGHT_LABELS: Record<number, string> = {
  300: "300 (Light)",
  400: "400 (Normal)",
  500: "500 (Medium)",
  600: "600 (Semi Bold)",
  700: "700 (Bold)",
  800: "800 (Extra Bold)",
  900: "900 (Black)",
};

export const TITLE_SCALE = { XS: 14, S: 17, M: 20, L: 23, XL: 26, XXL: 30 };
export const SUBTITLE_SCALE = { XS: 10, S: 12, M: 14, L: 16, XL: 18 };
export type TitleSize = keyof typeof TITLE_SCALE;
export type SubtitleSize = keyof typeof SUBTITLE_SCALE;

export function getAutoTitleSize(title: string, _type: CardType): number {
  const len = title.length;
  if (len <= 10) return TITLE_SCALE.XXL;
  if (len <= 20) return TITLE_SCALE.XL;
  if (len <= 30) return TITLE_SCALE.L;
  if (len <= 45) return TITLE_SCALE.M;
  if (len <= 65) return TITLE_SCALE.S;
  return TITLE_SCALE.XS;
}

export function getAutoSubtitleSize(subtitle: string, _type: CardType): number {
  const len = subtitle.length;
  if (len <= 15) return SUBTITLE_SCALE.XL;
  if (len <= 30) return SUBTITLE_SCALE.L;
  if (len <= 50) return SUBTITLE_SCALE.M;
  if (len <= 70) return SUBTITLE_SCALE.S;
  return SUBTITLE_SCALE.XS;
}

export function generateCaption(cards: Card[], topic: string, framework: Framework, goal?: Goal): string {
  const titles = cards.map((c) => c.title).filter(Boolean);
  const mainIdea = titles[0] || topic;
  const subtitle = cards.map((c) => c.subtitle).filter(Boolean)[0] || "";

  const goalLabel = goal === "sales" ? "conversão" : goal === "viral" ? "alcance" : "autoridade";

  const structures: Record<Framework, string[]> = {
    aida: [
      `🚨 PAROU AQUI?\n${mainIdea}`,
      `👀 POR ISSO VOCÊ PRECISA SABER\n${subtitle || `Se você já tentou ${topic.toLowerCase()} e não funcionou, não é culpa sua. O problema é outro.`}`,
      `🔥 O QUE MUDA QUANDO VOCÊ ENTENDE ISSO\nA diferença entre quem consegue e quem continua tentando é uma única coisa: saber onde focar.`,
      `⚡ SEU PRÓXIMO PASSO\nSalva este post. Daqui a 30 dias você volta aqui e me agradece.`,
    ],
    pas: [
      `😤 ISSO É SOBRE VOCÊ?\n${mainIdea}`,
      `⚠️ O PREÇO DE IGNORAR\n${subtitle || `Enquanto você não resolve ${topic.toLowerCase()}, você perde tempo, grana e oportunidades que não voltam.`}`,
      `✅ O CAMINHO PARA RESOLVER\nA solução existe. E é mais simples do que te fazem acreditar.`,
    ],
    bab: [
      `😩 ANTES: O CENÁRIO QUE DÓI\n${mainIdea}`,
      `✨ DEPOIS: COMO FICA QUANDO MUDA\n${subtitle || `Quando você domina ${topic.toLowerCase()}, tudo se encaixa. Resultado vem. O estresse some.`}`,
      `🌉 A PONTE ENTRE OS DOIS\nNão é segredo. É método. E está nos cards acima.`,
    ],
    storytelling: [
      `🎬 A CENA QUE TODO MUNDO CONHECE\n${mainIdea}`,
      `😬 O MOMENTO QUE QUASE DEU TUDO ERRADO\n${subtitle || `Parecia que não ia dar certo. Mas foi exatamente ali que tudo virou.`}`,
      `💎 O APRENDIZADO QUE MUDA O JOGO\nHoje eu olho pra trás e vejo: se não fosse aquele dia, eu não estaria onde estou.`,
    ],
    autoridade: [
      `🎯 MINHA VISÃO SOBRE ISSO\n${mainIdea}`,
      `📊 O QUE OS DADOS MOSTRAM\n${subtitle || `Depois de anos trabalhando com ${topic.toLowerCase()}, uma coisa ficou clara: a maioria erra no básico.`}`,
      `🏆 O RESULTADO QUE PROVA\nTeoria é barato. O que realmente funciona — e entrega — está resumido aqui.`,
    ],
    conversao: [
      `🔍 DIAGNÓSTICO RÁPIDO\n${mainIdea}`,
      `💰 QUANTO TEMPO VOCÊ VAI PERDER?\n${subtitle || `Quem age agora sai na frente. Quem espera "o momento certo" fica para trás.`}`,
      `🚀 SUA VEZ DE AGIR\nClique no link da bio. Envia "EU QUERO". O próximo passo é seu.`,
    ],
  };

  const blocks = structures[framework] || structures.aida;
  const goalSuffix = goal === "viral"
    ? "\n\n---\nCompartilha com alguém que precisa ler isso. Pode ser o empurrão que faltava."
    : goal === "sales"
    ? "\n\n---\nPronto para aplicar? Me chama no direct. São poucas vagas e isso não vai ficar disponível para sempre."
    : "\n\n---\nSalva para consultar depois. Deixa nos comentários: qual card fez mais sentido para você?";

  return `📝 ${topic.toUpperCase()}\n\n${blocks.map((b, i) => `${i > 0 ? "\n" : ""}${b}`).join("\n")}\n\n---${goalSuffix}`;
}

export function generateCta(goal: Goal): string {
  const map: Record<Goal, string> = {
    viral: "Compartilhe com alguém que está cometendo esse erro",
    authority: "Salve para ter este roteiro sempre à mão",
    sales: "Envie 'EU QUERO' no direct — vagas limitadas",
  };
  return map[goal] || map.authority;
}

export function generateHashtags(topic: string, goal: Goal): string[] {
  const tag = topic.replace(/\s+/g, "").toLowerCase();
  const goalTag = goal === "viral" ? "crescimento" : goal === "sales" ? "conversão" : "autoridade";
  const extra: Record<string, string[]> = {
    viral: ["#viralizar", "#entretenimento", "#engajamento"],
    authority: ["#aprendizado", "#desenvolvimento", "#conhecimento"],
    sales: ["#oportunidade", "#resultados", "#transformação"],
  };
  return [`#${tag}`, `#${goalTag}`, ...(extra[goal] || extra.authority), "#carrossel", "#instagram"];
}

export function autoSelectDesign(topic: string): { preset: DesignPreset; theme: ColorTheme } {
  const lower = topic.toLowerCase();
  if (lower.includes("tech") || lower.includes("ia") || lower.includes("dado") || lower.includes("digital")) return { preset: "tech", theme: "preto" };
  if (lower.includes("negócio") || lower.includes("empreende") || lower.includes("venda") || lower.includes("marketing")) return { preset: "corporativo", theme: "marrom" };
  if (lower.includes("educa") || lower.includes("aprend") || lower.includes("curs") || lower.includes("conhec")) return { preset: "educacional", theme: "bege" };
  if (lower.includes("autoridad") || lower.includes("lider") || lower.includes("expert")) return { preset: "autoridade", theme: "roxo" };
  if (lower.includes("criat") || lower.includes("design") || lower.includes("moda") || lower.includes("arte")) return { preset: "moderno", theme: "azul" };
  return { preset: "minimalista", theme: "preto" };
}

const CARD_LABELS: Record<CardType, string> = {
  hook: "Hook", problem: "Problema", insight: "Insight", explanation: "Explicação",
  framework: "Framework", mistake: "Erro", cta: "CTA", example: "",
};

const CARD_DESCRIPTIONS: Record<CardType, string> = {
  hook: "Prende a atenção nos primeiros segundos",
  problem: "Aponta uma dor ou desafio",
  insight: "Revela uma verdade pouco conhecida",
  explanation: "Explica o conceito de forma simples",
  framework: "Apresenta um passo a passo",
  mistake: "Expõe um erro comum",
  cta: "Chama para a ação final",
  example: "",
};

const KICKER_BY_GOAL: Record<Goal, Record<CardType, string>> = {
  viral: { hook: "ISSO MUDA TUDO", problem: "NINGUÉM TE CONTOU", insight: "O SEGREDO", framework: "O MÉTODO OCULTO", explanation: "A VERDADE", mistake: "VOCÊ TAMBÉM CAI", cta: "COMPARTILHE AGORA", example: "" },
  authority: { hook: "DADOS QUE IMPORTAM", problem: "O GAP DE CONHECIMENTO", insight: "ANÁLISE CRÍTICA", framework: "METODOLOGIA COMPROVADA", explanation: "ENTENDENDO O CONCEITO", mistake: "EQUÍVOCO COMUM", cta: "PRÓXIMOS PASSOS", example: "" },
  sales: { hook: "VOCÊ PERDE DINHEIRO", problem: "O CUSTO DA OMISSÃO", insight: "OPORTUNIDADE PERDIDA", framework: "O SISTEMA QUE VENDE", explanation: "NA PRÁTICA", mistake: "O ERRO QUE CUSTA CARO", cta: "FALE CONOSCO", example: "" },
};

const SUBTITLE_BY_TONE: Record<string, Record<CardType, (t: string) => string>> = {
  direto: {
    hook: (t) => `90% aplica ${t} do jeito errado. O resto entendeu o que ninguém explica.`,
    problem: (t) => `Não é falta de talento. É um padrão específico que você repete sem perceber.`,
    insight: (t) => `Não é teoria nova. É um princípio que existe há décadas — mas ninguém aplica porque parece simples demais.`,
    framework: (_) => "3 etapas. Nenhuma teoria. Diagnostique, corrija, meça. Repita.",
    explanation: (t) => `${t} parece difícil porque ensinam do jeito errado. O básico bem feito supera qualquer hack.`,
    mistake: (t) => `O erro não é técnico. É acreditar que ${t} se resolve com mais informação em vez de execução.`,
    cta: (_) => "Informação sem ação é entretenimento. Qual é o primeiro passo que você vai dar?",
    example: () => "",
  },
  educacional: {
    hook: (t) => `Antes de aplicar ${t}, entenda por que a maioria falha. A resposta muda como você enxerga tudo.`,
    problem: (t) => `Sem os fundamentos de ${t}, você repete os mesmos erros esperando resultados diferentes.`,
    insight: (t) => `Estudos mostram que ${t} bem executado supera estratégias complexas. Consistência vence intensidade.`,
    framework: (_) => "Ciclo de 3 etapas validado por profissionais. Diagnostique, intervenha, mensure. Sem achismo.",
    explanation: (t) => `${t} descomplicado: do conceito central à aplicação em 3 pilares. Só o que funciona.`,
    mistake: (t) => `Confundir informação com formação é o erro mais comum sobre ${t}. Saber não é fazer.`,
    cta: (_) => "Salve, estude com calma e compartilhe com quem leva aprendizado a sério.",
    example: () => "",
  },
  provocativo: {
    hook: (t) => `Todo mundo fala de ${t}. Quase ninguém entende. E se a maioria estiver errada?`,
    problem: (t) => `Continua ignorando ${t} enquanto seus concorrentes avançam? Ótimo. Mais espaço para quem age.`,
    insight: (t) => `O que te ensinaram sobre ${t} está incompleto. E o pior: te mantém exatamente onde está.`,
    framework: (_) => "3 passos. 99% pula o segundo. Depois reclama que não funciona. Você vai pular também?",
    explanation: (t) => `${t} é simples. O problema é que existe uma indústria inteira lucrando pra fazer parecer complexo.`,
    mistake: (t) => `O maior erro sobre ${t} não é técnico. É achar que existe atalho. Não existe.`,
    cta: (_) => "Se chegou até aqui, não tem desculpa. Vai aplicar ou só salvar?",
    example: () => "",
  },
};

export function defaultCards(topic: string, goal?: Goal, tone?: string): Card[] {
  const t = topic.toLowerCase();
  const gk = goal && KICKER_BY_GOAL[goal] || null;
  const st = tone && SUBTITLE_BY_TONE[tone] || null;
  const kf = (ct: CardType, fallback: string) => gk ? gk[ct] : fallback;
  const sf = (ct: CardType, fallback: string) => st ? st[ct](t) : fallback;
  return ([
    { type: "hook" as CardType, kicker: kf("hook", "POR QUE 90% ERRA"), title: `O que ninguém te\nconta sobre ${t}`, subtitle: sf("hook", `Se você segue o óbvio sobre ${t}, está competindo com todo mundo. O atalho real é outro.`), buttonText: "", buttonCaption: "", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom", highlights: [] },
    { type: "problem" as CardType, kicker: kf("problem", "ISSO É SOBRE VOCÊ"), title: `O sintoma que você\nignora todo dia`, subtitle: sf("problem", `Se algo em ${t} não funciona, não é culpa do mercado. É um padrão específico que você repete sem perceber.`), buttonText: "", buttonCaption: "", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom", highlights: [] },
    { type: "insight" as CardType, kicker: kf("insight", "NINGUÉM FALA SOBRE"), title: `O princípio escondido\nque muda o jogo`, subtitle: sf("insight", `Quem descobre isso sobre ${t} sai na frente. Quem ignora continua preso no resultado mediano sem entender o motivo.`), buttonText: "", buttonCaption: "", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom", highlights: [] },
    { type: "framework" as CardType, kicker: kf("framework", "3 PASSOS"), title: `${topic} sem achismo:\ndiagnóstico, ação, ajuste`, subtitle: sf("framework", "Passo 1: Onde você está. Passo 2: O que furar. Passo 3: Como medir. Nada além. Nada menos."), buttonText: "", buttonCaption: "", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom", highlights: [] },
    { type: "explanation" as CardType, kicker: kf("explanation", "A VERDADE"), title: `${t} é sobre 3 coisas.\nO resto é ruído.`, subtitle: sf("explanation", `${topic} parece complexo porque complicam de propósito. Simplificado: causa, método, consistência.`), buttonText: "", buttonCaption: "", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom", highlights: [] },
    { type: "mistake" as CardType, kicker: kf("mistake", "ERRO FATAL"), title: `O erro que 90% cometem\nem ${t}`, subtitle: sf("mistake", `Não é técnica. É achar que ${t} se resolve com mais informação. O problema é outro — e é mais simples.`), buttonText: "", buttonCaption: "", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom", highlights: [] },
    { type: "cta" as CardType, kicker: kf("cta", "DECISÃO"), title: "O que muda se você\naplicar isso hoje?", subtitle: sf("cta", "Ler e esquecer é entretenimento. Salvar e executar é investimento. Qual você escolhe?"), buttonText: "Quero aplicar agora", buttonCaption: "Salve e compartilhe com quem precisa", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom", highlights: [] },
  ] as Card[]);
}

export type AIGenerationStatus = "idle" | "analyzing" | "generating" | "error";

export type AnalysisResult = {
  theme: string;
  painPoint: string;
  implicitDesire: string;
  contentOpportunity: string;
  positioningAngle: string;
  viralPotential: string;
  conversionPotential: string;
};

export type Store = {
  insight: string;
  setInsight: (t: string) => void;
  insightAnalysis: AnalysisResult | null;
  setInsightAnalysis: (a: AnalysisResult | null) => void;
  aiStatus: AIGenerationStatus;
  setAiStatus: (s: AIGenerationStatus) => void;
  aiError: string;
  setAiError: (e: string) => void;
  topic: string;
  setTopic: (t: string) => void;
  goal: Goal;
  setGoal: (g: Goal) => void;
  tone: "direto" | "educacional" | "provocativo";
  setTone: (t: "direto" | "educacional" | "provocativo") => void;
  cards: Card[];
  setCards: (c: Card[]) => void;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  designPreset: DesignPreset | null;
  setDesignPreset: (d: DesignPreset | null) => void;
  colorTheme: ColorTheme | null;
  setColorTheme: (c: ColorTheme | null) => void;
  typography: TypographyConfig | null;
  setTypography: (t: TypographyConfig | null) => void;
  framework: Framework;
  setFramework: (f: Framework) => void;
  generatedCaption: string;
  setGeneratedCaption: (c: string) => void;
  generatedCta: string;
  setGeneratedCta: (c: string) => void;
  generatedHashtags: string[];
  setGeneratedHashtags: (h: string[]) => void;
  brand: BrandIdentity;
  setBrand: (b: BrandIdentity) => void;
  highlight: HighlightConfig;
  setHighlight: (h: HighlightConfig) => void;
  documento: DocumentoMestre;
  setDocumentoField: (key: keyof DocumentoMestre, value: string) => void;
  pesquisa: PesquisaCalendario;
  setPesquisaField: (key: keyof PesquisaCalendario, value: string | number | boolean) => void;
  calendario: CalendarioItem[];
  calendarioLoading: boolean;
  gerarCalendario: () => void;
  setCalendarioFromIa: (items: CalendarioItem[]) => void;
  updateCard: (i: number, patch: Partial<Card>) => void;
  removeCard: (i: number) => void;
  generateCards: () => void;
  generateAll: () => void;
  generateFromInsight: () => Promise<void>;
  resetAll: () => void;
};

function toneAdjust(tone: string, base: string): string {
  if (tone === "direto") return base;
  if (tone === "provocativo") return base + " 🔥";
  return base + " 📚";
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      insight: "",
      setInsight: (insight) => set({ insight }),
      insightAnalysis: null,
      setInsightAnalysis: (insightAnalysis) => set({ insightAnalysis }),
      aiStatus: "idle",
      setAiStatus: (aiStatus) => set({ aiStatus }),
      aiError: "",
      setAiError: (aiError) => set({ aiError }),
      topic: "",
      setTopic: (topic) => set({ topic }),
      goal: "authority" as Goal,
      setGoal: (goal) => set({ goal }),
      tone: "direto" as const,
      setTone: (tone) => set({ tone }),
      cards: defaultCards("seu tópico", "authority", "direto"),
      setCards: (cards) => set({ cards }),
      activeIndex: 0,
      setActiveIndex: (activeIndex) => set({ activeIndex }),
      designPreset: null,
      setDesignPreset: (designPreset) => set({ designPreset }),
      colorTheme: null,
      setColorTheme: (colorTheme) => set({ colorTheme }),
      typography: null,
      setTypography: (typography) => set({ typography }),
      framework: "aida" as Framework,
      setFramework: (framework) => set({ framework }),
      generatedCaption: "",
      setGeneratedCaption: (generatedCaption) => set({ generatedCaption }),
      generatedCta: "",
      setGeneratedCta: (generatedCta) => set({ generatedCta }),
      generatedHashtags: [],
      setGeneratedHashtags: (generatedHashtags) => set({ generatedHashtags }),
      brand: { logo: null, primaryColor: "#c2a25b", secondaryColor: "#ffffff", fontTitle: "Inter, sans-serif", fontBody: "Inter, sans-serif", applyByDefault: false },
      setBrand: (brand) => set({ brand }),
      highlight: { mode: "off" as HighlightMode, style: "bold" as HighlightStyle },
      setHighlight: (highlight) => set({ highlight }),
      documento: { propostaDeValor: "", publicoAlvo: "", dores: "", desejos: "", servicos: "", posicionamento: "" },
      setDocumentoField: (key, value) => set((s) => ({ documento: { ...s.documento, [key]: value } })),
      pesquisa: { dias: 30, objetivo: "crescer seguidores", postsPorDia: 1, incluirStories: true, dataInicial: new Date().toISOString().split("T")[0] },
      setPesquisaField: (key, value) => set((s) => ({ pesquisa: { ...s.pesquisa, [key]: value } })),
      calendario: [],
      calendarioLoading: false,
      gerarCalendario: () => {
        const st = get();
        const d = st.documento;
        const p = st.pesquisa;
        if (!d.propostaDeValor || !d.publicoAlvo) { set({ calendarioLoading: false }); return; }
        set({ calendarioLoading: true });
        const items: CalendarioItem[] = [];
        const inicio = new Date(p.dataInicial);
        const goals: Goal[] = ["authority", "viral", "sales"];
        const tones = ["direto", "provocativo", "educacional"];
        const temasBase = [
          { tipo: "Carrossel" as const, tema: (i: number) => `Por que ${d.publicoAlvo.slice(0, 30)} ignoram isso?`, obj: "Gerar curiosidade e identificação" },
          { tipo: "Carrossel" as const, tema: (_: number) => `O maior erro sobre ${d.servicos.slice(0, 30)}`, obj: "Quebrar crença limitante" },
          { tipo: "Reels" as const, tema: (i: number) => `${d.dores.slice(0, 40)} — Como resolver em 3 passos`, obj: "Entregar valor rápido" },
          { tipo: "Carrossel" as const, tema: (i: number) => `O metodo que usei para ${d.desejos.slice(0, 40)}`, obj: "Demonstrar autoridade" },
          { tipo: "Stories" as const, tema: (_: number) => `Pergunta: ${d.publicoAlvo.slice(0, 30)} — qual sua maior dificuldade?`, obj: "Gerar interação" },
          { tipo: "Carrossel" as const, tema: (i: number) => `${d.propostaDeValor.slice(0, 50)}`, obj: "Reforçar posicionamento" },
          { tipo: "Reels" as const, tema: (_: number) => `3 sinais de que ${d.dores.slice(0, 30)}`, obj: "Auto-diagnóstico" },
          { tipo: "Carrossel" as const, tema: (i: number) => `O que ninguem te conta sobre ${d.servicos.slice(0, 30)}`, obj: "Insight exclusivo" },
        ];
        for (let i = 0; i < p.dias; i++) {
          const dt = new Date(inicio);
          dt.setDate(dt.getDate() + i);
          const ds = dt.toLocaleDateString("pt-BR");
          const base = temasBase[i % temasBase.length];
          const g = goals[i % goals.length];
          const t = tones[i % tones.length];
          items.push({
            data: ds,
            tipo: base.tipo,
            tema: base.tema(i),
            objetivoEstrategico: base.obj,
            dorOuDesejo: i % 2 === 0 ? d.dores.slice(0, 60) : d.desejos.slice(0, 60),
            goal: g,
            tone: t,
            insight: `${base.tema(i)} — para ${d.publicoAlvo.slice(0, 30)} que busca ${d.desejos.slice(0, 30)}`,
          });
        }
        set({ calendario: items, calendarioLoading: false });
      },
      setCalendarioFromIa: (calendario) => set({ calendario, calendarioLoading: false }),
      updateCard: (i, patch) => set((s) => ({
        cards: s.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
      })),
      removeCard: (i) => set((s) => {
        const updated = s.cards.filter((_, idx) => idx !== i);
        if (updated.length === 0) return s;
        return { cards: updated, activeIndex: Math.min(s.activeIndex, updated.length - 1) };
      }),
      generateCards: () => {
        const st = get();
        const topic = st.topic || "seu tópico";
        const newCards = defaultCards(topic, st.goal, st.tone);
        const i = st.activeIndex;
        set({
          cards: st.cards.map((c, idx) => (idx === i ? newCards[i] : c)),
        });
      },
      generateAll: async () => {
        const st = get();
        const topic = st.topic?.trim() || "";
        if (!topic) {
          const cards = defaultCards("seu tópico", st.goal, st.tone);
          const design = autoSelectDesign("");
          set({
            cards,
            activeIndex: 0,
            designPreset: design.preset,
            colorTheme: design.theme,
            generatedCaption: generateCaption(cards, "seu tópico", st.framework, st.goal),
            generatedCta: generateCta(st.goal),
            generatedHashtags: generateHashtags("seu tópico", st.goal),
            highlight: { mode: st.brand.applyByDefault ? "medium" as HighlightMode : "off" as HighlightMode, style: "bold" as HighlightStyle },
          });
          return;
        }
        set({ aiStatus: "generating", aiError: "" });
        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ insight: topic, goal: st.goal, tone: st.tone, brand: st.brand }),
          });
          const data = await res.json();
          if (res.ok && data.cards) {
            const design = autoSelectDesign(data.analysis?.theme || topic);
            set({
              aiStatus: "idle",
              cards: data.cards,
              activeIndex: 0,
              generatedCaption: data.caption || "",
              generatedCta: data.cta || "",
              generatedHashtags: data.hashtags || [],
              designPreset: design.preset,
              colorTheme: design.theme,
              framework: "aida" as Framework,
              highlight: { mode: st.brand.applyByDefault ? "medium" as HighlightMode : "off" as HighlightMode, style: "bold" as HighlightStyle },
            });
            return;
          }
        } catch {}
        const cards = defaultCards(topic, st.goal, st.tone);
        const design = autoSelectDesign(topic);
        set({
          aiStatus: "idle",
          cards,
          activeIndex: 0,
          designPreset: design.preset,
          colorTheme: design.theme,
          generatedCaption: generateCaption(cards, topic, st.framework, st.goal),
          generatedCta: generateCta(st.goal),
          generatedHashtags: generateHashtags(topic, st.goal),
          highlight: { mode: st.brand.applyByDefault ? "medium" as HighlightMode : "off" as HighlightMode, style: "bold" as HighlightStyle },
        });
      },
      generateFromInsight: async () => {
        const st = get();
        const insight = st.insight.trim();
        if (!insight) return;

        set({ aiStatus: "analyzing", aiError: "" });

        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              insight,
              goal: st.goal,
              tone: st.tone,
              brand: st.brand,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Erro ao gerar carrossel");
          }

          const design = autoSelectDesign(data.analysis?.theme || insight);

          set({
            aiStatus: "idle",
            aiError: "",
            topic: data.analysis?.theme || insight.slice(0, 40),
            insightAnalysis: data.analysis || null,
            cards: data.cards || defaultCards(insight, st.goal, st.tone),
            generatedCaption: data.caption || "",
            generatedCta: data.cta || "",
            generatedHashtags: data.hashtags || [],
            activeIndex: 0,
            designPreset: design.preset,
            colorTheme: design.theme,
            framework: "aida" as Framework,
            highlight: { mode: st.brand.applyByDefault ? "medium" as HighlightMode : "off" as HighlightMode, style: "bold" as HighlightStyle },
          });
        } catch {
          // Fallback local quando API nao esta disponivel
          const topic = insight.slice(0, 60);
          const newCards = defaultCards(topic, st.goal, st.tone);
          const design = autoSelectDesign(topic);
          const caption = generateCaption(newCards, topic, st.framework, st.goal);
          const cta = generateCta(st.goal);
          const hashtags = generateHashtags(topic, st.goal);
          set({
            aiStatus: "idle",
            aiError: "",
            topic,
            insightAnalysis: null,
            cards: newCards,
            generatedCaption: caption,
            generatedCta: cta,
            generatedHashtags: hashtags,
            activeIndex: 0,
            designPreset: design.preset,
            colorTheme: design.theme,
            framework: "aida" as Framework,
            highlight: { mode: st.brand.applyByDefault ? "medium" as HighlightMode : "off" as HighlightMode, style: "bold" as HighlightStyle },
          });
        }
      },
      resetAll: () => {
        set({
          insight: "",
          insightAnalysis: null,
          aiStatus: "idle",
          aiError: "",
          topic: "",
          goal: "authority",
          tone: "direto",
          cards: defaultCards("seu tópico", "authority", "direto"),
          activeIndex: 0,
          designPreset: null,
          colorTheme: null,
          typography: null,
          framework: "aida",
          generatedCaption: "",
          generatedCta: "",
          generatedHashtags: [],
          brand: { logo: null, primaryColor: "#c2a25b", secondaryColor: "#ffffff", fontTitle: "Inter, sans-serif", fontBody: "Inter, sans-serif", applyByDefault: false },
          highlight: { mode: "off", style: "bold" },
          documento: { propostaDeValor: "", publicoAlvo: "", dores: "", desejos: "", servicos: "", posicionamento: "" },
          pesquisa: { dias: 30, objetivo: "crescer seguidores", postsPorDia: 1, incluirStories: true, dataInicial: new Date().toISOString().split("T")[0] },
          calendario: [],
        });
      },
    }),
    { name: "carrossel-store-v2", merge: (persisted, current) => {
      const merged = { ...current, ...persisted as Partial<Store> };
      if (merged.designPreset && !(merged.designPreset in TYPOGRAPHY_PRESETS)) merged.designPreset = null;
      if (merged.colorTheme && !(merged.colorTheme in COLOR_THEMES)) merged.colorTheme = null;
      if (merged.cards) {
        merged.cards = merged.cards.map((c) => ({
          ...c,
          gradientDirection: (c as Record<string, unknown>).gradientDirection as Card["gradientDirection"] || "bottom",
          highlights: (c as Record<string, unknown>).highlights as Card["highlights"] || [],
        }));
      }
      return merged;
    } }
  )
);
