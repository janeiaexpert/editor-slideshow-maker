"use client"

import { useState, useCallback, useEffect, Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Sparkles, Copy, Download, FileText, FileDown, ChevronDown, ChevronRight,
  ArrowLeft, ShoppingCart, DollarSign, TrendingUp, Users, BarChart3,
  Mail, MessageSquare, Gift, ShieldCheck, Target, Zap, Eye,
  Image, Palette, Layout, Code, PenTool, Play, RotateCcw
} from "lucide-react"
import { exportPDF, downloadMarkdown, exportDOCX, exportPNG } from "@/lib/export"
import { sanitizeSvg } from "@/lib/security"
import { useRouter, useSearchParams } from "next/navigation"
import { ChatBot } from "@/components/chat-bot"
import { Biblioteca } from "@/components/biblioteca"
import { ProdutoCustom } from "@/components/produto-custom"
import { Conversor } from "@/components/conversor"
import { EditablePreview } from "@/components/editable-preview"

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
  { id:"headline", title:"Headline e Promessa", description:"Título, subtítulo e benefício principal", icon:<Eye className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },
  { id:"modulos", title:"Módulos do Produto", description:"Estrutura completa de conteúdo", icon:<Book className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },
  { id:"entregaveis", title:"Entregáveis", description:"O que o cliente recebe", icon:<Gift className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },
  { id:"bonus", title:"Bônus Exclusivos", description:"Extras que aumentam o valor percebido", icon:<Sparkles className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },
  { id:"vsl", title:"VSL — Script Completo", description:"Vídeo de vendas com roteiro completo", icon:<FileText className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },
  { id:"anuncios", title:"Anúncios por Plataforma", description:"Criativos para Instagram, Facebook, Google, TikTok", icon:<Target className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },
  { id:"conteudo", title:"Plano de Conteúdo", description:"14 dias de posts e roteiros", icon:<Calendar className="w-4 h-4"/>, tab:"produto", content:{}, generated:false },

  // === VENDAS TAB ===
  { id:"oferta", title:"Oferta Inteligente", description:"Precificação, garantia, escassez e CTA", icon:<DollarSign className="w-4 h-4"/>, tab:"vendas", content:{}, generated:false },
  { id:"funil", title:"Funil Inteligente", description:"Checkout, Order Bump, Upsell, Downsell", icon:<ShoppingCart className="w-4 h-4"/>, tab:"vendas", content:{}, generated:false },
  { id:"automacao", title:"Automação", description:"E-mails, WhatsApp, Recuperação de Carrinho", icon:<Mail className="w-4 h-4"/>, tab:"vendas", content:{}, generated:false },
  { id:"monetizacao", title:"Monetização", description:"Assinatura, Licenciamento, Afiliados, White Label", icon:<TrendingUp className="w-4 h-4"/>, tab:"vendas", content:{}, generated:false },

  // === OPERACAO TAB ===
  { id:"dashboard", title:"Dashboard", description:"KPIs, métricas e gráficos", icon:<BarChart3 className="w-4 h-4"/>, tab:"operacao", content:{}, generated:false },
  { id:"escala", title:"Estratégias de Escala", description:"Próximo produto, cross sell, ascensão de valor", icon:<Zap className="w-4 h-4"/>, tab:"operacao", content:{}, generated:false },

  // === ARTEFATOS TAB ===
  { id:"logo", title:"Logo SVG", description:"Logotipo profissional em SVG", icon:<Image className="w-4 h-4"/>, tab:"artefatos", content:{}, generated:false },
  { id:"capa", title:"Capa para Redes Sociais", description:"Capa Feed (4:5) e Reels/Stories (9:16)", icon:<Palette className="w-4 h-4"/>, tab:"artefatos", content:{}, generated:false },
  { id:"card_oferta", title:"Card de Oferta", description:"Card promocional para divulgação", icon:<Layout className="w-4 h-4"/>, tab:"artefatos", content:{}, generated:false },
  { id:"certificado", title:"Certificado", description:"Template de certificado de conclusão", icon:<FileText className="w-4 h-4"/>, tab:"artefatos", content:{}, generated:false },
  { id:"landing", title:"Landing Page HTML", description:"Página de captura completa em HTML/CSS", icon:<Code className="w-4 h-4"/>, tab:"artefatos", content:{}, generated:false },
  { id:"story", title:"Roteiro para Story/Reel", description:"Storyboard visual para stories", icon:<PenTool className="w-4 h-4"/>, tab:"artefatos", content:{}, generated:false },
]

