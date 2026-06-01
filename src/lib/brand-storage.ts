export type Brand = {
  niche: string;
  audience: string;
  tone: "autoridade" | "proximo" | "provocador" | "didatico";
  goal: "autoridade" | "conversao" | "educacao" | "viralizacao";
  handle: string;
  author: string;
  primaryColor: string;
  bgColor: string;
};

export const defaultBrand: Brand = {
  niche: "",
  audience: "",
  tone: "autoridade",
  goal: "autoridade",
  handle: "@seuhandle",
  author: "Seu Nome",
  primaryColor: "#c2a25b",
  bgColor: "#0a0a0a",
};

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
