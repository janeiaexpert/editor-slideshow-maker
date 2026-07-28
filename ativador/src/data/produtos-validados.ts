export interface ProdutoValidado {
  id: string
  nome: string
  tag: string
  descricao: string
  publico: string
  iconeSvg: string
  ideia: string
}

function lucideIcon(inner: string, color = "#D4B896", sw = 2, size = 24): string {
  const scale = 50 / size
  return `<g transform="scale(${scale}) translate(-12,-12)" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" fill="none">${inner}</g>`
}

const LUCIDE: Record<string, string> = {
  "chatgpt-vendas": lucideIcon(`<path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/>`, "#D4B896", 2.5),
  "avatares-ia": lucideIcon(`<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`, "#D4B896", 2.5),
  "carrosseis-virais": lucideIcon(`<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>`, "#D4B896", 2),
  "ia-iniciantes": lucideIcon(`<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>`, "#D4B896", 2),
  "copy-ia": lucideIcon(`<path d="M13 21h8"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>`, "#D4B896", 2),
  "video-ia": lucideIcon(`<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>`, "#D4B896", 2.5),
  "cursos-ia": lucideIcon(`<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>`, "#D4B896", 2),
  "automacao-marketing": lucideIcon(`<path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"/>`, "#D4B896", 2.5),
  "design-ia": lucideIcon(`<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>`, "#D4B896", 2),
  "afiliados-ia": lucideIcon(`<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>`, "#D4B896", 2.5),
  "trafego-ia": lucideIcon(`<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`, "#D4B896", 2.5),
  "musica-ia": lucideIcon(`<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`, "#D4B896", 2.5),
  "chatbot-atendimento": lucideIcon(`<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>`, "#D4B896", 2.5),
  "ebook-ia": lucideIcon(`<path d="M12 5v16"/><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/>`, "#D4B896", 2),
  "dados-ia": lucideIcon(`<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 16h8"/><path d="M7 11h12"/><path d="M7 6h3"/>`, "#D4B896", 2.5),
  "personas-ia": lucideIcon(`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>`, "#D4B896", 2),
  "claude-ecossistema": "",
  "vibe-coding": lucideIcon(`<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>`, "#D4B896", 2.5),
  "skills-ia": "",
  "criar-gpts": lucideIcon(`<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/>`, "#D4B896", 2),
}

