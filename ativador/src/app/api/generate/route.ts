import { NextRequest, NextResponse } from "next/server"
import { aiChat } from "@/lib/ai"
import { sanitizeText } from "@/lib/security"

const STEP_PROMPTS: Record<string, string> = {
  headline: `Gere headline e subtítulo ESPECÍFICOS para o produto do usuário.
Retorne APENAS um JSON com as chaves: "Headline", "Subtítulo", "Benefício Central", "Prova Social".
USE a ideia do produto para criar headlines que falem do nicho, tema e promessa específica.
Exemplo: Curso de Fotografia → "Domine a Fotografia Profissional — Método Prático Para Tirar Fotos Que Vendem"
Exemplo: Método Produtividade → "Rotina de Produtividade para Mães — Organize Seu Dia em 15 Minutos Sem Culpa"
Headline e Subtítulo: textos prontos para publicar, específicos para o nicho.
ATENÇÃO: NÃO invente números, prazos, métricas ou promessas específicas (ex: "21 dias", "8 semanas", "resultados incríveis"). Headline e subtítulo devem ser baseados APENAS no tema do produto, sem promessas quantificáveis não verificadas.
Prova Social: APENAS o texto "[INSIRA AQUI SEUS DEPOIMENTOS E DADOS REAIS DE ALUNOS]".
Não invente absolutamente nenhuma frase, depoimento, número ou dado de prova social. O valor de Prova Social deve ser exatamente o placeholder acima.`,

  modulos: `Gere 5 módulos COMPLETOS e ESPECÍFICOS para o produto do usuário.
Retorne APENAS um JSON com as chaves: "Módulo 1", "Módulo 2", "Módulo 3", "Módulo 4", "Módulo 5".
Cada chave deve conter o NOME do módulo em negrito e a DESCRIÇÃO COMPLETA do conteúdo.
Os módulos devem ser ESPECÍFICOS ao nicho e tema do produto — NÃO use módulos genéricos.
Exemplo: se o produto é "Curso de Fotografia", os módulos falam de câmera, luz, composição, edição, ensaio — NÃO "fundação, estrutura, execução".
Exemplo: se é "Método de Produtividade para Mães", os módulos falam de rotina matinal, organização com filhos, gestão de tempo, energia, planejamento semanal — NÃO genéricos.
Cada módulo deve ter entre 3-6 tópicos específicos do tema.
Não use emojis.`,

  entregaveis: `Gere 5 entregáveis ESPECÍFICOS para o produto do usuário.
Retorne APENAS um JSON com 5 chaves com nomes reais dos entregáveis.
Cada valor deve ser DESCRIÇÃO COMPLETA do entregável, específico ao nicho.
Exemplo: Curso de Fotografia → Videoaulas de técnica, Presets de edição, Templates de contrato, Checklist de ensaio, Grupo de networking.
Exemplo: Método de Produtividade → Planner semanal, Rotina matinal 15min, Lista de prioridades, Planilha de metas, Comunidade de mães.
NÃO use entregáveis genéricos como "Videoaulas", "Templates", "Planilha" sem contexto do produto.
Não use emojis.`,

  bonus: `Gere 4 bônus exclusivos ESPECÍFICOS para o produto do usuário.
Retorne APENAS um JSON com as chaves: "Bônus 1", "Bônus 2", "Bônus 3", "Bônus 4".
Cada bônus deve ser RELEVANTE e ESPECÍFICO ao nicho do produto — não genéricos.
Exemplo: Curso de Fotografia → Pack de 50 presets Lightroom, Guia de iluminação natural, Templates de proposta comercial, Acesso a comunidade de fotógrafos.
Exemplo: Método de Produtividade → E-book "Rotina Matinal de 15min", Planner para mães, Lista de apps produtivos, Grupo VIP no Telegram.
Não use emojis.`,

  vsl: `Gere um script completo de VSL (Vídeo de Vendas) ESPECÍFICO para o produto do usuário.
Retorne APENAS um JSON com as chaves: "Abertura", "Problema", "Solução", "Prova Social", "Oferta", "Script Completo".
Cada valor deve ser TEXTO FALADO COMPLETO, pronto para ler em voz alta, ESPECÍFICO ao nicho e produto.
O script completo deve unir todas as seções em texto corrido com marcações de cena.
USE A IDEIA DO PRODUTO para falar de temas, dores, desejos e objeções REAIS do público-alvo.
Exemplo: Curso de Fotografia → fale de fotos embaçadas, luz ruim, clientes insatisfeitos, equipamento caro — NÃO de "resultados" genéricos.
Exemplo: Método Produtividade para Mães → fale de rotina caótica, filhos, sono, culpa, tempo — NÃO de "produtividade" abstrata.
Não use emojis.
ATENÇÃO — Prova Social: escreva APENAS "[INSIRA AQUI SEUS DEPOIMENTOS E DADOS REAIS DE ALUNOS]". Não invente absolutamente nenhum depoimento, número, dado, frase ou história de prova social.`,

  anuncios: `Gere anúncios para múltiplas plataformas, ESPECÍFICOS para o produto do usuário.
Retorne APENAS um JSON com as chaves: "Instagram", "Facebook", "Google Ads", "TikTok", "Hook Topo", "Hook Meio", "Hook Fundo".
Cada valor deve ser TEXTO COMPLETO DO ANÚNCIO, específico ao nicho e produto, pronto para copiar e usar.
USE a ideia do produto para falar de dores, desejos e objeções REAIS do público.
Exemplo: Curso de Fotografia → fale de fotos ruins, luz ruim, clientes insatisfeitos — NÃO de "resultados" genéricos.
Exemplo: Método Produtividade → fale de rotina caótica, filhos, sono, tempo — NÃO de "produtividade" abstrata.
Não use emojis.
ATENÇÃO: Não invente números ou provas sociais falsas. Use linguagem que o usuário preenche com dados reais.`,

  conteudo: `Gere um plano de conteúdo de 30 dias COM COPY VALIDADA ESPECÍFICA PARA O PRODUTO DO USUÁRIO.
Retorne APENAS um JSON com 30 chaves: "Semana 1 — Dia 1" até "Semana 5 — Dia 30" (5 semanas de 6 dias).
Cada valor deve seguir o formato: "FORMATO: Tema — Copy completa pronta para publicar".

REGRAS CRÍTICAS:
- USE A IDEIA DO PRODUTO FORNECIDA PELO USUÁRIO como base para TODA a copy
- ADAPTE cada estrutura ao NICHO, TEMA e PROMESSA reais do produto
- NÃO USE templates genéricos — a copy deve parecer escrita PARA aquele produto específico
- Ex: se o produto é "Curso de Fotografia para Iniciantes", a copy fala de ISO, abertura, luz natural, ensaios — NÃO de "resultados" genéricos
- Ex: se o produto é "Método de Produtividade para Mães", a copy fala de rotina, filhos, tempo, energia — NÃO de "produtividade" abstrata

ESTRUTURAS DE COPY OBRIGATÓRIAS POR FORMATO (aplique AO PRODUTO ESPECÍFICO):

REELS (15-30s) — "Gancho-Retenção-CTA" adaptado ao nicho:
- 0-3s: Gancho visual + texto — pergunta/afirmação CONTRAINTUITIVA sobre o problema real do avatar
- 3-15s: Demonstração/storytelling — mostre o MÉTODO ESPECÍFICO do produto em ação ("Eu usava X, apliquei Y do [NOME DO PRODUTO], agora Z")
- 15-25s: Prova/resultado — placeholder: [INSIRA SEU PRINT/RESULTADO REAL DE ALUNO]
- 25-30s: CTA direto contextualizado ("Comenta FOTO que te mando o preset", "Link na bio pro checklist de luz")
- Legenda: Gancho curto + 3 bullets de valor ESPECÍFICOS DO NICHO + CTA + 5 hashtags do nicho

POST FEED Carrossel (5-7 slides) — "Problema-Agitação-Solução" do produto:
- Slide 1: Capa — Headline com PROMESSA ESPECÍFICA do produto + "Slide 1/7"
- Slide 2: Problema real — "O erro que a maioria comete ao tentar [OBJETIVO ESPECÍFICO DO NICHO]"
- Slide 3: Agitação — "Por que isso te faz perder [DOR REAL: tempo/dinheiro/frustração ESPECÍFICA]"
- Slide 4-5: Solução — Seu método/processo EM 3 PASSOS REAIS do produto (um por slide)
- Slide 6: Prova — [INSIRA CASE REAL: "Aluno [NOME] foi de [SITUAÇÃO A] para [RESULTADO B] em [TEMPO]"]
- Slide 7: CTA — "Quer o roteiro completo? Link na bio / Comenta [PALAVRA-CHAVE DO PRODUTO]"
- Legenda: Resumo em 3 linhas específico + CTA + hashtags do nicho

STORIES (5-7 frames) — "Engajamento-Venda" contextualizado:
- Frame 1: Enquete/Quiz diagnóstico — "Qual seu maior obstáculo em [TEMA ESPECÍFICO DO PRODUTO]?"
- Frame 2: Resultado + insight — "X% disse [RESPOSTA] — o problema real é [INSIGHT DO SEU MÉTODO]"
- Frame 3: Mini-aula — 1 dica APLICÁVEL AGORA do seu método (30s)
- Frame 4: Prova social — [INSIRA PRINT REAL DE ALUNO]
- Frame 5: Oferta suave — "Abrindo vagas para [NOME DO PRODUTO], quer prioridade? Responde SIM"
- Frame 6: Lembrete/contagem
- Frame 7: Link direto

ROTAÇÃO ESTRATÉGICA POR SEMANA (aplique temas REAIS do produto):
- Semana 1: Consciência — Problema + Mito + Primeiro passo do método
- Semana 2: Consideração — Como funciona + Bastidores + Comparação (antes/depois do método)
- Semana 3: Decisão — Objeções reais (tempo, dinheiro, "não sei começar") + Cases + Ferramentas
- Semana 4: Ação — Oferta completa + FAQ + Última chamada + Encerramento
- Semana 5: Pós-venda/Lista espera — Resultados alunos + Próxima turma + Conteúdo bônus

NÃO USE EMOJIS. NÃO INVENTE NÚMEROS/DEPOIMENTOS/MÉTRICAS. Placeholders apenas: [INSIRA SEU PRINT REAL], [INSIRA CASE REAL], [INSIRA RESULTADO REAL]. A copy deve ser ESPECÍFICA ao produto — se não souber detalhes, use termos do nicho inferidos da ideia.`,

  oferta: `Gere uma oferta completa com precificação inteligente, ESPECÍFICA para o produto do usuário.
Retorne APENAS um JSON com as chaves: "Valor Ideal", "Ancoragem", "Parcelamento", "Garantia", "Escassez", "Oferta Principal".
Cada valor deve ser TEXTO COMPLETO E PRONTO PARA PUBLICAR, contextualizado ao nicho do produto.
USE a ideia do produto para descrever o que o cliente recebe na oferta (módulos, bônus, acessos).
Não use emojis.
REGRAS DE PREÇO:
- O valor informado pelo usuário já é o preço FINAL de venda (sem desconto)
- Na Ancoragem: invente um valor cheio MAIOR (ex: se o produto vale R$ 497, Ancore de R$ 997)
- No Parcelamento: DIVIDA o valor informado por 12 para mostrar a parcela (ex: R$ 497 → 12x de R$ 41,42). NUNCA repita o valor integral como parcela
- Escreva R$ uma única vez (ex: "R$ 497", nunca "R$ R$ 497")
- Na Escassez: use números realistas (ex: 50 vagas, 100 vagas), NUNCA use o número 12
- Na Garantia: use 7 dias (padrão do mercado)
- Não invente valores numéricos diferentes do informado. Use o valor informado como base para todos os cálculos.`,

  funil: `Gere um funil de vendas completo, ESPECÍFICO para o produto do usuário.
Retorne APENAS um JSON com as chaves: "Checkout", "Order Bump", "Upsell 1", "Upsell 2", "Downsell", "Obrigado".
Cada valor deve ser TEXTO COMPLETO com plataforma, valores e estratégia, específico ao nicho.
USE a ideia do produto para sugerir order bumps, upsells e downsells RELEVANTES.
Exemplo: Curso de Fotografia → Order Bump: Pack de presets. Upsell 1: Mentoria individual. Upsell 2: Curso avançado.
Exemplo: Método Produtividade → Order Bump: Planner premium. Upsell 1: Consultoria 1:1. Upsell 2: Workshop ao vivo.
Não use emojis.`,

  automacao: `Gere uma estratégia de automação de marketing, ESPECÍFICA para o produto do usuário.
Retorne APENAS um JSON com as chaves: "Email 1 — Boas-Vindas", "Email 2 — Dica", "Email 3 — Case", "WhatsApp", "Recuperação Carrinho".
Cada valor deve ser TEXTO COMPLETO com roteiro do email ou mensagem, contextualizado ao nicho.
USE a ideia do produto para escrever emails e mensagens que falem do tema específico.
Exemplo: Curso de Fotografia → Email de boas-vindas fala de dica de luz, email de dica fala de composição.
Exemplo: Método Produtividade → Email de boas-vindas fala de rotina matinal, email de dica fala de organização.
Não use emojis.`,

  monetizacao: `Gere estratégias de monetização ESPECÍFICAS para o produto do usuário.
Retorne APENAS um JSON com as chaves: "Assinatura", "Licenciamento", "Mentoria", "Afiliados", "White Label".
Cada valor deve ser TEXTO COMPLETO com descrição do modelo e como se aplica ao nicho do produto.
USE a ideia do produto para sugerir formas de monetização relevantes.
Exemplo: Curso de Fotografia → Mentoria fotográfica, Workshop presencial, Venda de presets.
Exemplo: Método Produtividade → Consultoria para empresas, Workshop corporativo, Licenciamento do método.
Não use emojis.
ATENÇÃO: Não invente preços. Use [VALOR] como placeholder.`,

  dashboard: `Gere um dashboard de KPIs ESPECÍFICO para o produto do usuário.
Retorne APENAS um JSON com as chaves: "Receita Projetada", "Meta Mensal", "Ticket Médio", "Conversão", "CAC", "ROI", "ROAS", "LTV".
Cada valor deve ser TEXTO COMPLETO contextualizado ao nicho do produto.
Use o PREÇO informado pelo usuário (LUCRO DESEJADO) como base para TODOS os cálculos. Faça cálculos MATEMÁTICOS CORRETOS:

EXEMPLO com preço de R$ 497:
- Ticket Médio: "R$ 497 (básico) / R$ 647 com upsell e order bump"
- Meta Mensal: "10 vendas/mês = R$ 4.970 de receita"
- Receita Projetada: "R$ 4.970/mês (10 vendas x R$ 497) com potencial de R$ 6.470/mês incluindo upsells"
- CAC: "Meta: abaixo de R$ 150 (30% do preço). Calcule: investimento em anúncios / vendas fechadas"
- ROI: "Para cada R$ 1 investido, retorne R$ 3,30 (230% de lucro sobre o investimento)"
- ROAS: "Meta: 4:1 (R$ 4 de retorno para cada R$ 1 investido em anúncios)"
- LTV: "R$ 1.200 (ticket médio x 2,4 compras médias ao longo de 12 meses)"

REGRAS:
- O preço informado é o PREÇO DE VENDA do produto (não o lucro líquido)
- Ticket Médio com upsell deve ser MAIOR que o básico (ex: básico R$ 497, com upsell R$ 647)
- Receita Projetada = Meta Mensal x Ticket Médio (seja coerente entre si)
- CAC deve ser MENOR que o preço do produto (senão não há lucro)
- ROI = ((Receita - Custos) / Custos) x 100. Deve ser coerente com CAC x número de vendas
- ROAS mínimo 3:1 para produtos digitais
- LTV deve ser maior que o ticket único (considera compras recorrentes)
- NÃO invente números que não façam sentido matemático
- Não use emojis.`,

  escala: `Gere estratégias de escala ESPECÍFICAS para o produto do usuário.
Retorne APENAS um JSON com as chaves: "Próximo Produto", "Cross Sell", "Linha de Produtos", "Tráfego Pago", "Afiliados", "Recorrência".
Cada valor deve ser TEXTO COMPLETO com estratégia detalhada, específica ao nicho do produto.
USE a ideia do produto para sugerir produtos futuros, cross sells e estratégias de escala relevantes.
Exemplo: Curso de Fotografia → Próximo: Curso avançado. Cross Sell: Pack de presets. Recorrência: Clube de presets mensal.
Exemplo: Método Produtividade → Próximo: Método para empresas. Cross Sell: Consultoria. Recorrência: Assinatura com módulos novos.
Não use emojis.
ATENÇÃO: Não invente números. Use [VALOR] ou [N] como placeholder.`,

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
- Design MINIMALISTA PREMIUM, tipografia Inter + Playfair Display (serif para headlines) do Google Fonts
- Hero com GRADIENTE MULTI-CAMADA bonito: fundo escuro (#1A1A1A → #2D2D2D) + mesh gradients, radial gradients decorativos sutis, glow elegante
- Headline GRANDE (clamp 40-72px) em Playfair Display, peso 900, linha 1.0, palavra de destaque em #D4B896 com ITÁLICO
- Sub-headline em Inter, branco opacidade 0.7, tamanho clamp 18-24px, com ITÁLICO para frases-chave
- CTA pill-shaped (border-radius 9999px) com gradiente marrom (#8B5E3C → #6B4226), hover: shadow-lg + translateY(-2px) + scale(1.02)
- SEÇÃO BENEFÍCIOS/MÓDULOS: grid responsivo (auto-fit, minmax 260px), cards brancos com borda #D9CEC2, hover: sobe 8px, borda #8B5E3C, shadow-xl
- Número do benefício em círculo marrom com gradiente
- BULLET POINTS com marcadores personalizados (✓¦ ou —¢ em #D4B896) em listas
- FRASES CHAVE EM ITÁLICO (font-style: italic) para ênfase visual
- Seção de oferta escura com box centralizado (max-w 600px), preço em destaque #D4B896 clamp 36-56px, lista de itens com check verde (#22C55E)
- Selo de garantia: "Pagamento 100% seguro" + ícone de cadeado
- SEÇÃO FAQ/DÚVIDAS FREQUENTES — accordion com 6-8 perguntas REAIS baseadas no nicho do produto
- Footer escuro com direitos reservados

ANIMAÇÕES E MOTION (obrigatório — tudo deve ser SUAVE e elegante):
- Animação de entrada: fade-in-up (opacity 0 → 1, translateY 20px → 0) com stagger de 80ms entre elementos
- Duração padrão: 600ms-800ms com easing: cubic-bezier(0.25, 0.46, 0.45, 0.94) — curva suave, sem abrupto
- Hero elements: animação sequencial suave (badge 0ms → headline 200ms → subheadline 400ms → CTA 600ms → decorative 800ms)
- Mesh gradients decorativos no hero com animação float muito lenta (8-12s ease-in-out infinite) e pulse quase imperceptível (6s)
- Elementos geométricos sutis com opacity 0.03-0.06 e animação rotate/scale ultra lenta (15-20s)

ELEMENTOS 3D COM MOTION (suave e sutil):
- Parallax em camadas: background (0.3x), midground (0.6x), foreground (1.0x) — movimento quase imperceptível
- Cards com perspective(1200px) rotateX/Y no hover: máximo 3-5graus, transição 500ms ease-out
- Hero com profundidade: elementos flutuantes com blur 1-2px, movimento vertical 8-10px máximo
- Glassmorphism: backdrop-filter: blur(8px) + borda rgba(255,255,255,0.08) — efeito sutil
- Floating elements: translateY 6-8px máximo, duração 6-8s, ease-in-out
- Botões: sombra dinâmica suave, scale 1.01-1.02 no hover (não mais que isso)
- Seção de oferta: reveal suave com scale 0.98 → 1.0 e opacity 0 → 1

BOTÕES MODERNOS (suave e elegante):
- CTA Principal: gradiente #8B5E3C → #6B4226, border-radius 9999px, padding 14px 36px
- Hover: sombra 0 12px 24px rgba(139,94,60,0.2), translateY(-2px), scale(1.015)
- Transição: cubic-bezier(0.25, 0.46, 0.45, 0.94) 400ms — fluido, sem snap
- CTA Secundário (ghost): fundo transparente, borda 1.5px #D4B896, texto #D4B896
- Hover ghost: fundo rgba(212,184,150,0.15), borda #D4B896
- Botões: font-weight 600 (não 800), letter-spacing 0.5px, transição suave
- Small CTA: padding 10px 24px, font-size 13px

SCROLL EFFECTS (suave e natural):
- IntersectionObserver threshold 0.15-0.25 (ativa antes de estar totalmente visível)
- Stagger: delay incremental 60-80ms entre filhos (não mais que 100ms)
- Parallax: velocidade reduzida (0.2-0.4x), movimento máximo 30-50px
- Reveal: opacity 0 + translateY(20-30px) → estado final em 700ms ease-out
- Counter: contagem de 0 ao valor em 1.5s com ease-out (desacelera no final)
- Smooth scroll: scroll-behavior: smooth, scroll-padding-top: 80px
- FAQ accordion: max-height transition 350ms ease-out, overflow hidden
- NADA de bounce, shake, rubberband — apenas movimentos lineares e circulares suaves

CSS INTERNO COMPLETO no <style> — INCLUA:
- @keyframes: float (8s), pulse-subtle (6s), fade-in-up, slide-in, rotate-slow (20s), shimmer, glow-subtle
- .animate-on-scroll { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
- .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }
- .card-3d { transform-style: preserve-3d; transition: transform 0.5s ease-out, box-shadow 0.5s ease-out; }
- .card-3d:hover { transform: perspective(1200px) rotateY(3deg) rotateX(1.5deg) translateZ(5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
- .glass { background: rgba(255,255,255,0.06); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.08); }
- .btn-primary { background: linear-gradient(135deg, #8B5E3C, #6B4226); border-radius: 9999px; padding: 14px 36px; color: white; font-weight: 600; letter-spacing: 0.3px; transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94); box-shadow: 0 4px 12px rgba(139,94,60,0.25); }
- .btn-primary:hover { transform: translateY(-2px) scale(1.015); box-shadow: 0 12px 24px rgba(139,94,60,0.25); }
- .btn-ghost { background: transparent; border: 1.5px solid #D4B896; color: #D4B896; border-radius: 9999px; padding: 14px 36px; transition: all 0.4s ease; }
- .btn-ghost:hover { background: rgba(212,184,150,0.12); }
- .floating { animation: float 8s ease-in-out infinite; }
- @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
- .parallax-bg { will-change: transform; }
- Scrollbar personalizada: scrollbar-width thin; scrollbar-color: #8B5E3C #F5EFE8;
- Reduced motion: @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }

SEÇÕES OBRIGATÓRIAS (na ordem exata):
1. Hero (badge, headline com palavra em ITÁLICO + #D4B896, sub-headline com ITÁLICO, CTA principal + CTA secundário ghost)
2. Problema/Agitação (texto curto em ITÁLICO centralizado, max-width 600px)
3. O que você vai aprender / Benefícios (grid de 4-6 cards com números, títulos, descrições + bullet points internos)
4. Para quem é / Não é para (2 colunas com check/cross em #D4B896 / #EF4444)
5. Depoimentos — USE APENAS PLACEHOLDER: "[INSIRA DEPOIMENTOS REAIS AQUI]" com estrutura de card pronta
6. Oferta (preço tachado → preço real, parcelamento, garantia, lista do que inclui com bullets ✓¦)
7. FAQ / Dúvidas Frequentes (accordion animado, 6-8 perguntas específicas do nicho)
8. Garantia / Segurança (box com ícones de confiança)
9. CTA Final (repetição da oferta com urgência sutil)
10. Footer

COPYWRITING VALIDADO — FRAMEWORKS COMPROVADOS (use obrigatoriamente):

HEADLINE — Escolha UMA e aplique:
- PAS: Problema → Agitação → Solução
  Ex: "Cansado de Fotos Amadoras? Pare de Perder Clientes por Falta de Técnica — Domine a Fotografia em 30 Dias"
- AIDA: Atenção → Interesse → Desejo → Ação
  Ex: "A Fotografia Que Seus Clientes Esperam — Método Comprovado Para Fotos Que Vendem"
- 4U: Útil → Urgente → Único → Ultra-específico
  Ex: "Como Tirar Fotos Profissionais com Celular em 7 Dias (Método Exclusivo de 3 Passos)"
- QUEST: Qualificar → Entender → Educar → Stimular → Transicionar
  Ex: "Para Fotógrafos Iniciantes Que Querem Cobrar R$ 2.000+/Ensaio Sem Equipamento Caro"

SUB-HEADLINE — Estrutura:
[Autoridade/Credibilidade] + [Método/Mechanism Único] + [Resultado Tangível] + [Prazo Realista]
Ex: "Desenvolvido por fotógrafo com 12 anos de mercado — método 'Luz Direta' ensina você a dominar luz natural e artificial em 30 dias, garantindo ensaios que vendem sozinhos"

BENEFÍCIOS (Bullets) — Fórmula BENEFÍCIO + PROVA + CONTEXTO:
[Verbo Forte] + [Resultado Mensurável] + [Contexto/Como] + [Objeção Eliminada]
- "Capture retratos profissionais em qualquer luz — sem flash, sem estúdio, sem equipamento caro"
- "Edite 50 fotos em 15 minutos — preset pack incluso, workflow otimizado, zero retrabalho"
- "Feche ensaios a R$ 1.500+ na primeira semana — script de vendas incluso, objeções antecipadas"

OFERTA — Stack de Valor (Value Stacking):
1. Produto Principal → [Nome] — Valor Real: R$ [valor cheio = lucro x 2.5]
2. Bônus 1 → [Nome] — Valor: R$ [valor]
3. Bônus 2 → [Nome] — Valor: R$ [valor]
4. Suporte/Comunidade → Valor: R$ [valor]
5. Garantia Reversa → "Se não tiver resultado em 30 dias, devolvemos 2x seu dinheiro"
TOTAL: R$ [soma] → HOJE: R$ [lucro] (ou 12x de R$ [parcela])

ESCASSEZ REAL (escolha uma):
- "Vagas limitadas a 50 alunos por turma — suporte individual exige limite"
- "Preço sobe à meia-noite — próxima turma abre em 60 dias"
- "Bônus 'Preset Pack Pro' só para os primeiros 30 inscritos"

FAQ — Perguntas que DESARMAM OBJEÇÕES (ordem de prioridade):
1. Preço: "Por que custa R$ [valor]? → Comparação: 1 ensaio paga o curso"
2. Tempo: "Tenho pouco tempo → 15 min/dia, aulas de 10 min, acesso vitalício"
3. Suporte: "E se travar? → Comunidade ativa + plantão semanal + email prioridade"
4. Resultado: "Funciona pra mim? → Método testado por 500+ alunos, adaptável a qualquer nicho"
5. Garantia: "E se não gostar? → 30 dias incondicional + garantia reversa de resultado"
6. Pagamento: "Parcelado tem juros? → 12x sem juros no cartão, PIX à vista com 5% off"
7. Acesso: "Como recebo? → Imediato por email, área de membros vitalícia"
8. Diferencial: "Por que não YouTube grátis? → Estrutura passo a passo, suporte, certificação, community"

CTA FINAL — Fórmula:
[Verbo de Ação] + [Benefício Imediato] + [Remoção de Risco] + [Urgência Sutil]
Ex: "Garantir Minha Vaga Agora → Acesso Imediato + 30 Dias Grátis + Preset Pack (só hoje)"

SUBSTITUA TODOS OS PLACEHOLDERS por conteúdo REAL baseado na IDEIA do produto:
- [NOME DO PRODUTO] → nome real do produto
- [HEADLINE] → headline usando fórmula acima
- [PALAVRA DE DESTAQUE] → palavra-chave do nicho (em ITÁLICO + #D4B896)
- [SUBTÍTULO] → subtítulo persuasivo com ITÁLICO em frase-chave
- [PROBLEMA] → dor real do avatar
- [DESCRIÇÃO BREVE DOS MÓDULOS] → descrição dos módulos
- [MÓDULOS HTML] → cards HTML reais com títulos, descrições + 3 bullets cada
- [VALOR CHEIO], [VALOR], [N], [PARCELA] → use o LUCRO DESEJADO para calcular (valor cheio = lucro x 2.5, parcela = valor/12)
- [BENEFÍCIO 1-6] → benefícios reais com fórmula [Verbo] + [Resultado] + [Contexto]
- [PERGUNTA FAQ 1-8] → perguntas baseadas em objeções reais do nicho
- [RESPOSTA FAQ 1-8] → respostas que vendem, não apenas informam

CSS INTERNO COMPLETO no <style> — INCLUA:
- @keyframes para float, pulse, fade-in-up, slide-in, rotate-slow
- .animate-on-scroll { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.4,0,0.2,1); }
- .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }
- Classes utilitárias: .italic, .text-gold, .bg-gradient-mesh, .card-hover, .btn-primary, .btn-ghost
- Scrollbar personalizada fina
- Reduced motion: @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }

VARIAÇÃO DE LAYOUT (gere layout DIFERENTE a cada vez):
- Varie: Hero centralizado vs Hero assimétrico (texto esquerda, visual direita)
- Varie: Grid de benefícios 2/3/4 colunas, cards horizontais vs verticais
- Varie: Oferta em box centralizado vs faixa full-width com fundo gradiente
- Varie: FAQ accordion vs FAQ lado a lado (desktop)
- Varie: Decorativos: mesh gradients vs formas geométricas vs linhas fluidas
- Varie: CTA: botão único vs botão principal + botão ghost

NÃO INVENTE: números falsos, métricas, prazos específicos, depoimentos, dados de alunos, resultados quantificáveis não verificados. Use apenas placeholders claros onde dados reais são necessários.

Retorne APENAS um JSON com as chaves: "HTML Landing Page", "Como Usar", "Personalização", "Layout Usado".
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
- PROIBIDO usar emojis, smilies, ícones, ou caracteres especiais como 🔥 ✓
 💪 🎯 etc. Use apenas texto puro.

Retorne APENAS um JSON com as chaves: "Slide 1 — Gancho", "Slide 2 — Dor", "Slide 3 — Solução", "Slide 4 — Prova", "Slide 5 — Benefícios", "Slide 6 — Oferta", "Slide 7 — CTA Final", "Dicas de Produção".
SEM EMOCOS. APENAS TEXTO PURO.`,
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
      const userPrompt = `Crie conteúdo COMPLETO E PRONTO PARA PUBLICAR para o produto abaixo:

IDEIA DO PRODUTO: ${ideia}
TOM: ${tom || "Persuasivo e direto"}
LUCRO DESEJADO: R$ ${lucro || "60000"}

${systemPrompt}

REGRAS OBRIGATÓRIAS:
- USE A IDEIA ACIMA como base para TODA a copy — nicho, promessa, método, avatar, dor, desejo
- ADAPTE cada framework (PAS, AIDA, 4U, QUEST, Value Stack) AO PRODUTO ESPECÍFICO, não use templates genéricos
- Ex: se a ideia é "Curso de Fotografia para Iniciantes", a copy fala de ISO, abertura, luz natural, ensaio, preset — NÃO de "resultados" abstratos
- Ex: se a ideia é "Método Produtividade para Mães", a copy fala de rotina, filhos, tempo, energia, manhã — NÃO de "produtividade" genérica
- NÃO INVENTE números, métricas, depoimentos, prazos, resultados quantificáveis
- Placeholders APENAS onde o usuário deve inserir dados REAIS: [INSIRA SEU PRINT/RESULTADO REAL], [INSIRA CASE REAL], [INSIRA SEUS DADOS REAIS]
- Gere textos COMPLETOS, prontos para copiar e usar. Não use emojis. Não use colchetes genéricos.`

      // Try AI providers
      const result = await aiChat({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        maxTokens: 4000,
      })

      if (result) {
        const content = result.content
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
          if (step === "landing") {
            const htmlMatch = content.match(/<!DOCTYPE[\s\S]*<\/html>/i)
            if (htmlMatch) {
              return NextResponse.json({ "HTML Landing Page": htmlMatch[0], "Como Usar": "Copie o HTML e salve como .html", "Personalização": "Troque cores e placeholders", "Layout Usado": "Variável" })
            }
          }
          if (["logo", "capa", "card_oferta", "certificado"].includes(step)) {
            const svgMatches = content.match(/<svg[\s\S]*?<\/svg>/gi)
            if (svgMatches && svgMatches.length > 0) {
              const result: Record<string, string> = {}
              const svgKeys = step === "logo" ? ["Logo Principal SVG", "Logo Alternativo SVG"]
                : step === "capa" ? ["Feed SVG", "Reels SVG"]
                : step === "card_oferta" ? ["Card Oferta SVG"]
                : ["Certificado SVG"]
              svgMatches.forEach((svg: string, i: number) => {
                const key = svgKeys[i] || `SVG ${i + 1}`
                result[key] = svg
              })
              if (step === "logo") {
                result["Cores da Marca"] = "Primaria: #8B5E3C | Secundaria: #6B4226 | Fundo: #F5EFE8 | Texto: #1A1A1A | Detalhe: #D4B896"
                result["Usos do Logo"] = "Versao Principal: fundo claro. Versao Alternativa: fundo escuro."
              }
              if (step === "capa") {
                result["Dicas de Uso"] = "Feed: 1080x1350 (4:5). Reels: 1080x1920 (9:16)."
              }
              if (step === "card_oferta") {
                result["Indicado para"] = "Instagram Stories, Facebook Ads, WhatsApp"
                result["Copy para Legenda"] = "Oferta especial! Garanta sua vaga agora."
              }
              if (step === "certificado") {
                result["Instrucoes"] = "Substitua os placeholders entre colchetes."
                result["Personalizacao"] = "Adicione seu logo e troque as cores."
              }
              return NextResponse.json(result)
            }
          }
        }
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
  "plano_conteudo": { "semana_1": [{ "dia": 1, "formato": "Reels", "tema": "", "roteiro": "" }, { "dia": 2, "formato": "Feed", "tema": "", "roteiro": "" }, { "dia": 3, "formato": "Stories", "tema": "", "roteiro": "" }, { "dia": 4, "formato": "Reels", "tema": "", "roteiro": "" }, { "dia": 5, "formato": "Feed", "tema": "", "roteiro": "" }, { "dia": 6, "formato": "Stories", "tema": "", "roteiro": "" }], "semana_2": [{ "dia": 7, "formato": "Reels", "tema": "", "roteiro": "" }, { "dia": 8, "formato": "Feed", "tema": "", "roteiro": "" }, { "dia": 9, "formato": "Stories", "tema": "", "roteiro": "" }, { "dia": 10, "formato": "Reels", "tema": "", "roteiro": "" }, { "dia": 11, "formato": "Feed", "tema": "", "roteiro": "" }, { "dia": 12, "formato": "Stories", "tema": "", "roteiro": "" }], "semana_3": [{ "dia": 13, "formato": "Reels", "tema": "", "roteiro": "" }, { "dia": 14, "formato": "Feed", "tema": "", "roteiro": "" }, { "dia": 15, "formato": "Stories", "tema": "", "roteiro": "" }, { "dia": 16, "formato": "Reels", "tema": "", "roteiro": "" }, { "dia": 17, "formato": "Feed", "tema": "", "roteiro": "" }, { "dia": 18, "formato": "Stories", "tema": "", "roteiro": "" }], "semana_4": [{ "dia": 19, "formato": "Reels", "tema": "", "roteiro": "" }, { "dia": 20, "formato": "Feed", "tema": "", "roteiro": "" }, { "dia": 21, "formato": "Stories", "tema": "", "roteiro": "" }, { "dia": 22, "formato": "Reels", "tema": "", "roteiro": "" }, { "dia": 23, "formato": "Feed", "tema": "", "roteiro": "" }, { "dia": 24, "formato": "Stories", "tema": "", "roteiro": "" }], "semana_5": [{ "dia": 25, "formato": "Reels", "tema": "", "roteiro": "" }, { "dia": 26, "formato": "Feed", "tema": "", "roteiro": "" }, { "dia": 27, "formato": "Stories", "tema": "", "roteiro": "" }, { "dia": 28, "formato": "Reels", "tema": "", "roteiro": "" }, { "dia": 29, "formato": "Feed", "tema": "", "roteiro": "" }, { "dia": 30, "formato": "Stories", "tema": "", "roteiro": "" }] },
  "oferta_precificacao": { "valor_ideal": "", "ancoragem": "", "parcelamento": "", "garantia": "", "escassez": "", "oferta_principal": "" },
  "funil_automacao": { "checkout": "", "order_bump": "", "upsell": "", "downsell": "", "emails_pos_venda": "", "whatsapp": "", "recuperacao_carrinho": "", "automacao_visao_geral": "" },
  "escala_monetizacao": { "trafego_pago": "", "afiliados": "", "indicacao": "", "recorrencia": "", "assinatura": "", "licenciamento": "", "white_label": "", "franquia_digital": "", "metricas": [] },
  "dashboard_operacao": { "receita_projetada": "", "meta_mensal": "", "ticket_medio": "", "conversao": "", "cac": "", "roi": "", "escala": "" },
  "proximo_produto": { "ideia": "", "linha_produtos": [], "cross_sell": "", "ascensao_valor": "" },
  "ia_otimizadora": { "analise_anuncios": "", "analise_vsl": "", "analise_pagina": "", "analise_funil": "", "melhorias_auto": "", "testes_ab": "" }
}

REGRAS: Personalize 100% para o nicho. NUNCA use colchetes. NUNCA use emojis.
ATENÇÃO: NUNCA invente números, dados, métricas, depoimentos ou qualquer prova social. Todo campo de prova social deve conter exatamente o texto "[INSIRA AQUI SEUS DEPOIMENTOS E DADOS REAIS DE ALUNOS]". Não escreva nenhuma frase genérica como "alunos reais", "resultados comprovados" ou "depoimentos verdadeiros" — isso também é conteúdo fabricado. O usuário deve inserir os dados reais manualmente.`

    const userPrompt = `Crie um produto digital COMPLETO baseado na ideia abaixo:

IDEIA DO PRODUTO: ${ideia}
TOM: ${tom || "Persuasivo e direto"}
LUCRO DESEJADO: R$ ${lucro || "60000"}

REGRAS OBRIGATÓRIAS:
- USE A IDEIA ACIMA como base para TODOS os campos — nicho, promessa, método, avatar, dor, desejo, objeções
- ADAPTE cada estrutura (PAS, AIDA, Value Stack, etc.) AO PRODUTO ESPECÍFICO
- Ex: se ideia é "Curso de Fotografia para Iniciantes", módulos falam de câmera, luz, composição, edição, ensaio — NÃO "módulo 1 fundação, módulo 2 estrutura"
- Ex: se ideia é "Método Produtividade para Mães", bônus são "Rotina matinal 15min", "Planner semanal filhos", "Guia energia" — NÃO "checklist genérico"
- NÃO INVENTE números, métricas, preços de mercado, depoimentos, casos de sucesso
- Placeholders APENAS onde usuário insere dados REAIS: [INSIRA AQUI SEUS DEPOIMENTOS E DADOS REAIS DE ALUNOS]
- Gere TODOS os campos com conteúdo COMPLETO, pronto para usar. Não use emojis. Não use colchetes genéricos.`

    const result = await aiChat({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      maxTokens: 4000,
    })

    if (!result) {
      return NextResponse.json({ error: "Nenhuma API configurada" }, { status: 500 })
    }

    const content = sanitizeText(result.content)

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
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 })
  }
}
