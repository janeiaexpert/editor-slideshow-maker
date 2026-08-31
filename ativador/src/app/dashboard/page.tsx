"use client"

import { useState, useCallback, useEffect, useRef, Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Rocket, Copy, Download, FileText, FileDown, ChevronDown, ChevronRight,
  ArrowLeft, ShoppingCart, DollarSign, TrendingUp, BarChart3,
  Mail, MessageSquare, Gift, ShieldCheck, Target, Zap, Eye,
  Image, Palette, Layout, Code, PenTool, Play, RotateCcw, Camera, X,
  RefreshCw, Star, Package, Book
} from "lucide-react"
import { exportPDF, downloadMarkdown, exportDOCX, exportPNG } from "@/lib/export"
import { sanitizeSvg, sanitizeText } from "@/lib/security"
import { useRouter, useSearchParams } from "next/navigation"
import { ChatBot } from "@/components/chat-bot"
import { Biblioteca } from "@/components/biblioteca"
import { ProdutoCustom } from "@/components/produto-custom"
import { Conversor } from "@/components/conversor"
import { EditablePreview } from "@/components/editable-preview"
import { TrilhaProgresso } from "@/components/trilha-progresso"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PRODUTOS_VALIDADOS, gerarCoverSvg } from "@/data/produtos-validados"


type StepData = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  tab: "produto" | "vendas" | "operacao" | "artefatos"
  content: Record<string, string>
  generated: boolean
}

const INITIAL_STEPS: StepData[] = [
  // === PRODUTO TAB ===
  { id:"headline", title:"Headline e Promessa", description:"T\u00EDtulo, subt\u00EDtulo e benef\u00EDcio principal", icon:<Eye className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },
  { id:"modulos", title:"M\u00F3dulos do Produto", description:"Estrutura completa de conte\u00FAdo", icon:<Book className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },
  { id:"entregaveis", title:"Entreg\u00E1veis", description:"O que o cliente recebe", icon:<Gift className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },
  { id:"bonus", title:"B\u00F4nus Exclusivos", description:"Extras que aumentam o valor percebido", icon:<Star className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },
  { id:"vsl", title:"VSL \u2014 Script Completo", description:"V\u00EDdeo de vendas com roteiro completo", icon:<FileText className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },
  { id:"anuncios", title:"An\u00FAncios por Plataforma", description:"Criativos para Instagram, Facebook, Google, TikTok", icon:<Target className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },
  { id:"conteudo", title:"Plano de Conte\u00FAdo", description:"Posts, stories e roteiros para 30 dias", icon:<Calendar className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },

  // === VENDAS TAB ===
  { id:"oferta", title:"Oferta Inteligente", description:"Precifica\u00E7\u00E3o, garantia, escassez e CTA", icon:<DollarSign className="w-4 h-4"/>, tab:"vendas", content:{}, generated:false },
  { id:"funil", title:"Funil Inteligente", description:"Checkout, Order Bump, Upsell, Downsell", icon:<ShoppingCart className="w-4 h-4"/>, tab:"vendas", content:{}, generated:false },
  { id:"automacao", title:"Automa\u00E7\u00E3o", description:"E-mails, WhatsApp, Recupera\u00E7\u00E3o de Carrinho", icon:<Mail className="w-4 h-4"/>, tab:"vendas", content:{}, generated:false },
  { id:"monetizacao", title:"Monetiza\u00E7\u00E3o", description:"Assinatura, Licenciamento, Afiliados, White Label", icon:<TrendingUp className="w-4 h-4"/>, tab:"vendas", content:{}, generated:false },

  // === OPERACAO TAB ===
  { id:"dashboard", title:"Dashboard", description:"KPIs, m\u00E9tricas e gr\u00E1ficos", icon:<BarChart3 className="w-4 h-4"/>, tab:"operacao", content:{}, generated:false },
  { id:"escala", title:"Estrat\u00E9gias de Escala", description:"Pr\u00F3ximo produto, cross sell, ascens\u00E3o de valor", icon:<Zap className="w-4 h-4"/>, tab:"operacao", content:{}, generated:false },

  // === ARTEFATOS TAB ===
  { id:"logo", title:"Logo SVG", description:"Logotipo profissional em SVG", icon:<Image className="w-4 h-4"/>, tab:"artefatos", content:{}, generated:false },
  { id:"capa", title:"Capa para Redes Sociais", description:"Capa Feed (4:5) e Reels/Stories (9:16)", icon:<Palette className="w-4 h-4"/>, tab:"artefatos", content:{}, generated:false },
  { id:"card_oferta", title:"Card de Oferta", description:"Card promocional para divulga\u00E7\u00E3o", icon:<Layout className="w-4 h-4"/>, tab:"artefatos", content:{}, generated:false },
  { id:"certificado", title:"Certificado", description:"Template de certificado de conclus\u00E3o", icon:<FileText className="w-4 h-4"/>, tab:"artefatos", content:{}, generated:false },
  { id:"landing", title:"Landing Page HTML", description:"P\u00E1gina de captura completa em HTML/CSS", icon:<Code className="w-4 h-4"/>, tab:"artefatos", content:{}, generated:false },
  { id:"story", title:"Roteiro para Story/Reel", description:"Storyboard visual para stories", icon:<PenTool className="w-4 h-4"/>, tab:"artefatos", content:{}, generated:false },
]

function getStepGuide(stepId: string): string {
  const guides: Record<string, string> = {
    headline: "A headline é a primeira impressão. Use uma promessa clara e específica. Ex: 'Método X para conseguir Y em Z dias'",
    modulos: "Estruture o conteúdo em módulos lógicos. Cada módulo deve ensinar uma habilidade específica e levar ao próximo.",
    entregaveis: "Defina exatamente o que o aluno recebe: vídeos, PDFs, templates, comunidade. Seja específico.",
    bonus: "Bônus aumentam o valor percebido. Ofereça extras relevantes que complementem o produto principal.",
    vsl: "O VSL (Vídeo de Vendas) deve seguir: Problema → Solução → Prova → Oferta → Garantia. Seja autêntico.",
    anuncios: "Crie anúncios para cada plataforma. Instagram = visual, Facebook = carrossel, Google = busca, TikTok = dinâmico.",
    conteudo: "Monte um calendário de 30 dias. Alterne entre educar, engajar e vender. Não venda todos os dias.",
    oferta: "Preço deve ser justo para o valor entregue. Use ancoragem (preço de), parcelamento e garantia de 7 dias.",
    funil: "Funil completo: Tráfego → Captura → E-mail → Checkout → Upsell. Cada etapa deve nutrir a próxima.",
    automacao: "Automatize: boas-vindas, nutrição, recuperação de carrinho. Use e-mail + WhatsApp.",
    monetizacao: "Pense além do produto: mentoria, consultoria, assinatura, infoprodutos complementares.",
    dashboard: "Acompanhe: taxa de conversão, custo por aquisição, LTV, churn. Dados guiam decisões.",
    escala: "Após validar, escale: novos produtos, cross-sell, parcerias, afiliados, mercados adjacentes.",
    logo: "Logo simples e memorável. Use cores da paleta do produto. Formato SVG para qualquer tamanho.",
    capa: "Capa Feed (4:5) e Reels (9:16). Use mockup profissional com benefit text e CTA.",
    card_oferta: "Card com: benefício principal, prova social, preço com desconto, CTA claro e urgência.",
    certificado: "Certificado com: nome do aluno, data, carga horária, assinatura digital. Design alinhado à marca.",
    landing: "Landing page com: headline, benefícios, prova social, CTA, garantia. Mobile-first e rápido.",
    story: "Storyboard: 5-7 frames. Frame 1 = gancho, frames 2-4 = conteúdo, frame 5 = CTA. Texto curto.",
  }
  return guides[stepId] || "Clique em gerar para criar o conteúdo deste passo."
}

const KNOWN_PRODUCTS_KEY = "ativador_known_products"
const NEW_PRODUCTS_KEY = "ativador_new_products"

function getKnownProducts(): string[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(KNOWN_PRODUCTS_KEY) || "[]") } catch { return [] }
}

function setKnownProducts(ids: string[]) {
  localStorage.setItem(KNOWN_PRODUCTS_KEY, JSON.stringify(ids))
}

function getNewProducts(): string[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(NEW_PRODUCTS_KEY) || "[]") } catch { return [] }
}

function setNewProducts(ids: string[]) {
  localStorage.setItem(NEW_PRODUCTS_KEY, JSON.stringify(ids))
}



function getPaletteColors(p?: { id: string; nome: string; cores: string[] } | null) {
  const defaults = { primary: "#8B5E3C", secondary: "#6B4226", light: "#D4B896", bg: "#F5EFE8", dark: "#1A1A1A" }
  if (!p?.cores || p.cores.length < 5) return defaults
  return { primary: p.cores[0], secondary: p.cores[1], light: p.cores[2], bg: p.cores[3], dark: p.cores[4] }
}

function stripEmojis(text: string): string {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2702}-\u{27B0}]/gu, "").replace(/\s{2,}/g, " ").trim()
}