function coverSvg(p: ProdutoValidado): string {
  const nomeTamanho = p.nome.length > 30 ? 13 : p.nome.length > 25 ? 14 : p.nome.length > 20 ? 15 : p.nome.length > 14 ? 18 : 20
  const maxChars = 28
  const words = p.nome.split(" ")
  const lines: string[] = []
  let current = ""
  for (const w of words) {
    if ((current + " " + w).trim().length > maxChars && current) { lines.push(current.trim()); current = w }
    else current = current ? current + " " + w : w
  }
  if (current.trim()) lines.push(current.trim())
  const lineH = nomeTamanho + 4
  const totalNameH = lines.length * lineH
  const nameY = 280
  const nameLines = lines.map((line, i) => `<text x="200" y="${nameY + i * lineH}" font-family="Helvetica Neue,Arial,sans-serif" font-size="${nomeTamanho}" font-weight="800" fill="#1A1A1A" text-anchor="middle">${line}</text>`).join("")
  const dividerY = nameY + totalNameH + 10
  const publicoY = dividerY + 40
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500"><defs><linearGradient id="bg-${p.id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F5EFE8"/><stop offset="100%" stop-color="#EDE6DC"/></linearGradient></defs><rect width="400" height="500" fill="url(#bg-${p.id})" rx="16"/><rect x="12" y="12" width="376" height="476" rx="14" fill="none" stroke="#D9CEC2" stroke-width="1"/><circle cx="200" cy="130" r="55" fill="#F5EFE8" stroke="#D4B896" stroke-width="1.5"/><g transform="translate(200,130)">${LUCIDE[p.id] || p.iconeSvg}</g><rect x="90" y="230" width="220" height="28" rx="14" fill="#8B5E3C"/><text x="200" y="250" font-family="Helvetica Neue,Arial,sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">${p.tag}</text>${nameLines}<rect x="40" y="${dividerY}" width="320" height="2" rx="1" fill="#D4B896"/><text x="200" y="${publicoY}" font-family="Arial,sans-serif" font-size="14" font-weight="600" fill="#8B5E3C" text-anchor="middle" opacity="0.8">${p.publico}</text></svg>`
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
  "claude-ecossistema": `<rect x="-16" y="-16" width="32" height="24" rx="5" fill="none" stroke="#D4B896" stroke-width="2.5"/><line x1="0" y1="-16" x2="0" y2="-22" stroke="#8B5E3C" stroke-width="2"/><circle cx="0" cy="-24" r="3" fill="#D4B896"/><circle cx="-7" cy="-6" r="3" fill="none" stroke="#8B5E3C" stroke-width="2"/><circle cx="7" cy="-6" r="3" fill="none" stroke="#8B5E3C" stroke-width="2"/><circle cx="-7" cy="-6" r="1.5" fill="#8B5E3C"/><circle cx="7" cy="-6" r="1.5" fill="#8B5E3C"/><line x1="-5" y1="2" x2="5" y2="2" stroke="#8B5E3C" stroke-width="2"/><rect x="-12" y="14" width="24" height="10" rx="3" fill="none" stroke="#D4B896" stroke-width="2"/><circle cx="-4" cy="19" r="1.5" fill="#8B5E3C"/><circle cx="0" cy="19" r="1.5" fill="#8B5E3C"/><circle cx="4" cy="19" r="1.5" fill="#8B5E3C"/>`,
  "vibe-coding": `<rect x="-25" y="-20" width="50" height="40" rx="4" fill="none" stroke="#D4B896" stroke-width="2.5"/><text x="-14" y="-2" font-family="monospace" font-size="12" fill="#8B5E3C" font-weight="bold">&lt;/&gt;</text><text x="4" y="10" font-family="monospace" font-size="10" fill="#D4B896">{'{ }'}</text><line x1="-15" y1="14" x2="15" y2="14" stroke="#8B5E3C" stroke-width="2" stroke-linecap="round"/>`,
  "skills-ia": `<circle cx="0" cy="0" r="6" fill="#8B5E3C"/><circle cx="0" cy="-18" r="4" fill="none" stroke="#D4B896" stroke-width="2"/><circle cx="18" cy="0" r="4" fill="none" stroke="#D4B896" stroke-width="2"/><circle cx="0" cy="18" r="4" fill="none" stroke="#D4B896" stroke-width="2"/><circle cx="-18" cy="0" r="4" fill="none" stroke="#D4B896" stroke-width="2"/><line x1="0" y1="-6" x2="0" y2="-14" stroke="#D4B896" stroke-width="2"/><line x1="6" y1="0" x2="14" y2="0" stroke="#D4B896" stroke-width="2"/><line x1="0" y1="6" x2="0" y2="14" stroke="#D4B896" stroke-width="2"/><line x1="-6" y1="0" x2="-14" y2="0" stroke="#D4B896" stroke-width="2"/><circle cx="14" cy="-14" r="3" fill="none" stroke="#8B5E3C" stroke-width="1.5"/><circle cx="-14" cy="14" r="3" fill="none" stroke="#8B5E3C" stroke-width="1.5"/><line x1="4" y1="-4" x2="11" y2="-11" stroke="#D4B896" stroke-width="1.5"/><line x1="-4" y1="4" x2="-11" y2="11" stroke="#D4B896" stroke-width="1.5"/>`,
  "criar-gpts": `<rect x="-22" y="-20" width="44" height="40" rx="6" fill="none" stroke="#D4B896" stroke-width="2.5"/><circle cx="0" cy="-4" r="10" fill="none" stroke="#8B5E3C" stroke-width="2"/><path d="M-5,-4 L-2,-1 L5,-8" fill="none" stroke="#8B5E3C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="-8" cy="12" r="2.5" fill="#D4B896"/><circle cx="0" cy="12" r="2.5" fill="#8B5E3C"/><circle cx="8" cy="12" r="2.5" fill="#D4B896"/>`,
}

export const PRODUTOS_VALIDADOS: ProdutoValidado[] = [
  {
    id: "chatgpt-vendas",
    nome: "ChatGPT para Vendas",
    tag: "AUTOMAÇÃO",
    descricao: "Aprenda a usar ChatGPT para automatizar vendas, criar scripts, nutrir leads e fechar mais clientes sem esforço manual.",
    publico: "Empreendedores e Vendedores",
    iconeSvg: ICONES["chatgpt-vendas"],
    ideia: "Quero criar um treinamento completo sobre como usar ChatGPT e IAs conversacionais para automatizar o processo de vendas: desde a abordagem inicial até o fechamento. Inclui scripts prontos para WhatsApp, Instagram e ligação, integração com CRM, nutrição de leads por e-mail automatizado, recuperação de carrinhos abandonados com sequências de mensagens personalizadas, qualificação de leads com perguntas estratégicas e relatórios de conversão.\n\nBÔNUS MONETIZAÇÃO: Como vender serviço de automação de vendas com ChatGPT para empresas locais (lojas, clínicas, restaurantes, imobiliárias). Cobrança por setup (R$ 500-2.000) + mensalidade de manutenção (R$ 300-800/mês). Como criar pacotes de automação para infoprodutores: setup de chatbot de vendas + sequência de nutrição + recuperação de carrinho. Como monetizar como afiliado recomendando ferramentas de automação com comissão recorrente.\n\nBÔNUS PROSPECÇÃO: Como prospectar empresas locais usando Google Maps e Instagram para identificar negócios que ainda vendem manualmente. Script de abordagem por WhatsApp Business: mensagem personalizada mostrando como a automação aumentaria as vendas deles. Como usar o próprio ChatGPT para gerar lista de prospects, personalizar mensagens de prospecção e criar propostas comerciais. Estratégia de portfólio: criar 3 automações-grátis para empresas locais como prova social antes de cobrar."
  },
  {
    id: "avatares-ia",
    nome: "Avatares Digitais com IA",
    tag: "CRIAÇÃO",
    descricao: "Gere avatares realistas com IA para vídeos, apresentações e marketing digital sem precisar gravar sua imagem.",
    publico: "Criadores de Conteúdo",
    iconeSvg: ICONES["avatares-ia"],
    ideia: "Quero ensinar criadores de conteúdo e empreendedores a criar avatares digitais realistas usando ferramentas de IA generativa. Do prompt ao vídeo finalizado, com dublagem, expressões e personalização completa. Ferramentas: HeyGen, D-ID, Synthesia, CapCut Avatar, Midjourney para rostos. Incluitemplates de apresentação corporativa, vídeos para redes sociais, tutoriais e vídeos de vendas com avatar.\n\nBÔNUS MONETIZAÇÃO: Como vender serviço de criação de avatares para empresas (R$ 200-800 por vídeo de avatar). Nichos lucrativos: treinamentos corporativos, vídeos de onboarding para RH, apresentações de produtos para e-commerce. Como criar pacotes de assinatura para empresas que precisam de vídeos mensais com avatar. Como usar avatares em vídeos de afiliados para gerar comissões sem mostrar o rosto.\n\nBÔNUS PROSPECÇÃO: Como prospectar empresas de médio porte que precisam de treinamentos internos e não têm equipe de vídeo. Prospecção em LinkedIn: identificar profissionais de RH e treinamento corporativo. Como usar o próprio avatar como portfólio: criar 3 vídeos-demo para nichos diferentes (educação, saúde, tecnologia) e enviar como proposta. Estratégia de cold outreach com vídeo personalizado usando avatar."
  },
  {
    id: "carrosseis-virais",
    nome: "Carrosséis Virais com IA",
    tag: "CONTEÚDO",
    descricao: "Produza carrosséis do Instagram que geram alta retenção usando IA no roteiro, design e Storytelling.",
    publico: "Social Media e Criadores",
    iconeSvg: ICONES["carrosseis-virais"],
    ideia: "Quero criar um método para produzir carrosséis virais no Instagram usando inteligência artificial em todas as etapas: pesquisa de tópicos em alta com IA, roteiro com frameworks de copy (PAS, AIDA, 4U), design de slides com Canva AI e Midjourney, copy de legenda otimizada, hashtags estratégicas e análise de métricas. Incluitemplates por nicho: saúde, finanças, tecnología, alimentação, fitness.\n\nBÔNUS MONETIZAÇÃO: Como vender pacotes de carrosséis para empresas locais (R$ 500-1.500/mês por 12 carrosséis). Como monetizar criando carrosséis para infoprodutores durante lançamentos. Como usar carrosséis para promover produtos de afiliados e gerar comissões. Como criar mini-curso de carrosséis e vender como infoproduto (R$ 97-297).\n\nBÔNUS PROSPECÇÃO: Como identificar empresas locais que postam pouco ou mal no Instagram usando ferramentas de análise. Prospecção por nicho: academias, clínicas, restaurantes, lojas de roupa — todos precisam de conteúdo visual. Script de abordagem: enviar 3 carrosséis-grátis já feitos como prova do seu trabalho. Como usar o Instagram DM automatizado para prospectar seguidores de concorrentes."
  },
  {
    id: "ia-iniciantes",
    nome: "IA para Iniciantes",
    tag: "TECNOLOGIA",
    descricao: "Do zero ao primeiro projeto de IA: entenda os conceitos, ferramentas e aplicações práticas sem programação.",
    publico: "Iniciantes em Tecnologia",
    iconeSvg: ICONES["ia-iniciantes"],
    ideia: "Quero criar um curso introdutório sobre inteligência artificial para pessoas sem experiência técnica. Abordagem prática com ferramentas prontas, exemplos do dia a dia e projetos simples usando ChatGPT, Midjourney, Canva AI, CapCut, Notion AI. Cada módulo com projeto prático: escrever e-mail profissional, criar posts para redes sociais, organizar planilhas, gerar imagens para negócios.\n\nBÔNUS MONETIZAÇÃO: Como usar IA no dia a dia para ganhar produtividade no trabalho e ser promovido. Como oferecer serviços simples de IA para empresas locais: digitar documentos, criar posts, organizar dados, responder e-mails. Como criar micro-serviços no Workana, 99Freelas e Fiverr usando IA para entregar trabalho 3x mais rápido. Como transformar o conhecimento em mini-ebook ou checklist e vender como produto digital.\n\nBÔNUS PROSPECÇÃO: Como prospectar pessoas que estão pedindo ajuda em grupos de Facebook e WhatsApp sobre tecnologia. Como criar conteúdo educativo no LinkedIn e Instagram para atrair empresas que precisam de alguém que entenda de IA. Script de abordagem para oferecer consultoria básica de IA para pequenos empresários: mostrar como a IA pode economizar 5 horas por semana do negócio deles."
  },
  {
    id: "copy-ia",
    nome: "Copywriting com IA",
    tag: "MARKETING",
    descricao: "Gere anúncios, e-mails, páginas de vendas e scripts de VSL com IA. Prompt engineering aplicado à copy.",
    publico: "Marketers e Copywriters",
    iconeSvg: ICONES["copy-ia"],
    ideia: "Quero ensinar copywriters e profissionais de marketing a usar IA generativa para criar textos persuasivos de alta conversão: anúncios para Meta Ads e Google Ads, e-mails de nutrição e lançamento, landing pages completas, scripts de VSL, posts para redes sociais, descrições de produtos para e-commerce. Foco em prompt engineering avançado com frameworks PAS, AIDA, 4U, QUEST, Before-After-Bridge. Inclui templates de prompts testados e bank de copy.\n\nBÔNUS MONETIZAÇÃO: Como vender serviços de copy com IA para empresas de e-commerce (R$ 300-1.000 por página de produto). Como criar pacotes de copy para lançamentos de infoprodutos: VSL + landing page + e-mails + anúncios. Como usar IA para escrever copy de afiliados em escala e gerar mais comissões. Como oferecer consultoria de copy para empresas locais: cards de menu, flyers, textos de Google Meu Negócio.\n\nBÔNUS PROSPECÇÃO: Como identificar empresas com anúncios ruins no Facebook Ad Library e oferecer melhoria. Prospecção em grupos de marketing digital: pessoas sempre precisam de copy. Como usar IA para gerar propostas personalizadas em 5 minutos para prospects. Script de abordagem: enviar 3 versões de anúncio já escritas para o negócio do prospect como prova."
  },
  {
    id: "video-ia",
    nome: "Edição de Vídeo com IA",
    tag: "PRODUÇÃO",
    descricao: "Edite vídeos completos com ferramentas de IA: roteiro, voz sintética, avatar e edição automatizada.",
    publico: "Criadores de Vídeo",
    iconeSvg: ICONES["video-ia"],
    ideia: "Quero criar um guia prático para produção de vídeos com IA: roteirização com ChatGPT, geração de voz sintética com ElevenLabs e PlayHT, criação de avatar digital com HeyGen, edição automatizada com CapCut e Descript, legendagem automática, remoção de fundo, upscaling de qualidade. Para YouTube, Instagram Reels, TikTok e cursos online.\n\nBÔNUS MONETIZAÇÃO: Como vender edição de vídeo com IA para YouTubers e criadores (R$ 500-2.000 por vídeo longo, R$ 100-300 por Reel). Como criar vídeos automatizados para canais de nicho no YouTube (compilações, listas, notícias) usando IA e gerar receita com AdSense. Como oferecer produção de vídeos para empresas locais: vídeos promocionais, tutoriais de produto, depoimentos de clientes. Como criar e vender pacotes de vídeos para infoprodutores durante lançamentos.\n\nBÔNUS PROSPECÇÃO: Como identificar YouTubers e criadores que publicam com pouca frequência e oferecer serviço de edição. Prospecção no LinkedIn para empresas que precisam de vídeos institucionais. Como usar IA para criar reels-demo de diferentes nichos e enviar como portfólio. Estratégia de prospecção em massa: identificar 50 criadores no Instagram, enviar mensagem com vídeo-demo personalizado."
  },
  {
    id: "cursos-ia",
    nome: "Criação de Cursos com IA",
    tag: "INFOPRODUTO",
    descricao: "Produza cursos completos usando IA no roteiro, design, edição e plataforma. Lance mais rápido.",
    publico: "Infoprodutores",
    iconeSvg: ICONES["cursos-ia"],
    ideia: "Quero ensinar infoprodutores a usar inteligência artificial na produção de cursos digitais completos: pesquisa de mercado com IA para validar nicho, roteiro de aulas com ChatGPT, criação de slides com Gamma e Canva AI, gravação com teleprompter e IA, edição de vídeo automatizada com Descript e CapCut, criação de material de apoio (PDFs, checklists, planilhas), configuração de plataforma (Hotmart, Kiwify, Eduzz) e estratégia de lançamento com copy e anúncios gerados por IA.\n\nBÔNUS MONETIZAÇÃO: Como criar e lançar um curso digital em 30 dias usando IA em todas as etapas. Como usar IA para criar cursos para outros infoprodutores como serviço (R$ 2.000-10.000 por curso). Como criar mini-cursos de 1-2 horas e vender como produto de entrada a R$ 47-97 para captar leads. Como usar IA para atualizar e regravar módulos de cursos antigos sem refazer tudo.\n\nBÔNUS PROSPECÇÃO: Como identificar infoprodutores que têm conhecimento mas não lançam curso (muitos seguidores, nenhum produto digital). Prospecção em eventos de marketing digital e feiras do setor. Como usar IA para gerar propostas personalizadas mostrando o curso que você criaria para o prospect. Script de abordagem: criar 1 módulo demo do curso usando IA e enviar como prova do resultado."
  },
  {
    id: "automacao-marketing",
    nome: "Automação de Marketing com IA",
    tag: "AUTOMAÇÃO",
    descricao: "Monte um sistema de marketing automatizado com IA: chatbot, e-mail, CRM e funil sem toque manual.",
    publico: "Empreendedores Digitais",
    iconeSvg: ICONES["automacao-marketing"],
    ideia: "Quero criar um sistema completo de automação de marketing usando inteligência artificial: chatbot para atendimento e vendas no WhatsApp com ManyChat e ChatGPT API, nutrição automática por e-mail com sequências personalizadas, recuperação de carrinho abandonado com mensagens inteligentes, segmentação de leads baseada em comportamento, relatórios inteligentes com análise preditiva. Integrações: Hotmart, Kiwify, RD Station, Bling.\n\nBÔNUS MONETIZAÇÃO: Como vender sistemas de automação completa para empresas locais (R$ 1.500-5.000 de setup + R$ 500-1.500/mês de manutenção). Nichos mais lucrativos: clínicas (agendamento + follow-up), imobiliárias (qualificação de leads), restaurantes (pedidos automatizados), academias (retenção de alunos). Como criar templates de automação e vender como produto digital. Como oferecer automação como serviço recorrente para infoprodutores.\n\nBÔNUS PROSPECÇÃO: Como identificar empresas que perdem vendas por falta de atendimento automatizado (verificar horário de resposta no WhatsApp Business). Prospecção em grupos de empreendedores: quem reclama de não conseguir responder todos os clientes. Script de demonstração: criar um fluxo de automação grátis para o prospect e mostrar os números (leads perdidos vs recuperados). Como usar LinkedIn Sales Navigator para encontrar donos de pequenos negócios."
  },
  {
    id: "design-ia",
    nome: "Design Gráfico com IA",
    tag: "DESIGN",
    descricao: "Crie designs profissionais com IA: logos, posts, banners, apresentações e identidade visual.",
    publico: "Designers e Empreendedores",
    iconeSvg: ICONES["design-ia"],
    ideia: "Quero ensinar designers e não-designers a usar ferramentas de IA generativa para criação de design gráfico: logotipos com Midjourney e Looka, posts para redes sociais com Canva AI e Adobe Firefly, banners e materiais gráficos, apresentações com Gamma, identidade visual completa, mockups realistas, manipulação de imagens com Photoshop AI e Remove.bg. Inclui teoria de design, paleta de cores e tipografia.\n\nBÔNUS MONETIZAÇÃO: Como vender serviços de identidade visual para empresas locais (R$ 800-3.000 por identidade completa). Como criar pacotes de design mensal para redes sociais (R$ 500-1.500/mês por empresa). Como usar IA para produzir designs 5x mais rápido e triplicar a margem de lucro. Como criar e vender templates de design no Canva, Creative Market e Etsy. Como oferecer redesign de logotipo para empresas com marcas antigas.\n\nBÔNUS PROSPECÇÃO: Como identificar empresas com design ruim no Google Meu Negócio e Instagram (logos feios, posts amadores). Prospecção por nicho: clínicas odontológicas, salões de beleza, escritórios de contabilidade — todos precisam de identidade visual profissional. Como usar IA para criar 3 opções de logotipo para o prospect e enviar como prova. Script de abordagem: mandar mensagem com mockup do novo design da marca do prospect."
  },
  {
    id: "afiliados-ia",
    nome: "Marketing de Afiliados com IA",
    tag: "AFILIADOS",
    descricao: "Use IA para criar conteúdo, analisar produtos, anúncios e automatizar suas vendas como afiliado.",
    publico: "Afiliados Digitais",
    iconeSvg: ICONES["afiliados-ia"],
    ideia: "Quero criar um método para afiliados usarem inteligência artificial em todas as etapas do marketing de afiliados: pesquisa de produtos viáveis no Hotmart, Monetizze e Eduzz com análise de taxa de conversão e comissão, criação de blog com artigos SEO gerados por IA, landing pages de comparação, vídeos de review com avatar, e-mails de remarketing, anúncios no Meta Ads e Google Ads com copy gerada por IA, automação de conteúdo recorrente.\n\nBÔNUS MONETIZAÇÃO: Como escolher produtos de afiliados com alta comissão e demanda usando IA para análise de dados. Como criar conteúdo em escala: 30 artigos otimizados por mês com IA para gerar tráfego orgânico. Como usar IA para criar campanhas de anúncios de afiliados com ROAS positivo. Como montar um portal de afiliados automatizado com conteúdo gerado por IA e receita recorrente. Números reais: blog com 50 artigos pode gerar R$ 2.000-10.000/mês em comissões.\n\nBÔNUS PROSPECÇÃO: Como identificar produtos com poucos afiliados e alta demanda (oportunidade). Como prospectar produtores de conteúdo para oferecer serviço de afiliado premium (você cria todo o conteúdo, ele dá comissão maior). Como usar IA para gerar lista de blogs e canais do nicho que poderiam ser seus parceiros de divulgação. Prospecção em grupos de afiliados: quem tem produto mas não tem tráfego."
  },
  {
    id: "trafego-ia",
    nome: "Tráfego Pago com IA",
    tag: "ANÚNCIOS",
    descricao: "Otimize campanhas de tráfego pago com IA: criação de anúncios, segmentação e lances inteligentes.",
    publico: "Gestores de Tráfego",
    iconeSvg: ICONES["trafego-ia"],
    ideia: "Quero ensinar gestores de tráfego a usar inteligência artificial para criar e otimizar campanhas de anúncios: geração de criativos (imagens, vídeos, textos) com Midjourney, Canva AI e ChatGPT, segmentação inteligente de públicos com análise de dados, otimização de lances com algoritmos preditivos, criação de landing pages com IA, análise de resultados com relatórios inteligentes, teste A/B automatizado. Plataformas: Meta Ads, Google Ads, TikTok Ads.\n\nBÔNUS MONETIZAÇÃO: Como cobrar mais caro como gestor de tráfego usando IA para entregar resultados superiores (R$ 2.000-8.000/mês por cliente + % sobre faturamento). Como usar IA para gerar 20 variações de anúncio em 10 minutos e testar mais rápido. Como criar agência de tráfego com IA: cada gestor atende 3x mais clientes. Como usar IA para criar relatórios visuais impressionantes que justificam o valor cobrado.\n\nBÔNUS PROSPECÇÃO: Como identificar empresas que estão gastando com anúncios mas com ROI baixo (usar Facebook Ad Library e SEMrush). Prospecção local: restaurantes, academias, clínicas que anunciam sem estratégia. Como usar IA para criar auditoria gratuita de anúncios para prospects: analisar campanhas atuais e mostrar o que pode melhorar. Script de abordagem: enviar relatório-análise gerado por IA com 5 melhorias concretas para o negócio do prospect."
  },
  {
    id: "musica-ia",
    nome: "Música e Áudio com IA",
    tag: "ÁUDIO",
    descricao: "Produza músicas, efeitos sonoros e narrações com IA para seus projetos criativos.",
    publico: "Produtores e Criadores",
    iconeSvg: ICONES["musica-ia"],
    ideia: "Quero criar um curso sobre produção musical e de áudio com inteligência artificial: geração de músicas com Suno AI e Udio, efeitos sonoros com Soundraw, narrações com voz sintética ElevenLabs e Murf AI, trilhas sonoras para vídeos com AIVA, mixagem e masterização automática com LANDR, separação de stems com LALAL.AI. Para podcasters, YouTubers, infoprodutores e produtores musicais.\n\nBÔNUS MONETIZAÇÃO: Como vender trilhas sonoras personalizadas para criadores de conteúdo (R$ 50-200 por trilha). Como oferecer serviço de narração com IA para audiolivros e podcasts (R$ 30-100 por capítulo). Como criar e vender pacotes de músicas para uso comercial em plataformas como Artlist e Epidemic Sound. Como produzir e vender beats e instrumentais para artistas no BeatStars. Como criar jingles personalizados para empresas locais usando IA.\n\nBÔNUS PROSPECÇÃO: Como identificar YouTubers e podcasters que usam músicas genéricas ou sem direitos autorais (risco de copyright). Prospecção em grupos de podcasters e criadores de conteúdo. Como usar IA para gerar 3 opções de trilha personalizada para o prospect e enviar como demo. Como prospectar empresas locais que precisam de jingle para rádio local, TV a cabo ou redes sociais."
  },
  {
    id: "chatbot-atendimento",
    nome: "Chatbot e Atendimento com IA",
    tag: "ATENDIMENTO",
    descricao: "Crie chatbots inteligentes para atendimento ao cliente, suporte e vendas 24 horas.",
    publico: "Empresas e Loja Virtual",
    iconeSvg: ICONES["chatbot-atendimento"],
    ideia: "Quero ensinar empreendedores a criar chatbots com IA para atendimento ao cliente: configuração do ManyChat e ChatGPT API, fluxo de conversa para vendas e suporte, integração com WhatsApp Business API, base de conhecimento automática com upload de documentos e PDFs, transferência inteligente para atendente humano, análise de métricas (taxa de resolução, satisfação, tempo de resposta). Casos de uso: e-commerce, clínicas, restaurantes, imobiliárias.\n\nBÔNUS MONETIZAÇÃO: Como vender chatbots personalizados para empresas locais (R$ 800-3.000 de setup + R$ 300-800/mês de manutenção). Nichos mais lucrativos: clínicas (agendamento + cancelamento + dúvidas pré-consulta), lojas online (pedidos + acompanhar entrega + trocas), restaurantes (cardápio + pedidos + reservas), imobiliárias (qualificação + agendamento de visitas). Como criar templates de chatbot e vender como produto digital. Como oferecer chatbot como serviço recorrente para infoprodutores durante lançamentos.\n\nBÔNUS PROSPECÇÃO: Como identificar empresas que não respondem WhatsApp nos finais de semana ou à noite (perdem vendas). Prospecção por nicho: verificar horário de atendimento no Google Meu Negócio. Script de abordagem: demonstrar o chatbot funcionando com o cardápio/catálogo do prospect. Como usar IA para gerar lista de 100 empresas locais com potencial e personalizar mensagem para cada uma."
  },
  {
    id: "ebook-ia",
    nome: "E-book Digital com IA",
    tag: "CONTEÚDO",
    descricao: "Escreva e-books completos com IA: pesquisa, estruturação, escrita, diagramação e capa.",
    publico: "Escritores e Infoprodutores",
    iconeSvg: ICONES["ebook-ia"],
    ideia: "Quero criar um guia completo para produção de e-books com inteligência artificial: pesquisa de tópicos viáveis com análise de demanda, estruturação de capítulos com ChatGPT, escrita com IA mantendo autoria e originalidade, revisão e correção com Grammarly e QuillBot, diagramação com Canva e Google Docs, criação de capa profissional com Midjourney e Canva, publicação na Amazon KDP, Google Play Livros e Hotmart. Incluitemplates prontos e checklist de lançamento.\n\nBÔNUS MONETIZAÇÃO: Como criar e-books e vender como produto de entrada (R$ 17-47) para captar leads e depois vender curso ou mentoria. Como escrever e-books para outros autores como serviço (R$ 500-2.000 por e-book de 30-50 páginas). Como publicar na Amazon KDP e gerar receita passiva com livros sobre nichos Lucrativos. Como criar pacotes de e-books temáticos e vender como assinatura mensal. Como usar e-books como lead magnet para infoprodutos de maior valor.\n\nBÔNUS PROSPECÇÃO: Como identificar nichos com demanda de livros mas poucos títulos buenos no Amazon KDP (usar Publisher Rocket). Prospecção de empresas que precisam de e-books para treinamento interno ou marketing. Como usar IA para gerar amostra gratuita do e-book e enviar para prospects. Script de abordagem para escritores e blogs: oferecer serviço de ghostwriting com IA para publicar mais rápido."
  },
  {
    id: "dados-ia",
    nome: "Análise de Dados com IA",
    tag: "DADOS",
    descricao: "Analise dados e gere insights com IA: dashboards, relatórios e decisões baseadas em dados.",
    publico: "Analistas e Gestores",
    iconeSvg: ICONES["dados-ia"],
    ideia: "Quero ensinar profissionais a usar inteligência artificial para análise de dados: coleta automatizada com web scraping e APIs, limpeza de dados com Python e IA, visualização com dashboards interativos em Google Data Studio e Power BI, geração de relatórios inteligentes com ChatGPT, análise preditiva com modelos simples, identificação de padrões e anomalias. Casos de uso: vendas, marketing, financeiro, operações.\n\nBÔNUS MONETIZAÇÃO: Como vender serviços de análise de dados para empresas (R$ 1.500-5.000 por relatório completo). Como criar dashboards automatizados que se atualizam sozinhos e cobrar mensalidade (R$ 500-1.500/mês). Como usar IA para transformar dados brutos em relatórios executivos em minutos. Como oferecer consultoria de dados para e-commerce: análise de comportamento de compra, previsão de demanda, otimização de estoque. Como criar e vender templates de dashboards.\n\nBÔNUS PROSPECÇÃO: Como identificar empresas que não usam dados para tomar decisões (muitas planilhas, pouca análise). Prospecção em grupos de gestão e controladoresia. Como usar IA para gerar uma análise gratuita dos dados do prospect e mostrar o que pode melhorar. Script de abordagem: pedir acesso a uma planilha de vendas, gerar insights com IA e apresentar 5 descobertas concretas."
  },
  {
    id: "personas-ia",
    nome: "Criação de Personas com IA",
    tag: "MARKETING",
    descricao: "Use IA para criar personas detalhadas, mapas de jornada e estratégias de marketing personalizadas.",
    publico: "Marketers e Estrategistas",
    iconeSvg: ICONES["personas-ia"],
    ideia: "Quero ensinar profissionais de marketing a usar inteligência artificial para criar personas detalhadas, mapas de jornada do cliente e estratégias de marketing personalizadas baseadas em dados comportamentais. Ferramentas: ChatGPT para análise de dados, Google Trends, SparkToro, Meta Audience Insights. Incluitemplates de personas, mapas de jornada e playbooks de marketing por persona.\n\nBÔNUS MONETIZAÇÃO: Como vender serviço de criação de personas para agências e empresas (R$ 800-2.500 por persona completa). Como usar personas para otimizar campanhas de tráfego pago e aumentar ROI dos clientes. Como criar pacotes de persona + estratégia de conteúdo + planejamento de posts. Como oferecer consultoria de marketing estratégico com foco em persona para empresas B2B. Como vender templates de personas e jornadas como produto digital.\n\nBÔNUS PROSPECÇÃO: Como identificar empresas que fazem marketing sem saber exatamente para quem falam (posts genéricos, baixo engajamento). Prospecção em grupos de marketing: quem reclama de não converter. Como usar IA para gerar uma persona draft do prospect e enviar como prova de valor. Script de abordagem: mostrar como a persona que você criou explicaria por que os anúncios atuais não convertem."
  },
  {
    id: "claude-ecossistema",
    nome: "Claude: Chat, Code, Cowork & Designer",
    tag: "ECOSSISTEMA IA",
    descricao: "Domine o ecossistema Claude AI: chat avançado, Claude Code para programação, modo cowork para projetos e design assistido por IA.",
    publico: "Profissionais e Desenvolvedores",
    iconeSvg: ICONES["claude-ecossistema"],
    ideia: "Quero criar um treinamento completo sobre o ecossistema Claude AI. Cobrindo o Claude Chat para conversas avançadas e raciocínio profundo (análise de documentos longos, criação de estratégias, resolução de problemas complexos), Claude Code para programação e automação de código com IA (criação de scripts, debug, refatoração, geração de testes), o modo Cowork para trabalhar em projetos colaborativos com a IA (planejamento de projetos, brainstorming, tomada de decisão em equipe), e Claude Designer para criação de interfaces e design assistido (wireframes, protótipos, landing pages). Foco em prompts avançados para cada ferramenta, fluxos de trabalho profissionais e casos de uso reais para empresas e freelancers.\n\nBÔNUS MONETIZAÇÃO: Como vender consultoria de implementação de Claude para empresas (R$ 2.000-8.000 por projeto). Nichos: escritórios de advocacia (análise de contratos), agências de marketing (criação de conteúdo em escala), empresas de tecnologia (automação de código). Como usar Claude Code para oferecer serviço de desenvolvimento de software 3x mais rápido e cobrar pelo valor entregue. Como criar treinamento corporativo de Claude para empresas (R$ 5.000-15.000 por turma). Como oferecer serviço de automação de processos usando Claude para empresas locais.\n\nBÔNUS PROSPECÇÃO: Como identificar empresas que usam ChatGPT mas poderiam se beneficiar do Claude (raciocínio profundo, documentos longos, código). Prospecção em LinkedIn para CTOs, gestores de produto e diretores de tecnologia. Como usar o próprio Claude para gerar propostas comerciais personalizadas e análise do negócio do prospect. Script de abordagem: enviar comparativo Claude vs ChatGPT para o caso de uso específico do prospect."
  },
  {
    id: "vibe-coding",
    nome: "Vibe Coding com IA",
    tag: "DESENVOLVIMENTO",
    descricao: "Aprenda a criar aplicativos, sites e sistemas completos apenas descrevendo o que quer para a IA — sem ser programador.",
    publico: "Não-Programadores e Empreendedores",
    iconeSvg: ICONES["vibe-coding"],
    ideia: "Quero ensinar pessoas que não sabem programar a criar projetos de software completos usando a técnica de Vibe Coding com inteligência artificial. O método consiste em descrever em linguagem natural o que você quer construir, e a IA gera o código, a estrutura e até o deploy. Inclui criação de sites institucionais, landing pages de alta conversão, dashboards administrativos, APIs REST, automações de processos, sistemas de agendamento, lojas simples e até apps mobile. Ferramentas: Cursor, Bolt.new, Replit, v0.dev, Lovable, Windsurf. Cada módulo com projeto prático publicado online.\n\nBÔNUS MONETIZAÇÃO: Como criar sites e landing pages para empresas locais usando Vibe Coding e cobrar R$ 500-3.000 por projeto (entrega em 1-2 dias). Como oferecer serviço de criação de dashboards personalizados para empresas (R$ 1.000-5.000 por dashboard). Como criar e vender templates de sites e sistemas como produto digital. Como usar Vibe Coding para criar MVPs rápidos e validar ideias de negócio antes de investir em desenvolvimento. Como oferecer manutenção e atualização de sistemas feitos com IA como serviço recorrente.\n\nBÔNUS PROSPECÇÃO: Como identificar empresas com sites ultrapassados ou que ainda não têm presença digital (Google Maps, Instagram). Prospecção local: consultórios, clínicas, restaurantes, salões de beleza que precisam de sistema de agendamento ou cardápio digital. Como usar IA para criar um protótipo funcional do projeto do prospect em 30 minutos e enviar como prova. Script de abordagem: mostrar o site/demo criado com IA e explicar como foi feito em menos de 1 hora."
  },
  {
    id: "skills-ia",
    nome: "Skills de IA: Claude, Codex & Manus",
    tag: "HABILIDADES IA",
    descricao: "Domine as ferramentas de IA mais poderosas do mercado: Claude, Codex, Manus, ChatGPT, Gemini e Copilot — e aprenda a usar cada uma como um profissional.",
    publico: "Profissionais e Empreendedores",
    iconeSvg: ICONES["skills-ia"],
    ideia: "Quero criar um programa completo de habilidades práticas com as ferramentas de IA mais relevantes do mercado. Não é sobre conceitos abstratos — é sobre saber USAR cada ferramenta como um profissional:\n\nSKILL CLAUDE: Claude Chat (conversas avançadas, análise de documentos longos, raciocínio profundo), Claude Code (programação, debug, refatoração, scripts, automação de código), Claude Cowork (projetos colaborativos com IA, brainstorming estratégico, tomada de decisão). Prompts avançados para cada ferramenta.\n\nSKILL CODEX: OpenAI Codex e Codex CLI (automação de código, geração de projetos completos, testes automáticos, deploy). Como usar para criar sistemas, APIs e aplicações completas descrevendo em linguagem natural.\n\nSKILL MANUS: Manus AI (agente autônomo que executa tarefas complexas: pesquisa, análise de dados, criação de documentos, automação de processos, coordenação de múltiplas etapas). Como criar workflows completos que o Manus executa sozinho.\n\nSKILL CHATGPT: GPT-4o e o1 (análise de imagens, raciocínio avançado, plugins, GPTs customizados, modo canvas). Como usar para copywriting, análise de dados, criação de conteúdo e automação.\n\nSKILL GEMINI: Google Gemini (integração com Google Workspace, análise de vídeo, pesquisa com Grounding, Gems customizados). Como usar no dia a dia com Docs, Sheets, Slides e Gmail.\n\nSKILL COPILOT: Microsoft Copilot (integração com Office 365, Word, Excel, PowerPoint, Outlook). Como automatizar relatórios, apresentações e e-mails corporativos.\n\nCada skill com projeto prático, atalhos, templates de prompts testados e caso de uso real. O aluno sai sabendo usar cada ferramenta profissionalmente.\n\nBÔNUS MONETIZAÇÃO: Como oferecer serviço de consultoria de IA para empresas: auditar qual ferramenta usar para cada tarefa e implementar (R$ 2.000-8.000 por consultoria). Como vender treinamento corporativo de ferramentas de IA para equipes (R$ 5.000-15.000 por turma). Como usar essas skills para trabalhar remotamente para empresas internacionais que pagam em dólar/euro. Como criar micro-serviços especializados: análise de contratos com Claude, automação de código com Codex, pesquisa de mercado com Manus. Como oferecer gestão de IA para empresas: escolher, implementar e manter as ferramentas certas.\n\nBÔNUS PROSPECÇÃO: Como identificar empresas que pagam caro por tarefas que essas ferramentas automatizam (análise de dados, criação de conteúdo, programação). Prospecção no LinkedIn para CTOs, diretores de operações e gestores de equipe. Como usar o próprio Claude/Codex/Manus para gerar propostas comerciais e análise do negócio do prospect em minutos. Script de abordagem: fazer uma demonstração ao vivo usando a ferramenta para resolver um problema real do prospect."
  },
  {
    id: "criar-gpts",
    nome: "Aprenda a Criar GPTs",
    tag: "PERSONALIZAÇÃO",
    descricao: "Crie GPTs personalizados para seu negócio: assistentes de vendas, suporte, treinamento e automação com IA.",
    publico: "Empreendedores e Criadores",
    iconeSvg: ICONES["criar-gpts"],
    ideia: "Quero ensinar empreendedores e criadores a construir seus próprios GPTs personalizados na plataforma OpenAI. Inclui criação de assistentes de vendas que conhecem o catálogo de produtos e respondem dúvidas, chatbots de suporte com base de conhecimento completa, assistentes de treinamento para equipes internas, geradores de conteúdo especializados por nicho, analisadores de documentos e contratos, assistentes de planejamento e organização. Cobrindo configuração de instruções detalhadas, upload de conhecimento (PDFs, documentos, planilhas), ações conectadas a APIs externas, testes e iteração, e publicação na loja de GPTs da OpenAI.\n\nBÔNUS MONETIZAÇÃO: Como criar GPTs personalizados para empresas e cobrar R$ 500-2.000 por GPT + R$ 200-500/mês de manutenção. Nichos lucrativos: GPT para escritórios de advocacia (análise de contratos), GPT para clínicas (triagem de pacientes), GPT para imobiliárias (qualificação de leads), GPT para e-commerce (atendimento e recomendações). Como publicar GPTs na loja da OpenAI e monetizar com assinatura. Como criar GPTs como lead magnet para vender outros produtos. Como criar pacotes de GPTs para empresas (suporte + vendas + treinamento).\n\nBÔNUS PROSPECÇÃO: Como identificar empresas que usam ChatGPT mas precisam de algo personalizado com dados próprios. Prospecção em LinkedIn para gestores de operações e diretores de inovação. Como usar IA para gerar protótipo de GPT funcional para o prospect em 30 minutos. Script de abordagem: criar um GPT-demo com 3 perguntas reais do negócio do prospect e demonstrar a diferença entre ChatGPT genérico e GPT personalizado."
  },
]

export function gerarCoverSvg(p: ProdutoValidado): string {
  return coverSvg(p)
}
