export interface ArtDirection {
  style: string
  colorPsychology: string
  typography: string
  layout: string
  composition: string
  marketingPrinciple: string
  antiPatterns: string
}

const ART_DIRECTION: Record<string, ArtDirection> = {
  logo: {
    style: "Minimalista geométrico. Uma forma ícone que comunique o nicho em 0.5 segundos. Sem gradients complexos, sem sombras pesadas.",
    colorPsychology: "Marrom #8B5E3C = confiança e tradição. Dourado #D4B896 = premium e valor. Fundo claro = elegância. Use no máximo 3 cores.",
    typography: "Nome do produto em bold 36-40px. Subtítulo em light 12-14px uppercase com letter-spacing 4-6px. Hierarquia clara: nome > subtítulo.",
    layout: "Horizontal 500x180. Ícone à esquerda (80x80), texto à direita. Proporção áurea: ícone 38%, espaço 8%, texto 54%.",
    composition: "Regra dos terços: ícone no terço esquerdo, texto nos 2/3 restantes. Espaço negativo mínimo de 20px em todas as bordas.",
    marketingPrinciple: "O logo deve ser reconhecível em 3 segundos. Funciona em favicon 32x32 e em billboard. Teste: se não legível em preto e branco, simplifique.",
    antiPatterns: "NÃO use: mais de 2 fontes, efeitos 3D, gradientes com mais de 2 cores, texto curvo, sombras coloridas, ícones genéricos de banco de imagens."
  },
  capa: {
    style: "Editorial premium estilo revista. Uma imagem mental forte criada com elementos tipográficos e geométricos. Sem fotos, sem ilustrações.",
    colorPsychology: "Fundo escuro #1A1A1A = sofisticação e autoridade. Destaque dourado #D4B896 = exclusividade. Branco = clareza da mensagem.",
    typography: "Headline em 2-3 linhas, máximo 4 palavras por linha. Font-size 44-56px weight 800. Subtítulo 18-22px weight 400. Hierarquia: headline > destaque > subtítulo.",
    layout: "Feed 1080x1350: conteúdo centralizado nos 80% centrais (margem 108px cada lado). Reels 1080x1920: conteúdo no terço central vertical.",
    composition: "Ponto focal no cruzamento dos terços superiores. Elementos decorativos (círculos) em opacidade 0.03-0.06 para textura, nunca para competir com o texto.",
    marketingPrinciple: "A capa deve causar impacto em 0.3 segundos no scroll. Regra: se não entendeu a mensagem em 1 segundo, simplifique. O olhar deve ir do headline ao destaque ao subtítulo.",
    antiPatterns: "NÃO use: mais de 5 palavras no headline, font-size acima de 60px, mais de 3 elementos decorativos, bordas grossas, efeitos de texto (outline, shadow)."
  },
  card_oferta: {
    style: "Card de alta conversão estilo Black Friday. Design escuro com hierarquia de preço agressiva. O preço é o herói.",
    colorPsychology: "Fundo escuro #1A1A1A = urgência. Dourado #D4B896 = valor percebido. Branco no preço = máxima atenção. Vermelho NUNCA (gera desconfiança).",
    typography: "Preço antigo riscado: 24-28px opacity 0.5. Preço novo: 100-120px weight 800. Parcela: 22-26px. CTA: 16-18px bold uppercase letter-spacing 2px.",
    layout: "1080x1350 vertical. Preço no centro vertical. CTA a 60% da altura. Selo de garantia a 75%. Hierarquia de escaneamento: preço → parcela → CTA → garantia.",
    composition: "Triângulo visual: preço (vértice superior), CTA (vértice inferior esquerdo), garantia (vértice inferior direito). Borda sutil 2px opacidade 0.3 para definir espaço.",
    marketingPrinciple: "Ancoragem: preço antigo visível mas discreto. O preço real deve parecer uma pechincha. CTA com ação clara: 'GARANTIR', 'QUERO AGORA', não 'Comprar'.",
    antiPatterns: "NÃO use: preço sem R$, mais de 2 preços visíveis, CTA genérico ('Clique aqui'), fundo claro para oferta, mais de 1 botão de ação."
  },
  certificado: {
    style: "Clássico e institucional. Estilo diploma universitário. Serifa para autoridade, sem serifas para modernidade.",
    colorPsychology: "Fundo off-white #F5EFE8 = tradição e seriedade. Moldura marrom-dourada = prestígio. Texto escuro = legibilidade e formalidade.",
    typography: "Título 'CERTIFICADO' em Georgia 36-40px bold. Nome do aluno em Georgia 28-32px italic bold. Todo texto em letter-spacing 2-4px parâmetro.",
    layout: "842x595 (A4 landscape). Moldura dupla: externa 2px gradiente, interna 0.5px dourado. Margem interna mínima 40px. Centralizado simetricamente.",
    composition: "Simetria axial perfeita. Cabeçalho (25%), corpo central (50%), rodapé com assinaturas (25%). Selos e ornamentos equilibrados nos cantos.",
    marketingPrinciple: "O certificado é o objeto físico que valida a compra. Deve parecer que vale mais do que o curso. Acabamento premium = percepção de valor.",
    antiPatterns: "NÃO use: bordas arredondadas, fontes sans-serif no título, cores vibrantes, emojis, layout assimétrico, fundo escuro."
  },
  landing: {
    style: "SaaS moderno + editorial premium. Conversão é tudo. Cada pixel tem que empurrar para baixo.",
    colorPsychology: "Hero escuro = autoridade. Seções claras = confiabilidade. Dourado no CTA = ação. Verde NÃO (associação com 'grátis').",
    typography: "Hero headline: clamp(32px, 5vw, 56px) weight 800. Body: 16-18px weight 400 line-height 1.6. CTA: 14px bold uppercase letter-spacing 2px.",
    layout: "Mobile-first. Max-width 800px para leitura. Grid de benefícios: auto-fit minmax(240px, 1fr). Seções com padding 80px mobile, 40px.",
    composition: "F-pattern de leitura: headline à esquerda, CTA visível sem scroll. Acima da dobra: 100% da mensagem em 3 segundos. Seção de prova social antes da oferta.",
    marketingPrinciple: "Hierarquia de conversão: 1) Dor do cliente, 2) Solução (produto), 3) Prova (depoimentos), 4) Oferta (preço), 5) Ação (CTA). Nunca comece pelo preço.",
    antiPatterns: "NÃO use: slider/carrossel no hero, vídeo autoplay, pop-ups imediatos, menu complexo, mais de 1 CTA por seção, font-size abaixo 14px."
  },
  story: {
    style: " storytelling visual cinematográfico. Cada slide é um frame de um filme de 30 segundos. Ritmo: gancho 3s → tensão 6s → resolução 12s → ação 9s.",
    colorPsychology: "Slide 1-2: escuro (tensão). Slide 3-4: transição para claro (esperança). Slide 5-7: claro com destaque dourado (solução + ação).",
    typography: "Texto na tela: máximo 8 palavras por slide. Fonte bold 32-40px. Subtítulo 16-18px. Animações: fade-in 0.5s, typewriter 2s, glow 1s.",
    layout: "Stories 1080x1920. Texto sempre no terço central (y: 640-1280). Zona segura: 120px das bordas. CTA sempre nos 20% inferiores.",
    composition: "Regra dos terços: sujeito/texto no terço superior ou central. Nunca no terço inferior (botões do Instagram cobrem). Contraste mínimo 4.5:1.",
    marketingPrinciple: "Hook nos primeiros 1.5 segundos ou perdeu. Cada slide tem UMA mensagem. Transição = mudança de emoção. Último slide = única chance de CTA.",
    antiPatterns: "NÃO use: mais de 10 palavras por slide, transições lentas (>1s), texto embaixo de 120px, fundo complexo que compete com texto, mais de 3 cores."
  }
}