function fillVars(text: string, ideia: string, tom: string, lucro: number): string {
  const cleaned = ideia.replace(/\b(com|para|de|do|da|dos|das|e|em|no|na)\b/gi, "").replace(/\s+/g, " ").trim()
  const words = cleaned.split(" ").filter(w => w.length > 2)
  const nome = words.slice(0, 2).join(" ") || "Seu Produto"
  const headline = words.slice(0, 3).join(" ").toUpperCase() || "TRANSFORME SUA VIDA"
  const destaque = words[0] || "Método"
  const tag = (words[words.length - 1] || words[0] || "").toUpperCase()
  const fmt = (v: number) => v.toLocaleString("pt-BR")
  const oferta = lucro > 0 ? `R$ ${fmt(lucro)}` : "[VALOR]"
  const valorCheio = lucro > 0 ? `R$ ${fmt(Math.round(lucro * 2.5))}` : "[VALOR CHEIO]"
  const parcela = lucro > 0 ? `R$ ${fmt(Math.round(lucro / 12))}` : "[PARCELA]"
  const n = "12"
  const hoje = new Date().toLocaleDateString("pt-BR")

  const map: Record<string, string> = {
    "[NOME]": nome,
    "[NOME DO PRODUTO]": nome,
    "[NOME DO CURSO]": nome,
    "[HEADLINE]": headline,
    "[HEADLINE PRINCIPAL]": headline,
    "[TAG]": tag,
    "[DESTAQUE]": destaque,
    "[SUBTÍTULO]": `Domine ${destaque.toLowerCase()} e crie resultados reais`,
    "[PALAVRA DE DESTAQUE]": destaque,
    "[OFERTA]": oferta,
    "[VALOR]": lucro > 0 ? `R$ ${fmt(lucro)}` : "[VALOR]",
    "[VALOR CHEIO]": valorCheio,
    "[N]": n,
    "[PARCELA]": parcela,
    "[CARGA]": "40",
    "[DATA]": hoje,
    "[PROBLEMA]": words.slice(0, 4).join(" ") || "alcançar seus objetivos",
    "[BENEFÍCIO 1]": `Aprender ${words[0] || "o método"} do zero`,
    "[BENEFÍCIO 2]": `Acelerar seus resultados em ${n} dias`,
    "[BENEFÍCIO 3]": `Ter suporte e comunidade exclusiva`,
    "[DEPOIMENTO]": `Este curso mudou minha vida! Consegui ${words.slice(0, 3).join(" ")} em poucas semanas. Recomendo demais!`,
    "[TEMPO]": `${n} dias`,
    "[DESCRIÃO BREVE DOS MÓDULOS]": ideia.slice(0, 80) + (ideia.length > 80 ? "..." : ""),
    "[MÓDULOS HTML]": words.slice(0, 3).map((w, i) => `<div class="benefit-card"><div class="num">${i+1}</div><h3>Módulo ${i+1}</h3><p>Aprenda ${w} na prática, passo a passo.</p></div>`).join(""),
    "[VALOR COM DESCONTO]": lucro > 0 ? `R$ ${fmt(Math.round(lucro * 0.8))}` : "[VALOR COM DESCONTO]",
  }

  let result = text
  for (const [key, val] of Object.entries(map)) {
    result = result.replaceAll(key, val)
  }
  return result
}
function Calendar({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }

function stopKeys(e: React.KeyboardEvent) {
  e.stopPropagation()
  e.nativeEvent.stopImmediatePropagation()
  const k = e.key
  if (k === "ArrowLeft" || k === "ArrowRight" || k === "ArrowUp" || k === "ArrowDown" || k === "Enter" || k === "Tab") {
    if (k !== "Tab") e.preventDefault()
  }
}

const TAB_KEYS = new Set(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"])
function blockRadixTabs(e: KeyboardEvent) {
  if (TAB_KEYS.has(e.key)) { e.stopPropagation(); e.stopImmediatePropagation() }
}

const STOP_WORDS = /^(com|para|de|do|da|dos|das|e|em|no|na|o|a|os|as|um|uma|que|por|mas|se|n\u00E3o|j\u00E1|est\u00E1|mais|como|isso|este|esta|esse|essa|vou|vai|quero|criar|fazer|ter|pode|muito|bem|quando|por\u00E9m|porque|tamb\u00E9m|sobre|antes|depois|ainda|todo|toda|todos|todas|pelo|pela|at\u00E9|desde|sem|com|apoio|uso|meu|minha|nosso|nossa|quais|qual|onde|quem|s\u00E3o|ser|estou|tem|te|ter|foi|ser|estava|tinha|tenho|me|lhe|lhes|nos|eles|elas|tu|voc\u00EA|voc\u00EAs|si|meu|teu|seu|minha|tua|sua|meus|teus|seus|minhas|tuas|suas)$/i

function extractTheme(idea: string, maxWords = 3): string {
  const cleaned = idea.replace(/[.,;!?:]/g, "")
  const words = cleaned.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.test(w))
  return words.slice(0, maxWords).join(" ") || "este método"
}

interface ProdutoInfo {
  nome: string
  tag: string
  descricao: string
  publico: string
  paleta?: { id: string; nome: string; cores: string[] }
  fonte?: { id: string; nome: string }
}

const FALLBACKS: Record<string, (idea: string, lucro?: number, produto?: ProdutoInfo) => Record<string, string>> = {
  headline: (idea, _, p) => {
    const nome = p?.nome || extractTheme(idea, 2)
    const desc = p?.descricao || extractTheme(idea, 5)
    const pub = p?.publico || "você"
    return {
      "Headline": nome + " — " + desc.split(".")[0],
      "Subtítulo": "Método completo e passo a passo para " + pub + " que quer resultados reais em " + nome,
      "Benefício Central": "Transformação completa com método comprovado, suporte direto e conteúdo prático em " + nome,
      "Prova Social": "[INSIRA AQUI SEUS DEPOIMENTOS E DADOS REAIS DE ALUNOS]"
    }
  },
  modulos: (idea, _, p) => {
    const nome = p?.nome || extractTheme(idea, 2)
    const pub = p?.publico || "você"
    return {
      "Módulo 1": `Introdução a ${nome}   Conceitos fundamentais, o que ${pub} precisa saber antes de começar, erros mais comuns e como evitar`,
      "Módulo 2": `Fundamentos práticos de ${nome}   Passo a passo essencial, ferramentas e exercícios para colocar em prática`,
      "Módulo 3": `Técnicas avançadas em ${nome}   Estratégias diferenciadas, otimização de resultados, como ir além do básico`,
      "Módulo 4": `Aplicação no mundo real   Casos práticos de ${nome}, erros que sabotam resultados, como manter consistência`,
      "Módulo 5": `Próximos passos   Como escalar resultados em ${nome}, monetizar conhecimento, criar metodologia própria`
    }
  },
  entregaveis: (idea, _, p) => {
    const nome = p?.nome || extractTheme(idea, 1)
    const tag = p?.tag?.toLowerCase() || "método"
    return {
      "Vídeoaulas": "Sequência de aulas em vídeo com demonstrações práticas de " + nome + " passo a passo",
      "Material de Apoio": "PDF complementar com resumos, listas de verificação e referências rápidas de " + nome,
      "Exercícios Práticos": "Atividades guiadas para praticar " + nome + " com feedback e correção",
      "Comunidade": "Grupo exclusivo para tirar dúvidas, compartilhar resultados e networking sobre " + nome,
      "Certificado": "Certificado digital de conclusão de " + nome + " com carga horária registrada"
    }
  },
  bonus: (idea, _, p) => {
    const nome = p?.nome || extractTheme(idea, 2)
    return {
      "Bônus 1": "Guia Rápido   Material de bolso com os pontos-chave de " + nome + " para consultar a qualquer momento",
      "Bônus 2": "Checklist de Implementação   Passo a passo do zero ao primeiro resultado em " + nome,
      "Bônus 3": "Lista de Ferramentas   Os melhores recursos e apps para acelerar seus resultados em " + nome,
      "Bônus 4": "Acesso Vitalício e Atualizações Futuras   Todo o conteúdo de " + nome + " atualizado sem custo adicional"
    }
  },
  vsl: (idea, _, p) => {
    const nome = p?.nome || extractTheme(idea, 2)
    const pub = p?.publico || "você"
    return {
      "Abertura": pub + " já tentou " + nome + " e sentiu que faltava algo? Que não estava conseguindo o resultado que esperava?",
      "Problema": "A maioria das pessoas que tentam " + nome + " cometem o mesmo erro: são sem método, sem direção, e acabam perdendo tempo e dinheiro. " + pub + " já passou por isso?",
      "Solução": "Foi pensando nisso que criei o " + nome + ". Um método passo a passo que elimina a confusão e te leva direto ao resultado. Sem enrolação, sem teoria irrelevante.",
      "Prova Social": "[INSIRA DEPOIMENTOS REAIS OU DADOS VERDADEIROS DE RESULTADOS]",
      "Oferta": "Tudo isso por um investimento que cabe no seu bolso. Garantia de 7 dias   se não funcionar, você recebe 100% de volta.",
      "Script Completo": pub + " já tentou " + nome + " e sentiu que faltava algo? A maioria das pessoas cometem o mesmo erro   são sem método e sem direção. Foi pensando nisso que criei o " + nome + ". Um método passo a passo que elimina a confusão. [INSIRA DEPOIMENTOS REAIS]. Tudo isso por um investimento acessível. Garantia de 7 dias."
    }
  },
  anuncios: (idea, _, p) => {
    const nome = p?.nome || extractTheme(idea, 2)
    const pub = p?.publico || "público"
    const tag = p?.tag?.toLowerCase() || "método"
    return {
      "Instagram": "Reels de 30s: Mostra o problema REAL que " + nome + " resolve. Texto na tela com gancho forte. Legenda: 3 bullets do método + CTA 'Link na bio'",
      "Facebook": "Carrossel de 5 slides: Slide 1 - Problema com " + nome + ". Slide 2 - Por que isso te custa resultado. Slide 3 - Seu método em 3 passos. Slide 4 - Prova social. Slide 5 - CTA direto",
      "Google Ads": "Anúncio de busca: Headline focada na DOR do público que busca " + nome + ". Descrição com promessa específica + garantia de 7 dias",
      "TikTok": "Vídeo de 15s: Demonstração rápida de " + nome + " em ação. Gancho nos primeiros 2 segundos. CTA: 'Salva pra testar'",
      "Hook Topo": pub + " também tem dificuldade com " + nome + "? A maioria das pessoas cometem este erro...",
      "Hook Meio": "Em [INSIRA TEMPO] de " + nome + ", meus alunos têm obtido resultados reais. Veja como...",
      "Hook Fundo": "Vagas limitadas pro " + nome + ". Bônus exclusivos só pra quem entrar agora. Garantia de 7 dias."
    }
  },
  conteudo: (idea, _, p) => {
    const nome = p?.nome || extractTheme(idea, 2)
    return {
      "Semana 1   Dia 1": "Reels: Gancho   'Você ainda tem dificuldade com " + nome + "?'. Demo visual de 15s mostrando o método. CTA: 'Comenta MÉTODO que te mando o passo a passo'",
      "Semana 1   Dia 2": "Carrossel: Slide 1 'O erro #1 ao tentar " + nome + "'. Slide 2 'Por que isso te custa tempo e resultado'. Slide 3-5 'Meu método em 3 passos'. Slide 6 'Case real'. Slide 7 CTA 'Link na bio'",
      "Semana 1   Dia 3": "Reels: Transformação   'Eu era [estado anterior], apliquei " + nome + ", agora [estado atual]'. Legenda: 3 bullets do método + CTA",
      "Semana 1   Dia 4": "Carrossel: '3 mitos que impedem seu resultado em " + nome + "'. Mito 1 vs Verdade. Mito 2 vs Verdade. Mito 3 vs Verdade. Slide final: CTA",
      "Semana 1   Dia 5": "Stories: Enquete 'Qual seu maior obstáculo em " + nome + "?'. Frame 2: Resultado + insight. Frame 3: Dica rápida. Frame 4: CTA oferta suave",
      "Semana 1   Dia 6": "Reels: Demonstração técnica   'Como faço [tarefa específica de " + nome + "] em 60s'. CTA: 'Salva pra testar depois'",
      "Semana 1   Dia 7": "Carrossel: Checklist '7 passos pra começar " + nome + " hoje'. Slide final: download grátis na bio + CTA",
      "Semana 2   Dia 8": "Reels: Storytelling 'Por que 90% desiste de " + nome + " antes do resultado'. Seu método = solução. CTA: 'Quer a solução?'",
      "Semana 2   Dia 9": "Carrossel: '7 erros que sabotam seus resultados em " + nome + "'. Um erro por slide com solução. Slide 8: Case real. CTA",
      "Semana 2   Dia 10": "Stories: Q&A   responda top 3 dúvidas sobre " + nome + ". Frame final: 'Abrindo vagas, entra na lista de espera'",
      "Semana 2   Dia 11": "Reels: Bastidores   'Como eu aplico " + nome + " no dia a dia'. Autoridade + humanização. Legenda: breakdown do processo",
      "Semana 2   Dia 12": "Carrossel: Comparação 'Método tradicional vs Meu método de " + nome + "'. Tempo, custo, resultado. Slide final: CTA",
      "Semana 2   Dia 13": "Post Feed: Frase-chave sobre " + nome + " em imagem + legenda educativa. CTA comentários",
      "Semana 2   Dia 14": "Reels: Convite direto   'Vaga aberta pro " + nome + ". [Benefício 1], [Benefício 2], [Benefício 3]. Link na bio'",
      "Semana 3   Dia 15": "Carrossel: Case   'Aluno foi de [A] para [B] usando " + nome + " em [tempo]'. Contexto, obstáculo, ação, resultado. CTA",
      "Semana 3   Dia 16": "Reels: Objeção #1   'Não tenho tempo pra " + nome + "'. Resposta: '15 min/dia = resultado real'. Mostre cronograma",
      "Semana 3   Dia 17": "Carrossel: Objeção #2   'Não tenho dinheiro'. ROI visual: 'Custo de NÃO fazer " + nome + " = X'. CTA",
      "Semana 3   Dia 18": "Stories: Prova social   prints de resultados de alunos de " + nome + ". Frame 4: 'Quer acesso?'",
      "Semana 3   Dia 19": "Reels: Objeção #3   'Não sei por onde começar " + nome + "'. Roadmap visual: Passo 1, 2, 3. CTA",
      "Semana 3   Dia 20": "Carrossel: 'Ferramentas essenciais pra " + nome + "'   5 ferramentas + por que uso cada. CTA: link na bio",
      "Semana 3   Dia 21": "Post Feed: Recap semanal sobre " + nome + " + oferta suave. 'Montando turma nova, aviso quem tá na lista'",
      "Semana 4   Dia 22": "Reels: Urgência   'Vagas acabando / Bônus expiram'. CTA direto checkout do " + nome,
      "Semana 4   Dia 23": "Carrossel: Oferta completa   'O que você leva: Módulos + Bônus + Garantia 7 dias'. Preço tachado -> real",
      "Semana 4   Dia 24": "Stories: Sequência venda   Frame 1: 'Dúvida?'. Frame 2: Resposta. Frame 3: 'última chance'. Frame 4: Link direto",
      "Semana 4   Dia 25": "Post Feed: Depoimento de aluno de " + nome + ". História completa + resultado real",
      "Semana 4   Dia 26": "Reels: 'última chamada   portas fecham'. Mostre checkout. 'Nos vemos do lado de dentro'",
      "Semana 4   Dia 27": "Carrossel: FAQ visual   5 perguntas reais sobre " + nome + " respondidas. CTA final",
      "Semana 4   Dia 28": "Reels: Encerramento   'Campanha fechou'. Lista de espera aberta pro próximo ciclo de " + nome,
      "Semana 4   Dia 29": "Post Feed: 'Porta aberta pra lista de espera' de " + nome + ". Benefícios de entrar agora. CTA",
      "Semana 4   Dia 30": "Reels: Recap do ciclo de " + nome + " + teaser próxima turma. Inscreve na lista pra não perder"
    }
  },
  oferta: (idea, lucro, p) => {
    const nome = p?.nome || "Curso"
    const valor = lucro && lucro > 0 ? lucro : 497
    const fv = valor.toLocaleString("pt-BR")
    const parcela = Math.round(valor / 12)
    const fParcela = parcela.toLocaleString("pt-BR")
    const valorCheio = Math.round(valor * 2)
    const fCheio = valorCheio.toLocaleString("pt-BR")
    return {
      "Valor Ideal": `R$ ${fv} à vista ou 12x de R$ ${fParcela}`,
      "Ancoragem": `De R$ ${fCheio} por apenas R$ ${fv}   economia de 50%`,
      "Parcelamento": `12x de R$ ${fParcela} sem juros no cartão. PIX com 10% de desconto.`,
      "Garantia": "7 dias de garantia incondicional. Risco zero.",
      "Escassez": "últimas 50 vagas com acesso aos bônus exclusivos de " + nome,
      "Oferta Principal": `Curso completo de ${nome} com todos os módulos, conteúdo exclusivo e acesso vitalício. Bônus: checklist, templates e comunidade. Tudo por R$ ${fv}. Garantia de 7 dias.`
    }
  },
  funil: (idea, lucro, p) => {
    const nome = p?.nome || extractTheme(idea, 2)
    const valor = lucro && lucro > 0 ? lucro : 497
    const fv = valor.toLocaleString("pt-BR")
    const orderBump = Math.round(valor * 0.3).toLocaleString("pt-BR")
    const upsell1 = Math.round(valor * 0.6).toLocaleString("pt-BR")
    const upsell2 = Math.round(valor * 1.2).toLocaleString("pt-BR")
    const downsell = Math.round(valor * 0.4).toLocaleString("pt-BR")
    return {
      "Checkout": `Página de checkout otimizada para ${nome}. Headline: 'Acesse ${nome} agora'. Depoimentos reais. Garantia de 7 dias em destaque. Botões de urgência.`,
      "Order Bump": `Pack complementar de ${nome}   material avançado por R$ ${orderBump} adicionado ao checkout com um clique`,
      "Upsell 1": `Mentoria individual de ${nome}   3 sessões de 45min por R$ ${upsell1}. Acompanhamento personalizado para acelerar resultados`,
      "Upsell 2": `Workshop ao vivo de ${nome}   treinamento intensivo por R$ ${upsell2}. Gravação disponível por 30 dias`,
      "Downsell": `Versão simplificada de ${nome}   acesso básico por R$ ${downsell}. Ideal para quem quer começar com investimento menor`,
      "Obrigado": `Página de agradecimento com acesso imediato ao ${nome}. Instruções de primeiro passo. Convite para grupo VIP`
    }
  },
  automacao: (idea, _, p) => {
    const nome = p?.nome || extractTheme(idea, 2)
    return {
      "Email 1   Boas-Vindas": `Dia 1: 'Bem-vindo ao ${nome}!'   Link de acesso imediato + dica rápida para começar hoje. Tom de entusiasmo e proximidade.`,
      "Email 2   Dica": `Dia 3: 'A dica que mudou tudo em ${nome}'   Conteúdo de valor puro que mostra sua autoridade no tema. CTA suave para o próximo passo.`,
      "Email 3   Case": `Dia 7: 'Como [NOME] conseguiu [RESULTADO] com ${nome}'   História real de transformação. Prova social + CTA para garantir vaga na próxima turma.`,
      "WhatsApp": `Sequência automatizada: Dia 1 (link de acesso + dica de ${nome}), Dia 4 (pergunta sobre progresso), Dia 7 (convite para grupo VIP), Dia 14 (oferta especial)`,
      "Recuperação Carrinho": `Email 1 (1h): 'Você deixou o acesso a ${nome} para trás'. Email 2 (24h): depoimento real de aluno. Email 3 (72h): oferta especial com [N]% de desconto.`
    }
  },
  monetizacao: (idea, _, p) => {
    const nome = p?.nome || extractTheme(idea, 2)
    return {
      "Assinatura": `Clube de ${nome}   assinatura mensal com módulo novo por mês, lives exclusivas e comunidade ativa. Conteúdo que mantém o aluno engajado.`,
      "Licenciamento": `Licença do método ${nome} para profissionais. Permite usar sua metodologia com clientes próprios.`,
      "Mentoria": `Mentoria individual em ${nome}   12 sessões de 60min. Acompanhamento personalizado para quem quer resultados rápidos.`,
      "Afiliados": `Programa de afiliados para ${nome}   comissão de 30% por venda. Material promocional pronto para copiar e divulgar.`,
      "White Label": `Revenda completa do ${nome}   todo o conteúdo sem marcação da marca. Ideal para quem quer empreender.`
    }
  },
  dashboard: (idea, lucro, p) => {
    const nome = p?.nome || extractTheme(idea, 2)
    const valor = lucro && lucro > 0 ? lucro : 497
    const fv = valor.toLocaleString("pt-BR")
    const metaVendas = 10
    const receitaBasica = valor * metaVendas
    const fReceita = receitaBasica.toLocaleString("pt-BR")
    const ticketUpsell = Math.round(valor * 1.3)
    const fTicket = ticketUpsell.toLocaleString("pt-BR")
    const receitaUpsell = ticketUpsell * metaVendas
    const fReceitaUpsell = receitaUpsell.toLocaleString("pt-BR")
    const cac = Math.round(valor * 0.3)
    const fCac = cac.toLocaleString("pt-BR")
    const investimentoAnuncios = cac * metaVendas
    const fInvest = investimentoAnuncios.toLocaleString("pt-BR")
    const roi = Math.round(((receitaBasica - investimentoAnuncios) / investimentoAnuncios) * 100)
    const ltv = Math.round(ticketUpsell * 2.4)
    const fLtv = ltv.toLocaleString("pt-BR")
    return {
      "Receita Projetada": `R$ ${fReceita}/mês (10 vendas x R$ ${fv}) com potencial de R$ ${fReceitaUpsell}/mês incluindo upsells e order bumps`,
      "Meta Mensal": `${metaVendas} vendas por mês   média de ${Math.ceil(metaVendas / 4)} vendas por semana. Aumente gradualmente baseado na conversão.`,
      "Ticket Médio": `R$ ${fv} (básico) / R$ ${fTicket} (com upsell e order bump). O objetivo é aumentar o ticket médio a cada campanha.`,
      "Conversão": `Para ${nome}: 2% a 4% em tráfego frio / 6% a 12% em tráfego quente (lista de espera, remarketing).`,
      "CAC": `Meta: abaixo de R$ ${fCac} (30% do preço). Calcule: investimento em anúncios R$ ${fInvest} / ${metaVendas} vendas = R$ ${fCac} por aluno.`,
      "ROI": `${roi}% de retorno   para cada R$ 1 investido, retorne R$ ${(receitaBasica / investimentoAnuncios).toFixed(2).replace(".", ",")} de receita.`,
      "ROAS": `${(receitaBasica / investimentoAnuncios).toFixed(1).replace(".", ",")}:1   retorno sobre investimento em anúncios. Meta mínima: 4:1.`,
      "LTV": `R$ ${fLtv}   valor médio do aluno em 12 meses (ticket médio com upsell R$ ${fTicket} x 2,4 compras recorrentes). Meta: 3x o CAC (R$ ${(cac * 3).toLocaleString("pt-BR")}).`
    }
  },
  escala: (idea, _, p) => {
    const tema = p?.nome || extractTheme(idea, 2)
    const nome = p?.nome || extractTheme(idea, 2)
    return {
      "Próximo Produto": `Versão avançada de ${tema}   para quem já domina o básico. Conteúdo mais profundo, técnicas avançadas e estudos de caso.`,
      "Cross Sell": `Ao comprar ${nome}, oferecer complemento relacionado a ${tema} com 20% de desconto. Combo que aumenta o valor percebido.`,
      "Linha de Produtos": `Entry (${tema} básico)   Médio (${tema} completo com bônus)   Premium (${tema} + mentoria 1:1)`,
      "Tráfego Pago": `Estratégia de anúncios para ${tema}: comece com orçamento pequeno, teste criativos, escale o que funciona. Meta: ROAS 4:1.`,
      "Afiliados": `Recrutar afiliados que atuam em ${tema}. Comissão de 30% + material promocional pronto. Foco em quem já tem audiência no nicho.`,
      "Recorrência": `Clube mensal de ${tema}   módulo novo por mês + lives + comunidade. Receita recorrente previsível.`
    }
  },
  // === ARTEFATOS ===
  logo: (_, __, p) => {
    const c = getPaletteColors(p?.paleta)
    return {
      "Logo Principal SVG": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 180" style="max-width:100%;width:100%;height:auto;display:block;aspect-ratio:6/1"><defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c.primary}"/><stop offset="100%" stop-color="${c.secondary}"/></linearGradient></defs><rect width="1080" height="180" fill="${c.bg}" rx="12"/><rect x="20" y="20" width="140" height="140" rx="24" fill="url(#lg)"/><text x="90" y="100" font-family="Georgia,serif" font-size="56" font-weight="bold" fill="#FFFFFF" text-anchor="middle">V</text><rect x="175" y="40" width="4" height="40" rx="2" fill="${c.light}"/><text x="195" y="80" font-family="'Helvetica Neue',Arial,sans-serif" font-size="26" font-weight="800" fill="${c.dark}" textLength="780" lengthAdjust="spacingAndGlyphs">[NOME]</text><rect x="195" y="95" width="60" height="3" rx="1.5" fill="${c.primary}"/><text x="195" y="130" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="600" fill="${c.primary}" letter-spacing="3" textLength="500" lengthAdjust="spacingAndGlyphs">[SUBTÍTULO]</text></svg>`,
      "Logo Alternativo SVG": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 180" style="max-width:100%;width:100%;height:auto;display:block;aspect-ratio:6/1"><rect width="1080" height="180" fill="${c.dark}" rx="12"/><circle cx="90" cy="90" r="50" fill="none" stroke="${c.primary}" stroke-width="3"/><circle cx="90" cy="90" r="25" fill="${c.primary}"/><text x="90" y="98" font-family="Georgia,serif" font-size="30" font-weight="bold" fill="#FFFFFF" text-anchor="middle">V</text><text x="170" y="80" font-family="'Helvetica Neue',Arial,sans-serif" font-size="26" font-weight="700" fill="#FFFFFF" textLength="800" lengthAdjust="spacingAndGlyphs">[NOME]</text><text x="170" y="115" font-family="'Helvetica Neue',Arial,sans-serif" font-size="12" font-weight="500" fill="${c.light}" letter-spacing="3">[SUBTÍTULO]</text></svg>`,
      "Cores da Marca": `Primária: ${c.primary} | Secundária: ${c.secondary} | Fundo: ${c.bg} | Texto: ${c.dark} | Detalhe: ${c.light}`,
      "Usos do Logo": "Versão Principal: fundo claro, uso geral. Versão Alternativa: fundo escuro, ideal para vídeos e stories.",
    }
  },
  capa: (_, __, p) => {
    const c = getPaletteColors(p?.paleta)
    return {
      "Feed SVG": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" style="max-width:100%;width:100%;height:auto;display:block;aspect-ratio:4/5"><defs><linearGradient id="bg" x1="0" y1="0" x2="1080" y2="1350" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="${c.dark}"/><stop offset="100%" stop-color="${c.secondary}"/></linearGradient></defs><rect width="1080" height="1350" fill="url(#bg)"/><circle cx="850" cy="200" r="250" fill="${c.primary}" opacity="0.04"/><circle cx="200" cy="1100" r="200" fill="${c.primary}" opacity="0.03"/><rect x="80" y="300" width="3" height="40" rx="1.5" fill="${c.light}"/><text x="100" y="318" font-family="'Helvetica Neue',Arial,sans-serif" font-size="11" font-weight="600" fill="${c.light}" letter-spacing="4">[TAG]</text><polygon points="540,380 548,396 540,392 532,396" fill="${c.light}" opacity="0.6"/><text x="540" y="460" font-family="'Helvetica Neue',Arial,sans-serif" font-size="34" font-weight="800" fill="#FFFFFF" text-anchor="middle">[HEADLINE]</text><text x="540" y="510" font-family="'Helvetica Neue',Arial,sans-serif" font-size="34" font-weight="800" fill="${c.light}" text-anchor="middle">[DESTAQUE]</text><line x1="440" y1="540" x2="640" y2="540" stroke="${c.primary}" stroke-width="2" opacity="0.5"/><text x="540" y="585" font-family="Arial,sans-serif" font-size="15" font-weight="400" fill="#FFFFFF" opacity="0.5" text-anchor="middle">[SUBTÍTULO]</text><rect x="80" y="1140" width="920" height="90" rx="6" fill="${c.primary}" opacity="0.08"/><text x="540" y="1180" font-family="'Helvetica Neue',Arial,sans-serif" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">[NOME DO PRODUTO]</text><text x="540" y="1205" font-family="Arial,sans-serif" font-size="12" fill="${c.light}" text-anchor="middle">[OFERTA]</text></svg>`,
      "Reels SVG": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" style="max-width:100%;width:100%;height:auto;display:block;aspect-ratio:9/16"><defs><linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1920" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="${c.dark}"/><stop offset="100%" stop-color="${c.secondary}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#bg2)"/><circle cx="900" cy="300" r="260" fill="${c.primary}" opacity="0.04"/><circle cx="150" cy="1600" r="210" fill="${c.primary}" opacity="0.03"/><rect x="80" y="700" width="3" height="40" rx="1.5" fill="${c.light}"/><text x="100" y="718" font-family="'Helvetica Neue',Arial,sans-serif" font-size="12" font-weight="600" fill="${c.light}" letter-spacing="4">[TAG]</text><polygon points="540,800 548,816 540,812 532,816" fill="${c.light}" opacity="0.6"/><text x="540" y="880" font-family="'Helvetica Neue',Arial,sans-serif" font-size="38" font-weight="800" fill="#FFFFFF" text-anchor="middle">[HEADLINE]</text><text x="540" y="935" font-family="'Helvetica Neue',Arial,sans-serif" font-size="38" font-weight="800" fill="${c.light}" text-anchor="middle">[DESTAQUE]</text><line x1="440" y1="965" x2="640" y2="965" stroke="${c.primary}" stroke-width="2" opacity="0.5"/><text x="540" y="1015" font-family="Arial,sans-serif" font-size="17" font-weight="400" fill="#FFFFFF" opacity="0.5" text-anchor="middle">[SUBTÍTULO]</text><rect x="80" y="1700" width="920" height="90" rx="6" fill="${c.primary}" opacity="0.08"/><text x="540" y="1740" font-family="'Helvetica Neue',Arial,sans-serif" font-size="15" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">[NOME DO PRODUTO]</text><text x="540" y="1765" font-family="Arial,sans-serif" font-size="13" fill="${c.light}" text-anchor="middle">[OFERTA]</text></svg>`,
      "Dicas de Uso": "Feed: 1080x1350 (4:5). Reels: 1080x1920 (9:16). Poste como imagem ou capa de video.",
    }
  },
  card_oferta: (_, __, p) => {
    const c = getPaletteColors(p?.paleta)
    return {
      "Card Oferta SVG": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" style="max-width:100%;width:100%;height:auto;display:block;aspect-ratio:4/5"><defs><linearGradient id="cbg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c.dark}"/><stop offset="100%" stop-color="${c.secondary}"/></linearGradient><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c.primary}"/><stop offset="100%" stop-color="${c.secondary}"/></linearGradient></defs><rect width="1080" height="1350" fill="url(#cbg)"/><rect x="30" y="30" width="1020" height="1290" rx="24" fill="none" stroke="${c.primary}" stroke-width="2" opacity="0.3"/><circle cx="540" cy="800" r="320" fill="${c.primary}" opacity="0.04"/><text x="540" y="220" font-family="'Helvetica Neue',Arial,sans-serif" font-size="32" font-weight="700" fill="${c.light}" text-anchor="middle" letter-spacing="8">OFERTA ESPECIAL</text><rect x="440" y="250" width="200" height="2" fill="${c.light}" opacity="0.5"/><text x="540" y="420" font-family="'Helvetica Neue',Arial,sans-serif" font-size="26" font-weight="400" fill="#FFFFFF" opacity="0.5" text-anchor="middle" text-decoration="line-through">DE [VALOR CHEIO]</text><text x="540" y="540" font-family="'Helvetica Neue',Arial,sans-serif" font-size="110" font-weight="800" fill="#FFFFFF" text-anchor="middle">[VALOR]</text><text x="540" y="620" font-family="Arial,sans-serif" font-size="26" font-weight="400" fill="${c.light}" text-anchor="middle">ou 12x de [PARCELA]</text><rect x="290" y="730" width="500" height="65" rx="32" fill="url(#cg)"/><text x="540" y="772" font-family="'Helvetica Neue',Arial,sans-serif" font-size="20" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">GARANTIR OFERTA</text><text x="540" y="900" font-family="Arial,sans-serif" font-size="16" fill="#FFFFFF" opacity="0.5" text-anchor="middle">Oferta por tempo limitado</text></svg>`,
      "Indicado para": "Instagram Stories, Facebook Ads, WhatsApp, E-mail Marketing",
      "Copy para Legenda": "A oferta especial do [NOME DO PRODUTO] chegou! De [VALOR CHEIO] por apenas [VALOR] à vista ou 12x de [PARCELA]. Vagas limitadas - garanta a sua agora! Link na bio.",
    }
  },
  certificado: (_, __, p) => {
    const c = getPaletteColors(p?.paleta)
    return {
      "Certificado SVG": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 842 595" width="842" height="595"><defs><linearGradient id="cborder" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c.primary}"/><stop offset="100%" stop-color="${c.light}"/></linearGradient></defs><rect width="842" height="595" fill="${c.bg}"/><rect x="15" y="15" width="812" height="565" fill="none" stroke="url(#cborder)" stroke-width="2" rx="8"/><rect x="25" y="25" width="792" height="545" fill="none" stroke="${c.light}" stroke-width="0.5" rx="6"/><circle cx="421" cy="80" r="40" fill="${c.primary}" opacity="0.1"/><text x="421" y="90" font-family="Georgia,serif" font-size="40" font-weight="bold" fill="${c.primary}" text-anchor="middle">CERTIFICADO</text><text x="421" y="130" font-family="Georgia,serif" font-size="18" fill="${c.primary}" text-anchor="middle" letter-spacing="6">DE CONCLUSÃO</text><rect x="300" y="145" width="242" height="1" fill="${c.light}"/><text x="421" y="210" font-family="'Helvetica Neue',Arial,sans-serif" font-size="14" fill="${c.secondary}" text-anchor="middle">Concedemos o presente certificado a</text><text x="421" y="280" font-family="Georgia,serif" font-size="32" font-weight="bold" fill="${c.dark}" text-anchor="middle">[NOME DO ALUNO]</text><rect x="320" y="300" width="202" height="2" fill="${c.primary}"/><text x="421" y="350" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" fill="${c.secondary}" text-anchor="middle">Por ter concluído com êxito o curso</text><text x="421" y="400" font-family="Georgia,serif" font-size="22" font-weight="bold" fill="${c.primary}" text-anchor="middle">[NOME DO CURSO]</text><text x="421" y="440" font-family="'Helvetica Neue',Arial,sans-serif" font-size="12" fill="${c.secondary}" text-anchor="middle">Carga horária: 40 horas</text><line x1="200" y1="510" x2="350" y2="510" stroke="${c.dark}" stroke-width="0.5"/><text x="275" y="530" font-family="Arial,sans-serif" font-size="10" fill="${c.secondary}" text-anchor="middle">Assinatura</text><line x1="492" y1="510" x2="642" y2="510" stroke="${c.dark}" stroke-width="0.5"/><text x="567" y="530" font-family="Arial,sans-serif" font-size="10" fill="${c.secondary}" text-anchor="middle">Data: [DATA]</text></svg>`,
      "Instruções": "Substitua os placeholders entre colchetes. O SVG pode ser salvo como imagem, impresso ou convertido para PDF diretamente no navegador.",
      "Personalização": `Adicione seu logo no canto superior esquerdo. Paleta aplicada: ${p?.paleta?.nome || "Marrom Clássico"}.`,
    }
  },
  landing: (_, __, p) => {
    const c = getPaletteColors(p?.paleta)
    return {
      "HTML Landing Page": `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>[NOME DO PRODUTO]</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}:root{--brown:${c.primary};--brown-dark:${c.secondary};--gold:${c.light};--cream:${c.bg};--dark:${c.dark};--dark2:${c.secondary};--muted:${c.secondary}}html{scroll-behavior:smooth}body{font-family:'Inter',sans-serif;color:var(--dark);background:var(--cream);line-height:1.7;overflow-x:hidden}.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,var(--dark) 0%,var(--dark2) 40%,#3D2A1A 100%);color:#fff;padding:80px 24px;text-align:center;position:relative;overflow:hidden}.hero::before{content:'';position:absolute;top:-30%;right:-20%;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(139,94,60,0.15) 0%,transparent 70%);pointer-events:none}.hero::after{content:'';position:absolute;bottom:-20%;left:-10%;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(212,184,150,0.08) 0%,transparent 70%);pointer-events:none}.hero-content{position:relative;z-index:1;max-width:760px;margin:0 auto}.badge{display:inline-block;background:rgba(139,94,60,0.2);border:1px solid rgba(139,94,60,0.4);color:var(--gold);padding:8px 20px;border-radius:50px;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;margin-bottom:32px}.hero h1{font-family:'Playfair Display',serif;font-size:clamp(36px,7vw,64px);font-weight:900;line-height:1.05;margin-bottom:24px;letter-spacing:-1.5px}.hero h1 span{color:var(--gold);display:block}.hero p{font-size:clamp(16px,2.2vw,20px);color:rgba(255,255,255,0.65);margin-bottom:40px;max-width:520px;margin-left:auto}</style></head><body><section class="hero"><div class="hero-content"><div class="badge">[TAG]</div><h1>[HEADLINE]<span>[DESTAQUE]</span></h1><p>[SUBTÍTULO]</p><a href="#oferta" style="display:inline-block;background:var(--brown);color:#fff;padding:16px 40px;border-radius:12px;font-weight:700;font-size:16px;text-decoration:none">GARANTIR ACESSO</a></div></section></body></html>`,
      "Como Usar": "Copie o HTML completo, substitua os placeholders entre colchetes []. Salve como .html e abra no navegador.",
      "Personalização": `Troque as cores pela paleta da sua marca (${c.primary}, ${c.light}, ${c.bg}). Adicione imagens reais entre as seções.`,
    }
  },
  story: () => ({
    "Slide 1 - Gancho": "Cena: Tela preta com texto gigante centralizado\nTexto na tela: 'Voce ja tentou [PROBLEMA] e nao conseguiu?'\nLocucao: tom de identificacao, pausa dramatica de 2s\nDuracao: 0-3s",
    "Slide 2 - Dor": "Cena: Close de alguem frustrado mexendo no celular\nTexto na tela: 'A maioria desiste por falta de metodo' (animacao de digitacao)\nFundo: gradiente escuro com textura sutil\nDuracao: 3-6s",
    "Slide 3 - Solucao": "Cena: Produto sendo apresentado (mockup do curso/ebook)\nTexto: 'Apresentamos o [NOME DO PRODUTO]' em fade-in\nEfeito: spotlight no produto\nDuracao: 6-10s",
    "Slide 4 - Prova": "Cena: Depoimento real em destaque com foto do aluno\nTexto: '[DEPOIMENTO]'\nFundo: claro para destacar o depoimento\nDuracao: 10-14s",
    "Slide 5 - Beneficios": "Cena: Icones aparecendo um por um\nTopicos na tela:\n  [BENEFICIO 1]\n  [BENEFICIO 2]\n  [BENEFICIO 3]\nEfeito: cada item aparece com um swipe\nDuracao: 14-20s",
    "Slide 6 - Oferta": "Cena: Card de oferta em destaque com gradiente\nPreco gigante: 'R$ [VALOR]' com line-through no preco cheio\nElemento: 'Oferta por tempo limitado'\nDuracao: 20-25s",
    "Slide 7 - CTA Final": "Cena: Botao pulsando no centro da tela\nTexto: 'VAGAS LIMITADAS - GARANTA A SUA' + 'Clique no link da bio'\nEfeito: CTA com glow pulsante\nDuracao: 25-30s",
    "Dicas de Producao": "Grave cada slide como takes separados de 3-5s. Use cortes secos. Legenda automatica no Instagram. Musica: instrumental crescente (energy up). Call to action no ultimo slide com link na bio.",
  }),
}

const LS_KEY = "ativador_dashboard"

function loadState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return fallback
    const data = JSON.parse(raw)
    return data[key] !== undefined ? data[key] : fallback
  } catch { return fallback }
}

