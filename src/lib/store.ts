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

/** Ganchos validados de alta retenção (PT-BR) */
export const COPY_HOOKS: { label: string; text: string }[] = [
  { label: "Erro comum", text: "O erro que 9 em cada 10 cometem\nsem perceber" },
  { label: "Contradição", text: "Tudo que te ensinaram sobre isso\nestá desatualizado" },
  { label: "Custo oculto", text: "O que esse detalhe\nestá te custando por mês" },
  { label: "Antes/depois", text: "De travado a previsível\nem 30 dias" },
  { label: "Lista curta", text: "3 decisões que mudam\no resultado inteiro" },
  { label: "Prova", text: "Testei por 90 dias.\nO que sobrou foi isto" },
  { label: "Segredo do topo", text: "O que os melhores fazem\ne quase ninguém copia" },
  { label: "Pergunta direta", text: "Por que você trabalha mais\ne fatura o mesmo?" },
];

/** CTAs estratégicas validadas por objetivo */
export const COPY_CTAS: { label: string; text: string; caption: string }[] = [
  { label: "Salvar", text: "Salve para aplicar hoje", caption: "Você vai querer reler isto depois" },
  { label: "Comentar", text: "Comente PLANO", caption: "Envio o passo a passo no direct" },
  { label: "Direct", text: "Chame no direct", caption: "Respondo pessoalmente" },
  { label: "Link bio", text: "Link na bio", caption: "Acesso imediato, sem burocracia" },
  { label: "Diagnóstico", text: "Quero meu diagnóstico", caption: "Leva 2 minutos e é gratuito" },
  { label: "Vaga limitada", text: "Garantir minha vaga", caption: "Turma pequena, atenção real" },
  { label: "Compartilhar", text: "Envie para quem precisa ler", caption: "Um print pode mudar a semana dela" },
  { label: "Seguir", text: "Siga para a parte 2", caption: "Continuo esse assunto amanhã" },
];


export type WordHighlight = {
  word: string;
  color: string;
  shape: "rect" | "oval" | "marker" | "tilt" | "none";
  tilt?: number;
  fontFamily?: string;
  fontWeight?: number;
  italic?: boolean;
  uppercase?: boolean;
};

/** Presets de estilo para palavras destacadas */
export type WordPreset = {
  label: string;
  color: string;
  shape: WordHighlight["shape"];
  tilt: number;
  fontFamily?: string;
  fontWeight?: number;
  italic?: boolean;
  uppercase?: boolean;
};

export const WORD_PRESETS: WordPreset[] = [
  { label: "Marca-texto", color: "#ffeb3b", shape: "marker", tilt: 0, fontWeight: 700 },
  { label: "Etiqueta", color: "#c2a25b", shape: "rect", tilt: 0, fontWeight: 800, uppercase: true },
  { label: "Pílula", color: "#8b5a2b", shape: "oval", tilt: 0, fontWeight: 700 },
  { label: "Editorial", color: "#c2a25b", shape: "none", tilt: 0, fontFamily: "Georgia, serif", fontWeight: 700, italic: true },
  { label: "Manuscrito", color: "#ffffff", shape: "none", tilt: -6, fontFamily: "Georgia, serif", fontWeight: 600, italic: true },
  { label: "Adesivo", color: "#ff5252", shape: "rect", tilt: -8, fontWeight: 900, uppercase: true },
  { label: "Mono técnico", color: "#7de2c3", shape: "none", tilt: 0, fontFamily: "ui-monospace, monospace", fontWeight: 700 },
  { label: "Neon leve", color: "#4fc3f7", shape: "marker", tilt: 3, fontWeight: 800 },
];

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

export function autoSelectDesign(topic: string): { preset: DesignPreset; theme: ColorTheme } {
  const lower = topic.toLowerCase();
  if (lower.includes("tech") || lower.includes("ia") || lower.includes("dado") || lower.includes("digital")) return { preset: "tech", theme: "preto" };
  if (lower.includes("negócio") || lower.includes("empreende") || lower.includes("venda") || lower.includes("marketing")) return { preset: "corporativo", theme: "marrom" };
  if (lower.includes("educa") || lower.includes("aprend") || lower.includes("curs") || lower.includes("conhec")) return { preset: "educacional", theme: "bege" };
  if (lower.includes("autoridad") || lower.includes("lider") || lower.includes("expert")) return { preset: "autoridade", theme: "roxo" };
  if (lower.includes("criat") || lower.includes("design") || lower.includes("moda") || lower.includes("arte")) return { preset: "moderno", theme: "azul" };
  return { preset: "minimalista", theme: "preto" };
}

const CARD_SEQUENCE: CardType[] = ["hook", "problem", "insight", "framework", "explanation", "mistake", "cta"];

