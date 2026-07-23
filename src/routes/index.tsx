import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { useStore, defaultCards, generateCaption, DOCUMENTO_CAMPOS, type Goal, type Framework, type CardType, type Card, type DesignPreset, type ColorTheme, type TextAlign, type TextVerticalAlign, type HighlightMode, type HighlightStyle, COLOR_THEMES, TYPOGRAPHY_PRESETS, TYPOGRAPHY_LABELS, FRAMEWORK_LABELS, HIGHLIGHT_KEYWORDS, getAutoTitleSize, getAutoSubtitleSize } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Index,
});

const GOLD = "#c2a25b";
const ICON_CLS = "w-3.5 h-3.5 sm:w-4 sm:h-4";

function IconSave({ className }: { className?: string }) {
  return (
    <svg className={className || ICON_CLS} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h7l3 3v8a1 1 0 0 1-1 1z" />
      <path d="M5 14V9h6v5" />
      <path d="M11 3v3H6V3" />
    </svg>
  );
}

function IconDownload({ className }: { className?: string }) {
  return (
    <svg className={className || ICON_CLS} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1v10" />
      <path d="M4 7l4 4 4-4" />
      <path d="M2 13h12" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className || ICON_CLS} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l8 8" />
      <path d="M12 4l-8 8" />
    </svg>
  );
}

function IconNew({ className }: { className?: string }) {
  return (
    <svg className={className || ICON_CLS} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
      <path d="M8 5v6" />
      <path d="M5 8h6" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className || ICON_CLS} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8l3 4 7-7" />
    </svg>
  );
}

function HighlightedText({ text, mode, style, highlightColor }: { text: string; mode: HighlightMode; style: HighlightStyle; highlightColor: string }) {
  if (mode === "off") return <>{text}</>;
  const keywords = Object.values(HIGHLIGHT_KEYWORDS).flat();
  if (mode === "low") {
    const top = HIGHLIGHT_KEYWORDS.urgencia || [];
    const re = new RegExp(`(${top.join("|")})`, "gi");
    const parts = text.split(re);
    return <>{parts.map((p, i) => {
      if (top.includes(p.toLowerCase())) {
        if (style === "bold") return <strong key={i} className="font-bold">{p}</strong>;
        if (style === "badge") return <span key={i} className="inline-block rounded bg-white/10 px-1">{p}</span>;
        if (style === "background") return <span key={i} className="rounded px-0.5" style={{ background: highlightColor + "33" }}>{p}</span>;
        if (style === "color") return <span key={i} style={{ color: highlightColor }}>{p}</span>;
        if (style === "uppercase") return <span key={i} className="uppercase">{p}</span>;
      }
      return <span key={i}>{p}</span>;
    })}</>;
  }
  const re = new RegExp(`(${keywords.join("|")})`, "gi");
  const parts = text.split(re);
  return <>{parts.map((p, i) => {
    if (keywords.includes(p.toLowerCase())) {
      if (style === "bold") return <strong key={i} className="font-bold">{p}</strong>;
      if (style === "badge") return <span key={i} className="inline-block rounded bg-white/10 px-1">{p}</span>;
      if (style === "background") return <span key={i} className="rounded px-0.5" style={{ background: highlightColor + "33" }}>{p}</span>;
      if (style === "color") return <span key={i} style={{ color: highlightColor }}>{p}</span>;
      if (style === "uppercase") return <span key={i} className="uppercase">{p}</span>;
    }
    return <span key={i}>{p}</span>;
  })}</>;
}

import type { WordHighlight } from "@/lib/store";

function WordHighlighter({ text, highlights }: { text: string; highlights: WordHighlight[] }) {
  if (!highlights || !highlights.length) return <>{text}</>;
  const sorted = [...highlights].sort((a, b) => b.word.length - a.word.length);
  const parts: { text: string; hl: WordHighlight | null }[] = [{ text, hl: null }];
  for (const hl of sorted) {
    if (!hl.word) continue;
    const re = new RegExp(hl.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (p.hl) continue;
      const segments = p.text.split(re);
      if (segments.length <= 1) continue;
      const matches = p.text.match(re);
      if (!matches) continue;
      const newParts: typeof parts = [];
      segments.forEach((seg, j) => {
        if (seg) newParts.push({ text: seg, hl: null });
        if (j < matches.length) newParts.push({ text: matches[j], hl });
      });
      parts.splice(i, 1, ...newParts);
    }
  }
  return <>{parts.map((p, i) => {
    if (!p.hl) return <span key={i}>{p.text}</span>;
    const c = p.hl.color;
    if (p.hl.shape === "rect") return <span key={i} style={{ display: "inline-block", background: c + "DD", borderRadius: 3, padding: "0 3px" }}>{p.text}</span>;
    if (p.hl.shape === "oval") return <span key={i} style={{ display: "inline-block", background: c + "DD", borderRadius: 999, padding: "0 8px" }}>{p.text}</span>;
    if (p.hl.shape === "tilt") return <span key={i} style={{ display: "inline-block", transform: "rotate(-4deg)", background: c + "DD", borderRadius: 3, padding: "0 3px" }}>{p.text}</span>;
    return <span key={i} style={{ display: "inline-block", background: `linear-gradient(transparent 25%, ${c}BB 25%, ${c}BB 75%, transparent 75%)`, padding: "0 3px" }}>{p.text}</span>;
  })}</>;
}
const CARD_TYPES: CardType[] = ["hook", "problem", "insight", "framework", "explanation", "mistake", "cta"];
const CARD_LABELS: Record<CardType, string> = { hook: "Hook", problem: "Problema", insight: "Insight", framework: "Framework", explanation: "Explicação", mistake: "Erro", cta: "CTA", example: "" };
const CARD_DESCRIPTIONS: Record<CardType, string> = { hook: "Prende a atenção", problem: "Aponta uma dor", insight: "Revela um insight", framework: "Passo a passo", explanation: "Explica o conceito", mistake: "Expõe um erro", cta: "Chama para ação", example: "" };