function saveState(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(LS_KEY)
    const data = raw ? JSON.parse(raw) : {}
    data[key] = value
    localStorage.setItem(LS_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

function DashboardInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const formRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = formRef.current
    if (!el) return
    const handler = (e: KeyboardEvent) => {
      if (TAB_KEYS.has(e.key)) { e.stopPropagation(); e.stopImmediatePropagation(); e.preventDefault() }
    }
    el.addEventListener("keydown", handler, true)
    return () => el.removeEventListener("keydown", handler, true)
  }, [])
  const [steps, setSteps] = useState<StepData[]>(() => {
    const saved = loadState<Record<string, { content: Record<string, string>; generated: boolean }>>("stepsData", {})
    return INITIAL_STEPS.map(s => saved[s.id] ? { ...s, content: saved[s.id].content, generated: saved[s.id].generated } : s)
  })
  const [tom, setTom] = useState(() => loadState("tom", ""))
  const [lucro, setLucro] = useState<number>(() => { const v = loadState("lucro", 0); return typeof v === "string" ? parseFloat(v) || 0 : Number(v) || 0 })
  const [activeTab, setActiveTab] = useState(() => loadState("activeTab", "produto"))
  const [loading, setLoading] = useState<string | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<string[]>(() => loadState("expandedSteps", []))
  const [stepIdeia, setStepIdeia] = useState(() => loadState("stepIdeia", ""))
  const [nicho, setNicho] = useState(() => loadState("nicho", ""))
  const [publicoAlvo, setPublicoAlvo] = useState(() => loadState("publicoAlvo", ""))
  const [transformacao, setTransformacao] = useState(() => loadState("transformacao", ""))
  const [capaPhotoFeed, setCapaPhotoFeed] = useState<string | null>(null)
  const [capaPhotoReels, setCapaPhotoReels] = useState<string | null>(null)
  const [selectedPalette, setSelectedPalette] = useState<{ id: string; nome: string; cores: string[] } | null>(null)
  const [selectedFont, setSelectedFont] = useState<{ id: string; nome: string } | null>(null)
  const [showIdeiaForm, setShowIdeiaForm] = useState(() => loadState("showIdeiaForm", true))
  const [stepByStepMode, setStepByStepMode] = useState(false)
  const [idea, setIdea] = useState("")
  const [autoGenerating, setAutoGenerating] = useState(false)
  const [autoProgress, setAutoProgress] = useState({ current: 0, total: 0, tab: "" })
  const [showEditablePreview, setShowEditablePreview] = useState(false)
  const [editingField, setEditingField] = useState<{ stepId: string; key: string } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [newProducts, setNewProductsState] = useState<string[]>([])
  const [showNewBanner, setShowNewBanner] = useState(true)

  useEffect(() => {
    const currentIds = PRODUTOS_VALIDADOS.map(p => p.id)
    const known = getKnownProducts()
    if (known.length === 0) {
      setKnownProducts(currentIds)
    } else {
      const newOnes = currentIds.filter(id => !known.includes(id))
      if (newOnes.length > 0) {
        setNewProductsState(newOnes)
        setNewProducts(newOnes)
      } else {
        const saved = getNewProducts()
        if (saved.length > 0) setNewProductsState(saved)
      }
      setKnownProducts(currentIds)
    }
  }, [])

  const clearNewProducts = () => {
    setNewProductsState([])
    setNewProducts([])
    setShowNewBanner(false)
  }

  useEffect(() => {
    const data: Record<string, { content: Record<string, string>; generated: boolean }> = {}
    steps.forEach(s => { data[s.id] = { content: s.content, generated: s.generated } })
    saveState("stepsData", data)
  }, [steps])
  useEffect(() => { saveState("tom", tom) }, [tom])
  useEffect(() => { saveState("lucro", lucro) }, [lucro])
  useEffect(() => { saveState("activeTab", activeTab) }, [activeTab])
  useEffect(() => { saveState("expandedSteps", expandedSteps) }, [expandedSteps])
  useEffect(() => { saveState("stepIdeia", stepIdeia) }, [stepIdeia])
  useEffect(() => { saveState("nicho", nicho) }, [nicho])
  useEffect(() => { saveState("publicoAlvo", publicoAlvo) }, [publicoAlvo])
  useEffect(() => { saveState("transformacao", transformacao) }, [transformacao])
  useEffect(() => { saveState("showIdeiaForm", showIdeiaForm) }, [showIdeiaForm])

  const updateStepContent = useCallback((id: string, content: Record<string, string>) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, content, generated: true } : s))
  }, [])

  const doGenerate = useCallback(async (stepId: string, ideaText: string, tomText: string, lucroVal: number, produtoInfo?: ProdutoInfo) => {
    const enrichedIdea = [ideaText, nicho ? `Nicho: ${nicho}` : "", publicoAlvo ? `Público-alvo: ${publicoAlvo}` : "", transformacao ? `Transformação desejada: ${transformacao}` : ""].filter(Boolean).join(". ")

    const resolvedProduto = produtoInfo || (() => {
      const matched = PRODUTOS_VALIDADOS.find(p =>
        ideaText.toLowerCase().includes(p.nome.toLowerCase()) ||
        p.nome.toLowerCase().includes(ideaText.toLowerCase().split(" ")[0] || "")
      )
      return matched ? { nome: matched.nome, tag: matched.tag, descricao: matched.descricao, publico: matched.publico } : undefined
    })()

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideia: enrichedIdea, tom: tomText, lucro: lucroVal, step: stepId }),
      })
      let content: Record<string, string> | null = null
      if (res.ok) {
        const data = await res.json()
        if (data && typeof data === "object" && !data.error) content = data
      }
      if (!content) {
        const fallback = FALLBACKS[stepId]
        content = fallback ? fallback(ideaText, lucroVal, resolvedProduto) : { "Conteúdo": "Conteúdo gerado automaticamente" }
      }
      updateStepContent(stepId, content)
      return content
    } catch {
      const fallback = FALLBACKS[stepId]
      const content = fallback ? fallback(ideaText, lucroVal, resolvedProduto) : { "Conteúdo": "Conteúdo gerado (offline)" }
      updateStepContent(stepId, content)
      return content
    }
  }, [updateStepContent, nicho, publicoAlvo, transformacao])

  const handleSelectProduto = useCallback(async (ideia: string, lucroVal: number, produtoInfo?: ProdutoInfo) => {
    localStorage.removeItem(LS_KEY)
    setStepIdeia(ideia)
    setLucro(lucroVal)
    setShowIdeiaForm(false)
    setActiveTab("produto")
    setSteps(prev => prev.map(s => ({ ...s, content: {}, generated: false })))
    setExpandedSteps([])
    if (produtoInfo?.paleta) setSelectedPalette(produtoInfo.paleta)
    if (produtoInfo?.fonte) setSelectedFont(produtoInfo.fonte)

    const tomText = tom || "Persuasivo e direto"
    const allTabs = ["produto", "vendas", "operacao", "artefatos"]
    const allSteps = steps.filter(s => allTabs.includes(s.tab))
    const totalSteps = allSteps.length

    setAutoGenerating(true)
    setAutoProgress({ current: 0, total: totalSteps, tab: "" })

    let current = 0
    for (const tab of allTabs) {
      const tabSteps = steps.filter(s => s.tab === tab)
      setAutoProgress({ current, total: totalSteps, tab })
      for (const step of tabSteps) {
        current++
        setAutoProgress({ current, total: totalSteps, tab })
        setExpandedSteps(prev => prev.includes(step.id) ? prev : [...prev, step.id])
        await doGenerate(step.id, ideia, tomText, lucroVal, produtoInfo)
      }
    }
    setAutoGenerating(false)
    toast("Produto completo gerado com sucesso!")
  }, [steps, tom, doGenerate])

  const generateStep = useCallback(async (step: StepData) => {
    if (!stepIdeia && !idea) { toast("Descreva sua ideia primeiro"); return }
    const ideaText = stepIdeia || idea
    setLoading(step.id)
    try {
      await doGenerate(step.id, ideaText, tom || "Persuasivo e direto", lucro)
      setExpandedSteps(prev => prev.includes(step.id) ? prev : [...prev, step.id])
    } catch {
      toast("Erro ao gerar. Tente novamente.")
    } finally {
      setLoading(null)
    }
  }, [stepIdeia, idea, tom, lucro, doGenerate])

  useEffect(() => {
    const auto = searchParams.get("auto")
    const q = searchParams.get("ideia")

    // Handle vitrine product (selectedProductId in sessionStorage)
    if (auto === "1") {
      const productId = sessionStorage.getItem("selectedProductId")
      if (productId) {
        sessionStorage.removeItem("selectedProductId")
        const produto = PRODUTOS_VALIDADOS.find(p => p.id === productId)
        if (produto) {
          setStepIdeia(produto.ideia)
          setShowIdeiaForm(false)
          const lucroDefault = 60000
          setLucro(lucroDefault)
          setTom("Persuasivo e direto")

          setTimeout(() => {
            handleSelectProduto(produto.ideia, lucroDefault, {
              nome: produto.nome,
              tag: produto.tag,
              descricao: produto.descricao,
              publico: produto.publico
            })
          }, 300)
          return
        }
      }
    }

    // Handle direct URL with ideia param
    if (q) {
      setStepIdeia(q)
      setShowIdeiaForm(false)

      if (auto === "1") {
        const nomeParam = searchParams.get("nome")
        const tagParam = searchParams.get("tag")
        const descParam = searchParams.get("descricao")
        const pubParam = searchParams.get("publico")
        const lucroDefault = 60000
        setLucro(lucroDefault)
        setTom("Persuasivo e direto")

        const produtoInfo: ProdutoInfo | undefined = (nomeParam || descParam) ? {
          nome: nomeParam || "",
          tag: tagParam || "",
          descricao: descParam || "",
          publico: pubParam || ""
        } : undefined

        setTimeout(() => {
          handleSelectProduto(q, lucroDefault, produtoInfo)
        }, 300)
      }
    }
  }, [searchParams, handleSelectProduto])

  const handleNovoProduto = useCallback(() => {
    localStorage.removeItem(LS_KEY)
    setStepIdeia("")
    setTom("")
    setLucro(0)
    setActiveTab("produto")
    setShowIdeiaForm(true)
    setExpandedSteps([])
    setSteps(prev => prev.map(s => ({ ...s, content: {}, generated: false })))
    toast("Pronto! Comece um novo produto.")
  }, [])

  const toggleStep = useCallback((id: string) => {
    setExpandedSteps(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }, [])

  const handleExport = (step: StepData, format: "pdf" | "docx" | "md") => {
    if (format === "pdf") exportPDF(step.title, step.content)
    else if (format === "md") downloadMarkdown(step.title, step.content)
    else exportDOCX(step.title, step.content)
    toast("Exportado como " + format.toUpperCase())
  }

  const handleCapaPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, card: "feed" | "reels") => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast("Imagem muito grande (max 5MB)"); return }
    const reader = new FileReader()
    reader.onload = () => {
      if (card === "feed") setCapaPhotoFeed(reader.result as string)
      else setCapaPhotoReels(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleExportCapaPNG = (step: StepData) => {
    const filled: Record<string, string> = {}
    for (const [k, v] of Object.entries(step.content)) {
      let svg = fillVars(v, stepIdeia || idea, tom, lucro)
      const photo = k.includes("Reels") ? capaPhotoReels : capaPhotoFeed
      if (photo && svg.includes("<svg")) {
        const h = k.includes("Reels") ? 1920 : 1350
        const imgTag = `<image href="${photo}" x="0" y="0" width="1080" height="${h}" preserveAspectRatio="xMidYMid slice" opacity="0.35"/><rect width="1080" height="${h}" fill="#1A1A1A" opacity="0.45"/>`
        svg = svg.replace(/<svg([^>]*)>/, `<svg$1>${imgTag}`)
      }
      filled[k] = svg
    }
    exportPNG(step.title, filled)
  }

  const handleCopyAll = (step: StepData) => {
    const text = Object.entries(step.content)
      .map(([k, v]) => `${k}\n${v}`)
      .join("\n\n---\n\n")
    navigator.clipboard.writeText(text)
    toast("Conteúdo copiado!")
  }

  const handleGenerateAll = async (tab: string) => {
    const tabSteps = steps.filter(s => s.tab === tab && !s.generated)
    if (tabSteps.length === 0) { toast("Todos os passos já foram gerados"); return }
    if (!stepIdeia && !idea) { toast("Descreva sua ideia primeiro"); return }

    for (const step of tabSteps) {
      await generateStep(step)
    }
    toast(`Todos os passos de ${tab} foram gerados!`)

    // Auto-navegar para a próxima aba
    const tabOrder = ["produto", "vendas", "operacao", "artefatos"]
    const currentIdx = tabOrder.indexOf(tab)
    if (currentIdx < tabOrder.length - 1) {
      const nextTab = tabOrder[currentIdx + 1]
      const nextTabSteps = steps.filter(s => s.tab === nextTab)
      const nextTabIncomplete = nextTabSteps.some(s => !s.generated)
      if (nextTabIncomplete) {
        setTimeout(() => {
          setActiveTab(nextTab as typeof activeTab)
          toast(`Avançando para ${nextTab === "operacao" ? "Operação" : nextTab.charAt(0).toUpperCase() + nextTab.slice(1)}`)
        }, 1000)
      }
    }
  }

  const activeSteps = steps.filter(s => s.tab === activeTab)

  return (
    <div className="min-h-screen bg-[#F5EFE8]">
      {/* Header all devices */}
      <header className="relative px-4 py-3 sm:px-6 sm:py-4" style={{background: "linear-gradient(135deg, #6B4226 0%, #8B5E3C 40%, #A67C52 70%, #8B5E3C 100%)", zIndex: 50}}>
        <div className="absolute top-0 left-1/4 w-64 h-full bg-gradient-to-r from-[#D4B896]/20 via-[#FFD700]/10 to-transparent blur-2xl pointer-events-none" />
        <div className="absolute -top-4 right-1/3 w-48 h-16 bg-[#D4B896]/15 blur-3xl pointer-events-none" />
        <div className="max-w-[900px] mx-auto flex items-center justify-between relative z-50">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.push("/")} className="text-white/70 hover:text-white transition-colors shrink-0" style={{touchAction:'manipulation'}}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-white text-sm sm:text-base font-bold truncate">Ativador <span className="text-[#D4B896]">Automático</span></h1>
            {!showIdeiaForm && (
              <div className="flex items-center gap-1 text-white/50 text-[10px]">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden sm:inline">Salvo</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 relative z-30">
            <button
              onClick={handleNovoProduto}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
              title="Limpar e comecar novo produto"
              style={{touchAction:'manipulation'}}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Novo Produto</span>
            </button>
          </div>
        </div>
      </header>

      {/* Auto-generation overlay */}
      {autoGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#8B5E3C] to-[#6B4226] flex items-center justify-center animate-pulse">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Gerando seu produto...</h3>
            <p className="text-sm text-[#5C5146] mb-4">
              {autoProgress.tab && (
                <span className="font-semibold text-[#8B5E3C]">
                  {autoProgress.tab === "operacao" ? "Operação" : autoProgress.tab.charAt(0).toUpperCase() + autoProgress.tab.slice(1)}
                </span>
              )}
            </p>
            <div className="w-full bg-[#EDE6DC] rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-[#8B5E3C] to-[#D4A574] h-3 rounded-full transition-all duration-500"
                style={{ width: `${autoProgress.total > 0 ? (autoProgress.current / autoProgress.total) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-[#5C5146]">{autoProgress.current} de {autoProgress.total} passos</p>
          </div>
        </div>
      )}

      {/* Tabs horizontal */}
      <div className="bg-[#EDE6DC] border-b border-[#D9CEC2] sticky top-0 z-30">
        <div className="max-w-[900px] mx-auto px-2 sm:px-4">
          <Tabs value={activeTab} onValueChange={v => { if (!showIdeiaForm) setActiveTab(v) }} className="w-full">
            <TabsList className="flex w-full gap-0 bg-transparent p-0 h-auto">
              {[
                { id: "produto", label: "Produto" },
                { id: "vendas", label: "Vendas" },
                { id: "operacao", label: "Opera\u00E7\u00E3o" },
                { id: "artefatos", label: "Artefatos" },
                { id: "biblioteca", label: "Biblioteca" },
                { id: "custom", label: "Meu Produto" },
              ].map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex-1 min-w-0 text-[10px] sm:text-xs py-2.5 sm:py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#8B5E3C] data-[state=active]:bg-white data-[state=active]:text-[#8B5E3C] data-[state=active]:font-bold text-[#5C5146] hover:text-[#8B5E3C] transition-all">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Trilha de Progresso */}
      {!showIdeiaForm && (
        <TrilhaProgresso
          steps={steps}
          activeTab={activeTab}
          onTabClick={(tab) => setActiveTab(tab as typeof activeTab)}
        />
      )}

      {/* New products banner */}
      {newProducts.length > 0 && showNewBanner && activeTab !== "biblioteca" && (
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-3">
          <div className="bg-gradient-to-r from-[#8B5E3C] to-[#6B4226] rounded-xl p-3 relative overflow-hidden">
            <button onClick={clearNewProducts} className="absolute top-2 right-2 text-white/50 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-[#D4B896]" />
              <span className="text-white text-xs font-bold">{newProducts.length} novo(s) produto(s) adicionado(s)!</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
              {newProducts.map(id => {
                const p = PRODUTOS_VALIDADOS.find(pr => pr.id === id)
                if (!p) return null
                return (
                  <button
                    key={p.id}
                    onClick={() => { setActiveTab("biblioteca"); clearNewProducts() }}
                    className="flex-shrink-0 w-32 bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-all text-left"
                  >
                    <div className="w-full aspect-square rounded-md overflow-hidden mb-1.5" dangerouslySetInnerHTML={{ __html: sanitizeSvg(gerarCoverSvg(p)) }} />
                    <p className="text-[9px] text-white font-bold leading-tight line-clamp-2">{p.nome}</p>
                    <p className="text-[8px] text-[#D4B896] uppercase">{p.tag}</p>
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => { setActiveTab("biblioteca"); clearNewProducts() }}
              className="mt-2 text-[10px] text-[#D4B896] font-semibold hover:text-white transition-colors"
            >
              Ver todos na Biblioteca
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-[900px] mx-auto p-4 sm:p-6 space-y-4">

        {/* Ideia Form */}
        {showIdeiaForm && (
          <div ref={formRef}>
          <Card className="border-[#D9CEC2]">
            <CardContent className="p-4 sm:p-6 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Sua Ideia</label>
                <Textarea
                  placeholder="Descreva o conhecimento, habilidade ou paixão que quer transformar em produto..."
                  value={stepIdeia}
                  onChange={e => setStepIdeia(e.target.value)}
                  onKeyDown={e => e.stopPropagation()}
                  className="mt-1 min-h-[140px] text-sm leading-relaxed resize-y"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Nicho</label>
                  <Input
                    placeholder="Ex: Saúde, Finanças, Relacionamentos..."
                    value={nicho}
                    onChange={e => setNicho(e.target.value)}
                    onKeyDown={e => e.stopPropagation()}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Público-Alvo</label>
                  <Input
                    placeholder="Ex: Mães empreendedoras, Jovens 18-25..."
                    value={publicoAlvo}
                    onChange={e => setPublicoAlvo(e.target.value)}
                    onKeyDown={e => e.stopPropagation()}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Transformação</label>
                <Textarea
                  placeholder="Qual a transformacao real que este produto entrega? (Ex: De frustrada com dietas para confiante e saudavel)"
                  value={transformacao}
                  onChange={e => setTransformacao(e.target.value)}
                  onKeyDown={e => e.stopPropagation()}
                  className="mt-1 min-h-[70px] text-sm resize-y"
                />
                <p className="text-[10px] text-[#A67C52] mt-1">Em dúvida? Consulte o Ativador no canto inferior direito</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Tom / Comunicação</label>
                <Input
                  placeholder="Ex: Comunicação simples, feminina e prática"
                  value={tom}
                  onChange={e => setTom(e.target.value)}
                  onKeyDown={e => e.stopPropagation()}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Lucro Desejado</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#5C5146] font-semibold">R$</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={lucro > 0 ? lucro.toLocaleString("pt-BR") : ""}
                    onChange={e => {
                      const raw = e.target.value.replace(/\./g, "").replace(",", ".")
                      const num = parseFloat(raw) || 0
                      setLucro(Math.round(num))
                    }}
                    onKeyDown={e => e.stopPropagation()}
                    className="pl-8"
                    placeholder="Quanto quer ganhar? (ex: 10.000)"
                  />
                </div>
                <Conversor moeda="BRL" valor={lucro} />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStepIdeia("")
                    setNicho("")
                    setPublicoAlvo("")
                    setTransformacao("")
                    setTom("")
                    setLucro(0)
                    setSteps(prev => prev.map(s => ({ ...s, content: {}, generated: false })))
                    setExpandedSteps([])
                    localStorage.removeItem(LS_KEY)
                    toast("Ideia apagada.")
                  }}
                  className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  Apagar Ideia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!stepIdeia.trim()) {
                      toast("Descreva sua ideia primeiro")
                      return
                    }
                    setShowIdeiaForm(false)
                    toast("Ideia guardada! Agora gere os passos abaixo.")
                  }}
                  className="text-xs"
                >
                  Ok, guardar ideia
                </Button>
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {!showIdeiaForm && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-xs text-[#5C5146]">
              <strong>Ideia:</strong> {stepIdeia.slice(0, 80)}...
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const generatedSteps = steps.filter(s => s.generated)
                  if (generatedSteps.length === 0) { toast("Gere pelo menos um passo primeiro"); return }
                  setShowEditablePreview(true)
                }}
                className="text-xs border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
              >
                Publicar Pagina de Vendas
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowIdeiaForm(true)} className="text-xs text-[#8B5E3C]">
                Editar
              </Button>
            </div>
          </div>
        )}

        {/* Tabs content */}
        <Tabs value={activeTab} onValueChange={v => { if (!showIdeiaForm) setActiveTab(v) }} className="w-full">
          {["produto", "vendas", "operacao", "artefatos"].map(tab => (
            <TabsContent key={tab} value={tab} className="mt-3 space-y-2">
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-[#8B5E3C] hover:bg-[#6B4226] text-white font-semibold text-sm btn-glow-primary"
                  onClick={() => handleGenerateAll(tab)}
                  disabled={loading !== null}
                >
                  <Rocket className="w-4 h-4" />
                  {loading ? "Gerando..." : "Gerar Todos os Passos"}
                </Button>
                <Button
                  variant={stepByStepMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStepByStepMode(!stepByStepMode)}
                  className={`text-xs ${stepByStepMode ? "bg-[#6B4226] text-white" : "border-[#8B5E3C] text-[#8B5E3C]"}`}
                >
                  {stepByStepMode ? "Modo Lista" : "Passo a Passo"}
                </Button>
              </div>

              {(() => {
                const tabSteps = steps.filter(s => s.tab === tab)
                const firstIncompleteIdx = tabSteps.findIndex(s => !s.generated)
                const visibleSteps = stepByStepMode
                  ? tabSteps.filter((_, idx) => idx <= firstIncompleteIdx || tabSteps[idx].generated)
                  : tabSteps

                return visibleSteps.map((step, tabIdx) => {
                  const actualIdx = tabSteps.indexOf(step)
                  const isCurrentInStepMode = stepByStepMode && actualIdx === firstIncompleteIdx

                return (
                <Card key={step.id} className={`step-card-glass overflow-hidden transition-all ${step.generated ? "border-green-300 bg-green-50/30" : ""} ${isCurrentInStepMode ? "ring-2 ring-[#8B5E3C] ring-offset-2" : ""}`}>
                  <div
                    className="flex items-center gap-3 p-3 sm:p-4 cursor-pointer hover:bg-white/50 transition-colors select-none"
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-md transition-all ${
                      step.generated
                        ? "bg-green-500 text-white"
                        : isCurrentInStepMode
                          ? "bg-[#8B5E3C] text-white animate-pulse"
                          : "bg-gradient-to-br from-[#8B5E3C] to-[#6B4226] text-white"
                    }`}>
                      {step.generated ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        actualIdx + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
                        {step.icon}
                        <span className="text-sm font-semibold text-[#1A1A1A]">{step.title}</span>
                        {!step.generated && (
                          <div className="group relative">
                            <button className="text-[#A67C52] hover:text-[#8B5E3C] transition-colors" onClick={e => e.stopPropagation()}>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <div className="absolute left-0 top-full mt-1 w-56 p-2 bg-[#1A1A1A] text-white text-[10px] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                              <p className="font-bold mb-1">Dica:</p>
                              <p>{getStepGuide(step.id)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[#5C5146] mt-0.5">{step.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {step.generated && <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">Pronto</Badge>}
                      {expandedSteps.includes(step.id) ? <ChevronDown className="w-4 h-4 text-[#5C5146]" /> : <ChevronRight className="w-4 h-4 text-[#5C5146]" />}
                    </div>
                  </div>

                  {expandedSteps.includes(step.id) && (
                    <div className="border-t border-[#D9CEC2] p-4 space-y-3 animate-in step-card-enter">
                      {!step.generated ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-[#5C5146] mb-3">Clique em gerar para criar o conteudo</p>
                          <Button
                            className="bg-[#8B5E3C] hover:bg-[#6B4226] text-white btn-glow-primary"
                            onClick={() => generateStep(step)}
                            disabled={loading === step.id}
                          >
                            <Play className="w-4 h-4" />
                            {loading === step.id ? "Gerando..." : "Gerar " + step.title}
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            {Object.entries(step.content).map(([key, value]) => {
                              if (key === "Video") return null
                              const filled = sanitizeText(fillVars(value, stepIdeia || idea, tom, lucro))
                              const isSVG = filled.startsWith("<svg")
                              const isHTML = filled.includes("<!DOCTYPE") || filled.includes("<html") || (filled.includes("<style") && filled.includes("<body")) || (filled.includes("<div") && filled.includes("font-family") && filled.includes("padding"))
                              let svgContent = filled
                              const photo = key.includes("Reels") ? capaPhotoReels : capaPhotoFeed
                              if (isSVG && photo && step.id === "capa") {
                                const h = key.includes("Reels") ? 1920 : 1350
                                const imgTag = `<image href="${photo}" x="0" y="0" width="1080" height="${h}" preserveAspectRatio="xMidYMid slice" opacity="0.35"/><rect width="1080" height="${h}" fill="#1A1A1A" opacity="0.45"/>`
                                svgContent = svgContent.replace(/<svg([^>]*)>/, `<svg$1>${imgTag}`)
                              }
                              const safeSvg = isSVG ? sanitizeSvg(svgContent) : svgContent
                              const isEditing = editingField?.stepId === step.id && editingField?.key === key
                              return (
                              <div key={key} className="bg-[#EDE6DC] border border-[#D9CEC2] rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">{key}</span>
                                  {!isSVG && !isHTML && (
                                    isEditing ? (
                                      <div className="flex gap-1">
                                        <Button size="sm" variant="ghost" className="h-5 px-1.5 text-[10px] text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => { updateStepContent(step.id, { ...step.content, [key]: editValue }); setEditingField(null); toast("Salvo!") }}>Salvar</Button>
                                        <Button size="sm" variant="ghost" className="h-5 px-1.5 text-[10px] text-[#5C5146] hover:bg-[#D9CEC2]" onClick={() => setEditingField(null)}>Cancelar</Button>
                                      </div>
                                    ) : (
                                      <Button size="sm" variant="ghost" className="h-5 px-1.5 text-[10px] text-[#8B5E3C] hover:bg-[#D9CEC2]" onClick={() => { setEditingField({ stepId: step.id, key }); setEditValue(value) }}>Editar</Button>
                                    )
                                  )}
                                </div>
                                {isSVG ? (
                                  <div className="bg-white rounded-lg p-2 flex justify-center overflow-hidden max-w-full" dangerouslySetInnerHTML={{ __html: safeSvg }} />
                                ) : isHTML ? (
                                  <div className="space-y-2">
                                    <iframe srcDoc={filled} title={key} className="w-full rounded-lg border border-[#D9CEC2]" style={{ height: "500px", background: "white" }} sandbox="allow-scripts allow-same-origin" />
                                    {isEditing ? (
                                      <div className="space-y-2">
                                        <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={e => e.stopPropagation()} className="w-full min-h-[300px] text-[11px] font-mono text-[#5C5146] bg-white border border-[#D9CEC2] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 resize-y" />
                                        <div className="flex gap-1">
                                          <Button size="sm" variant="ghost" className="h-5 px-1.5 text-[10px] text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => { updateStepContent(step.id, { ...step.content, [key]: editValue }); setEditingField(null); toast("Salvo!") }}>Salvar</Button>
                                          <Button size="sm" variant="ghost" className="h-5 px-1.5 text-[10px] text-[#5C5146] hover:bg-[#D9CEC2]" onClick={() => setEditingField(null)}>Cancelar</Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="bg-white rounded-lg p-3">
                                        <span className="text-[10px] font-bold text-[#5C5146] uppercase tracking-wider block mb-2">Codigo HTML</span>
                                        <pre className="text-[11px] text-[#5C5146] whitespace-pre-wrap break-all max-h-[300px] overflow-auto font-mono">{filled}</pre>
                                      </div>
                                    )}
                                  </div>
                                ) : isEditing ? (
                                  <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={e => e.stopPropagation()} className="w-full min-h-[150px] text-sm text-[#1A1A1A] leading-relaxed bg-white border border-[#D9CEC2] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 resize-y whitespace-pre-wrap" />
                                ) : (
                                  <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">{stripEmojis(filled)}</p>
                                )}
                              </div>
                            )})}
                          </div>

                          {step.id === "vsl" && (
                            <div className="bg-[#EDE6DC] border border-[#D9CEC2] rounded-lg p-4">
                              <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider block mb-2">Video da VSL</span>
                              {step.content["Video"] ? (
                                <div className="space-y-2">
                                  <video src={step.content["Video"]} controls className="w-full rounded-lg max-h-[300px] bg-black" style={{ aspectRatio: "16/9" }} />
                                  <Button variant="outline" size="sm" onClick={() => { const newContent = { ...step.content }; delete newContent["Video"]; updateStepContent(step.id, newContent) }} className="text-xs text-red-500">Remover Video</Button>
                                </div>
                              ) : (
                                <div className="border-2 border-dashed border-[#D9CEC2] rounded-lg p-6 text-center cursor-pointer hover:border-[#8B5E3C] transition-colors" onClick={() => { const input = document.createElement("input"); input.type = "file"; input.accept = "video/*"; input.onchange = (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return; if (file.size > 100 * 1024 * 1024) { toast("Video muito grande. Maximo 100MB."); return }; const reader = new FileReader(); reader.onload = () => { updateStepContent(step.id, { ...step.content, Video: reader.result as string }) }; reader.readAsDataURL(file) }; input.click() }}>
                                  <Play className="w-8 h-8 text-[#A67C52] mx-auto mb-2" />
                                  <p className="text-sm text-[#5C5146] font-medium">Clique para fazer upload do video</p>
                                  <p className="text-xs text-[#A67C52] mt-1">MP4, WebM   maximo 100MB</p>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => handleCopyAll(step)} className="text-xs"><Copy className="w-3 h-3" /> Copiar</Button>
                            <Button variant="outline" size="sm" onClick={() => generateStep(step)} className="text-xs" disabled={loading === step.id}><RefreshCw className="w-3 h-3" /> Regenerar</Button>
                            <Button variant="outline" size="sm" onClick={() => handleExport(step, "pdf")} className="text-xs"><FileText className="w-3 h-3" /> PDF</Button>
                            <Button variant="outline" size="sm" onClick={() => handleExport(step, "docx")} className="text-xs"><FileDown className="w-3 h-3" /> DOCX</Button>
                            <Button variant="outline" size="sm" onClick={() => handleExport(step, "md")} className="text-xs"><Download className="w-3 h-3" /> MD</Button>
                            {Object.values(step.content).some(v => typeof v === "string" && v.startsWith("<svg")) && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => handleExportCapaPNG(step)} className="text-xs"><Download className="w-3 h-3" /> PNG</Button>
                                <div className="w-full flex flex-wrap gap-2 mt-2">
                                  <div className="flex items-center gap-1">
                                    <label className="text-xs inline-flex items-center gap-1 px-2 py-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"><Camera className="w-3 h-3" /> Feed<input type="file" accept="image/*" className="hidden" onChange={(e) => handleCapaPhotoUpload(e, "feed")} /></label>
                                    {capaPhotoFeed && <Button variant="outline" size="sm" onClick={() => setCapaPhotoFeed(null)} className="text-xs text-red-500 px-2 py-1 h-auto"><X className="w-3 h-3" /></Button>}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <label className="text-xs inline-flex items-center gap-1 px-2 py-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"><Camera className="w-3 h-3" /> Reels<input type="file" accept="image/*" className="hidden" onChange={(e) => handleCapaPhotoUpload(e, "reels")} /></label>
                                    {capaPhotoReels && <Button variant="outline" size="sm" onClick={() => setCapaPhotoReels(null)} className="text-xs text-red-500 px-2 py-1 h-auto"><X className="w-3 h-3" /></Button>}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </Card>
                )
                })
                })()}

              {steps.filter(s => s.tab === tab).length === 0 && (
                <p className="text-center text-sm text-[#5C5146] py-8">Nenhum passo nesta aba</p>
              )}
            </TabsContent>
          ))}

          <TabsContent value="biblioteca" className="mt-3">
            <Biblioteca onSelectProduto={handleSelectProduto} />
          </TabsContent>

          <TabsContent value="custom" className="mt-3">
            <ProdutoCustom onGerar={handleSelectProduto} />
          </TabsContent>
        </Tabs>
      </div>

      {activeTab !== "artefatos" && <ChatBot ideia={stepIdeia || idea} tom={tom} lucro={lucro} steps={Object.fromEntries(steps.filter(s => s.generated).map(s => [s.id, s.content]))} />}

      {showEditablePreview && (() => {
        const generatedSteps = steps.filter(s => s.generated)
        const stepsData: Record<string, Record<string, string>> = {}
        generatedSteps.forEach(s => { stepsData[s.id] = s.content })
        const headlineContent = generatedSteps.find(s => s.id === "headline")?.content || {}
        const vslContent = generatedSteps.find(s => s.id === "vsl")?.content || {}
        const anunciosContent = generatedSteps.find(s => s.id === "anuncios")?.content || {}
        const ofertaContent = generatedSteps.find(s => s.id === "oferta")?.content || {}
        const modulosContent = generatedSteps.find(s => s.id === "modulos")?.content || {}
        const bonusContent = generatedSteps.find(s => s.id === "bonus")?.content || {}
        const entregaveisContent = generatedSteps.find(s => s.id === "entregaveis")?.content || {}

        return (
          <EditablePreview
            data={{
              headline: headlineContent,
              modulos: modulosContent,
              entregaveis: entregaveisContent,
              vsl: vslContent,
              anuncios: anunciosContent,
              oferta: ofertaContent,
              bonus: bonusContent,
              ctaLink: "#",
              ctaText: "Quero Meu Acesso Agora",
            }}
            onConfirm={async (edited) => {
              const savedSteps: Record<string, Record<string, string>> = {}
              generatedSteps.forEach(s => {
                if (s.id === "headline") savedSteps[s.id] = edited.headline
                else if (s.id === "modulos") savedSteps[s.id] = edited.modulos
                else if (s.id === "entregaveis") savedSteps[s.id] = edited.entregaveis
                else if (s.id === "vsl") savedSteps[s.id] = edited.vsl
                else if (s.id === "anuncios") savedSteps[s.id] = edited.anuncios
                else if (s.id === "oferta") savedSteps[s.id] = edited.oferta
                else if (s.id === "bonus") savedSteps[s.id] = edited.bonus
                else savedSteps[s.id] = s.content
              })
              const res = await fetch("/api/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ideia: stepIdeia || idea, tom, lucro, name: edited.headline["Headline"] || stepIdeia, ctaLink: edited.ctaLink, ctaText: edited.ctaText, steps: savedSteps }),
              })
              if (!res.ok) { const err = await res.json().catch(() => ({})); toast("Erro ao publicar: " + (err.error || res.status)); return }
              const { id } = await res.json()
              setShowEditablePreview(false)
              router.push(`/produto/preview?key=${id}`)
            }}
            onCancel={() => setShowEditablePreview(false)}
          />
        )
      })()}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5EFE8] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#D9CEC2] border-t-[#8B5E3C] rounded-full animate-spin" /></div>}>
      <DashboardInner />
    </Suspense>
  )
}