const UNIVERSAL_RULES = `
REGRAS UNIVERSAIS DE DESIGN PARA SVG:
1. LIMITE DE TEXTO: Máximo 8-10 palavras por elemento <text>. Se precisar de mais, quebre em múltiplos <text> com y diferentes.
2. FONT-SIZE: Máximo 60px para headlines, máximo 24px para corpos de texto em SVG.
3. ESPAÇAMENTO: Padding mínimo de 60px entre borda do viewBox e qualquer conteúdo.
4. HIERARQUIA: Apenas 1 elemento por tamanho de fonte. Não use 2 headlines do mesmo tamanho.
5. CONTRASTE: Texto claro em fundo escuro com opacity >= 0.7. Nunca abaixo de 0.5.
6. RESPONSIVIDADE: Remova width/height do <svg>. Use viewBox apenas. Adicione style="max-width:100%;height:auto;display:block".
7. PLACEHOLDERS: Use [NOME], [HEADLINE], [SUBTÍTULO], [VALOR] etc. NUNCA invente dados do produto.
8. CORES: Use apenas: #1A1A1A, #2D2D2D, #8B5E3C, #D4B896, #F5EFE8, #FFFFFF. Max 3 cores por SVG.
9. SEM EMOJIS: Nenhum emoji no SVG. Apenas texto limpo.
10. ATRIBUTOS: Use text-anchor="middle" para textos centralizados. Sempre x no centro do viewBox.
`

export function getArtDirection(assetType: string): ArtDirection | null {
  return ART_DIRECTION[assetType] || null
}

export function buildArtDirectedPrompt(
  assetType: string,
  basePrompt: string,
  productIdea: string
): string {
  const artDir = ART_DIRECTION[assetType]
  
  if (!artDir) {
    return `${basePrompt}\n\n${UNIVERSAL_RULES}`
  }

  return `VOCÊ É UM DIRETOR DE ARTE DIGITAL com 15 anos de experiência em design para produtos digitais e marketing digital.

PRODUTO: ${productIdea}

=== DIREÇÃO DE ARTE PARA ${assetType.toUpperCase()} ===

ESTILO: ${artDir.style}

PSICOLOGIA DAS CORES: ${artDir.colorPsychology}

TIPOGRAFIA: ${artDir.typography}

LAYOUT: ${artDir.layout}

COMPOSIÇÃO: ${artDir.composition}

PRINCÍPIO DE MARKETING: ${artDir.marketingPrinciple}

ANTI-PADRÕES (NUNCA FAÇA): ${artDir.antiPatterns}

${UNIVERSAL_RULES}

=== PROMPT ORIGINAL ===
${basePrompt}

=== INSTRUÇÕES FINAIS ===
Gere o conteúdo seguindo EXATAMENTE a direção de arte acima. O resultado deve parecer que foi feito por um designer profissional, não por uma IA. Cada elemento visual deve ter intenção de marketing.
`
}

export function enhanceSvgPrompt(
  assetType: string,
  basePrompt: string,
  productIdea: string
): string {
  return buildArtDirectedPrompt(assetType, basePrompt, productIdea)
}