function Index() {
  const store = useStore();
  const { cards, setCards, activeIndex, setActiveIndex, updateCard, removeCard, topic, setTopic, goal, setGoal, tone, setTone, designPreset, setDesignPreset, colorTheme, setColorTheme, framework, setFramework, generatedCaption, setGeneratedCaption, generatedCta, setGeneratedCta, generatedHashtags, setGeneratedHashtags, brand, setBrand, highlight, setHighlight, generateCards, generateAll: storeGenerateAll, resetAll, insight, setInsight, aiStatus, aiError, insightAnalysis, generateFromInsight: storeGenerateFromInsight } = store;

  const slideRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"card" | "content" | "design" | "brand" | "estrategia">("card");
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [savedList, setSavedList] = useState<{ id: number; name: string }[]>([]);
  const [saveName, setSaveName] = useState("");
  const [loadId, setLoadId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [savedFeedbacks, setSavedFeedbacks] = useState<Record<number, string>>({});
  const [textScale, setTextScale] = useState(100);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cloudSaves, setCloudSaves] = useState<{ id: number; name: string }[]>([]);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrName, setQrName] = useState("");
  const [cloudTab, setCloudTab] = useState<"local" | "nuvem">("local");
  const [exporting, setExporting] = useState<string | null>(null);
  const [imageBank, setImageBank] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("carrossel-image-bank") || "[]"); } catch { return []; } });
  const [hlWord, setHlWord] = useState("");
  const [hlColor, setHlColor] = useState("#ffeb3b");
  const [hlShape, setHlShape] = useState<"rect" | "oval" | "marker" | "tilt">("rect");

  // Garante que applyByDefault tenha efeito ao carregar página com estado persistido
  useEffect(() => {
    if (brand.applyByDefault) {
      if (colorTheme) setColorTheme(null);
      if (highlight.mode !== "medium") setHighlight({ mode: "medium" as HighlightMode, style: "bold" as HighlightStyle });
    }
  }, []);


  const s = cards[activeIndex] || cards[0];
  const activeTheme = colorTheme && !brand.applyByDefault ? COLOR_THEMES[colorTheme] : null;
  const effectiveBg = activeTheme?.background || "#111";
  const effectiveText = activeTheme?.text || "#fff";
  const brandTextColor = brand.applyByDefault ? brand.secondaryColor : null; // MARKER_XYZ123
  const effectiveAccent = brand.applyByDefault ? (brand.primaryColor || GOLD) : (activeTheme?.accent || brand.primaryColor || GOLD);
  const effectivePrimary = brand.applyByDefault ? (brand.secondaryColor || "#fff") : (activeTheme?.primary || brand.secondaryColor || "#fff");
  const g = s.gradientOpacity / 100;
  const gradientDir: Record<string, string> = { top: "to bottom", bottom: "to top", left: "to right", right: "to left" };
  const gradientStyle = {
    background: `linear-gradient(${gradientDir[s.gradientDirection] || "to bottom"}, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,${(g * 0.35).toFixed(2)}) 50%, rgba(0,0,0,${(g * 0.55 + 0.12).toFixed(2)}) 70%, rgba(0,0,0,${(g * 0.65 + 0.35).toFixed(2)}) 100%)`,
  };
  const imageObjPos: Record<string, string> = { top: "center top", center: "center center", bottom: "center bottom" };
  const isSplit = s.imagePosition === "left" || s.imagePosition === "right";

  const verticalStyle: React.CSSProperties = {
    justifyContent: s.textVerticalAlign === "top" ? "flex-start" : s.textVerticalAlign === "center" ? "center" : "flex-end",
  };
  const horizontalStyle: React.CSSProperties = {
    textAlign: s.textAlign,
  };

  const autoTitleSize = getAutoTitleSize(s.title, s.type);
  const autoSubtitleSize = s.subtitle ? getAutoSubtitleSize(s.subtitle, s.type) : 12;

  const typography = TYPOGRAPHY_PRESETS[designPreset || "minimalista"];
  const titleScaleFactor = typography.fontSizeTitle / 26;
  const subtitleScaleFactor = typography.fontSizeBody / 13;
  const effectiveTitleSize = autoTitleSize * textScale / 100 * titleScaleFactor;
  const effectiveSubSize = autoSubtitleSize * textScale / 100 * subtitleScaleFactor;

  function checkOverflow(card?: Card): string | null {
    const c = card || s;
    let h = 0;
    const gap = 8;
    if (brand.logo) h += 40 + gap;
    h += 16 + gap;
    const titleLines = Math.max(1, Math.ceil(c.title.replace(/\n/g, " ").length / 11));
    h += effectiveTitleSize * (typography.lineHeight || 1.08) * titleLines + gap;
    if (c.subtitle) {
      const subLines = Math.max(1, Math.ceil(c.subtitle.length / 22));
      h += effectiveSubSize * (typography.lineHeight || 1.4) * subLines + gap;
    }
    h += 14 + gap;
    if (c.buttonText) h += 28 + gap + (c.buttonCaption ? 14 + 4 : 0);
    h += 18 + gap;
    h += 8;
    if (h > 429) return `⚠ Conteúdo excede área segura (${Math.round(h - 429)}px extra)`;
    return null;
  }

  const overflowMsg = checkOverflow();

  function downloadDataUrl(url: string, filename: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  }

  async function captureSlide(): Promise<string | null> {
    if (!slideRef.current) return null;
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 500)));
    try {
      return await toPng(slideRef.current, { pixelRatio: 1, cacheBust: true });
    } catch { return null; }
  }

  const exportSlide = async (idx?: number) => {
    const i = idx ?? activeIndex;
    if (overflowMsg && i === activeIndex) { setFeedback("Conteúdo excede área segura. Reduza o texto."); setTimeout(() => setFeedback(""), 3000); return; }
    if (i !== activeIndex) setActiveIndex(i);
    setExporting("Exportando slide...");
    await new Promise((r) => setTimeout(r, 100));
    const url = await captureSlide();
    setExporting(null);
    if (!url) { setFeedback("Erro ao exportar"); setTimeout(() => setFeedback(""), 2500); return; }
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], `slide-${i + 1}.png`, { type: "image/png" })] })) {
        await navigator.share({ files: [new File([blob], `slide-${i + 1}.png`, { type: "image/png" })] });
      } else {
        downloadDataUrl(URL.createObjectURL(blob), `slide-${i + 1}.png`);
      }
    } catch { downloadDataUrl(url, `slide-${i + 1}.png`); }
    setSaved(i);
    setTimeout(() => setSaved(null), 1500);
  };

  const exportAll = async () => {
    const overflowing = cards.map((c, i) => checkOverflow(c) ? i : -1).filter(i => i >= 0);
    if (overflowing.length > 0) {
      const msg = overflowing.map(i => `Card ${i + 1}`).join(", ");
      if (!confirm(`⚠ Cards ${msg} excedem área segura. Continuar?`)) return;
    }
    const origIdx = activeIndex;
    setExporting("Preparando slides...");
    await new Promise((r) => setTimeout(r, 50));
    const urls: string[] = [];
    for (let i = 0; i < cards.length; i++) {
      setActiveIndex(i);
      setExporting(`Exportando slide ${i + 1}/${cards.length}...`);
      const url = await captureSlide();
      if (url) urls.push(url);
      else urls.push("");
    }
    setActiveIndex(origIdx);
    setExporting("Finalizando...");
    await new Promise((r) => setTimeout(r, 300));
    setExporting(null);
    if (urls.every(u => !u)) { setFeedback("Erro ao exportar slides"); setTimeout(() => setFeedback(""), 3000); return; }
    for (let i = 0; i < urls.length; i++) {
      if (!urls[i]) continue;
      await new Promise((r) => setTimeout(r, 400));
      downloadDataUrl(urls[i], `slide-${i + 1}.png`);
    }
    setFeedback(`${urls.filter(Boolean).length} slides exportados!`);
    setTimeout(() => setFeedback(""), 3000);
  };

  const exportPdf = async () => {
    const overflowing = cards.map((c, i) => checkOverflow(c) ? i : -1).filter(i => i >= 0);
    if (overflowing.length > 0) {
      const msg = overflowing.map(i => `Card ${i + 1}`).join(", ");
      if (!confirm(`⚠ Cards ${msg} excedem área segura. Continuar?`)) return;
    }
    const origIdx = activeIndex;
    setExporting("Preparando PDF...");
    await new Promise((r) => setTimeout(r, 50));
    const urls: string[] = [];
    for (let i = 0; i < cards.length; i++) {
      setActiveIndex(i);
      setExporting(`PDF: slide ${i + 1}/${cards.length}...`);
      const url = await captureSlide();
      urls.push(url || "");
    }
    setActiveIndex(origIdx);
    setExporting("Gerando PDF...");
    await new Promise((r) => setTimeout(r, 200));
    setExporting(null);
    if (urls.every(u => !u)) { setFeedback("Erro ao gerar PDF"); setTimeout(() => setFeedback(""), 3000); return; }
    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < urls.length; i++) {
      if (!urls[i]) continue;
      if (i > 0) pdf.addPage();
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      pdf.addImage(urls[i], "PNG", 0, 0, pw, ph, undefined, "FAST");
    }
    pdf.save("carrossel.pdf");
    setFeedback("PDF gerado!");
    setTimeout(() => setFeedback(""), 2500);
  };

  const generateAll = () => {
    storeGenerateAll();
  };

  const dbKey = "carrosseis_db";

  function getDb(): { id: number; name: string; cards: Card[]; extra?: Record<string, unknown> }[] {
    try { return JSON.parse(localStorage.getItem(dbKey) || "[]"); } catch { return []; }
  }

  function setDb(data: unknown[]) {
    localStorage.setItem(dbKey, JSON.stringify(data));
  }

  function handleDbSave() {
    const name = saveName.trim() || `Carrossel ${new Date().toLocaleDateString("pt-BR")}`;
    try {
      const serialized = JSON.stringify({ cards: JSON.parse(JSON.stringify(cards)) });
      if (serialized.length > 3_500_000) {
        setFeedback("Imagens muito grandes! Use Exportar PNG (botão abaixo) para baixar os slides.");
        setTimeout(() => setFeedback(""), 5000);
        return;
      }
      const db = getDb();
      const entry = { id: Date.now(), name, cards: JSON.parse(serialized).cards, extra: { topic, goal, tone, designPreset, colorTheme, framework, generatedCaption, generatedCta, generatedHashtags, brand, highlight } };
      db.unshift(entry);
      setDb(db);
      setFeedback(`"${name}" salvo!`);
      setTimeout(() => setFeedback(""), 2500);
      setShowSaveLoad(false);
    } catch (e) {
      const msg = e instanceof DOMException && e.name === "QuotaExceededError"
        ? "Imagens muito grandes para salvar. Use Exportar PNG para baixar."
        : "Erro ao salvar";
      setFeedback(msg);
      setTimeout(() => setFeedback(""), 5000);
      console.error("save error", e);
    }
  }

  function handleLoadList() {
    setSavedList(getDb().map(({ id, name }) => ({ id, name })));
  }

  function handleLoad(id: number) {
    try {
      const db = getDb();
      const entry = db.find((d) => d.id === id);
      if (!entry) return;
      setCards(JSON.parse(JSON.stringify(entry.cards)));
      if (entry.extra) {
        if (entry.extra.topic) setTopic(entry.extra.topic as string);
        if (entry.extra.goal) setGoal(entry.extra.goal as Goal);
        if (entry.extra.tone) setTone(entry.extra.tone as "direto" | "educacional" | "provocativo");
        if (entry.extra.designPreset) setDesignPreset(entry.extra.designPreset as DesignPreset);
        if (entry.extra.colorTheme) setColorTheme(entry.extra.colorTheme as ColorTheme | null);
        if (entry.extra.framework) setFramework(entry.extra.framework as Framework);
        if (entry.extra.generatedCaption) setGeneratedCaption(entry.extra.generatedCaption as string);
        if (entry.extra.generatedCta) setGeneratedCta(entry.extra.generatedCta as string);
        if (entry.extra.generatedHashtags) setGeneratedHashtags(entry.extra.generatedHashtags as string[]);
        if (entry.extra.brand) setBrand(entry.extra.brand as typeof brand);
        if (entry.extra.highlight) setHighlight(entry.extra.highlight as typeof highlight);
      }
      setShowSaveLoad(false);
    } catch (e) {
      console.error("load error", e);
    }
  }

  function handleDbDelete(id: number) {
    try {
      const db = getDb().filter((d) => d.id !== id);
      setDb(db);
      handleLoadList();
    } catch (e) {
      console.error("delete error", e);
    }
  }

  function handleExportJson() {
    const data = { cards: JSON.parse(JSON.stringify(cards)), extra: { topic, goal, tone, designPreset, colorTheme, framework, generatedCaption, generatedCta, generatedHashtags, brand, highlight } };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `carrossel-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  function handleImportJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (data.cards) setCards(data.cards);
        if (data.extra) {
          if (data.extra.topic) setTopic(data.extra.topic);
          if (data.extra.goal) setGoal(data.extra.goal);
          if (data.extra.tone) setTone(data.extra.tone);
          if (data.extra.designPreset) setDesignPreset(data.extra.designPreset);
          if (data.extra.colorTheme) setColorTheme(data.extra.colorTheme);
          if (data.extra.framework) setFramework(data.extra.framework);
          if (data.extra.generatedCaption) setGeneratedCaption(data.extra.generatedCaption);
          if (data.extra.generatedCta) setGeneratedCta(data.extra.generatedCta);
          if (data.extra.generatedHashtags) setGeneratedHashtags(data.extra.generatedHashtags);
          if (data.extra.brand) setBrand(data.extra.brand);
          if (data.extra.highlight) setHighlight(data.extra.highlight);
        }
        setFeedback("Carrossel importado!");
        setTimeout(() => setFeedback(""), 2500);
        setShowSaveLoad(false);
      } catch { setFeedback("Arquivo invalido"); setTimeout(() => setFeedback(""), 3000); }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  async function handleCloudSave() {
    const name = saveName.trim() || `Carrossel ${new Date().toLocaleDateString("pt-BR")}`;
    setCloudLoading(true);
    try {
      const r = await fetch("/api/supabase/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, cards, extra: { topic, goal, tone, designPreset, colorTheme, framework, generatedCaption, generatedCta, generatedHashtags, brand, highlight } }) });
      await r.json();
      setFeedback("Salvo na nuvem!");
      setTimeout(() => setFeedback(""), 2500);
      await handleCloudList();
    } catch { setFeedback("Erro ao salvar na nuvem"); setTimeout(() => setFeedback(""), 3000); }
    setCloudLoading(false);
  }

  async function handleCloudList() {
    setCloudLoading(true);
    try {
      const r = await fetch("/api/supabase/list");
      const data = await r.json();
      setCloudSaves((data || []).map((d: { id: number; name: string }) => ({ id: d.id, name: d.name })));
    } catch { setCloudSaves([]); }
    setCloudLoading(false);
  }

  async function handleCloudLoad(id: number) {
    try {
      const r = await fetch(`/api/supabase/load/${id}`);
      const data = await r.json();
      if (data.cards) setCards(data.cards);
      if (data.extra) {
        if (data.extra.topic) setTopic(data.extra.topic);
        if (data.extra.goal) setGoal(data.extra.goal);
        if (data.extra.tone) setTone(data.extra.tone);
        if (data.extra.designPreset) setDesignPreset(data.extra.designPreset);
        if (data.extra.colorTheme) setColorTheme(data.extra.colorTheme);
        if (data.extra.framework) setFramework(data.extra.framework);
        if (data.extra.generatedCaption) setGeneratedCaption(data.extra.generatedCaption);
        if (data.extra.generatedCta) setGeneratedCta(data.extra.generatedCta);
        if (data.extra.generatedHashtags) setGeneratedHashtags(data.extra.generatedHashtags);
        if (data.extra.brand) setBrand(data.extra.brand);
        if (data.extra.highlight) setHighlight(data.extra.highlight);
      }
      setFeedback("Carregado da nuvem!");
      setTimeout(() => setFeedback(""), 2500);
    } catch { setFeedback("Erro ao carregar"); setTimeout(() => setFeedback(""), 3000); }
  }

  async function handleCloudDelete(id: number) {
    try {
      await fetch(`/api/supabase/delete/${id}`, { method: "DELETE" });
      handleCloudList();
    } catch { setFeedback("Erro ao excluir"); setTimeout(() => setFeedback(""), 3000); }
  }

  async function handleShowQr(id: number, name: string) {
    setQrName(name);
    setQrCode(`${location.origin}/qr/${id}`);
  }

  function randomTheme() {
    const keys = Object.keys(COLOR_THEMES) as ColorTheme[];
    const picked = keys[Math.floor(Math.random() * keys.length)];
    setColorTheme(picked);
  }

  useEffect(() => {
    if (loadId) { handleLoad(loadId); setLoadId(null); }
  }, [loadId]);

  useEffect(() => {
    setImageLoaded(!s.image);
  }, [activeIndex, s.image]);

  return (
    <div className="min-h-screen text-white" style={{ background: "#111" }}>
      <div className="mx-auto w-full max-w-[1800px] overflow-x-hidden px-3 py-3 sm:px-6 sm:py-5 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-[0.25em] uppercase" style={{ color: GOLD }}>
          <span className="font-bold text-[11px] sm:text-sm">Gerador de Carrossel</span>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {showSaveLoad && (
              <button onClick={() => setShowSaveLoad(false)} className="text-white/50 hover:text-white px-2 py-1">Fechar</button>
            )}
            <button onClick={() => { if (!confirm("Criar um novo carrossel perde as alteracoes nao salvas. Salve antes se necessario.")) return; const emptyCards: Card[] = Array.from({ length: 7 }, (_, i) => ({ type: CARD_TYPES[i] as CardType, kicker: "", title: "Título", subtitle: "Subtítulo", buttonText: "", buttonCaption: "", handle: "@seu.handle", author: "Seu Nome", image: null, imagePosition: "top", imageZoom: 100, gradientOpacity: 70, gradientDirection: "bottom", textAlign: "left", textVerticalAlign: "bottom", highlights: [] })); setCards(emptyCards); setTopic(""); setGoal("authority"); setTone("direto"); setDesignPreset(null); setColorTheme(null); setFramework("aida"); setGeneratedCaption(""); setGeneratedCta(""); setGeneratedHashtags([]); setBrand({ logo: null, primaryColor: "#c2a25b", secondaryColor: "#ffffff", fontTitle: "Inter, sans-serif", fontBody: "Inter, sans-serif", applyByDefault: false }); setHighlight({ mode: "off", style: "bold" as HighlightStyle }); setActiveIndex(0); try { localStorage.removeItem("carrossel-store-v2"); } catch {}; setFeedback("Novo carrossel criado!"); setTimeout(() => setFeedback(""), 2500); }} className="flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-white/80 hover:text-white"><IconNew /> Novo</button>
            <button onClick={() => { handleLoadList(); setShowSaveLoad(true); }} className="flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-white/80 hover:text-white"><IconSave /> Salvar</button>
          </div>
        </div>

        {/* Save/Load Modal */}
        {showSaveLoad && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 sm:px-0" onClick={() => setShowSaveLoad(false)}>
            <div className="w-full max-w-lg rounded-xl bg-zinc-900 p-4 sm:p-6 ring-1 ring-white/10" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2 rounded-lg bg-white/[0.05] p-0.5">
                  <button onClick={() => setCloudTab("local")} className={`rounded-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${cloudTab === "local" ? "bg-white/10 text-white" : "text-white/50"}`}>Local</button>
                  <button onClick={() => { setCloudTab("nuvem"); handleCloudList(); }} className={`rounded-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${cloudTab === "nuvem" ? "bg-white/10 text-white" : "text-white/50"}`}>Nuvem</button>
                </div>
                <button onClick={() => setShowSaveLoad(false)} className="text-white/50 hover:text-white p-1"><IconX /></button>
              </div>

              {cloudTab === "local" && (
                <>
                  <div className="mb-4 max-h-60 space-y-2 overflow-y-auto">
                    {savedList.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-white truncate">{item.name}</div>
                        </div>
                        <div className="flex gap-1.5 ml-2 shrink-0">
                          <button onClick={() => setLoadId(item.id)} className="rounded bg-white/10 px-2 py-1 text-xs whitespace-nowrap">Carregar</button>
                          <button onClick={() => handleDbDelete(item.id)} className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-400 whitespace-nowrap">Excluir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="Nome do carrossel..." className="min-w-0 flex-1 rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-[#c2a25b]" />
                    <button onClick={handleDbSave} className="shrink-0 rounded-md px-4 py-2 text-sm font-semibold" style={{ background: GOLD, color: "#111" }}>Salvar</button>
                  </div>
                  <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
                    <button onClick={handleExportJson} className="flex-1 rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-white/80 hover:text-white">Exportar JSON</button>
                    <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportJson} />
                    <button onClick={() => importRef.current?.click()} className="flex-1 rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-white/80 hover:text-white">Importar JSON</button>
                  </div>
                </>
              )}

              {cloudTab === "nuvem" && (
                <>
                  <div className="mb-4 max-h-60 space-y-2 overflow-y-auto">
                    {cloudLoading ? (
                      <div className="text-center text-xs text-white/50 py-8">Carregando...</div>
                    ) : cloudSaves.length === 0 ? (
                      <div className="text-center text-xs text-white/50 py-8">Nenhum carrossel na nuvem</div>
                    ) : cloudSaves.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-white truncate">{item.name}</div>
                        </div>
                        <div className="flex gap-1.5 ml-2 shrink-0">
                          <button onClick={() => handleCloudLoad(item.id)} className="rounded bg-white/10 px-2 py-1 text-xs whitespace-nowrap">Carregar</button>
                          <button onClick={() => handleShowQr(item.id, item.name)} className="rounded bg-white/10 px-2 py-1 text-xs whitespace-nowrap">QR</button>
                          <button onClick={() => handleCloudDelete(item.id)} className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-400 whitespace-nowrap">Excluir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="Nome do carrossel..." className="min-w-0 flex-1 rounded-md bg-white/5 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-[#c2a25b]" />
                    <button onClick={handleCloudSave} disabled={cloudLoading} className="shrink-0 rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-50" style={{ background: GOLD, color: "#111" }}>{cloudLoading ? "..." : "Salvar"}</button>
                  </div>
                </>
              )}

              {qrCode && <QrModal url={qrCode} name={qrName} onClose={() => setQrCode(null)} />}

              {feedback && <div className="mt-2 text-center text-sm font-medium" style={{ background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "6px 12px" }}>{feedback.includes("Salvo") || feedback.includes("Carregado") ? "\u2705 " : "\u26A0\uFE0F "}{feedback}</div>}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8 xl:gap-10 mt-3 sm:mt-5">
          {/* Left: Preview + thumbnails + navigation */}
          <div className="flex flex-col items-center md:sticky md:top-4 md:self-start w-full md:max-w-none md:w-[400px] lg:w-[420px] shrink-0 mx-auto md:mx-0">
            <div className="w-full">
              <div className="relative w-full overflow-hidden rounded-lg sm:rounded-2xl shadow-2xl" style={{ aspectRatio: "1080 / 1350" }}>
                <div ref={slideRef} className="absolute inset-0 flex" style={{ flexDirection: isSplit ? "row" : "column", background: effectiveBg, color: effectiveText }}>
                  {!isSplit && s.image && (
                    <div className="absolute inset-0 overflow-hidden">
                      <img src={s.image} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: "cover", objectPosition: imageObjPos[s.imagePosition], transform: `scale(${s.imageZoom / 100})`, transformOrigin: "top center" }} onLoad={() => setImageLoaded(true)} onError={() => updateCard(activeIndex, { image: null })} />
                    </div>
                  )}
                  {!isSplit && <div className="absolute inset-0" style={gradientStyle} />}

                  {isSplit && s.imagePosition === "left" && s.image && (
                    <div className="w-1/2 h-full overflow-hidden shrink-0 relative">
                      <img src={s.image} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: "cover", objectPosition: "center center", transform: `scale(${s.imageZoom / 100})`, transformOrigin: "top center" }} onLoad={() => setImageLoaded(true)} onError={() => updateCard(activeIndex, { image: null })} />
                    </div>
                  )}

                    <div className={`flex h-full flex-col ${isSplit ? "relative flex-1 overflow-auto" : "relative z-10 w-full"}`} style={{ padding: isSplit ? "28px 20px" : "48px 40px", background: isSplit ? effectiveBg : undefined }}>
                      <div className="flex flex-col overflow-hidden" style={{ flex: "1 1 0%", minHeight: 0, ...verticalStyle }}>
                        <div style={horizontalStyle} className="w-full overflow-hidden space-y-[2.5%]">
                          {brand.logo && <img src={brand.logo} alt="logo" className="h-10 object-contain" style={s.textAlign === "center" ? { margin: "0 auto" } : {}} />}
                          <div style={{ color: effectiveAccent, fontSize: typography.fontSizeKicker, fontWeight: 700, letterSpacing: "0.28em" }}>{s.kicker}</div>
                          <h2 className="whitespace-pre-line" style={{ color: brandTextColor ?? undefined, fontFamily: brand.fontTitle || typography.fontTitle || "Georgia, serif", fontSize: autoTitleSize * textScale / 100, fontWeight: typography.fontWeightTitle, lineHeight: typography.lineHeight, letterSpacing: typography.letterSpacing, textWrap: "balance" }}><WordHighlighter text={s.title} highlights={s.highlights || []} /></h2>
                          <div>
                            {s.subtitle ? (
                              <p style={{ color: brandTextColor ?? undefined, fontFamily: brand.fontBody || typography.fontBody || "Inter, sans-serif", fontSize: autoSubtitleSize * textScale / 100, fontWeight: typography.fontWeightBody, lineHeight: typography.lineHeight, letterSpacing: typography.letterSpacing * 0.5, opacity: .8 }}><WordHighlighter text={s.subtitle} highlights={s.highlights || []} /></p>
                            ) : (
                              <p className="text-[11px] leading-snug" style={{ color: brandTextColor ?? undefined, opacity: .6 }}>Adicione um subtítulo</p>
                            )}
                          </div>
                          {s.buttonText && (
                            <div>
                              <div className="w-full rounded-md py-2.5 text-center text-[12px]" style={{ fontFamily: brand.fontBody || typography.fontBody || "Inter, sans-serif", fontWeight: typography.fontWeightBody, background: effectiveAccent, color: effectiveBg }}>{s.buttonText}</div>
                              {s.buttonCaption && <div className="mt-[1%] text-center text-[10px]" style={{ opacity: .6 }}>{s.buttonCaption}</div>}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-none flex items-center justify-between text-[11px] pt-4 pb-1" style={{ opacity: .65 }}>
                        <span>{s.handle} · {s.author}</span>
                        <span>{activeIndex + 1}/{cards.length}</span>
                      </div>
                      <div className="flex-none h-[5px] w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((activeIndex + 1) / cards.length) * 100}%`, background: effectiveAccent }} />
                      </div>
                    </div>
                  {isSplit && s.imagePosition === "right" && s.image && (
                    <div className="w-1/2 h-full overflow-hidden shrink-0 relative">
                      <img src={s.image} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: "cover", objectPosition: "center center", transform: `scale(${s.imageZoom / 100})`, transformOrigin: "top center" }} onLoad={() => setImageLoaded(true)} onError={() => updateCard(activeIndex, { image: null })} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="mt-3 sm:mt-5 grid w-full grid-cols-4 gap-1.5 sm:gap-2">
              {cards.map((c, i) => (
                <button key={i} onClick={() => setActiveIndex(i)} className={`aspect-[1080/1350] rounded border sm:rounded-md border-2 text-[10px] font-bold transition ${i === activeIndex ? "border-[#c2a25b]" : "border-white/10 hover:border-white/30"}`} style={{ background: "#111", color: i === activeIndex ? GOLD : "rgba(255,255,255,0.5)" }}>
                  <span className="block text-sm sm:text-[16px]">{i + 1}</span>
                  {!c.image && <span className="block mt-0.5 text-[7px] sm:text-[8px] uppercase tracking-wider leading-tight px-0.5">{CARD_LABELS[c.type]}</span>}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-3 sm:mt-5 flex w-full items-center gap-1.5 sm:gap-2">
              <button onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))} disabled={activeIndex === 0 || !!exporting} className="flex-1 rounded-md bg-white/5 py-3 sm:py-3 text-sm sm:text-sm font-semibold disabled:opacity-30">‹ Anterior</button>
              <button onClick={() => exportSlide()} disabled={!!exporting} className="flex items-center justify-center rounded-md px-3 sm:px-3 py-3 sm:py-3 text-sm sm:text-sm font-bold disabled:opacity-50" style={{ background: GOLD, color: "#111" }} title="Exportar slide atual como PNG">
                {exporting ? <span className="text-xs">...</span> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
              </button>
              <button onClick={() => setActiveIndex(Math.min(cards.length - 1, activeIndex + 1))} disabled={activeIndex === cards.length - 1 || !!exporting} className="flex-1 rounded-md bg-white/5 py-3 sm:py-3 text-sm sm:text-sm font-semibold disabled:opacity-30">Próximo ›</button>
            </div>
            <div className="mt-2 sm:mt-2 flex w-full gap-2">
              <button onClick={exportAll} disabled={!!exporting} className="flex items-center justify-center gap-1.5 flex-1 rounded-md py-3 text-sm sm:text-xs font-semibold disabled:opacity-40" style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}><IconDownload /> {exporting ? "Exportando..." : "PNG"}</button>
              <button onClick={exportPdf} disabled={!!exporting} className="flex items-center justify-center gap-1.5 flex-1 rounded-md py-3 text-sm sm:text-xs font-semibold disabled:opacity-40" style={{ background: GOLD, color: "#111" }}><IconDownload /> {exporting ? "Exportando..." : "PDF"}</button>
            </div>
            {saved === activeIndex && <div className="mt-2 flex items-center gap-1 text-xs text-white/60"><IconCheck />Slide {activeIndex + 1} salvo!</div>}
          </div>

          {/* Right: Tabs + Config panels */}
          <div className="flex-1 min-w-0 w-full">
            {/* Tabs */}
            <div className="flex gap-1 rounded-lg bg-white/[0.05] p-1">
              {(["estrategia", "card", "content", "design", "brand"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold uppercase tracking-wider transition ${activeTab === tab ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}>
                  {tab === "estrategia" ? "Estratégia" : tab === "card" ? "Card" : tab === "content" ? "Conteúdo" : tab === "design" ? "Design" : "Marca"}
                </button>
              ))}
            </div>

            {/* Estratégia Tab */}
            {activeTab === "estrategia" && (
              <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                <div className="mb-1">
                  <h2 className="text-xs font-bold tracking-wider uppercase" style={{ color: GOLD }}>Estrategista de Conteudo</h2>
                  <p className="mt-1 text-[11px] text-white/50">Preencha o Documento Mestre e responda as perguntas. Vou gerar um calendario estrategico alinhado a sua persona.</p>
                </div>

                {/* Documento Mestre */}
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <div className="mb-2 text-[11px] tracking-wider uppercase text-white/60">Documento Mestre</div>
                  <p className="mb-3 text-[10px] text-white/40">Proposta de valor, publico, dores, desejos, servicos e posicionamento.</p>
                  <div className="space-y-2.5">
                    {(DOCUMENTO_CAMPOS as typeof DOCUMENTO_CAMPOS).map((campo) => (
                      <Field key={campo.key} label={campo.label}>
                        <textarea
                          value={store.documento[campo.key]}
                          onChange={(e) => store.setDocumentoField(campo.key, e.target.value)}
                          placeholder={campo.placeholder}
                          rows={2}
                          className={inputCls + " resize-none text-[11px]"}
                        />
                      </Field>
                    ))}
                  </div>
                </div>

                {/* Perguntas */}
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <div className="mb-2 text-[11px] tracking-wider uppercase text-white/60">Calendario de Conteudo</div>
                  <div className="space-y-2.5">
                    <Field label="Quantos dias de conteudo?">
                      <input type="number" min={1} max={90} value={store.pesquisa.dias} onChange={(e) => store.setPesquisaField("dias", Number(e.target.value))} className={inputCls} />
                    </Field>
                    <Field label="Objetivo principal">
                      <select value={store.pesquisa.objetivo} onChange={(e) => store.setPesquisaField("objetivo", e.target.value)} className={inputCls}>
                        <option value="crescer seguidores">Crescer seguidores</option>
                        <option value="vender mais">Vender mais</option>
                        <option value="aumentar engajamento">Aumentar engajamento</option>
                        <option value="gerar conexao">Gerar conexao</option>
                        <option value="autoridade">Construir autoridade</option>
                      </select>
                    </Field>
                    <Field label="Posts por dia">
                      <input type="number" min={1} max={5} value={store.pesquisa.postsPorDia} onChange={(e) => store.setPesquisaField("postsPorDia", Number(e.target.value))} className={inputCls} />
                    </Field>
                    <Field label="Incluir Stories?">
                      <div className="flex gap-2">
                        {[true, false].map((v) => (
                          <button key={String(v)} onClick={() => store.setPesquisaField("incluirStories", v)} className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold ${store.pesquisa.incluirStories === v ? "bg-white/20 text-white" : "bg-white/5 text-white/70"}`}>{v ? "Sim" : "Nao"}</button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Data inicial">
                      <input type="date" value={store.pesquisa.dataInicial} onChange={(e) => store.setPesquisaField("dataInicial", e.target.value)} className={inputCls} />
                    </Field>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!store.documento.propostaDeValor.trim() || !store.documento.publicoAlvo.trim()) {
                      setFeedback("Preencha Proposta de Valor e Publico-Alvo no Documento Mestre");
                      setTimeout(() => setFeedback(""), 3000);
                      return;
                    }
                    store.gerarCalendario();
                  }}
                  className="w-full rounded-md py-3 text-xs font-bold transition"
                  style={{ background: GOLD, color: "#111" }}
                >
                  Gerar Calendario Estrategico
                </button>

                {/* Calendário */}
                {store.calendario.length > 0 && (
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] tracking-wider uppercase text-white/60">Calendario ({store.calendario.length} dias)</span>
                      <span className="text-[10px] text-white/40">{store.pesquisa.objetivo}</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto space-y-1.5">
                      {store.calendario.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-md bg-white/[0.03] px-2.5 py-2 text-[10px]">
                          <span className="w-16 shrink-0 text-white/50">{item.data}</span>
                          <span className={`w-16 shrink-0 font-semibold ${item.tipo === "Carrossel" ? "text-[#c2a25b]" : item.tipo === "Reels" ? "text-blue-400" : "text-green-400"}`}>{item.tipo}</span>
                          <span className="flex-1 min-w-0 truncate text-white/80">{item.tema}</span>
                          <span className="w-20 shrink-0 text-center text-white/40">{item.goal === "sales" ? "vendas" : item.goal === "viral" ? "viral" : "autoridade"}</span>
                          <button
                            onClick={() => {
                              setTopic(item.tema);
                              setGoal(item.goal);
                              setTone(item.tone as "direto" | "educacional" | "provocativo");
                              setInsight(item.insight);
                              store.generateAll();
                              setActiveTab("card");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="shrink-0 rounded bg-[#c2a25b]/20 px-2 py-0.5 text-[9px] font-semibold text-[#c2a25b] hover:bg-[#c2a25b]/40"
                          >
                            Editar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Card Tab */}
            {activeTab === "card" && (
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xs font-bold tracking-wider uppercase text-white/70">Card {activeIndex + 1} &mdash; {CARD_LABELS[s.type]}</h2>
                  <div className="flex items-center gap-2">
                    {cards.length > 1 && (
                      <button onClick={() => { removeCard(activeIndex); setFeedback("Card removido!"); setTimeout(() => setFeedback(""), 2000); }} className="text-[10px] text-red-400/60 hover:text-red-400">remover</button>
                    )}
                    <button onClick={() => { const def = defaultCards(topic || "seu tópico")[activeIndex]; if (def) updateCard(activeIndex, def); }} className="text-[10px] text-white/50 hover:text-white shrink-0">restaurar</button>
                  </div>
                </div>
                <Field label="Kicker"><input value={s.kicker} onChange={(e) => updateCard(activeIndex, { kicker: e.target.value })} className={inputCls} /></Field>
                <Field label="Título"><textarea value={s.title} onChange={(e) => updateCard(activeIndex, { title: e.target.value })} rows={3} className={inputCls} /></Field>
                <Field label="Subtítulo"><textarea value={s.subtitle} onChange={(e) => updateCard(activeIndex, { subtitle: e.target.value })} rows={2} className={inputCls} /></Field>
                {/* Destaques */}
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] tracking-wider uppercase text-white/50">Destaques</span>
                    <span className="text-[9px] text-white/30">marca palavras no título e subtítulo</span>
                  </div>
                  {s.highlights && s.highlights.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {s.highlights.map((h, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px]" style={{ background: h.color + "33" }}>
                          <span className="w-2 h-2 rounded-full" style={{ background: h.color }} />
                          <span className="text-white/80">{h.word}</span>
                          <span className="text-white/40 text-[8px]">{h.shape}</span>
                          <button onClick={() => { const hls = [...(s.highlights || [])]; hls.splice(i, 1); updateCard(activeIndex, { highlights: hls }); }} className="text-white/40 hover:text-white ml-0.5">&times;</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-1.5 items-end">
                    <input
                      placeholder="palavra..."
                      value={hlWord}
                      onChange={(e) => setHlWord(e.target.value)}
                      className="min-w-0 flex-1 rounded-md bg-white/5 px-2 py-1.5 text-[10px] text-white outline-none ring-1 ring-white/10 focus:ring-[#c2a25b]"
                    />
                    <input
                      type="color"
                      value={hlColor}
                      onChange={(e) => setHlColor(e.target.value)}
                      className="h-7 w-7 shrink-0 rounded-md cursor-pointer bg-white/5"
                    />
                    <select value={hlShape} onChange={(e) => setHlShape(e.target.value as "rect" | "oval" | "marker" | "tilt")} className="rounded-md bg-white/5 px-1.5 py-1.5 text-[10px] text-white outline-none ring-1 ring-white/10">
                      <option value="rect">Rect</option>
                      <option value="oval">Oval</option>
                      <option value="marker">Marca-texto</option>
                      <option value="tilt">Inclinado</option>
                    </select>
                    <button onClick={() => { if (!hlWord.trim()) return; const hls = [...(s.highlights || [])]; hls.push({ word: hlWord.trim(), color: hlColor, shape: hlShape }); updateCard(activeIndex, { highlights: hls }); setHlWord(""); }} className="shrink-0 rounded-md bg-[#c2a25b] px-2.5 py-1.5 text-[10px] font-bold text-black">+</button>
                  </div>
                </div>
                <Field label="Texto do botão"><input value={s.buttonText} onChange={(e) => updateCard(activeIndex, { buttonText: e.target.value })} className={inputCls} /></Field>
                <Field label="Legenda do botão"><input value={s.buttonCaption} onChange={(e) => updateCard(activeIndex, { buttonCaption: e.target.value })} className={inputCls} /></Field>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Field label="@handle">
                    <div className="flex gap-1">
                      <input value={s.handle} onChange={(e) => updateCard(activeIndex, { handle: e.target.value })} className={inputCls + " flex-1 min-w-0"} />
                      <button onClick={() => { cards.forEach((_, i) => updateCard(i, { handle: s.handle })); setFeedback("@handle aplicado em todos!"); setTimeout(() => setFeedback(""), 2000); }} className="shrink-0 rounded-md bg-white/10 px-2 py-1 text-[9px] font-semibold text-white/60 hover:text-white" title="Aplicar em todos os cards">todos</button>
                    </div>
                  </Field>
                  <Field label="Autor">
                    <div className="flex gap-1">
                      <input value={s.author} onChange={(e) => updateCard(activeIndex, { author: e.target.value })} className={inputCls + " flex-1 min-w-0"} />
                      <button onClick={() => { cards.forEach((_, i) => updateCard(i, { author: s.author })); setFeedback("Autor aplicado em todos!"); setTimeout(() => setFeedback(""), 2000); }} className="shrink-0 rounded-md bg-white/10 px-2 py-1 text-[9px] font-semibold text-white/60 hover:text-white" title="Aplicar em todos os cards">todos</button>
                    </div>
                  </Field>
                </div>
                <Field label="Imagem de fundo">
                  <div className="mb-2 space-y-1">
                    <label className="block cursor-pointer rounded-md bg-white/5 px-3 py-2 text-center text-xs text-white/70 hover:bg-white/10">
                      {s.image ? "Trocar foto" : "Enviar foto"}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && (() => { const reader = new FileReader(); reader.onload = () => updateCard(activeIndex, { image: reader.result as string }); reader.readAsDataURL(e.target.files[0]); })()} />
                    </label>
                    <textarea
                      readOnly
                      onPaste={(e) => {
                        e.preventDefault();
                        const item = e.clipboardData?.items?.[0];
                        if (!item?.type.startsWith("image/")) return;
                        const blob = item.getAsFile();
                        if (!blob) return;
                        const reader = new FileReader();
                        reader.onload = () => { updateCard(activeIndex, { image: reader.result as string }); setFeedback("Imagem colada!"); setTimeout(() => setFeedback(""), 1500); };
                        reader.readAsDataURL(blob);
                      }}
                      value=""
                      onClick={(e) => (e.target as HTMLTextAreaElement).focus()}
                      rows={1}
                      className="block w-full resize-none rounded-md border-2 border-dashed border-white/10 bg-white/[0.02] px-3 py-4 text-center text-[10px] text-white/40 outline-none caret-transparent cursor-pointer hover:border-white/30 hover:text-white/60 focus:border-[#c2a25b] focus:text-white/80"
                      placeholder="Clique ou toque e segure para colar imagem"
                    />
                  </div>
                  {s.image && <button onClick={() => updateCard(activeIndex, { image: null })} className="mt-1 w-full text-[10px] text-white/50 hover:text-white">remover foto</button>}
                </Field>

                {/* Banco de Imagens */}
                <details className="group rounded-lg border border-white/10 bg-white/[0.02]">
                  <summary className="cursor-pointer px-3 py-2 text-[11px] font-semibold tracking-wider text-white/50 hover:text-white flex items-center gap-2">
                    <span>Banco de Imagens</span>
                    <span className="text-[9px] text-white/30">{imageBank.length} salvas</span>
                  </summary>
                  <div className="px-3 pb-3 space-y-2">
                    <textarea
                      readOnly
                      onPaste={(e) => {
                        e.preventDefault();
                        const items = e.clipboardData?.items;
                        if (!items) return;
                        for (const item of items) {
                          if (item.type.startsWith("image/")) {
                            const blob = item.getAsFile();
                            if (!blob) continue;
                            const reader = new FileReader();
                            reader.onload = () => {
                              const url = reader.result as string;
                              const updated = [...imageBank, url];
                              setImageBank(updated);
                              localStorage.setItem("carrossel-image-bank", JSON.stringify(updated));
                            };
                            reader.readAsDataURL(blob);
                          }
                        }
                      }}
                      value=""
                      onClick={(e) => (e.target as HTMLTextAreaElement).focus()}
                      rows={1}
                      className="block w-full resize-none rounded-md border-2 border-dashed border-white/10 bg-white/[0.02] px-3 py-4 text-center text-[10px] text-white/40 outline-none caret-transparent cursor-pointer hover:border-white/30 hover:text-white/60 focus:border-[#c2a25b] focus:text-white/80"
                      placeholder="Toque e segure para colar imagem"
                    />
                    {imageBank.length > 0 && (
                      <div className="grid grid-cols-4 gap-1.5">
                        {imageBank.map((url, i) => (
                          <div key={i} className="group/img relative aspect-[1080/1350] overflow-hidden rounded-md bg-black/40">
                            <img src={url} alt="" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 transition group-hover/img:opacity-100 bg-black/60">
                              <button onClick={() => { updateCard(activeIndex, { image: url }); setFeedback("Imagem aplicada!"); setTimeout(() => setFeedback(""), 1500); }} className="rounded bg-[#c2a25b] px-1.5 py-0.5 text-[9px] font-bold text-black">Usar</button>
                              <button onClick={() => { const updated = imageBank.filter((_, j) => j !== i); setImageBank(updated); localStorage.setItem("carrossel-image-bank", JSON.stringify(updated)); }} className="rounded bg-red-500/60 px-1.5 py-0.5 text-[9px] text-white">X</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {imageBank.length > 0 && (
                      <button onClick={() => { setImageBank([]); localStorage.removeItem("carrossel-image-bank"); }} className="w-full text-[10px] text-white/40 hover:text-white/70">limpar todas</button>
                    )}
                  </div>
                </details>
                <Field label="Posição da imagem">
                  <div className="flex gap-1">
                    {(["top", "left", "right"] as const).map((a) => (
                      <button key={a} onClick={() => updateCard(activeIndex, { imagePosition: a })} className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold capitalize ${(a === "top" ? (!isSplit) : s.imagePosition === a) ? "bg-white/20 text-white" : "bg-white/5 text-white/70"}`}>{a === "top" ? "Fundo" : a === "left" ? "Esquerda" : "Direita"}</button>
                    ))}
                  </div>
                </Field>
                <Field label="Posição do texto">
                  <div className="mb-2">
                    <div className="text-[10px] text-white/50 mb-1">Vertical</div>
                    <div className="flex gap-1">
                      {(["top", "center", "bottom"] as TextVerticalAlign[]).map((a) => (
                        <button key={a} onClick={() => updateCard(activeIndex, { textVerticalAlign: a })} className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold capitalize ${s.textVerticalAlign === a ? "bg-white/20 text-white" : "bg-white/5 text-white/70"}`}>{a === "top" ? "Superior" : a === "center" ? "Centro" : "Inferior"}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/50 mb-1">Horizontal</div>
                    <div className="flex gap-1">
                      {(["left", "center", "right"] as TextAlign[]).map((a) => (
                        <button key={a} onClick={() => updateCard(activeIndex, { textAlign: a })} className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold capitalize ${s.textAlign === a ? "bg-white/20 text-white" : "bg-white/5 text-white/70"}`}>{a === "left" ? "Esquerda" : a === "center" ? "Centralizado" : "Direita"}</button>
                      ))}
                    </div>
                  </div>
                </Field>
                <div className="mb-3">
                  <div className="mb-1 text-[10px] text-white/50">Zoom da imagem</div>
                  <input type="range" min={50} max={200} step={5} value={s.imageZoom} onChange={(e) => updateCard(activeIndex, { imageZoom: Number(e.target.value) })} className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, ${GOLD} ${(s.imageZoom - 50) / 150 * 100}%, rgba(255,255,255,0.15) ${(s.imageZoom - 50) / 150 * 100}%)` }} />
                  <div className="text-[10px] text-white/40 text-right">{s.imageZoom}%</div>
                </div>
                <div className="mb-3">
                  <div className="mb-1 text-[10px] text-white/50">Gradiente (direção)</div>
                  <div className="flex gap-1">
                    {(["top", "bottom", "left", "right"] as const).map((d) => (
                      <button key={d} onClick={() => updateCard(activeIndex, { gradientDirection: d })} className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold capitalize ${s.gradientDirection === d ? "bg-white/20 text-white" : "bg-white/5 text-white/70"}`}>{d === "top" ? "Topo" : d === "bottom" ? "Base" : d === "left" ? "Esquerda" : "Direita"}</button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="mb-1 text-[10px] text-white/50">Gradiente escuro</div>
                  <input type="range" min={0} max={100} step={5} value={s.gradientOpacity} onChange={(e) => updateCard(activeIndex, { gradientOpacity: Number(e.target.value) })} className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, ${GOLD} ${s.gradientOpacity}%, rgba(255,255,255,0.15) ${s.gradientOpacity}%)` }} />
                  <div className="text-[10px] text-white/40 text-right">{s.gradientOpacity}%</div>
                </div>


              </div>
            )}

            {/* Content Tab */}
            {activeTab === "content" && (
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xs font-bold tracking-wider uppercase text-white/70">Captura & Conteúdo</h2>
                </div>

                {/* ETAPA 1 — Captura do Insight */}
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <div className="mb-1 text-[11px] tracking-wider uppercase text-white/50">Insight</div>
                  <p className="mb-2 text-[10px] text-white/40">Cole um link, artigo, tweet, notícia, ideia ou anotação. A IA analisa e monta o carrossel.</p>
                  <textarea
                    value={insight}
                    onChange={(e) => setInsight(e.target.value)}
                    placeholder="Cole seu insight aqui...&#10;&#10;Ex: link de artigo, vídeo do YouTube, tweet, texto próprio, ideia solta"
                    rows={5}
                    className={inputCls + " resize-none text-[11px]"}
                  />
                  <button
                    onClick={storeGenerateFromInsight}
                    disabled={aiStatus === "analyzing" || aiStatus === "generating" || !insight.trim()}
                    className="mt-2 w-full rounded-md py-2.5 text-xs font-bold transition disabled:opacity-40"
                    style={{ background: GOLD, color: "#111" }}
                  >
                    {aiStatus === "analyzing" ? "Analisando insight..." :
                     aiStatus === "generating" ? "Gerando carrossel..." :
                     "Analisar e Gerar Carrossel"}
                  </button>

                  {aiStatus === "error" && aiError && (
                    <div className="mt-2 rounded-md bg-red-500/10 px-3 py-2 text-[10px] text-red-400">
                      {aiError}
                      {aiError.includes("GROQ_API_KEY") && (
                        <span className="block mt-1">Adicione GROQ_API_KEY no arquivo .env (key grátis em console.groq.com).</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Análise detectada */}
                {insightAnalysis && (
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                    <div className="mb-2 text-[11px] tracking-wider uppercase text-white/50">Análise do Insight</div>
                    <div className="space-y-1.5 text-[10px] text-white/60">
                      {insightAnalysis.theme && <div><span className="text-white/40">Tema:</span> {insightAnalysis.theme}</div>}
                      {insightAnalysis.painPoint && <div><span className="text-white/40">Dor:</span> {insightAnalysis.painPoint}</div>}
                      {insightAnalysis.implicitDesire && <div><span className="text-white/40">Desejo:</span> {insightAnalysis.implicitDesire}</div>}
                      {insightAnalysis.positioningAngle && <div><span className="text-white/40">Ângulo:</span> {insightAnalysis.positioningAngle}</div>}
                      {insightAnalysis.contentOpportunity && <div><span className="text-white/40">Oportunidade:</span> {insightAnalysis.contentOpportunity}</div>}
                      {insightAnalysis.viralPotential && <div><span className="text-white/40">Viral:</span> {insightAnalysis.viralPotential}</div>}
                      {insightAnalysis.conversionPotential && <div><span className="text-white/40">Conversão:</span> {insightAnalysis.conversionPotential}</div>}
                    </div>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3">
                  <details className="group">
                    <summary className="cursor-pointer text-[11px] font-semibold tracking-wider text-white/50 hover:text-white">Editar manualmente</summary>
                    <div className="mt-3 space-y-3">
                      <Field label="Tópico"><input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: IA, marketing, vendas..." className={inputCls} /></Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Objetivo">
                          <div className="flex gap-1">
                            {(["viral", "authority", "sales"] as Goal[]).map((g) => (
                              <button key={g} onClick={() => setGoal(g)} className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold capitalize ${goal === g ? "bg-white/20 text-white" : "bg-white/5 text-white/70"}`}>{g === "viral" ? "Viral" : g === "authority" ? "Autoridade" : "Vendas"}</button>
                            ))}
                          </div>
                        </Field>
                        <Field label="Tom">
                          <div className="flex gap-1">
                            {(["direto", "educacional", "provocativo"] as const).map((t) => (
                              <button key={t} onClick={() => setTone(t)} className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold capitalize ${tone === t ? "bg-white/20 text-white" : "bg-white/5 text-white/70"}`}>{t === "direto" ? "Direto" : t === "educacional" ? "Educacional" : "Provocativo"}</button>
                            ))}
                          </div>
                        </Field>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={generateCards} className="flex-1 rounded-md py-2 text-xs font-bold" style={{ background: GOLD, color: "#111" }}>Gerar Cards</button>
                        <button onClick={generateAll} className="flex-1 rounded-md py-2 text-xs font-bold" style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}>Gerar Tudo</button>
                      </div>
                    </div>
                  </details>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <details className="group">
                    <summary className="cursor-pointer text-[11px] font-semibold tracking-wider text-white/50 hover:text-white">Framework de Copy</summary>
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {(Object.entries(FRAMEWORK_LABELS) as [Framework, string][]).map(([key, label]) => (
                          <button key={key} onClick={() => setFramework(key)} className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${framework === key ? "bg-white/20 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`}>{label}</button>
                        ))}
                      </div>
                    </div>
                  </details>
                </div>

                <Field label="Caption">
                  <div className="flex gap-2">
                    <textarea value={generatedCaption} onChange={(e) => setGeneratedCaption(e.target.value)} rows={6} className={inputCls + " flex-1"} />
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button onClick={() => { const c = generateCaption(cards, topic, framework, goal); setGeneratedCaption(c); setFeedback("Caption gerada!"); setTimeout(() => setFeedback(""), 2000); }} className="rounded-md bg-[#c2a25b] px-3 py-2 text-[10px] font-bold text-black hover:brightness-110">Gerar</button>
                      <button onClick={() => { navigator.clipboard.writeText(generatedCaption); setFeedback("Caption copiada!"); setTimeout(() => setFeedback(""), 2000); }} className="rounded-md bg-white/10 px-3 py-2 text-[10px] font-semibold text-white/70 hover:text-white">Copiar</button>
                    </div>
                  </div>
                </Field>

                <Field label="Hashtags">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1.5">
                        {generatedHashtags.map((tag, i) => (
                          <span key={i} className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-white/70">{tag}
                            <button onClick={() => setGeneratedHashtags(generatedHashtags.filter((_, j) => j !== i))} className="ml-0.5 text-white/40 hover:text-white p-0.5"><IconX className="w-2.5 h-2.5" /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1 mt-2">
                        <input placeholder="Nova hashtag..." onKeyDown={(e) => { if (e.key === "Enter" && e.currentTarget.value.trim()) { setGeneratedHashtags([...generatedHashtags, e.currentTarget.value.trim()]); e.currentTarget.value = ""; }}} className="flex-1 rounded-md bg-white/5 px-2 py-1 text-xs text-white outline-none ring-1 ring-white/10 focus:ring-[#c2a25b]" />
                        <button onClick={() => { const input = document.querySelector("#hashtag-input") as HTMLInputElement; if (input?.value.trim()) { setGeneratedHashtags([...generatedHashtags, input.value.trim()]); input.value = ""; } }} className="rounded-md px-2 py-1 text-xs font-semibold bg-white/10 text-white/70">+</button>
                      </div>
                    </div>
                    <button onClick={() => { const text = generatedHashtags.join(" "); navigator.clipboard.writeText(text); setFeedback("Hashtags copiadas!"); setTimeout(() => setFeedback(""), 2000); }} className="shrink-0 self-start rounded-md bg-white/10 px-3 py-2 text-[10px] font-semibold text-white/70 hover:text-white">Copiar</button>
                  </div>
                </Field>
              </div>
            )}

            {/* Design Tab */}
            {activeTab === "design" && (
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xs font-bold tracking-wider uppercase text-white/70">Design</h2>
                </div>
                <Field label="Tipografia">
                  <div className="flex flex-wrap gap-1">
                    {(Object.entries(TYPOGRAPHY_PRESETS) as [DesignPreset, typeof TYPOGRAPHY_PRESETS[DesignPreset]][]).map(([key, val]) => (
                      <button key={key} onClick={() => setDesignPreset(key)} className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${designPreset === key ? "bg-white/20 text-white ring-1 ring-[#c2a25b]" : "bg-white/5 text-white/70 hover:bg-white/10"}`} style={{ fontFamily: val.fontTitle }}>{TYPOGRAPHY_LABELS[key]}</button>
                    ))}
                  </div>
                </Field>
                <Field label="Tema de Cores">
                  <div className="flex flex-wrap gap-1.5">
                    {(Object.entries(COLOR_THEMES) as [ColorTheme, typeof COLOR_THEMES[ColorTheme]][]).map(([key, val]) => (
                      <button key={key} onClick={() => setColorTheme(key)} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${colorTheme === key ? "ring-1 ring-white" : "ring-1 ring-white/10"}`} style={{ background: val.background, color: val.text }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: val.accent }} />
                        {key === "verdeagua" ? "Verde Água" : key === "azulclaro" ? "Azul Claro" : key.charAt(0).toUpperCase() + key.slice(1)}
                      </button>
                    ))}
                    <button onClick={randomTheme} className="rounded-md px-2 py-1 text-[10px] text-white/50 hover:text-white" title="Sortear tema">Sortear</button>
                    {colorTheme && <button onClick={() => setColorTheme(null)} className="rounded-md px-2 py-1 text-[10px] text-white/50 hover:text-white">Limpar</button>}
                  </div>
                </Field>
                <Field label="Tamanho do Texto">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-white/40 w-8 text-right">{textScale}%</span>
                    <input type="range" min={30} max={200} step={5} value={textScale} onChange={(e) => setTextScale(Number(e.target.value))} className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, ${GOLD} ${(textScale - 30) / 170 * 100}%, rgba(255,255,255,0.15) ${(textScale - 30) / 170 * 100}%)` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <button onClick={() => setTextScale(50)} className="text-[9px] text-white/40 hover:text-white">50%</button>
                    <button onClick={() => setTextScale(75)} className="text-[9px] text-white/40 hover:text-white">75%</button>
                    <button onClick={() => setTextScale(100)} className="text-[9px] text-white/40 hover:text-white">100%</button>
                    <button onClick={() => setTextScale(130)} className="text-[9px] text-white/40 hover:text-white">130%</button>
                  </div>
                </Field>
              </div>
            )}

            {/* Brand Tab */}
            {activeTab === "brand" && (
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-xs font-bold tracking-wider uppercase text-white/70">Marca</h2>
                </div>
                <Field label="Logo">
                  <label className="block cursor-pointer rounded-md bg-white/5 px-3 py-2 text-center text-xs text-white/70 hover:bg-white/10">
                    {brand.logo ? "Trocar logo" : "Enviar logo"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && (() => { const reader = new FileReader(); reader.onload = () => setBrand({ ...brand, logo: reader.result as string }); reader.readAsDataURL(e.target.files[0]); })()} />
                  </label>
                  {brand.logo && <button onClick={() => setBrand({ ...brand, logo: null })} className="mt-1 w-full text-[10px] text-white/50 hover:text-white">remover logo</button>}
                </Field>
                <Field label="Cor Primária">
                  <input type="color" value={brand.primaryColor} onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })} className="h-8 w-full rounded-md cursor-pointer bg-white/5" />
                </Field>
                <Field label="Cor Secundária">
                  <input type="color" value={brand.secondaryColor} onChange={(e) => setBrand({ ...brand, secondaryColor: e.target.value })} className="h-8 w-full rounded-md cursor-pointer bg-white/5" />
                </Field>
                <Field label="Fonte do Título">
                  <select value={brand.fontTitle} onChange={(e) => setBrand({ ...brand, fontTitle: e.target.value })} className={inputCls}>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="'Playfair Display', serif">Playfair Display</option>
                    <option value="'DM Serif Display', serif">DM Serif Display</option>
                    <option value="'Libre Baskerville', serif">Libre Baskerville</option>
                    <option value="'Cinzel', serif">Cinzel</option>
                    <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
                    <option value="'Merriweather', serif">Merriweather</option>
                    <option value="'Abril Fatface', serif">Abril Fatface</option>
                    <option value="'Bebas Neue', sans-serif">Bebas Neue</option>
                    <option value="'Anton', sans-serif">Anton</option>
                    <option value="'Oswald', sans-serif">Oswald</option>
                    <option value="'Inter', sans-serif">Inter</option>
                    <option value="'Montserrat', sans-serif">Montserrat</option>
                    <option value="'League Spartan', sans-serif">League Spartan</option>
                  </select>
                </Field>
                <Field label="Fonte do Corpo">
                  <select value={brand.fontBody} onChange={(e) => setBrand({ ...brand, fontBody: e.target.value })} className={inputCls}>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="'Inter', sans-serif">Inter</option>
                    <option value="'Montserrat', sans-serif">Montserrat</option>
                    <option value="'Open Sans', sans-serif">Open Sans</option>
                    <option value="'Roboto', sans-serif">Roboto</option>
                    <option value="'Nunito Sans', sans-serif">Nunito Sans</option>
                    <option value="'Work Sans', sans-serif">Work Sans</option>
                    <option value="'Quicksand', sans-serif">Quicksand</option>
                    <option value="'Manrope', sans-serif">Manrope</option>
                    <option value="'Source Sans 3', sans-serif">Source Sans</option>
                    <option value="'Nunito', sans-serif">Nunito</option>
                    <option value="Georgia, serif">Georgia</option>
                  </select>
                </Field>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={brand.applyByDefault} onChange={(e) => { const v = e.target.checked; setBrand({ ...brand, applyByDefault: v }); if (v) { if (colorTheme) setColorTheme(null); setHighlight({ mode: "medium" as HighlightMode, style: "bold" as HighlightStyle }); } else { setHighlight({ mode: "off" as HighlightMode, style: "bold" as HighlightStyle }); } }} className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#c2a25b] focus:ring-[#c2a25b]" />
                  <span className="text-[11px] text-white/70">Aplicar automaticamente</span>
                </label>
              </div>
            )}
          </div>
        </div>
        {/* Toast */}
        {feedback && !showSaveLoad && !exporting && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-white shadow-lg ring-1 ring-white/10">
            {feedback}
          </div>
        )}
        {exporting && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-[#c2a25b] px-5 py-3 text-sm font-bold text-black shadow-lg shadow-black/30">
            {exporting}
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-white/10 bg-black/40 px-3 py-2.5 text-[15px] text-white outline-none focus:border-[#c2a25b] sm:text-sm sm:py-2";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 block">
      <div className="mb-1 text-[11px] tracking-wider uppercase text-white/50">{label}</div>
      {children}
    </div>
  );
}

function QrModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    import("qrcode").then((QRCode) => {
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, url, { width: 200, margin: 2, color: { dark: "#000", light: "#fff" } });
      }
    });
  }, [url]);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-3" onClick={onClose}>
      <div className="flex flex-col items-center gap-3 rounded-xl bg-zinc-900 p-6 ring-1 ring-white/10" onClick={(e) => e.stopPropagation()}>
        <div className="text-xs font-bold tracking-wider uppercase text-white/70">QR Code</div>
        <div className="text-sm text-white/70">{name}</div>
        <canvas ref={canvasRef} className="rounded-lg" />
        <div className="text-[10px] text-white/50 text-center max-w-[220px]">{url}</div>
        <button onClick={onClose} className="rounded-md bg-white/10 px-4 py-2 text-xs text-white/80">Fechar</button>
      </div>
    </div>
  );
}