function Book({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> }

function fillVars(text: string, ideia: string, tom: string, lucro: number): string {
  const words = ideia.split(" ").filter(w => w.length > 2)
  const nome = words.slice(0, 3).join(" ") || ideia.slice(0, 30)
  const headline = ideia.length > 40 ? ideia.slice(0, 40) + "..." : ideia
  const destaque = words[0] || nome
  const oferta = lucro > 0 ? `R$ ${lucro}` : "[VALOR]"
  const valorCheio = lucro > 0 ? `R$ ${Math.round(lucro * 2.5)}` : "[VALOR CHEIO]"
  const parcela = lucro > 0 ? `R$ ${Math.round(lucro / 12)}` : "[PARCELA]"
  const n = "12"
  const hoje = new Date().toLocaleDateString("pt-BR")
  const beneficios = words.slice(0, 3).map((w, i) => `${i+1}. Dominar ${w}`).join("\n")

  const map: Record<string, string> = {
    "[NOME]": nome,
    "[NOME DO PRODUTO]": nome,
    "[NOME DO CURSO]": nome,
    "[HEADLINE]": headline.toUpperCase(),
    "[HEADLINE PRINCIPAL]": headline.toUpperCase(),
    "[SUBTÍTULO]": tom || "Transforme seu conhecimento em resultados",
    "[PALAVRA DE DESTAQUE]": destaque,
    "[OFERTA]": oferta,
    "[VALOR]": lucro > 0 ? `R$ ${lucro}` : "[VALOR]",
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
    "[DESCRIÇÃO BREVE DOS MÓDULOS]": ideia.slice(0, 80) + (ideia.length > 80 ? "..." : ""),
    "[MÓDULOS HTML]": words.slice(0, 3).map((w, i) => `<div class="benefit-card"><div class="num">${i+1}</div><h3>Módulo ${i+1}</h3><p>Aprenda ${w} na prática, passo a passo.</p></div>`).join(""),
    "[VALOR COM DESCONTO]": lucro > 0 ? `R$ ${Math.round(lucro * 0.8)}` : "[VALOR COM DESCONTO]",
  }

  let result = text
  for (const [key, val] of Object.entries(map)) {
    result = result.replaceAll(key, val)
  }
  return result
}
function Calendar({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }

const FALLBACKS: Record<string, (idea: string, lucro?: number) => Record<string, string>> = {
  headline: (idea) => ({
    "Headline": "Descubra o Método Para " + idea.split(" ").slice(0,4).join(" "),
    "Subtítulo": "Um guia prático e direto ao ponto para quem quer [RESULTADO] — sem enrolação",
    "Benefício Central": idea.split(" ").slice(0,5).join(" ") + " na prática, do início ao resultado",
    "Prova Social": "[INSIRA AQUI SEUS DEPOIMENTOS E DADOS REAIS DE ALUNOS]"
  }),
  modulos: () => ({
    "Módulo 1 — Fundação": "Os princípios essenciais que ninguém te conta",
    "Módulo 2 — Estrutura": "Passo a passo lógico que elimina confusão",
    "Módulo 3 — Execução": "Protocolo diário de 15 minutos que gera resultado",
    "Módulo 4 — Otimização": "Como evitar os 3 erros mais comuns",
    "Módulo 5 — Domínio": "Técnicas avançadas para quem quer ir além"
  }),
  entregaveis: () => ({
    "Videoaulas": "[NÚMERO] videoaulas ([DURAÇÃO]) com conteúdo prático",
    "Templates": "[NÚMERO] templates editáveis prontos para usar",
    "Planilha": "Planilha de precificação com cálculo automático",
    "Comunidade": "Grupo de alunos para networking e suporte",
    "Certificado": "Certificado digital de conclusão"
  }),
  bonus: () => ({
    "Bônus 1": "Guia Rápido — PDF com [NÚMERO] páginas de resumo executivo",
    "Bônus 2": "Checklist de Implementação em [NÚMERO] Dias",
    "Bônus 3": "Grupo VIP de Alunos no Telegram",
    "Bônus 4": "Acesso Vitalício e Atualizações Futuras"
  }),
  vsl: (idea) => ({
    "Abertura": "Você já sentiu que poderia estar vivendo muito melhor?",
    "Problema": "[DESCREVA O PROBLEMA REAL DO SEU PÚBLICO]",
    "Solução": "[EXPLIQUE SUA SOLUÇÃO REAL — o que é, como funciona, por que é diferente]",
    "Prova Social": "[INSIRA DEPOIMENTOS REAIS OU DADOS VERDADEIROS DE RESULTADOS]",
    "Oferta": "Curso completo com todos os bônus por [VALOR REAL]. Garantia de 7 dias.",
    "Script Completo": "[ABERTURA] [PROBLEMA] [SOLUÇÃO] [PROVA SOCIAL REAL] [OFERTA] [CTA]"
  }),
  anuncios: () => ({
    "Instagram": "Reels de 30s mostrando o problema — Texto na tela com a promessa principal",
    "Facebook": "Carrossel de 5 slides: Problema, Solução, Prova Social, Oferta, CTA",
    "Google Ads": "Anúncio de busca com headline que atrai pelo problema",
    "TikTok": "Vídeo de 15s com dica rápida — Gancho nos primeiros 2 segundos",
    "Hook Topo": "[INSIRA O PROBLEMA REAL DO SEU PÚBLICO em forma de pergunta]",
    "Hook Meio": "[INSIRA UM DADO OU HISTÓRIA REAL DE TRANSFORMAÇÃO]",
    "Hook Fundo": "Últimas vagas com bônus exclusivos — garantia de 7 dias."
  }),
  conteudo: () => ({
    "Semana 1 — Dia 1": "Reels: Apresentação do problema que o produto resolve",
    "Semana 1 — Dia 2": "Post: Os 3 maiores mitos sobre o tema",
    "Semana 1 — Dia 3": "Carrossel: Passo a passo para começar hoje",
    "Semana 1 — Dia 4": "Reels: Depoimento de aluno",
    "Semana 1 — Dia 5": "Post: Dica rápida de implementação",
    "Semana 1 — Dia 6": "Carrossel: Antes e depois com dados",
    "Semana 1 — Dia 7": "Reels: Pergunta para engajar",
    "Semana 2 — Dia 8": "Reels: Por que 80% desiste antes de ver resultado",
    "Semana 2 — Dia 9": "Post: Frase inspiradora com CTA",
    "Semana 2 — Dia 10": "Carrossel: 7 erros que sabotam seu resultado",
    "Semana 2 — Dia 11": "Reels: Demonstração prática de uma técnica",
    "Semana 2 — Dia 12": "Post: Pergunta para gerar conversa",
    "Semana 2 — Dia 13": "Carrossel: Resumo dos aprendizados da semana",
    "Semana 2 — Dia 14": "Reels: Convite para conhecer o método completo"
  }),
  oferta: (idea, lucro) => {
    const valor = lucro && lucro > 0 ? lucro : 497
    const parcela = Math.round(valor / 12 * 100) / 100
    const valorCheio = Math.round(valor * 2)
    return {
      "Valor Ideal": `R$ ${valor} à vista ou 12x de R$ ${parcela}`,
      "Ancoragem": `De R$ ${valorCheio} por apenas R$ ${valor} — economia de 50%`,
      "Parcelamento": `12x de R$ ${parcela} sem juros no cartão. PIX com 10% de desconto.`,
      "Garantia": "7 dias de garantia incondicional. Risco zero.",
      "Escassez": "Últimas 50 vagas com acesso aos bônus exclusivos",
      "Oferta Principal": `Curso completo com todos os módulos, conteúdo exclusivo e acesso vitalício. Bônus: checklist, templates e comunidade. Tudo por R$ ${valor}. Garantia de 7 dias.`
    }
  },
  funil: () => ({
    "Checkout": "[PLATAFORMA] — taxa de [N]%. Configuração em [TEMPO].",
    "Order Bump": "[PRODUTO EXTRA] por R$ [VALOR] no checkout",
    "Upsell 1": "[NOME DO UPSELL] — [DESCRIÇÃO] por R$ [VALOR]",
    "Upsell 2": "[NOME DO UPSELL 2] por R$ [VALOR]",
    "Downsell": "Versão simplificada por R$ [VALOR] — [N]x sem juros",
    "Obrigado": "Página de agradecimento com acesso imediato e bônus liberado"
  }),
  automacao: () => ({
    "Email 1 — Boas-Vindas": "Dia 1: Link de acesso e primeiros passos",
    "Email 2 — Dica": "Dia 3: Dica de ouro para começar bem",
    "Email 3 — Case": "Dia 7: Case de aluno que transformou resultado",
    "WhatsApp": "Sequência automatizada: Dia 1 (link), Dia 4 (dica), Dia 10 (grupo VIP)",
    "Recuperação Carrinho": "Email 1 (1h): 'Você deixou algo para trás'. Email 2 (24h): depoimento real. Email 3 (72h): [N]% de desconto."
  }),
  monetizacao: () => ({
    "Assinatura": "Clube de Conteúdo — R$ [VALOR]/mês com módulo novo mensal + lives",
    "Licenciamento": "Licença Básica: R$ [VALOR]. Licença Master: R$ [VALOR] (branding próprio)",
    "Mentoria": "Mentoria Individual: [N] sessões de [TEMPO] por R$ [VALOR]",
    "Afiliados": "Programa com [N]% de comissão + bônus por performance",
    "White Label": "Revenda completa: R$ [VALOR] — todo o conteúdo sem marcação da marca"
  }),
  dashboard: () => ({
    "Receita Projetada": "R$ [VALOR]/mês — baseado em ticket médio de R$ [VALOR] e [N] vendas/mês",
    "Meta Mensal": "[N] vendas por mês — média de [N] vendas/dia",
    "Ticket Médio": "R$ [VALOR] (básico) / R$ [VALOR] (com upsell)",
    "Conversão": "[N]% a [N]% — tráfego frio / [N]% a [N]% para tráfego quente",
    "CAC": "R$ [VALOR] — CPM médio de R$ [VALOR] e conversão de [N]%",
    "ROI": "[N]% de retorno nos primeiros [N] dias",
    "ROAS": "[N]:1 — retorno sobre investimento em anúncios",
    "LTV": "R$ [VALOR] — valor médio do cliente em [N] meses"
  }),
  escala: () => ({
    "Próximo Produto": "Versão Avançada — para quem já domina o básico. Preço: R$ [VALOR]",
    "Cross Sell": "Ao comprar o básico, oferecer o avançado com [N]% de desconto",
    "Linha de Produtos": "Entry (R$ [VALOR]) → Médio (R$ [VALOR]) → Premium (R$ [VALOR])",
    "Tráfego Pago": "Aumentar orçamento em [N]% a cada [N] dias mantendo ROAS acima de [N]:1",
    "Afiliados": "Recrutar [N] super-afiliados com comissão de [N]%",
    "Recorrência": "Implementar clube de assinatura para receita recorrente"
  }),
  // === ARTEFATOS ===
  logo: () => ({
    "Logo Principal SVG": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 180" width="500" height="180"><defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8B5E3C"/><stop offset="100%" stop-color="#6B4226"/></linearGradient></defs><rect width="500" height="180" fill="#F5EFE8" rx="12"/><rect x="30" y="30" width="120" height="120" rx="20" fill="url(#lg)"/><text x="90" y="100" font-family="Georgia,serif" font-size="48" font-weight="bold" fill="#FFFFFF" text-anchor="middle">V</text><rect x="170" y="40" width="6" height="40" rx="3" fill="#D4B896"/><text x="190" y="80" font-family="'Helvetica Neue',Arial,sans-serif" font-size="36" font-weight="800" fill="#1A1A1A" letter-spacing="2">[NOME]</text><rect x="190" y="95" width="60" height="3" rx="1.5" fill="#8B5E3C"/><text x="190" y="125" font-family="'Helvetica Neue',Arial,sans-serif" font-size="14" font-weight="600" fill="#8B5E3C" letter-spacing="4" text-transform="uppercase">[SUBTÍTULO]</text></svg>`,
    "Logo Alternativo SVG": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 180" width="500" height="180"><rect width="500" height="180" fill="#1A1A1A" rx="12"/><circle cx="90" cy="90" r="50" fill="none" stroke="#8B5E3C" stroke-width="3"/><circle cx="90" cy="90" r="25" fill="#8B5E3C"/><text x="90" y="97" font-family="Georgia,serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle">V</text><text x="170" y="85" font-family="'Helvetica Neue',Arial,sans-serif" font-size="34" font-weight="700" fill="#FFFFFF" letter-spacing="3">[NOME]</text><text x="170" y="115" font-family="'Helvetica Neue',Arial,sans-serif" font-size="12" font-weight="500" fill="#D4B896" letter-spacing="5" text-transform="uppercase">[SUBTÍTULO]</text></svg>`,
    "Cores da Marca": "Primária: #8B5E3C | Secundária: #6B4226 | Fundo Claro: #F5EFE8 | Texto: #1A1A1A | Detalhe: #D4B896",
    "Usos do Logo": "Versão Principal: fundo claro, uso geral. Versão Alternativa: fundo escuro, ideal para vídeos e stories.",
  }),
  capa: () => ({
    "Feed 1080x1350 SVG": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="1080" height="1350"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1A1A1A"/><stop offset="100%" stop-color="#2D2D2D"/></linearGradient><linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8B5E3C"/><stop offset="100%" stop-color="#6B4226"/></linearGradient></defs><rect width="1080" height="1350" fill="url(#bg)"/><circle cx="-100" cy="200" r="400" fill="#8B5E3C" opacity="0.08"/><circle cx="900" cy="1000" r="500" fill="#8B5E3C" opacity="0.06"/><rect x="60" y="1150" width="960" height="150" rx="12" fill="url(#accent)" opacity="0.15"/><text x="540" y="420" font-family="'Helvetica Neue',Arial,sans-serif" font-size="88" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-1">[HEADLINE]</text><text x="540" y="500" font-family="'Helvetica Neue',Arial,sans-serif" font-size="88" font-weight="800" fill="#D4B896" text-anchor="middle" letter-spacing="-1">PRINCIPAL</text><rect x="440" y="550" width="200" height="4" rx="2" fill="#8B5E3C"/><text x="540" y="620" font-family="Arial,sans-serif" font-size="28" font-weight="400" fill="#FFFFFF" opacity="0.7" text-anchor="middle" letter-spacing="3">[SUBTÍTULO]</text><text x="540" y="1230" font-family="'Helvetica Neue',Arial,sans-serif" font-size="22" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">[NOME DO PRODUTO]</text><text x="540" y="1270" font-family="Arial,sans-serif" font-size="16" fill="#D4B896" text-anchor="middle" letter-spacing="2">[OFERTA]</text></svg>`,
    "Reels 1080x1920 SVG": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920"><defs><linearGradient id="bg2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1A1A1A"/><stop offset="100%" stop-color="#2D2D2D"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#bg2)"/><circle cx="200" cy="300" r="350" fill="#8B5E3C" opacity="0.1"/><circle cx="900" cy="1500" r="450" fill="#8B5E3C" opacity="0.08"/><rect x="40" y="1680" width="1000" height="180" rx="16" fill="#8B5E3C" opacity="0.2"/><text x="540" y="600" font-family="'Helvetica Neue',Arial,sans-serif" font-size="120" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-2">[HEADLINE]</text><text x="540" y="740" font-family="'Helvetica Neue',Arial,sans-serif" font-size="120" font-weight="800" fill="#D4B896" text-anchor="middle" letter-spacing="-2">PRINCIPAL</text><rect x="440" y="820" width="200" height="5" rx="2.5" fill="#8B5E3C"/><text x="540" y="920" font-family="Arial,sans-serif" font-size="34" font-weight="400" fill="#FFFFFF" opacity="0.7" text-anchor="middle" letter-spacing="4">[SUBTÍTULO]</text><text x="540" y="1760" font-family="'Helvetica Neue',Arial,sans-serif" font-size="28" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="5">[NOME DO PRODUTO]</text><text x="540" y="1815" font-family="Arial,sans-serif" font-size="20" fill="#D4B896" text-anchor="middle" letter-spacing="3">[OFERTA]</text></svg>`,
    "Dicas de Uso": "Feed: poste como imagem no grid. Reels: use como capa de vídeo. Instagram recomenda tamanhos mínimos de 600px.",
  }),
  card_oferta: () => ({
    "Card Oferta SVG": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="1080" height="1350"><defs><linearGradient id="cbg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1A1A1A"/><stop offset="100%" stop-color="#0D0D0D"/></linearGradient><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8B5E3C"/><stop offset="100%" stop-color="#5C3A1E"/></linearGradient></defs><rect width="1080" height="1350" fill="url(#cbg)"/><rect x="30" y="30" width="1020" height="1290" rx="24" fill="none" stroke="#8B5E3C" stroke-width="2" opacity="0.3"/><circle cx="540" cy="800" r="320" fill="#8B5E3C" opacity="0.04"/><text x="540" y="220" font-family="'Helvetica Neue',Arial,sans-serif" font-size="36" font-weight="700" fill="#D4B896" text-anchor="middle" letter-spacing="8">OFERTA ESPECIAL</text><rect x="440" y="250" width="200" height="2" fill="#D4B896" opacity="0.5"/><text x="540" y="440" font-family="'Helvetica Neue',Arial,sans-serif" font-size="28" font-weight="400" fill="#FFFFFF" opacity="0.5" text-anchor="middle" text-decoration="line-through">DE R$ [VALOR CHEIO]</text><text x="540" y="560" font-family="'Helvetica Neue',Arial,sans-serif" font-size="120" font-weight="800" fill="#FFFFFF" text-anchor="middle">R$ [VALOR]</text><text x="540" y="640" font-family="Arial,sans-serif" font-size="28" font-weight="400" fill="#D4B896" text-anchor="middle">ou [N]x de R$ [PARCELA]</text><rect x="290" y="750" width="500" height="70" rx="35" fill="url(#cg)"/><text x="540" y="795" font-family="'Helvetica Neue',Arial,sans-serif" font-size="22" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">GARANTIR OFERTA</text><text x="540" y="920" font-family="Arial,sans-serif" font-size="18" fill="#FFFFFF" opacity="0.5" text-anchor="middle">⏰ Oferta por tempo limitado</text><text x="540" y="970" font-family="Arial,sans-serif" font-size="18" fill="#FFFFFF" opacity="0.5" text-anchor="middle">✅ 7 dias de garantia incondicional</text></svg>`,
    "Indicado para": "Instagram Stories, Facebook Ads, WhatsApp, E-mail Marketing",
    "Copy para Legenda": "A oferta especial do [NOME DO PRODUTO] chegou! 🔥 De R$ [VALOR CHEIO] por apenas R$ [VALOR] à vista ou [N]x de R$ [PARCELA]. Vagas limitadas — garanta a sua agora! Link na bio.",
  }),
  certificado: () => ({
    "Certificado SVG": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 842 595" width="842" height="595"><defs><linearGradient id="cborder" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8B5E3C"/><stop offset="100%" stop-color="#D4B896"/></linearGradient></defs><rect width="842" height="595" fill="#F5EFE8"/><rect x="15" y="15" width="812" height="565" fill="none" stroke="url(#cborder)" stroke-width="2" rx="8"/><rect x="25" y="25" width="792" height="545" fill="none" stroke="#D4B896" stroke-width="0.5" rx="6"/><circle cx="421" cy="80" r="40" fill="#8B5E3C" opacity="0.1"/><text x="421" y="90" font-family="Georgia,serif" font-size="40" font-weight="bold" fill="#8B5E3C" text-anchor="middle">CERTIFICADO</text><text x="421" y="130" font-family="Georgia,serif" font-size="18" fill="#8B5E3C" text-anchor="middle" letter-spacing="6">DE CONCLUSÃO</text><rect x="300" y="145" width="242" height="1" fill="#D4B896"/><text x="421" y="210" font-family="'Helvetica Neue',Arial,sans-serif" font-size="14" fill="#5C5146" text-anchor="middle">Concedemos o presente certificado a</text><text x="421" y="280" font-family="Georgia,serif" font-size="32" font-weight="bold" fill="#1A1A1A" text-anchor="middle">[NOME DO ALUNO]</text><rect x="320" y="300" width="202" height="2" fill="#8B5E3C"/><text x="421" y="350" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" fill="#5C5146" text-anchor="middle">Por ter concluído com êxito o curso</text><text x="421" y="400" font-family="Georgia,serif" font-size="22" font-weight="bold" fill="#8B5E3C" text-anchor="middle">[NOME DO CURSO]</text><text x="421" y="440" font-family="'Helvetica Neue',Arial,sans-serif" font-size="12" fill="#5C5146" text-anchor="middle">Carga horária: [CARGA] horas</text><line x1="200" y1="510" x2="350" y2="510" stroke="#1A1A1A" stroke-width="0.5"/><text x="275" y="530" font-family="Arial,sans-serif" font-size="10" fill="#5C5146" text-anchor="middle">Assinatura</text><line x1="492" y1="510" x2="642" y2="510" stroke="#1A1A1A" stroke-width="0.5"/><text x="567" y="530" font-family="Arial,sans-serif" font-size="10" fill="#5C5146" text-anchor="middle">Data: [DATA]</text></svg>`,
    "Instruções": "Substitua os placeholders entre colchetes. O SVG pode ser salvo como imagem, impresso ou convertido para PDF diretamente no navegador.",
    "Personalização": "Adicione seu logo no canto superior esquerdo. Troque a paleta de cores para combinar com sua marca.",
  }),
  landing: () => ({
    "HTML Landing Page": `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>[NOME DO PRODUTO]</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;color:#1A1A1A;background:#F5EFE8;line-height:1.6}.hero{background:linear-gradient(135deg,#1A1A1A 0%,#2D2D2D 100%);color:#fff;padding:100px 24px;text-align:center;position:relative;overflow:hidden}.hero::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(139,94,60,0.1) 0%,transparent 50%)}.hero-content{position:relative;z-index:1;max-width:720px;margin:0 auto}.hero h1{font-size:clamp(32px,6vw,56px);font-weight:800;line-height:1.1;margin-bottom:16px;letter-spacing:-1px}.hero h1 span{color:#D4B896}.hero p{font-size:clamp(16px,2vw,20px);color:rgba(255,255,255,0.7);margin-bottom:32px;max-width:540px;margin-left:auto;margin-right:auto}.btn-primary{display:inline-block;background:linear-gradient(135deg,#8B5E3C,#6B4226);color:#fff;padding:18px 48px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:2px;text-transform:uppercase;transition:transform 0.2s,box-shadow 0.2s}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(139,94,60,0.4)}.section{padding:80px 24px;max-width:800px;margin:0 auto}.section h2{font-size:32px;font-weight:700;color:#8B5E3C;margin-bottom:12px}.section>p{color:#5C5146;margin-bottom:32px;font-size:16px}.benefits-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}.benefit-card{background:#fff;padding:28px;border-radius:12px;border:1px solid #D9CEC2;transition:border-color 0.2s,transform 0.2s}.benefit-card:hover{border-color:#8B5E3C;transform:translateY(-4px)}.benefit-card .num{width:36px;height:36px;border-radius:50%;background:#8B5E3C;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;margin-bottom:12px}.benefit-card h3{font-size:16px;font-weight:700;margin-bottom:6px}.benefit-card p{font-size:14px;color:#5C5146}.offer-section{background:linear-gradient(135deg,#1A1A1A,#2D2D2D);color:#fff;padding:80px 24px;text-align:center}.offer-box{max-width:440px;margin:0 auto;background:rgba(255,255,255,0.05);border:1px solid rgba(139,94,60,0.3);border-radius:16px;padding:48px 32px}.offer-box .old-price{color:rgba(255,255,255,0.4);text-decoration:line-through;font-size:18px}.offer-box .price{font-size:56px;font-weight:800;color:#D4B896;margin:8px 0}.offer-box .installments{color:rgba(255,255,255,0.6);font-size:16px}.offer-box ul{list-style:none;margin:24px 0;text-align:left}.offer-box ul li{padding:8px 0;font-size:14px;color:rgba(255,255,255,0.8)}.offer-box ul li::before{content:'✓';color:#4CAF50;margin-right:10px;font-weight:700}.guarantee{display:flex;align-items:center;gap:12px;justify-content:center;margin-top:24px;font-size:13px;color:rgba(255,255,255,0.5)}.footer{background:#0D0D0D;color:rgba(255,255,255,0.4);text-align:center;padding:32px 24px;font-size:12px}@media(max-width:640px){.hero{padding:60px 20px}.section{padding:48px 20px}.offer-box{padding:32px 20px}.benefits-grid{grid-template-columns:1fr}}</style></head><body><section class="hero"><div class="hero-content"><h1>[HEADLINE] <span>[PALAVRA DE DESTAQUE]</span></h1><p>[SUBTÍTULO]</p><a href="#" class="btn-primary">Quero Meu Acesso</a></div></section><section class="section"><h2>O que você vai aprender</h2><p>[DESCRIÇÃO BREVE DOS MÓDULOS]</p><div class="benefits-grid">[MÓDULOS HTML]</div></section><section class="offer-section"><div class="offer-box"><p class="old-price">De R$ [VALOR CHEIO]</p><p class="price">R$ [VALOR]</p><p class="installments">ou [N]x de R$ [PARCELA]</p><ul><li>Acesso vitalício ao conteúdo</li><li>Todas as atualizações futuras</li><li>Certificado de conclusão</li><li>Suporte via grupo VIP</li><li>7 dias de garantia incondicional</li></ul><a href="#" class="btn-primary">Garantir Minha Vaga</a><div class="guarantee">🔒 Pagamento 100% seguro</div></div></section><section class="footer"><p>© 2026 [NOME DO PRODUTO]. Todos os direitos reservados.</p></section></body></html>`,
    "Como Usar": "Copie o HTML completo, substitua os placeholders entre colchetes []. Salve como .html e abra no navegador.",
    "Personalização": "Troque as cores (#1A1A1A, #8B5E3C, #D4B896) pela paleta da sua marca. Adicione imagens reais entre as seções.",
  }),
  story: () => ({
    "Slide 1 — Gancho": "🎬 Cena: Tela preta com texto gigante centralizado\n📝 Texto na tela: 'Você já tentou [PROBLEMA] e não conseguiu?'\n🗣️ Locução: tom de identificação, pausa dramática de 2s\n⏱️ Duração: 0-3s",
    "Slide 2 — Dor": "🎬 Cena: Close de alguém frustrado mexendo no celular\n📝 Texto na tela: 'A maioria desiste por falta de método' (animação de digitação)\n🎨 Fundo: gradiente escuro com textura sutil\n⏱️ Duração: 3-6s",
    "Slide 3 — Solução": "🎬 Cena: Produto sendo apresentado (mockup do curso/ebook)\n📝 Texto: 'Apresentamos o [NOME DO PRODUTO]' em fade-in\n💡 Efeito: spotlight no produto\n⏱️ Duração: 6-10s",
    "Slide 4 — Prova": "🎬 Cena: Depoimento real em destaque com foto do aluno\n📝 Texto: '⭐ ⭐ ⭐ ⭐ ⭐ \"[DEPOIMENTO]\"'\n🎨 Fundo: claro para destacar o depoimento\n⏱️ Duração: 10-14s",
    "Slide 5 — Benefícios": "🎬 Cena: Ícones aparecendo um por um\n📝 Tópicos na tela:\n   ✅ [BENEFÍCIO 1]\n   ✅ [BENEFÍCIO 2]\n   ✅ [BENEFÍCIO 3]\n✨ Efeito: cada item aparece com um swipe\n⏱️ Duração: 14-20s",
    "Slide 6 — Oferta": "🎬 Cena: Card de oferta em destaque com gradiente\n📝 Preço gigante: 'R$ [VALOR]' com line-through no preço cheio\n🔥 Elemento: foguinho + 'Oferta por tempo limitado'\n⏱️ Duração: 20-25s",
    "Slide 7 — CTA Final": "🎬 Cena: Botão pulsando no centro da tela\n📝 Texto: 'VAGAS LIMITADAS — GARANTA A SUA' + 'Clique no link da bio'\n💡 Efeito: CTA com glow pulsante\n⏱️ Duração: 25-30s",
    "Dicas de Produção": "Grave cada slide como takes separados de 3-5s. Use cortes secos. Legenda automática no Instagram. Música: instrumental crescente (energy up). Call to action no último slide com link na bio.",
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
  const [steps, setSteps] = useState<StepData[]>(() => {
    const saved = loadState<Record<string, { content: Record<string, string>; generated: boolean }>>("stepsData", {})
    return INITIAL_STEPS.map(s => saved[s.id] ? { ...s, content: saved[s.id].content, generated: saved[s.id].generated } : s)
  })
  const [tom, setTom] = useState(() => loadState("tom", ""))
  const [lucro, setLucro] = useState(() => loadState("lucro", 0))
  const [activeTab, setActiveTab] = useState(() => loadState("activeTab", "produto"))
  const [loading, setLoading] = useState<string | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<string[]>(() => loadState("expandedSteps", []))
  const [stepIdeia, setStepIdeia] = useState(() => loadState("stepIdeia", ""))
  const [showIdeiaForm, setShowIdeiaForm] = useState(() => loadState("showIdeiaForm", true))
  const [idea, setIdea] = useState("")
  const [showEditablePreview, setShowEditablePreview] = useState(false)

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
  useEffect(() => { saveState("showIdeiaForm", showIdeiaForm) }, [showIdeiaForm])

  const updateStepContent = useCallback((id: string, content: Record<string, string>) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, content, generated: true } : s))
  }, [])

  const doGenerate = useCallback(async (stepId: string, ideaText: string, tomText: string, lucroVal: number) => {
    setLoading(stepId)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideia: ideaText, tom: tomText, lucro: lucroVal, step: stepId }),
      })
      let content: Record<string, string> | null = null
      if (res.ok) {
        const data = await res.json()
        if (data && typeof data === "object" && !data.error) content = data
      }
      if (!content) {
        const fallback = FALLBACKS[stepId]
        content = fallback ? fallback(ideaText, lucroVal) : { "Conteúdo": "Conteúdo gerado automaticamente" }
      }
      updateStepContent(stepId, content)
      return content
    } catch {
      const fallback = FALLBACKS[stepId]
      const content = fallback ? fallback(ideaText, lucroVal) : { "Conteúdo": "Conteúdo gerado (offline)" }
      updateStepContent(stepId, content)
      return content
    } finally {
      setLoading(null)
    }
  }, [updateStepContent])

  const handleSelectProduto = useCallback(async (ideia: string, lucroVal: number) => {
    localStorage.removeItem(LS_KEY)
    setStepIdeia(ideia)
    setLucro(lucroVal)
    setShowIdeiaForm(false)
    setActiveTab("produto")
    setSteps(prev => prev.map(s => ({ ...s, content: {}, generated: false })))
    setExpandedSteps([])
    toast("Produto selecionado! Gerando conteúdo...")

    const tomText = tom || "Persuasivo e direto"
    const produtoSteps = steps.filter(s => s.tab === "produto")
    for (const step of produtoSteps) {
      setExpandedSteps(prev => prev.includes(step.id) ? prev : [...prev, step.id])
      await doGenerate(step.id, ideia, tomText, lucroVal)
    }
    toast("Produto modelado com sucesso!")
  }, [steps, tom, doGenerate])

  const generateStep = useCallback(async (step: StepData) => {
    if (!stepIdeia && !idea) { toast("Descreva sua ideia primeiro"); return }
    const ideaText = stepIdeia || idea
    setLoading(step.id)
    await doGenerate(step.id, ideaText, tom || "Persuasivo e direto", lucro)
    setExpandedSteps(prev => prev.includes(step.id) ? prev : [...prev, step.id])
    toast("Conteúdo gerado com sucesso!")
  }, [stepIdeia, idea, tom, lucro, doGenerate])

  useEffect(() => {
    const q = searchParams.get("ideia")
    if (q) {
      setStepIdeia(q)
      setShowIdeiaForm(false)
    }
  }, [searchParams])

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
  }

  const activeSteps = steps.filter(s => s.tab === activeTab)

  return (
    <div className="min-h-screen bg-[#F5EFE8]">
      {/* Topbar */}
      <header className="bg-[#8B5E3C] px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-[800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white text-sm font-bold">Ativador <span className="text-[#D4B896]">Automático</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNovoProduto}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
              title="Limpar e começar novo produto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Novo Produto
            </button>
            <Badge className="bg-white text-[#8B5E3C] text-[10px] font-semibold">
              {activeTab === "produto" ? "Produto" : activeTab === "vendas" ? "Vendas" : activeTab === "artefatos" ? "Artefatos" : activeTab === "custom" ? "Meu Produto" : activeTab === "biblioteca" ? "Biblioteca" : "Operação"}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-[800px] mx-auto p-4 sm:p-6 space-y-4">

        {/* Ideia Form */}
        {showIdeiaForm && (
          <Card className="border-[#D9CEC2]">
            <CardContent className="p-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Sua Ideia</label>
                <Textarea
                  placeholder="Descreva o conhecimento, habilidade ou paixão que quer transformar em produto..."
                  value={stepIdeia}
                  onChange={e => setStepIdeia(e.target.value)}
                  className="mt-1 min-h-[80px]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Tom / Comunicação</label>
                <Input
                  placeholder="Ex: Comunicação simples, feminina e prática"
                  value={tom}
                  onChange={e => setTom(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">Lucro Desejado</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#5C5146] font-semibold">R$</span>
                  <Input
                    type="number"
                    value={lucro || ""}
                    onChange={e => setLucro(e.target.value === "" ? 0 : Number(e.target.value))}
                    className="pl-8"
                    placeholder="Quanto quer ganhar? (ex: 10000)"
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
                  onClick={() => setShowIdeiaForm(false)}
                  className="text-xs"
                >
                  Ok, guardar ideia
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!showIdeiaForm && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#5C5146]">
              <strong>Ideia:</strong> {stepIdeia.slice(0, 60)}...
            </p>
            <div className="flex items-center gap-2">
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
                Publicar Página de Vendas
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowIdeiaForm(true)} className="text-xs text-[#8B5E3C]">
                Editar
              </Button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#EDE6DC] flex flex-wrap gap-0">
            <TabsTrigger value="produto" className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5E3C] flex-1 min-w-0">
              Produto
            </TabsTrigger>
            <TabsTrigger value="vendas" className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5E3C] flex-1 min-w-0">
              Vendas
            </TabsTrigger>
            <TabsTrigger value="operacao" className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5E3C] flex-1 min-w-0">
              Operação
            </TabsTrigger>
            <TabsTrigger value="artefatos" className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5E3C] flex-1 min-w-0">
              Artefatos
            </TabsTrigger>
            <TabsTrigger value="biblioteca" className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5E3C] flex-1 min-w-0">
              Biblioteca
            </TabsTrigger>
            <TabsTrigger value="custom" className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5E3C] flex-1 min-w-0">
              Meu Produto
            </TabsTrigger>
          </TabsList>

          {["produto", "vendas", "operacao", "artefatos"].map(tab => (
            <TabsContent key={tab} value={tab} className="mt-3 space-y-2">
              {/* Generate All Button */}
              <Button
                className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] text-white font-semibold text-sm"
                onClick={() => handleGenerateAll(tab)}
                disabled={loading !== null}
              >
                <Sparkles className="w-4 h-4" />
                {loading ? "Gerando..." : `Gerar Todos os Passos`}
              </Button>

              {/* Steps */}
              {activeSteps.map((step) => (
                <Card key={step.id} className="border-[#D9CEC2] overflow-hidden">
                  <div
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#EDE6DC]/50 transition-colors select-none"
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {steps.indexOf(step) + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {step.icon}
                        <span className="text-sm font-semibold text-[#1A1A1A]">{step.title}</span>
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
                          <p className="text-sm text-[#5C5146] mb-3">Clique em gerar para criar o conteúdo</p>
                          <Button
                            className="bg-[#8B5E3C] hover:bg-[#6B4226] text-white"
                            onClick={() => generateStep(step)}
                            disabled={loading === step.id}
                          >
                            <Sparkles className="w-4 h-4" />
                            {loading === step.id ? "Gerando..." : "Gerar " + step.title}
                          </Button>
                        </div>
                      ) : (
                        <>
                          {/* Content */}
                          <div className="space-y-2">
                            {Object.entries(step.content).map(([key, value]) => {
                              if (key === "Video") return null
                              const filled = fillVars(value, stepIdeia || idea, tom, lucro)
                              const isSVG = filled.startsWith("<svg")
                              return (
                              <div key={key} className="bg-[#EDE6DC] border border-[#D9CEC2] rounded-lg p-3">
                                <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider block mb-1">{key}</span>
                                {isSVG ? (
                                  <div className="bg-white rounded-lg p-2 flex justify-center overflow-hidden" dangerouslySetInnerHTML={{ __html: sanitizeSvg(filled) }} />
                                ) : (
                                  <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">{filled}</p>
                                )}
                              </div>
                            )})}
                          </div>

                          {/* Video Upload — VSL only */}
                          {step.id === "vsl" && (
                            <div className="bg-[#EDE6DC] border border-[#D9CEC2] rounded-lg p-4">
                              <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider block mb-2">Vídeo da VSL</span>
                              {step.content["Video"] ? (
                                <div className="space-y-2">
                                  <video
                                    src={step.content["Video"]}
                                    controls
                                    className="w-full rounded-lg max-h-[300px] bg-black"
                                    style={{ aspectRatio: "16/9" }}
                                  />
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => {
                                      const input = document.createElement("input")
                                      input.type = "file"
                                      input.accept = "video/*"
                                      input.onchange = (e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0]
                                        if (!file) return
                                        if (file.size > 100 * 1024 * 1024) { toast("Vídeo muito grande. Máximo 100MB."); return }
                                        const reader = new FileReader()
                                        reader.onload = () => {
                                          const newContent = { ...step.content, Video: reader.result as string }
                                          updateStepContent(step.id, newContent)
                                        }
                                        reader.readAsDataURL(file)
                                      }
                                      input.click()
                                    }} className="text-xs">
                                      Trocar Vídeo
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => {
                                      const { Video: _, ...rest } = step.content
                                      updateStepContent(step.id, rest)
                                    }} className="text-xs text-red-600 border-red-300 hover:bg-red-50">
                                      Remover Vídeo
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="border-2 border-dashed border-[#D9CEC2] rounded-lg p-6 text-center cursor-pointer hover:border-[#8B5E3C] transition-colors"
                                  onClick={() => {
                                    const input = document.createElement("input")
                                    input.type = "file"
                                    input.accept = "video/*"
                                    input.onchange = (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0]
                                      if (!file) return
                                      if (file.size > 100 * 1024 * 1024) { toast("Vídeo muito grande. Máximo 100MB."); return }
                                      const reader = new FileReader()
                                      reader.onload = () => {
                                        const newContent = { ...step.content, Video: reader.result as string }
                                        updateStepContent(step.id, newContent)
                                      }
                                      reader.readAsDataURL(file)
                                    }
                                    input.click()
                                  }}
                                >
                                  <Play className="w-8 h-8 text-[#A67C52] mx-auto mb-2" />
                                  <p className="text-sm text-[#5C5146] font-medium">Clique para fazer upload do vídeo</p>
                                  <p className="text-xs text-[#A67C52] mt-1">MP4, WebM — máximo 100MB</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => handleCopyAll(step)} className="text-xs">
                              <Copy className="w-3 h-3" /> Copiar
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => generateStep(step)} className="text-xs" disabled={loading === step.id}>
                              <Sparkles className="w-3 h-3" /> Regenerar
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleExport(step, "pdf")} className="text-xs">
                              <FileText className="w-3 h-3" /> PDF
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleExport(step, "docx")} className="text-xs">
                              <FileDown className="w-3 h-3" /> DOCX
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleExport(step, "md")} className="text-xs">
                              <Download className="w-3 h-3" /> MD
                            </Button>
                            {Object.values(step.content).some(v => typeof v === "string" && v.startsWith("<svg")) && (
                              <Button variant="outline" size="sm" onClick={() => {
                                const filled: Record<string, string> = {}
                                for (const [k, v] of Object.entries(step.content)) {
                                  filled[k] = fillVars(v, stepIdeia || idea, tom, lucro)
                                }
                                exportPNG(step.title, filled)
                              }} className="text-xs">
                                <Download className="w-3 h-3" /> PNG
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </Card>
              ))}

              {activeSteps.length === 0 && (
                <p className="text-center text-sm text-[#5C5146] py-8">Nenhum passo nesta aba</p>
              )}
            </TabsContent>
          ))}

          {/* Biblioteca Tab */}
          <TabsContent value="biblioteca" className="mt-3">
            <Biblioteca onSelectProduto={handleSelectProduto} />
          </TabsContent>

          {/* Meu Produto Tab */}
          <TabsContent value="custom" className="mt-3">
            <ProdutoCustom onGerar={handleSelectProduto} />
          </TabsContent>
        </Tabs>
      </div>
      <ChatBot ideia={stepIdeia || idea} tom={tom} lucro={lucro} steps={Object.fromEntries(steps.filter(s => s.generated).map(s => [s.id, s.content]))} />

      {/* Editable Preview Modal */}
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
                body: JSON.stringify({
                  ideia: stepIdeia || idea,
                  tom,
                  lucro,
                  name: edited.headline["Headline"] || stepIdeia,
                  ctaLink: edited.ctaLink,
                  ctaText: edited.ctaText,
                  steps: savedSteps,
                }),
              })
              if (!res.ok) { toast("Erro ao publicar"); return }

              const { id } = await res.json()
              setShowEditablePreview(false)
              toast("Página publicada! Abrindo preview...")
              setTimeout(() => window.open(`/produto/preview?key=${id}`, "_blank"), 500)
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
