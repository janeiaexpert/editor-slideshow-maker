export interface ProdutoValidado {
  id: string
  nome: string
  tag: string
  descricao: string
  publico: string
  iconeSvg: string
  ideia: string
  precoSugerido: number
}

function coverSvg(p: ProdutoValidado): string {
  const nomeTamanho = p.nome.length > 20 ? 16 : p.nome.length > 14 ? 18 : 20
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="bg-${p.id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F5EFE8"/><stop offset="100%" stop-color="#EDE6DC"/></linearGradient></defs><rect width="400" height="500" fill="url(#bg-${p.id})" rx="16"/><rect x="12" y="12" width="376" height="476" rx="14" fill="none" stroke="#D9CEC2" stroke-width="1"/><circle cx="200" cy="130" r="55" fill="#F5EFE8" stroke="#D4B896" stroke-width="1.5"/><g transform="translate(200,130) scale(0.95)">${p.iconeSvg}</g><rect x="90" y="230" width="220" height="28" rx="14" fill="#8B5E3C"/><text x="200" y="250" font-family="'Helvetica Neue',Arial,sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">${p.tag}</text><text x="200" y="310" font-family="'Helvetica Neue',Arial,sans-serif" font-size="${nomeTamanho}" font-weight="800" fill="#1A1A1A" text-anchor="middle">${p.nome}</text><rect x="40" y="330" width="320" height="2" rx="1" fill="#D4B896"/><text x="200" y="420" font-family="Arial,sans-serif" font-size="14" font-weight="600" fill="#8B5E3C" text-anchor="middle" opacity="0.8">${p.publico}</text></svg>`
}

const ICONES: Record<string, string> = {
  "chatgpt-vendas": `<path d="M-20,-20 L20,-20 L20,10 Q20,20 10,20 L0,20 L-10,30 L-10,20 L-20,20 Q-20,10 -20,10 Z" fill="none" stroke="#D4B896" stroke-width="2.5" stroke-linejoin="round"/><circle cx="-8" cy="0" r="2.5" fill="#8B5E3C"/><circle cx="0" cy="0" r="2.5" fill="#8B5E3C"/><circle cx="8" cy="0" r="2.5" fill="#8B5E3C"/>`,
  "avatares-ia": `<circle cx="0" cy="-10" r="18" fill="none" stroke="#D4B896" stroke-width="2.5"/><path d="M-30,30 Q-30,10 0,10 Q30,10 30,30" fill="none" stroke="#D4B896" stroke-width="2.5" stroke-linecap="round"/>`,
  "carrosseis-virais": `<rect x="-25" y="-20" width="50" height="35" rx="4" fill="none" stroke="#D4B896" stroke-width="2.5"/><rect x="-18" y="-13" width="36" height="22" rx="3" fill="none" stroke="#8B5E3C" stroke-width="1.5"/><line x1="-10" y1="-3" x2="10" y2="-3" stroke="#D4B896" stroke-width="2" stroke-linecap="round"/><line x1="-10" y1="3" x2="6" y2="3" stroke="#D4B896" stroke-width="2" stroke-linecap="round"/><rect x="-15" y="25" width="30" height="4" rx="2" fill="#8B5E3C"/>`,
  "ia-iniciantes": `<circle cx="0" cy="-5" r="22" fill="none" stroke="#D4B896" stroke-width="2.5"/><path d="M-10,-5 L-4,-5 L0,-18 L4,-5 L10,-5" fill="none" stroke="#8B5E3C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="0" cy="8" r="2.5" fill="#8B5E3C"/><circle cx="0" cy="18" r="2" fill="#D4B896"/>`,
  "copy-ia": `<line x1="-25" y1="-20" x2="25" y2="-20" stroke="#D4B896" stroke-width="3" stroke-linecap="round"/><line x1="-25" y1="-10" x2="25" y2="-10" stroke="#D4B896" stroke-width="3" stroke-linecap="round"/><line x1="-25" y1="0" x2="25" y2="0" stroke="#8B5E3C" stroke-width="3" stroke-linecap="round"/><line x1="-25" y1="10" x2="15" y2="10" stroke="#D4B896" stroke-width="3" stroke-linecap="round"/><line x1="-25" y1="20" x2="20" y2="20" stroke="#D4B896" stroke-width="3" stroke-linecap="round"/>`,
  "video-ia": `<circle cx="0" cy="0" r="25" fill="none" stroke="#D4B896" stroke-width="2.5"/><polygon points="-8,-12 -8,12 14,0" fill="none" stroke="#8B5E3C" stroke-width="2.5" stroke-linejoin="round"/>`,
  "cursos-ia": `<rect x="-20" y="-22" width="40" height="44" rx="3" fill="none" stroke="#D4B896" stroke-width="2.5"/><line x1="-14" y1="-10" x2="14" y2="-10" stroke="#8B5E3C" stroke-width="2" stroke-linecap="round"/><line x1="-14" y1="-2" x2="14" y2="-2" stroke="#D4B896" stroke-width="2" stroke-linecap="round"/><line x1="-14" y1="6" x2="8" y2="6" stroke="#D4B896" stroke-width="2" stroke-linecap="round"/><line x1="-14" y1="14" x2="10" y2="14" stroke="#D4B896" stroke-width="2" stroke-linecap="round"/>`,
  "automacao-marketing": `<circle cx="0" cy="0" r="25" fill="none" stroke="#D4B896" stroke-width="2.5"/><circle cx="0" cy="0" r="10" fill="none" stroke="#8B5E3C" stroke-width="2"/><circle cx="0" cy="0" r="3" fill="#D4B896"/><line x1="0" y1="-25" x2="0" y2="-35" stroke="#D4B896" stroke-width="2" stroke-linecap="round"/><line x1="0" y1="25" x2="0" y2="35" stroke="#D4B896" stroke-width="2" stroke-linecap="round"/><line x1="-25" y1="0" x2="-35" y2="0" stroke="#D4B896" stroke-width="2" stroke-linecap="round"/><line x1="25" y1="0" x2="35" y2="0" stroke="#D4B896" stroke-width="2" stroke-linecap="round"/>`,
  "design-ia": `<line x1="-25" y1="15" x2="25" y2="-15" stroke="#D4B896" stroke-width="2.5" stroke-linecap="round"/><circle cx="20" cy="-15" r="8" fill="none" stroke="#8B5E3C" stroke-width="2.5"/><rect x="-25" y="10" width="18" height="18" rx="3" fill="none" stroke="#D4B896" stroke-width="2.5" transform="rotate(-45,-16,19)"/>`,
  "afiliados-ia": `<path d="M-5,-25 L-5,25" stroke="#D4B896" stroke-width="2.5" stroke-linecap="round"/><path d="M-20,-10 Q-20,-25 -5,-25 Q10,-25 10,-10" fill="none" stroke="#8B5E3C" stroke-width="2" stroke-linecap="round"/><path d="M-20,10 Q-20,25 -5,25 Q10,25 10,10" fill="none" stroke="#8B5E3C" stroke-width="2" stroke-linecap="round"/><circle cx="-20" cy="-10" r="5" fill="none" stroke="#D4B896" stroke-width="2"/><circle cx="-20" cy="10" r="5" fill="none" stroke="#D4B896" stroke-width="2"/><circle cx="10" cy="-10" r="5" fill="none" stroke="#D4B896" stroke-width="2"/><circle cx="10" cy="10" r="5" fill="none" stroke="#D4B896" stroke-width="2"/>`,
  "trafego-ia": `<rect x="-25" y="-20" width="50" height="40" rx="4" fill="none" stroke="#D4B896" stroke-width="2.5"/><line x1="-12" y1="12" x2="-4" y2="4" stroke="#8B5E3C" stroke-width="2" stroke-linecap="round"/><line x1="-4" y1="4" x2="4" y2="8" stroke="#8B5E3C" stroke-width="2" stroke-linecap="round"/><line x1="4" y1="8" x2="12" y2="-8" stroke="#8B5E3C" stroke-width="2" stroke-linecap="round"/><circle cx="-12" cy="12" r="3" fill="#D4B896"/><circle cx="-4" cy="4" r="3" fill="#D4B896"/><circle cx="4" cy="8" r="3" fill="#D4B896"/><circle cx="12" cy="-8" r="3" fill="#D4B896"/>`,
  "musica-ia": `<circle cx="-8" cy="10" r="10" fill="none" stroke="#D4B896" stroke-width="2.5"/><path d="M2,10 L2,-20 L25,-15 L25,5" fill="none" stroke="#8B5E3C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="5" r="8" fill="none" stroke="#D4B896" stroke-width="2.5"/><line x1="2" y1="-12" x2="25" y2="-7" stroke="#D4B896" stroke-width="1.5" stroke-linecap="round"/>`,
  "chatbot-atendimento": `<rect x="-22" y="-25" width="44" height="42" rx="8" fill="none" stroke="#D4B896" stroke-width="2.5"/><path d="M-8,17 L-8,28 L3,17" fill="none" stroke="#8B5E3C" stroke-width="2" stroke-linejoin="round"/><circle cx="-8" cy="-5" r="2.5" fill="#8B5E3C"/><circle cx="0" cy="-5" r="2.5" fill="#8B5E3C"/><circle cx="8" cy="-5" r="2.5" fill="#8B5E3C"/>`,
  "ebook-ia": `<path d="M-20,-22 L-20,22 Q-20,28 -14,28 L14,28 Q20,28 20,22 L20,-22 Z" fill="none" stroke="#D4B896" stroke-width="2.5" stroke-linejoin="round"/><line x1="-12" y1="-10" x2="12" y2="-10" stroke="#8B5E3C" stroke-width="2" stroke-linecap="round"/><line x1="-12" y1="-2" x2="12" y2="-2" stroke="#D4B896" stroke-width="2" stroke-linecap="round"/><line x1="-12" y1="6" x2="6" y2="6" stroke="#D4B896" stroke-width="2" stroke-linecap="round"/><line x1="-12" y1="14" x2="8" y2="14" stroke="#D4B896" stroke-width="2" stroke-linecap="round"/>`,
  "dados-ia": `<rect x="-22" y="-22" width="44" height="44" rx="4" fill="none" stroke="#D4B896" stroke-width="2.5"/><line x1="-12" y1="14" x2="-12" y2="0" stroke="#8B5E3C" stroke-width="3" stroke-linecap="round"/><line x1="0" y1="14" x2="0" y2="-10" stroke="#D4B896" stroke-width="3" stroke-linecap="round"/><line x1="12" y1="14" x2="12" y2="4" stroke="#8B5E3C" stroke-width="3" stroke-linecap="round"/>`,
  "personas-ia": `<circle cx="-10" cy="-10" r="14" fill="none" stroke="#D4B896" stroke-width="2.5"/><circle cx="12" cy="-8" r="12" fill="none" stroke="#8B5E3C" stroke-width="2.5"/><path d="M-25,20 Q-25,5 -10,5 Q5,5 5,20" fill="none" stroke="#D4B896" stroke-width="2.5" stroke-linecap="round"/><path d="M-3,18 Q-3,3 12,3 Q27,3 27,18" fill="none" stroke="#8B5E3C" stroke-width="2.5" stroke-linecap="round"/>`,
}