/** Estrutura em branco do carrossel — sem copy simulada. A copy vem da IA ou do usuário. */
export function blankCards(): Card[] {
  return CARD_SEQUENCE.map((type) => ({
    type,
    kicker: "",
    title: "",
    subtitle: "",
    buttonText: "",
    buttonCaption: "",
    handle: "@seu.handle",
    author: "Seu Nome",
    image: null,
    imagePosition: "top",
    imageZoom: 100,
    gradientOpacity: 70,
    gradientDirection: "bottom",
    textAlign: "left",
    textVerticalAlign: "bottom",
    highlights: [],
  })) as Card[];
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
  calendarioError: string;
  gerarCalendario: () => Promise<void>;
  setCalendarioFromIa: (items: CalendarioItem[]) => void;
  updateCard: (i: number, patch: Partial<Card>) => void;
  removeCard: (i: number) => void;
  generateCards: () => Promise<void>;
  generateAll: () => Promise<void>;
  generateFromInsight: () => Promise<void>;
  resetAll: () => void;
};

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Falha na comunicação com a IA.");
  return data as T;
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
      cards: blankCards(),
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
      calendarioError: "",
      gerarCalendario: async () => {
        const st = get();
        const d = st.documento;
        if (!d.propostaDeValor.trim() || !d.publicoAlvo.trim()) {
          set({ calendarioError: "Preencha Proposta de Valor e Público-Alvo no Documento Mestre." });
          return;
        }
        set({ calendarioLoading: true, calendarioError: "" });
        try {
          const data = await postJson<{ itens: CalendarioItem[] }>("/api/calendario", {
            documento: d,
            ...st.pesquisa,
          });
          set({ calendario: data.itens || [], calendarioLoading: false, calendarioError: "" });
        } catch (e) {
          set({
            calendarioLoading: false,
            calendarioError: e instanceof Error ? e.message : "Não foi possível gerar o calendário.",
          });
        }
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
      generateCards: async () => {
        const st = get();
        const topic = st.topic.trim() || st.insight.trim();
        if (!topic) {
          set({ aiStatus: "error", aiError: "Informe o tópico ou o insight antes de gerar." });
          return;
        }
        const i = st.activeIndex;
        const current = st.cards[i];
        if (!current) return;
        set({ aiStatus: "generating", aiError: "" });
        try {
          const context = st.cards
            .filter((_, idx) => idx !== i)
            .map((c) => `${c.type}: ${c.title} — ${c.subtitle}`)
            .filter((l) => l.length > 8)
            .join("\n");
          const data = await postJson<{ card: Card }>("/api/generate-card", {
            type: current.type,
            topic,
            goal: st.goal,
            tone: st.tone,
            context,
          });
          set((s) => ({
            aiStatus: "idle",
            aiError: "",
            cards: s.cards.map((c, idx) =>
              idx === i
                ? {
                    ...c,
                    kicker: data.card.kicker,
                    title: data.card.title,
                    subtitle: data.card.subtitle,
                    buttonText: data.card.buttonText,
                    buttonCaption: data.card.buttonCaption,
                  }
                : c,
            ),
          }));
        } catch (e) {
          set({ aiStatus: "error", aiError: e instanceof Error ? e.message : "Erro ao gerar o card." });
        }
      },
      generateAll: async () => {
        const st = get();
        const topic = st.topic.trim() || st.insight.trim();
        if (!topic) {
          set({ aiStatus: "error", aiError: "Informe o tópico ou cole um insight antes de gerar." });
          return;
        }
        set({ aiStatus: "generating", aiError: "" });
        try {
          const data = await postJson<{
            cards: Card[];
            caption: string;
            cta: string;
            hashtags: string[];
            analysis: AnalysisResult;
          }>("/api/generate", { insight: topic, goal: st.goal, tone: st.tone, brand: st.brand });
          const design = autoSelectDesign(data.analysis?.theme || topic);
          set({
            aiStatus: "idle",
            aiError: "",
            cards: data.cards,
            insightAnalysis: data.analysis || null,
            activeIndex: 0,
            generatedCaption: data.caption || "",
            generatedCta: data.cta || "",
            generatedHashtags: data.hashtags || [],
            designPreset: design.preset,
            colorTheme: design.theme,
            highlight: { mode: st.brand.applyByDefault ? ("medium" as HighlightMode) : ("off" as HighlightMode), style: "bold" as HighlightStyle },
          });
        } catch (e) {
          set({ aiStatus: "error", aiError: e instanceof Error ? e.message : "Erro ao gerar o carrossel." });
        }
      },
      generateFromInsight: async () => {
        const st = get();
        const insight = st.insight.trim();
        if (!insight) {
          set({ aiStatus: "error", aiError: "Cole um insight antes de gerar." });
          return;
        }
        set({ aiStatus: "analyzing", aiError: "" });
        try {
          const data = await postJson<{
            cards: Card[];
            caption: string;
            cta: string;
            hashtags: string[];
            analysis: AnalysisResult;
          }>("/api/generate", { insight, goal: st.goal, tone: st.tone, brand: st.brand });
          const design = autoSelectDesign(data.analysis?.theme || insight);
          set({
            aiStatus: "idle",
            aiError: "",
            topic: data.analysis?.theme || insight.slice(0, 40),
            insightAnalysis: data.analysis || null,
            cards: data.cards,
            generatedCaption: data.caption || "",
            generatedCta: data.cta || "",
            generatedHashtags: data.hashtags || [],
            activeIndex: 0,
            designPreset: design.preset,
            colorTheme: design.theme,
            framework: "aida" as Framework,
            highlight: { mode: st.brand.applyByDefault ? ("medium" as HighlightMode) : ("off" as HighlightMode), style: "bold" as HighlightStyle },
          });
        } catch (e) {
          set({ aiStatus: "error", aiError: e instanceof Error ? e.message : "Erro ao gerar o carrossel." });
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
