export type Paleta = { id: string; nome: string; cores: string[] }
export type Fonte = { id: string; nome: string; estilo: string; preview: string }

export const PALETTES: Paleta[] = [
  { id: "marrom", nome: "Marrom Clássico", cores: ["#8B5E3C", "#6B4226", "#D4B896", "#F5EFE8", "#1A1A1A"] },
  { id: "azul", nome: "Azul Corporativo", cores: ["#1E40AF", "#1E3A5F", "#93C5FD", "#EFF6FF", "#0F172A"] },
  { id: "verde", nome: "Verde Natureza", cores: ["#16A34A", "#166534", "#86EFAC", "#F0FDF4", "#052E16"] },
  { id: "roxo", nome: "Roxo Criativo", cores: ["#9333EA", "#6B21A8", "#D8B4FE", "#FAF5FF", "#1E1B4B"] },
  { id: "vermelho", nome: "Vermelho Energia", cores: ["#DC2626", "#991B1B", "#FCA5A5", "#FEF2F2", "#450A0A"] },
  { id: "rosa", nome: "Rosa Elegante", cores: ["#DB2777", "#9D174D", "#F9A8D4", "#FDF2F8", "#831843"] },
  { id: "preto", nome: "Preto Premium", cores: ["#1A1A1A", "#2D2D2D", "#D4B896", "#F5EFE8", "#000000"] },
  { id: "laranja", nome: "Laranja Vibrante", cores: ["#EA580C", "#9A3412", "#FDBA74", "#FFF7ED", "#431407"] },
  { id: "ciano", nome: "Ciano Tech", cores: ["#0891B2", "#155E75", "#67E8F9", "#ECFEFF", "#083344"] },
]

export const FONTS: Fonte[] = [
  { id: "inter", nome: "Inter", estilo: "Moderno e limpo", preview: "font-[family-name:var(--font-inter)]" },
  { id: "playfair", nome: "Playfair Display", estilo: "Elegante e sofisticado", preview: "font-[family-name:var(--font-playfair)]" },
  { id: "raleway", nome: "Raleway", estilo: "Fino e profissional", preview: "font-[family-name:var(--font-raleway)]" },
  { id: "montserrat", nome: "Montserrat", estilo: "Forte e confiável", preview: "font-[family-name:var(--font-montserrat)]" },
  { id: "roboto", nome: "Roboto", estilo: "Clássico e versátil", preview: "font-[family-name:var(--font-roboto)]" },
  { id: "oswald", nome: "Oswald", estilo: "Impactante e chamativo", preview: "font-[family-name:var(--font-oswald)]" },
  { id: "poppins", nome: "Poppins", estilo: "Amigável e clean", preview: "font-[family-name:var(--font-poppins)]" },
  { id: "lora", nome: "Lora", estilo: "Editorial e refinado", preview: "font-[family-name:var(--font-lora)]" },
  { id: "bebas", nome: "Bebas Neue", estilo: "Alto e chamativo", preview: "font-[family-name:var(--font-bebas)]" },
]

export function acharPaleta(id: string): Paleta | undefined {
  return PALETTES.find(p => p.id === id)
}

export function acharFonte(id: string): Fonte | undefined {
  return FONTS.find(f => f.id === id)
}
