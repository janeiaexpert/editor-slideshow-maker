"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/app-context";

const MAX_DIM = 1200;

function downscale(w: number, h: number): [number, number] {
  if (w <= MAX_DIM && h <= MAX_DIM) return [w, h];
  const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
  return [Math.round(w * ratio), Math.round(h * ratio)];
}

function applyFilter(dataUrl: string, type: "pb" | "quente" | "contraste"): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const [cw, ch] = downscale(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, cw, ch);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        let r = d[i], g = d[i + 1], b = d[i + 2];

        if (type === "pb") {
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          const v = Math.min(255, Math.round(gray * 1.1));
          d[i] = v; d[i + 1] = v; d[i + 2] = v;
        } else if (type === "quente") {
          d[i] = Math.min(255, Math.round(r * 1.08 + 15));
          d[i + 1] = Math.min(255, Math.round(g * 0.95 + 8));
          d[i + 2] = Math.min(255, Math.round(b * 0.82));
        } else {
          const avg = (r + g + b) / 3;
          const f = avg > 128 ? 1.2 : 0.8;
          d[i] = Math.min(255, Math.round(r * f));
          d[i + 1] = Math.min(255, Math.round(g * f));
          d[i + 2] = Math.min(255, Math.round(b * f + 10));
        }
      }

      ctx.putImageData(imageData, 0, 0);

      if (type === "pb") {
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (type === "contraste") {
        const grad = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
          canvas.width / 2, canvas.height / 2, canvas.width * 0.75
        );
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, "rgba(0,0,0,0.45)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = dataUrl;
  });
}

async function generateThreeStyles(dataUrl: string): Promise<string[]> {
  const results: string[] = [];
  for (const type of ["pb", "quente", "contraste"] as const) {
    const img = await applyFilter(dataUrl, type);
    results.push(img);
  }
  return results;
}

export default function HomeScreen() {
  const { setUploadedImage, setScreen, setResultImages } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setUploadedImage(dataUrl);
      setIsExiting(true);

      await new Promise((r) => setTimeout(r, 400));
      setScreen("processing");

      setIsGenerating(true);
      const results = await generateThreeStyles(dataUrl);
      setResultImages(results);
      setScreen("results");
      setIsGenerating(false);
    };
    reader.readAsDataURL(file);
  }, [setUploadedImage, setScreen, setResultImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <motion.h1
        className="text-4xl sm:text-5xl font-semibold tracking-tight mb-2"
        style={{ fontFamily: "var(--font-serif)", color: "var(--color-primary)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Persona
      </motion.h1>

      <motion.p
        className="text-sm sm:text-base mb-12 sm:mb-16 font-light text-center"
        style={{ fontFamily: "var(--font-serif)", color: "var(--color-secondary)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
      >
        Sua visao. Nossa arte.
      </motion.p>

      <motion.button
        onClick={() => !isGenerating && fileInputRef.current?.click()}
        className={`group relative flex items-center justify-center w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isGenerating
            ? "border-[var(--color-gold)] bg-yellow-50 cursor-wait"
            : isDragOver
            ? "border-[var(--color-primary)] bg-gray-50 cursor-copy"
            : "hover:border-[var(--color-primary)] hover:bg-gray-50 cursor-pointer"
        }`}
        style={{ borderColor: isDragOver ? "var(--color-primary)" : isGenerating ? "var(--color-gold)" : "var(--color-border)" }}
        disabled={isGenerating}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        whileHover={{ scale: isGenerating ? 1 : 1.03 }}
        whileTap={{ scale: isGenerating ? 1 : 0.97 }}
      >
        {isGenerating ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.span
            className="text-4xl sm:text-5xl font-light"
            style={{ color: "var(--color-secondary)" }}
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 90, color: "var(--color-primary)" }}
            transition={{ duration: 0.3 }}
          >
            +
          </motion.span>
        )}
      </motion.button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <motion.p
        className="mt-8 sm:mt-10 text-xs sm:text-sm font-light text-center"
        style={{ fontFamily: "var(--font-serif)", color: "var(--color-secondary)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
      >
        Toque para iniciar sua sessao de foto.
      </motion.p>

      <motion.p
        className="mt-4 text-[10px] font-light opacity-40"
        style={{ color: "var(--color-light)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
      >
        Edicao 100% local - nada sai do seu pc
      </motion.p>
    </motion.div>
  );
}