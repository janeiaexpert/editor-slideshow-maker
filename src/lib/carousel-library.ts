const KEY = "carousel-library-v1";

export type SavedCarousel = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  slides: unknown[];
};

export function loadLibrary(): SavedCarousel[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveLibrary(items: SavedCarousel[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function upsertCarousel(item: SavedCarousel): SavedCarousel[] {
  const all = loadLibrary();
  const idx = all.findIndex((c) => c.id === item.id);
  if (idx >= 0) all[idx] = item;
  else all.unshift(item);
  saveLibrary(all);
  return all;
}

export function deleteCarousel(id: string): SavedCarousel[] {
  const all = loadLibrary().filter((c) => c.id !== id);
  saveLibrary(all);
  return all;
}

export function newId() {
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
