export type Brand = {
  niche: string;
  audience: string;
  tone: "autoridade" | "proximo" | "provocador" | "didatico";
  goal: "autoridade" | "conversao" | "educacao" | "viralizacao";
  handle: string;
  author: string;
  primaryColor: string;
  bgColor: string;
  fontFamily: string;
};

export const defaultBrand: Brand = {
  niche: "",
  audience: "",
  tone: "autoridade",
  goal: "autoridade",
  handle: "@seuhandle",
  author: "Seu Nome",
  primaryColor: "#8b5a2b",
  bgColor: "#0a0a0a",
  fontFamily: 'Georgia, "Times New Roman", serif',
};

export const BRAND_PALETTES: { name: string; primary: string; bg: string }[] = [
  { name: "Marrom & Preto", primary: "#8b5a2b", bg: "#0a0a0a" },
  { name: "Marrom & Branco", primary: "#6b3a1d", bg: "#f5f1ea" },
  { name: "Bege & Preto", primary: "#c9a27a", bg: "#111111" },
  { name: "Preto & Branco", primary: "#ffffff", bg: "#0a0a0a" },
];

export type DesignStyle = {
  name: string;
  description: string;
  fontFamily: string;
  primaryColor: string;
  bgColor: string;
};

export const DESIGN_STYLES: DesignStyle[] = [
  {
    name: "Editorial Serif",
    description: "Tipografia clássica, ar de revista",
    fontFamily: 'Georgia, "Times New Roman", serif',
    primaryColor: "#8b5a2b",
    bgColor: "#0a0a0a",
  },
  {
    name: "Minimal Sans",
    description: "Limpo, moderno, alta legibilidade",
    fontFamily: '"Helvetica Neue", Inter, system-ui, sans-serif',
    primaryColor: "#ffffff",
    bgColor: "#0a0a0a",
  },
  {
    name: "Premium Mono",
    description: "Mono técnico, ar de boutique",
    fontFamily: '"JetBrains Mono", "SFMono-Regular", Menlo, monospace',
    primaryColor: "#c9a27a",
    bgColor: "#111111",
  },
  {
    name: "Light Editorial",
    description: "Fundo claro, leitura premium",
    fontFamily: 'Georgia, "Times New Roman", serif',
    primaryColor: "#6b3a1d",
    bgColor: "#f5f1ea",
  },
];

const KEY = "carousel-brand-v1";

export function loadBrand(): Brand | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return { ...defaultBrand, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function saveBrand(b: Brand) {
  localStorage.setItem(KEY, JSON.stringify(b));
}
