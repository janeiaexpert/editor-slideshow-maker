export interface ProdutoValidado {
  id: string
  nome: string
  tag: string
  descricao: string
  publico: string
  iconeSvg: string
  ideia: string
  atualizadoEm?: string
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
    descricao: "Use IA conversacional (ChatGPT, Claude, Gemini) para automatizar vendas: scripts, follow-up, nutrição de leads e fechamento no WhatsApp e Instagram.",
    publico: "Empreendedores e Vendedores",
    iconeSvg: ICONES["chatgpt-vendas"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero criar um treinamento completo e atualizado (2026) sobre como usar IAs conversacionais — ChatGPT, Claude e Gemini — para automatizar o processo de vendas: abordagem inicial, qualificação com perguntas estratégicas, follow-up automático, nutrição de leads por e-mail e WhatsApp, recuperação de carrinhos abandonados com mensagens personalizadas e relatórios de conversão. Inclui scripts prontos para WhatsApp Business, Instagram DM e ligação, integração com CRM (RD Station, HubSpot, Kommo) e construção de assistentes próprios com base de conhecimento do negócio.\n\nBÔNUS MONETIZAÇÃO: Como vender serviço de automação de vendas com IA para empresas locais (lojas, clínicas, restaurantes, imobiliárias). Sugestão de precificação 2026: setup R$ 800-3.000 + mensalidade de manutenção R$ 500-1.200/mês. Como criar pacotes de automação para infoprodutores: assistente de vendas + sequência de nutrição + recuperação de carrinho. Como monetizar como afiliado de ferramentas (ManyChat, Kommo, RD Station) com comissão recorrente.\n\nBÔNUS PROSPECÇÃO: Como prospectar empresas locais usando Google Maps e Instagram para identificar negócios que ainda vendem manualmente ou demoram a responder no WhatsApp. Script de abordagem por WhatsApp Business mostrando quanto elas perdem sem automação. Como usar a própria IA para gerar lista de prospects, personalizar mensagens e criar propostas. Estratégia de portfólio: montar 3 automações-demo para nichos diferentes antes de cobrar."
  },
  {
    id: "avatares-ia",
    nome: "Avatares Digitais com IA",
    tag: "CRIAÇÃO",
    descricao: "Gere avatares realistas com IA (HeyGen Avatar IV, Synthesia, Kling) para vídeos, lives e marketing — inclusive apresentadores ao vivo no TikTok e YouTube.",
    publico: "Criadores de Conteúdo",
    iconeSvg: ICONES["avatares-ia"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero ensinar criadores e empreendedores a criar avatares digitais realistas com as ferramentas líderes de 2026: HeyGen (Avatar IV com microexpressões, tradução com lip-sync e avatares ao vivo para lives no TikTok e YouTube), Synthesia (padrão corporativo, 140+ idiomas), Kling Avatar e D-ID. Do roteiro ao vídeo finalizado: dublagem, expressões, personalização e tradução multilíngue. Inclui templates de apresentação corporativa, vídeos para redes sociais, tutoriais e vídeos de vendas com avatar.\n\nBÔNUS MONETIZAÇÃO: Como vender vídeos com avatar para empresas — sugestão 2026: R$ 300-1.000 por vídeo. Nichos lucrativos: treinamentos corporativos e onboarding de RH, apresentações de produtos para e-commerce, conteúdo multilíngue para empresas que exportam. Como criar pacotes de assinatura para empresas com necessidade mensal de vídeos. Como usar avatares em vídeos de afiliados e canais sem rosto para gerar comissões.\n\nBÔNUS PROSPECÇÃO: Como prospectar empresas de médio porte que precisam de treinamentos internos sem equipe de vídeo, via LinkedIn (RH e treinamento corporativo). Como usar o próprio avatar como portfólio: criar 3 vídeos-demo para nichos diferentes (educação, saúde, tecnologia). Estratégia de cold outreach com vídeo personalizado usando avatar com o nome do prospect."
  },
  {
    id: "carrosseis-virais",
    nome: "Carrosséis Virais com IA",
    tag: "CONTEÚDO",
    descricao: "Produza carrosséis e Shorts que geram retenção usando IA no roteiro, design e storytelling — do gancho à legenda otimizada.",
    publico: "Social Media e Criadores",
    iconeSvg: ICONES["carrosseis-virais"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero criar um método atualizado (2026) para produzir carrosséis virais e vídeos curtos usando IA em todas as etapas: pesquisa de tópicos em alta, roteiro com frameworks de copy (PAS, AIDA, 4U), design de slides com Canva AI e Adobe Firefly, edição de Shorts/Reels/TikTok com o app Edits da Meta, copy de legenda otimizada, hashtags estratégicas e análise de métricas. Inclui templates por nicho: saúde, finanças, tecnologia, alimentação, fitness, direito.\n\nBÔNUS MONETIZAÇÃO: Como vender pacotes de conteúdo para empresas locais — sugestão 2026: R$ 800-2.000/mês por 12 peças. Como monetizar criando conteúdo para infoprodutores durante lançamentos. Como usar carrosséis e Shorts para promover produtos de afiliados (Hotmart, Kiwify) e gerar comissões. Como empacotar o método como infoproduto de entrada (R$ 97-297).\n\nBÔNUS PROSPECÇÃO: Como identificar empresas locais com Instagram fraco (posts amadores, baixa frequência). Prospecção por nicho: academias, clínicas, restaurantes, lojas de roupa. Script de abordagem: enviar 3 peças prontas com a identidade do prospect como prova. Como usar DM do Instagram para prospectar seguidores de concorrentes."
  },
  {
    id: "ia-iniciantes",
    nome: "IA para Iniciantes",
    tag: "TECNOLOGIA",
    descricao: "Do zero ao primeiro projeto com IA em 2026: ChatGPT, Gemini, Copilot e Notion AI na prática, sem programação.",
    publico: "Iniciantes em Tecnologia",
    iconeSvg: ICONES["ia-iniciantes"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero criar um curso introdutório e atualizado (2026) sobre inteligência artificial para pessoas sem experiência técnica. Abordagem 100% prática com as ferramentas do dia a dia: ChatGPT, Google Gemini (integrado ao Gmail, Docs e Sheets), Microsoft Copilot (Word, Excel, Outlook), Notion AI, Canva AI e CapCut. Cada módulo com projeto prático: escrever e-mail profissional, criar posts, organizar planilhas, gerar imagens para o negócio, resumir PDFs e atas de reunião.\n\nBÔNUS MONETIZAÇÃO: Como usar IA para ganhar produtividade no trabalho e se destacar. Como oferecer serviços simples de IA para empresas locais: criar posts, organizar dados, responder e-mails, montar apresentações. Como criar micro-serviços em Workana, 99Freelas e Fiverr entregando 3x mais rápido com IA. Como transformar o conhecimento em checklist ou mini-ebook e vender como produto digital de entrada.\n\nBÔNUS PROSPECÇÃO: Como prospectar em grupos de Facebook e WhatsApp onde pessoas pedem ajuda com tecnologia. Como criar conteúdo educativo no LinkedIn e Instagram para atrair pequenos empresários. Script de abordagem para consultoria básica: mostrar como a IA economiza cerca de 5 horas por semana no negócio do prospect."
  },
  {
    id: "copy-ia",
    nome: "Copywriting com IA",
    tag: "MARKETING",
    descricao: "Gere anúncios, e-mails, páginas de vendas e VSLs com IA usando prompt engineering e frameworks validados (PAS, AIDA, 4U).",
    publico: "Marketers e Copywriters",
    iconeSvg: ICONES["copy-ia"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero ensinar copywriters e profissionais de marketing a usar IA generativa (ChatGPT, Claude, Gemini) para criar textos persuasivos: anúncios para Meta Ads, Google Ads e TikTok Ads, e-mails de nutrição e lançamento, landing pages completas, scripts de VSL, posts e descrições de produto para e-commerce. Foco em prompt engineering com frameworks PAS, AIDA, 4U, QUEST e Before-After-Bridge, além de pesquisa de voz do cliente (reviews, comentários) para alimentar a IA. Inclui banco de prompts testados por nicho.\n\nBÔNUS MONETIZAÇÃO: Como vender copy com IA para e-commerces — sugestão 2026: R$ 500-1.500 por página de produto, pacotes de lançamento para infoprodutores (VSL + landing + e-mails + anúncios). Como usar IA para produzir copy de afiliados em escala. Como oferecer textos para empresas locais: cardápios, Google Meu Negócio, panfletos.\n\nBÔNUS PROSPECÇÃO: Como usar a Biblioteca de Anúncios do Facebook para achar empresas com criativos fracos e oferecer melhoria. Como gerar 3 versões de anúncio para o prospect com IA e enviar como prova. Prospecção em grupos de marketing digital e marketplaces de freelas."
  },
  {
    id: "video-ia",
    nome: "Edição de Vídeo com IA",
    tag: "PRODUÇÃO",
    descricao: "Produza vídeos completos com IA em 2026: roteiro, voz sintética, avatar, edição e legendas — do Reels ao YouTube.",
    publico: "Criadores de Vídeo",
    iconeSvg: ICONES["video-ia"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero criar um guia prático e atualizado (2026) de produção de vídeo com IA: roteirização com ChatGPT/Claude, voz sintética com ElevenLabs, avatar com HeyGen, geração de cenas com Kling, Runway e Pika, edição e legendas automáticas com CapCut e o app Edits da Meta, remoção de fundo e upscaling. Fluxos para YouTube (vídeos longos e Shorts), Instagram Reels, TikTok e videoaulas de cursos.\n\nBÔNUS MONETIZAÇÃO: Como vender edição com IA para criadores — sugestão 2026: R$ 150-400 por Short/Reel, R$ 800-3.000 por vídeo longo. Como montar canais sem rosto (compilações, listas, notícias) e monetizar com AdSense e afiliados. Como produzir vídeos promocionais e depoimentos para empresas locais. Como vender pacotes de vídeo para infoprodutores em lançamentos.\n\nBÔNUS PROSPECÇÃO: Como achar criadores que postam pouco e oferecer edição recorrente. Prospecção no LinkedIn para vídeos institucionais. Como criar reels-demo por nicho como portfólio. Estratégia: listar 50 criadores no Instagram e enviar vídeo-demo personalizado."
  },
  {
    id: "cursos-ia",
    nome: "Criação de Cursos com IA",
    tag: "INFOPRODUTO",
    descricao: "Produza e lance cursos digitais com IA em 2026: validação de nicho, roteiro, slides, edição e estratégia na Hotmart e Kiwify.",
    publico: "Infoprodutores",
    iconeSvg: ICONES["cursos-ia"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero ensinar infoprodutores a produzir cursos digitais completos com IA: validação de nicho com pesquisa assistida, roteiro de aulas, slides com Gamma e Canva AI, gravação com teleprompter, edição automatizada, materiais de apoio (PDFs, checklists, planilhas), configuração de plataforma — Hotmart (taxa 2026: 9,9% + R$ 1 por venda) ou Kiwify (8,99% + R$ 2,49) — e estratégia de lançamento com copy e anúncios gerados por IA.\n\nBÔNUS MONETIZAÇÃO: Como criar e lançar um curso em 30 dias com IA em todas as etapas. Como prestar serviço de produção de curso para especialistas (sugestão: R$ 3.000-12.000 por curso). Como criar mini-cursos de 1-2h como produto de entrada (R$ 47-97) para captar leads. Como atualizar módulos antigos com IA sem regravar tudo.\n\nBÔNUS PROSPECÇÃO: Como achar especialistas com audiência e sem produto digital. Prospecção em eventos e comunidades de marketing digital. Como gerar 1 módulo demo com IA e enviar como prova. Script de abordagem mostrando o curso que você criaria para o prospect."
  },
  {
    id: "automacao-marketing",
    nome: "Automação de Marketing com IA",
    tag: "AUTOMAÇÃO",
    descricao: "Monte marketing automatizado com agentes de IA em 2026: n8n, WhatsApp, e-mail, CRM e funil funcionando sozinho.",
    publico: "Empreendedores Digitais",
    iconeSvg: ICONES["automacao-marketing"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero criar um sistema completo e atualizado (2026) de automação de marketing com agentes de IA: atendente e vendedor no WhatsApp via API oficial, nutrição por e-mail com sequências personalizadas, recuperação de carrinho, qualificação e pontuação de leads, segmentação por comportamento e relatórios inteligentes. Ferramentas: n8n (padrão 2026 para agentes e workflows, 1500+ integrações), Make, ManyChat, Kommo, RD Station, HubSpot. Integrações com Hotmart, Kiwify e ERPs.\n\nBÔNUS MONETIZAÇÃO: Como vender automação completa para empresas locais — sugestão 2026: setup R$ 2.000-8.000 + recorrência R$ 800-2.000/mês. Nichos: clínicas (agendamento + follow-up), imobiliárias (qualificação), restaurantes (pedidos), academias (retenção). Como vender templates de workflow e automação como serviço recorrente para infoprodutores.\n\nBÔNUS PROSPECÇÃO: Como achar empresas que perdem vendas por demora no WhatsApp. Prospecção em comunidades de empreendedores. Script de demonstração: montar um fluxo-demo com os dados do prospect e mostrar leads recuperados. Como usar IA para gerar auditorias de automação personalizadas em minutos."
  },
  {
    id: "design-ia",
    nome: "Design Gráfico com IA",
    tag: "DESIGN",
    descricao: "Crie logos, posts, banners e identidade visual com IA em 2026: Midjourney v7, Adobe Firefly, Canva AI e Flux.",
    publico: "Designers e Empreendedores",
    iconeSvg: ICONES["design-ia"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero ensinar designers e não-designers a criar design profissional com a geração atual de IA (2026): logotipos com Midjourney v7 e Adobe Firefly, posts com Canva AI, banners, apresentações com Gamma, identidade visual completa, mockups, tratamento de imagem e remoção de fundo. Inclui fundamentos que a IA não substitui: paleta, tipografia, hierarquia e consistência de marca — e como treinar a IA no estilo visual do cliente.\n\nBÔNUS MONETIZAÇÃO: Como vender identidade visual para empresas locais — sugestão 2026: R$ 1.000-4.000 por projeto. Pacotes mensais de social media (R$ 800-2.000/mês). Como produzir 5x mais rápido com IA e aumentar a margem. Como vender templates no Canva, Creative Market e Etsy. Como oferecer redesign para marcas antigas.\n\nBÔNUS PROSPECÇÃO: Como achar empresas com identidade fraca no Google Meu Negócio e Instagram. Nichos: clínicas, salões, escritórios, restaurantes. Como gerar 3 opções de logo com IA e enviar como prova. Script: mandar mockup da nova marca do prospect antes da primeira reunião."
  },
  {
    id: "afiliados-ia",
    nome: "Marketing de Afiliados com IA",
    tag: "AFILIADOS",
    descricao: "Venda como afiliado com IA em 2026: escolha de produtos (Hotmart, Kiwify, Eduzz), conteúdo SEO, reviews e anúncios.",
    publico: "Afiliados Digitais",
    iconeSvg: ICONES["afiliados-ia"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero criar um método atualizado (2026) para afiliados usarem IA em todas as etapas: garimpagem de produtos em Hotmart, Kiwify, Eduzz e Monetizze (comissão, conversão, temperatura e concorrência), blogs com artigos SEO gerados e revisados por IA, páginas de comparação, vídeos de review com avatar, e-mails de remarketing, anúncios Meta/Google/TikTok com copy de IA e rotina de conteúdo recorrente. Nichos em alta 2026: renda online, saúde e bem-estar, finanças, desenvolvimento pessoal e tecnologia.\n\nBÔNUS MONETIZAÇÃO: Como escolher produtos com comissão de 30-50% e demanda real. Como escalar conteúdo: dezenas de artigos e Shorts por mês com IA + revisão humana. Como rodar campanhas de afiliado com ROAS positivo testando criativos em volume. Como montar um portal de comparação automatizado com receita recorrente de comissões.\n\nBÔNUS PROSPECÇÃO: Como achar produtos bons com poucos afiliados (janela de oportunidade). Como oferecer serviço de afiliado premium para produtores (você cria tudo por comissão maior). Como mapear blogs e canais do nicho para parcerias. Prospecção em comunidades de afiliados e produtores."
  },
  {
    id: "trafego-ia",
    nome: "Tráfego Pago com IA",
    tag: "ANÚNCIOS",
    descricao: "Gestão de tráfego com IA em 2026: criativos em volume, segmentação, testes A/B e relatórios que justificam seu preço.",
    publico: "Gestores de Tráfego",
    iconeSvg: ICONES["trafego-ia"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero ensinar gestores de tráfego a operar com IA em 2026: geração de criativos em volume (imagens, vídeos UGC com IA, textos), segmentação e análise de públicos, otimização de lances, landing pages rápidas, relatórios inteligentes e rotina de testes A/B. Plataformas: Meta Ads, Google Ads e TikTok Ads. Foco no que o mercado paga: ler dados, testar rápido e comunicar resultado.\n\nBÔNUS MONETIZAÇÃO: Como precificar como gestor com IA — sugestão 2026: R$ 2.500-10.000/mês por cliente + percentual sobre verba ou faturamento. Como gerar 20+ variações de criativo por semana e acelerar testes. Como montar operação enxuta atendendo mais contas por gestor. Como vender auditorias de conta como porta de entrada.\n\nBÔNUS PROSPECÇÃO: Como achar empresas com ROI baixo usando Biblioteca de Anúncios e ferramentas de análise. Prospecção local: restaurantes, academias, clínicas. Como gerar uma auditoria gratuita com IA (5 melhorias concretas) e enviar ao prospect. Script: relatório-análise personalizado antes da call."
  },
  {
    id: "musica-ia",
    nome: "Música e Áudio com IA",
    tag: "ÁUDIO",
    descricao: "Produza músicas, trilhas, efeitos e narrações com IA em 2026: Suno, Udio e ElevenLabs para vídeos, podcasts e marcas.",
    publico: "Produtores e Criadores",
    iconeSvg: ICONES["musica-ia"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero criar um curso atualizado (2026) de áudio com IA: músicas completas com Suno e Udio (letra, estilo, master), efeitos e trilhas com ferramentas generativas, narrações e clonagem de voz com ElevenLabs, trilhas para vídeos e anúncios, separação de stems, podcasts com edição assistida e noções de direitos de uso comercial de cada plataforma. Para YouTubers, podcasters, infoprodutores e produtores musicais.\n\nBÔNUS MONETIZAÇÃO: Como vender trilhas personalizadas para criadores — sugestão 2026: R$ 80-300 por trilha. Narração com IA para audiolivros e podcasts por capítulo. Pacotes de música para uso comercial. Beats e instrumentais em marketplaces. Jingles para empresas locais (rádio, redes sociais, espera telefônica).\n\nBÔNUS PROSPECÇÃO: Como achar criadores usando música genérica ou com risco de copyright. Prospecção em comunidades de podcasters e YouTubers. Como gerar 3 opções de trilha demo para o prospect. Como prospectar empresas locais que precisam de identidade sonora."
  },
  {
    id: "chatbot-atendimento",
    nome: "Chatbot e Atendimento com IA",
    tag: "ATENDIMENTO",
    descricao: "Atendimento 24h com agentes de IA em 2026: WhatsApp API, base de conhecimento, agendamento e transferência humana.",
    publico: "Empresas e Loja Virtual",
    iconeSvg: ICONES["chatbot-atendimento"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero ensinar empreendedores a implantar atendimento com agentes de IA (evolução dos chatbots): fluxos no WhatsApp via API oficial, base de conhecimento com documentos e catálogos da empresa, agendamento e cancelamento automáticos, acompanhamento de pedidos e entregas, qualificação de leads, transferência para humano com contexto e métricas (resolução, satisfação, tempo de resposta). Ferramentas 2026: n8n, ManyChat, Kommo, Typebot. Casos: e-commerce, clínicas, restaurantes, imobiliárias, academias.\n\nBÔNUS MONETIZAÇÃO: Como vender projetos de atendimento com IA — sugestão 2026: setup R$ 1.200-4.000 + recorrência R$ 400-1.000/mês. Nichos: clínicas (agendamento e dúvidas), lojas online (pedidos, trocas, rastreio), restaurantes (cardápio e reservas), imobiliárias (qualificação e visitas). Como vender templates por nicho e recorrência em lançamentos de infoprodutores.\n\nBÔNUS PROSPECÇÃO: Como achar empresas que não respondem à noite e fins de semana. Verificação de horário no Google Meu Negócio por nicho. Script: demonstrar o agente com o catálogo do prospect. Como gerar lista de empresas locais e personalizar a abordagem com IA."
  },
  {
    id: "ebook-ia",
    nome: "E-book Digital com IA",
    tag: "CONTEÚDO",
    descricao: "Escreva e publique e-books com IA em 2026: pesquisa de nicho, escrita, capa, diagramação e Amazon KDP + Hotmart.",
    publico: "Escritores e Infoprodutores",
    iconeSvg: ICONES["ebook-ia"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero criar um guia atualizado (2026) de produção de e-books com IA: pesquisa de nichos com demanda (saúde, finanças, relacionamentos, educação, desenvolvimento pessoal), estrutura de capítulos, escrita assistida mantendo autoria, revisão, diagramação no Canva, capa profissional com IA, publicação na Amazon KDP, Google Play Livros, Hotmart e Kiwify. Inclui templates e checklist de lançamento — e quando vale adaptar um e-book em curso ou mentoria.\n\nBÔNUS MONETIZAÇÃO: Como usar e-book como produto de entrada — sugestão 2026: R$ 19-57 — para captar leads e vender ofertas maiores. Ghostwriting com IA para autores (sugestão: R$ 800-3.000 por e-book). Receita passiva na Amazon KDP em nichos evergreen. Pacotes temáticos e e-books como lead magnet de infoprodutos.\n\nBÔNUS PROSPECÇÃO: Como achar nichos com demanda e poucos títulos bons na Amazon. Prospecção de empresas que precisam de e-books institucionais e de treinamento. Como gerar um capítulo de amostra com IA e enviar ao prospect. Abordagem para blogs e escritores: publicar mais rápido com ghostwriting assistido."
  },
  {
    id: "dados-ia",
    nome: "Análise de Dados com IA",
    tag: "DADOS",
    descricao: "Transforme dados em decisão com IA em 2026: dashboards, relatórios executivos e previsões para vendas e marketing.",
    publico: "Analistas e Gestores",
    iconeSvg: ICONES["dados-ia"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero ensinar profissionais a analisar dados com IA em 2026: coleta e limpeza assistida, dashboards em Looker Studio e Power BI, relatórios executivos gerados com IA a partir dos números, detecção de padrões e anomalias, previsões simples de demanda e churn. Casos: vendas, marketing, financeiro, estoque de e-commerce e operações. Foco em comunicar insight — não só montar gráfico.\n\nBÔNUS MONETIZAÇÃO: Como vender análises e dashboards — sugestão 2026: R$ 2.000-8.000 por projeto, recorrência de R$ 800-2.000/mês por dashboards atualizados. Consultoria para e-commerce (compra, demanda, estoque). Templates de dashboard por nicho.\n\nBÔNUS PROSPECÇÃO: Como achar empresas decidindo no achismo (muitas planilhas, pouca análise). Como gerar uma análise gratuita com os dados do prospect mostrando 5 achados. Script: pedir uma planilha de vendas e devolver insights acionáveis."
  },
  {
    id: "personas-ia",
    nome: "Criação de Personas com IA",
    tag: "MARKETING",
    descricao: "Crie personas, jornadas e mensagens com IA em 2026 — e use UGC e micro-influenciadores para validar na prática.",
    publico: "Marketers e Estrategistas",
    iconeSvg: ICONES["personas-ia"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero ensinar marketers a criar personas e jornadas com IA em 2026: análise de reviews, comentários e dados de audiência, construção de personas baseadas em comportamento real, mapas de jornada, ângulos de mensagem por persona e validação com conteúdo UGC e micro-influenciadores. Ferramentas: ChatGPT/Claude para análise, Google Trends, Meta Audience Insights. Inclui templates de persona, jornada e playbook de mensagem.\n\nBÔNUS MONETIZAÇÃO: Como vender projetos de persona + estratégia — sugestão 2026: R$ 1.200-4.000 por projeto. Como usar personas para elevar o ROI de tráfego dos clientes. Pacotes persona + calendário de conteúdo. Consultoria B2B de posicionamento. Templates como produto digital.\n\nBÔNUS PROSPECÇÃO: Como achar empresas falando para todo mundo (posts genéricos, baixo engajamento). Como gerar uma persona-draft do prospect com IA e enviar como prova de valor. Script: mostrar por que os anúncios atuais não convertem na visão da persona."
  },
  {
    id: "claude-ecossistema",
    nome: "Claude: Chat, Code, Cowork & Designer",
    tag: "ECOSSISTEMA IA",
    descricao: "Domine o ecossistema Claude em 2026: chat avançado, Claude Code para programação e fluxos profissionais com IA.",
    publico: "Profissionais e Desenvolvedores",
    iconeSvg: ICONES["claude-ecossistema"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero criar um treinamento atualizado (2026) sobre o ecossistema Claude: Claude Chat para raciocínio profundo (documentos longos, contratos, estratégias, análise complexa), Claude Code para programação (scripts, debug, refatoração, testes, automações), fluxos de trabalho com IA para projetos (planejamento, brainstorming, decisão) e criação de interfaces e landing pages assistida. Foco em prompts avançados, projetos reais e rotinas profissionais para empresas e freelancers.\n\nBÔNUS MONETIZAÇÃO: Como vender consultoria de implementação — sugestão 2026: R$ 3.000-10.000 por projeto. Nichos: advocacia (análise de contratos), marketing (conteúdo em escala), tecnologia (automação de código). Treinamento corporativo por turma. Automação de processos para empresas locais.\n\nBÔNUS PROSPECÇÃO: Como achar empresas presas em tarefas manuais de leitura e código. Prospecção no LinkedIn (CTOs, produto, operações). Como gerar propostas e diagnósticos com a própria IA. Script: comparativo prático aplicado ao caso do prospect."
  },
  {
    id: "vibe-coding",
    nome: "Vibe Coding com IA",
    tag: "DESENVOLVIMENTO",
    descricao: "Crie sites, landing pages e sistemas descrevendo em português em 2026: Lovable, Bolt, v0, Cursor e Windsurf.",
    publico: "Não-Programadores e Empreendedores",
    iconeSvg: ICONES["vibe-coding"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero ensinar não-programadores a criar software com IA em 2026 (vibe coding): descrever em linguagem natural e receber sites institucionais, landing pages de alta conversão, dashboards, sistemas de agendamento, cardápios digitais e MVPs funcionais publicados online. Ferramentas: Lovable, Bolt, v0, Replit, Cursor e Windsurf. Cada módulo com projeto publicado + noções de domínio, hospedagem e ajustes sem código.\n\nBÔNUS MONETIZAÇÃO: Como vender sites e landings para empresas locais — sugestão 2026: R$ 800-4.000 por projeto com entrega em dias. Dashboards personalizados por assinatura. Templates como produto digital. MVPs para validar ideias antes de investir. Manutenção recorrente.\n\nBÔNUS PROSPECÇÃO: Como achar empresas sem site ou com site ultrapassado (Maps, Instagram). Nichos: consultórios, clínicas, restaurantes, salões, prestadores de serviço. Como gerar um protótipo funcional em minutos e enviar como prova. Script: mostrar o demo feito em menos de 1 hora."
  },
  {
    id: "skills-ia",
    nome: "Skills de IA: Claude, Codex & Manus",
    tag: "HABILIDADES IA",
    descricao: "Habilidades práticas nas IAs líderes de 2026: ChatGPT, Claude, Gemini, Codex, Manus e Copilot — uso profissional.",
    publico: "Profissionais e Empreendedores",
    iconeSvg: ICONES["skills-ia"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero criar um programa atualizado (2026) de habilidades práticas nas ferramentas de IA líderes — foco em USAR cada uma como profissional:\n\nSKILL CHATGPT: modelos atuais (texto, voz, imagens, análise de arquivos, GPTs customizados, Canvas). Copywriting, análise de dados, conteúdo e automação.\n\nSKILL CLAUDE: chat avançado e raciocínio profundo (documentos longos, contratos, estratégias) + Claude Code (programação, debug, scripts, automação).\n\nSKILL GEMINI: integração com Google Workspace (Docs, Sheets, Slides, Gmail), pesquisa com grounding, Gems customizados e análise de vídeo.\n\nSKILL CODEX: geração e automação de código por linguagem natural — sistemas, APIs, testes e deploys.\n\nSKILL MANUS: agente autônomo para tarefas complexas — pesquisa profunda, documentos, planilhas, workflows multietapas.\n\nSKILL COPILOT: produtividade no Microsoft 365 — relatórios no Word, análises no Excel, apresentações e e-mails.\n\nCada skill com projeto prático, atalhos, prompts testados e caso real. O aluno termina operando as 6 ferramentas profissionalmente.\n\nBÔNUS MONETIZAÇÃO: Como vender consultoria de IA para empresas — sugestão 2026: R$ 3.000-10.000 por projeto (auditoria + implementação). Treinamento corporativo por turma. Como empacotar cada skill como serviço (automação de relatórios, atendimento, conteúdo).\n\nBÔNUS PROSPECÇÃO: Como achar empresas afogadas em tarefas manuais repetitivas. Prospecção no LinkedIn (operações, financeiro, RH). Como gerar um diagnóstico gratuito com IA mostrando horas economizadas. Script: demo ao vivo com um processo real do prospect."  },
  {
    id: "criar-gpts",
    nome: "Aprenda a Criar GPTs",
    tag: "PERSONALIZAÇÃO",
    descricao: "Crie assistentes personalizados com os dados do seu negócio em 2026: GPTs, Gems e atendentes de WhatsApp com IA.",
    publico: "Empreendedores e Criadores",
    iconeSvg: ICONES["criar-gpts"],
    atualizadoEm: "22/09/2026",
    ideia: "Quero ensinar empreendedores a criar assistentes de IA com os dados do próprio negócio em 2026: GPTs personalizados (instruções, base de conhecimento com PDFs e planilhas, ações), Gems do Gemini para rotinas com Google Workspace, e atendentes de WhatsApp com IA para vendas e suporte. Casos: assistente de vendas com catálogo, suporte com base de conhecimento, treinamento de equipes, geradores de conteúdo por nicho e analisadores de documentos. Inclui testes, iteração e publicação.\n\nBÔNUS MONETIZAÇÃO: Como vender assistentes personalizados — sugestão 2026: R$ 800-3.000 por projeto + recorrência R$ 300-800/mês. Nichos: advocacia (contratos), clínicas (triagem), imobiliárias (qualificação), e-commerce (atendimento). Assistentes como lead magnet e pacotes por empresa.\n\nBÔNUS PROSPECÇÃO: Como achar empresas que usam IA genérica e precisam de dados próprios. Prospecção no LinkedIn (operações, inovação). Como gerar um demo funcional em minutos com perguntas reais do negócio. Script: demonstrar genérico vs personalizado lado a lado."
  },
]

export function gerarCoverSvg(p: ProdutoValidado): string {
  return coverSvg(p)
}
