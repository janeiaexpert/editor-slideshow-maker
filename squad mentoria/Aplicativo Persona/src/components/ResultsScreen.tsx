"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/app-context";

const LABELS = ["P&B Classico", "Tom Quente", "Alto Contraste"];

export default function ResultsScreen() {
  const { resultImages, favorites, toggleFavorite, openFullscreen, setScreen } =
    useApp();
  const [isExiting, setIsExiting] = useState(false);

  const handleSaveAll = () => {
    resultImages.forEach((img, i) => {
      const link = document.createElement("a");
      link.href = img;
      link.download = `persona-${LABELS[i].toLowerCase().replace(/\s/g, "-")}.jpg`;
      link.click();
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await fetch(resultImages[0]).then((r) => r.blob());
        const file = new File([blob], "persona-results.jpg", {
          type: "image/jpeg",
        });
        await navigator.share({
          title: "Persona - Minhas Fotos",
          text: "Confira minhas fotos transformadas pelo Persona!",
          files: [file],
        });
      } catch {
        // cancelled
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-10 sm:pt-12 pb-3 sm:pb-4">
        <h2
          className="text-xl sm:text-2xl font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-primary)" }}
        >
          Persona
        </h2>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => setScreen("favorites"), 300);
          }}
          className="p-2 transition-opacity hover:opacity-60"
          title="Book de Favoritos"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ color: "var(--color-muted)" }}
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M12 7l1.5 3 3.5.5-2.5 2.5.5 3.5L12 14.5 9 16.5l.5-3.5L7 10.5l3.5-.5z" />
          </svg>
        </button>
      </div>

      {/* Subtitle */}
      <p
        className="text-sm sm:text-base font-light px-4 sm:px-6 mb-6 sm:mb-8"
        style={{ fontFamily: "var(--font-serif)", color: "var(--color-secondary)" }}
      >
        Sua essencia, reinventada.
      </p>

      {/* Separator */}
      <div className="px-4 sm:px-6 mb-6 sm:mb-8">
        <div className="border-t border-gray-100" />
      </div>

      {/* Image Grid */}
      <div className="flex-1 px-4 sm:px-6 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {resultImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
            >
              <div
                className="relative group cursor-pointer rounded-xl overflow-hidden bg-gray-100"
                style={{
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.06)",
                }}
                onClick={() => openFullscreen(img, i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={LABELS[i]}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Persona watermark */}
                <div className="absolute bottom-2 right-2 opacity-40">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                  </svg>
                </div>

                {/* Favorite indicator */}
                {favorites.includes(img) && (
                  <div className="absolute top-3 right-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="var(--color-gold)"
                      stroke="none"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              {/* Label */}
              <p
                className="mt-3 sm:mt-4 text-xs font-light tracking-wide px-1"
                style={{ fontFamily: "var(--font-sans)", color: "var(--color-muted)" }}
              >
                {LABELS[i]}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Separator before CTA */}
      <div className="px-4 sm:px-6 mb-6 sm:mb-8">
        <div className="border-t border-gray-100" />
      </div>

      {/* Action Buttons */}
      <div className="px-4 sm:px-6 pb-10 sm:pb-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
        <button
          onClick={handleSaveAll}
          className="w-full sm:w-auto px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "var(--color-primary)",
            color: "white",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          Salvar Imagens
        </button>
        <button
          onClick={handleShare}
          className="w-full sm:w-auto px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "var(--color-surface)",
            color: "var(--color-primary)",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          Compartilhar Tudo
        </button>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => setScreen("home"), 300);
          }}
          className="w-full sm:w-auto px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-muted)",
            background: "transparent",
          }}
        >
          Nova Sessão
        </button>
      </div>
    </div>
  );
}