export const PRODUTOS_VALIDADOS: ProdutoValidado[] = [
  {
    id: "chatgpt-vendas",
    nome: "ChatGPT para Vendas",
    tag: "AUTOMAÇÃO",
    descricao: "Aprenda a usar ChatGPT para automatizar vendas, criar scripts, nutrir leads e fechar mais clientes sem esforço manual.",
    publico: "Empreendedores e Vendedores",
    iconeSvg: ICONES["chatgpt-vendas"],
    ideia: "Quero criar um treinamento completo sobre como usar ChatGPT e IAs conversacionais para automatizar o processo de vendas: desde a abordagem inicial até o fechamento. Inclui scripts prontos, integrações com CRM, nutrição de leads e recuperação de carrinhos abandonados.",
    precoSugerido: 497
  },
  {
    id: "avatares-ia",
    nome: "Avatares Digitais com IA",
    tag: "CRIAÇÃO",
    descricao: "Gere avatares realistas com IA para vídeos, apresentações e marketing digital sem precisar gravar sua imagem.",
    publico: "Criadores de Conteúdo",
    iconeSvg: ICONES["avatares-ia"],
    ideia: "Quero ensinar criadores de conteúdo e empreendedores a criar avatares digitais realistas usando ferramentas de IA generativa. Do prompt ao vídeo finalizado, com dublagem, expressões e personalização completa.",
    precoSugerido: 397
  },
  {
    id: "carrosseis-virais",
    nome: "Carrosséis Virais com IA",
    tag: "CONTEÚDO",
    descricao: "Produza carrosséis do Instagram que geram alta retenção usando IA no roteiro, design e Storytelling.",
    publico: "Social Media e Criadores",
    iconeSvg: ICONES["carrosseis-virais"],
    ideia: "Quero criar um método para produzir carrosséis virais no Instagram usando inteligência artificial em todas as etapas: pesquisa de tópicos, roteiro, design de slides, copy de legenda e hashtags. Foco em engajamento e retenção.",
    precoSugerido: 297
  },
  {
    id: "ia-iniciantes",
    nome: "IA para Iniciantes",
    tag: "TECNOLOGIA",
    descricao: "Do zero ao primeiro projeto de IA: entenda os conceitos, ferramentas e aplicações práticas sem programação.",
    publico: "Iniciantes em Tecnologia",
    iconeSvg: ICONES["ia-iniciantes"],
    ideia: "Quero criar um curso introdutório sobre inteligência artificial para pessoas sem experiência técnica. Abordagem prática com ferramentas prontas, exemplos do dia a dia e projetos simples usando ChatGPT, Midjourney e outras IAs populares.",
    precoSugerido: 197
  },
  {
    id: "copy-ia",
    nome: "Copywriting com IA",
    tag: "MARKETING",
    descricao: "Gere anúncios, e-mails, páginas de vendas e scripts de VSL com IA. Prompt engineering aplicado à copy.",
    publico: "Marketers e Copywriters",
    iconeSvg: ICONES["copy-ia"],
    ideia: "Quero ensinar copywriters e profissionais de marketing a usar IA generativa para criar textos persuasivos de alta conversão: anúncios, e-mails, landing pages, scripts de VSL e posts. Foco em prompt engineering e revisão estratégica.",
    precoSugerido: 497
  },
  {
    id: "video-ia",
    nome: "Edição de Vídeo com IA",
    tag: "PRODUÇÃO",
    descricao: "Edite vídeos completos com ferramentas de IA: roteiro, voz sintética, avatar e edição automatizada.",
    publico: "Criadores de Vídeo",
    iconeSvg: ICONES["video-ia"],
    ideia: "Quero criar um guia prático para produção de vídeos com IA: roteirização, geração de voz sintética, criação de avatar digital, edição automatizada e publicação. Para YouTube, Instagram Reels e TikTok.",
    precoSugerido: 397
  },
  {
    id: "cursos-ia",
    nome: "Criação de Cursos com IA",
    tag: "INFOPRODUTO",
    descricao: "Produza cursos completos usando IA no roteiro, design, edição e plataforma. Lance mais rápido.",
    publico: "Infoprodutores",
    iconeSvg: ICONES["cursos-ia"],
    ideia: "Quero ensinar infoprodutores a usar inteligência artificial na produção de cursos digitais completos: pesquisa de mercado, roteiro, criação de slides, edição de vídeo, plataforma de hospedagem e estratégia de lançamento.",
    precoSugerido: 597
  },
  {
    id: "automacao-marketing",
    nome: "Automação de Marketing com IA",
    tag: "AUTOMAÇÃO",
    descricao: "Monte um sistema de marketing automatizado com IA: chatbot, e-mail, CRM e funil sem toque manual.",
    publico: "Empreendedores Digitais",
    iconeSvg: ICONES["automacao-marketing"],
    ideia: "Quero criar um sistema completo de automação de marketing usando inteligência artificial: chatbot para atendimento, nutrição automática por e-mail, recuperação de carrinho, segmentação de leads e relatórios inteligentes.",
    precoSugerido: 697
  },
  {
    id: "design-ia",
    nome: "Design Gráfico com IA",
    tag: "DESIGN",
    descricao: "Crie designs profissionais com IA: logos, posts, banners, apresentações e identidade visual.",
    publico: "Designers e Empreendedores",
    iconeSvg: ICONES["design-ia"],
    ideia: "Quero ensinar designers e não-designers a usar ferramentas de IA generativa para criação de design gráfico: logotipos, posts para redes sociais, banners, apresentações, identidade visual e mockups.",
    precoSugerido: 397
  },
  {
    id: "afiliados-ia",
    nome: "Marketing de Afiliados com IA",
    tag: "AFILIADOS",
    descricao: "Use IA para criar conteúdo, analisar produtos, anúncios e automatizar suas vendas como afiliado.",
    publico: "Afiliados Digitais",
    iconeSvg: ICONES["afiliados-ia"],
    ideia: "Quero criar um método para afiliados usarem inteligência artificial em todas as etapas: pesquisa de produtos viáveis, criação de conteúdo, análise de concorrência, geração de anúncios e automação de vendas.",
    precoSugerido: 497
  },
  {
    id: "trafego-ia",
    nome: "Tráfego Pago com IA",
    tag: "ANÚNCIOS",
    descricao: "Otimize campanhas de tráfego pago com IA: criação de anúncios, segmentação e lances inteligentes.",
    publico: "Gestores de Tráfego",
    iconeSvg: ICONES["trafego-ia"],
    ideia: "Quero ensinar gestores de tráfego a usar inteligência artificial para criar e otimizar campanhas de anúncios: geração de criativos, segmentação inteligente, otimização de lances e análise de resultados em tempo real.",
    precoSugerido: 597
  },
  {
    id: "musica-ia",
    nome: "Música e Áudio com IA",
    tag: "ÁUDIO",
    descricao: "Produza músicas, efeitos sonoros e narrações com IA para seus projetos criativos.",
    publico: "Produtores e Criadores",
    iconeSvg: ICONES["musica-ia"],
    ideia: "Quero criar um curso sobre produção musical e de áudio com inteligência artificial: geração de músicas, efeitos sonoros, narrações com voz sintética, mixagem e masterização automática.",
    precoSugerido: 347
  },
  {
    id: "chatbot-atendimento",
    nome: "Chatbot e Atendimento com IA",
    tag: "ATENDIMENTO",
    descricao: "Crie chatbots inteligentes para atendimento ao cliente, suporte e vendas 24 horas.",
    publico: "Empresas e Loja Virtual",
    iconeSvg: ICONES["chatbot-atendimento"],
    ideia: "Quero ensinar empreendedores a criar chatbots com IA para atendimento ao cliente: configuração, fluxo de conversa, integração com WhatsApp, base de conhecimento automática e análise de métricas.",
    precoSugerido: 497
  },
  {
    id: "ebook-ia",
    nome: "E-book Digital com IA",
    tag: "CONTEÚDO",
    descricao: "Escreva e-books completos com IA: pesquisa, estruturação, escrita, diagramação e capa.",
    publico: "Escritores e Infoprodutores",
    iconeSvg: ICONES["ebook-ia"],
    ideia: "Quero criar um guia completo para produção de e-books com inteligência artificial: pesquisa de tópicos viáveis, estruturação de capítulos, escrita com IA, revisão, diagramação, criação de capa e publicação.",
    precoSugerido: 197
  },
  {
    id: "dados-ia",
    nome: "Análise de Dados com IA",
    tag: "DADOS",
    descricao: "Analise dados e gere insights com IA: dashboards, relatórios e decisões baseadas em dados.",
    publico: "Analistas e Gestores",
    iconeSvg: ICONES["dados-ia"],
    ideia: "Quero ensinar profissionais a usar inteligência artificial para análise de dados: coleta, limpeza, visualização, geração de relatórios inteligentes e insights para tomada de decisão.",
    precoSugerido: 497
  },
  {
    id: "personas-ia",
    nome: "Criação de Personas com IA",
    tag: "MARKETING",
    descricao: "Use IA para criar personas detalhadas, mapas de jornada e estratégias de marketing personalizadas.",
    publico: "Marketers e Estrategistas",
    iconeSvg: ICONES["personas-ia"],
    ideia: "Quero ensinar profissionais de marketing a usar inteligência artificial para criar personas detalhadas, mapas de jornada do cliente e estratégias de marketing personalizadas baseadas em dados comportamentais.",
    precoSugerido: 397
  },
]

export function gerarCoverSvg(p: ProdutoValidado): string {
  return coverSvg(p)
}
