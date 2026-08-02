"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/app-context";

export default function FullscreenView() {
  const { fullscreenImage, fullscreenIndex, favorites, toggleFavorite, closeFullscreen } =
    useApp();
  const [showButtons, setShowButtons] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!fullscreenImage || fullscreenIndex === null) return null;

  const isFavorite = favorites.includes(fullscreenImage);

  const handleSave = () => {
    const link = document.createElement("a");
    link.href = fullscreenImage;
    link.download = `persona-resultado-${fullscreenIndex + 1}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await fetch(fullscreenImage).then((r) => r.blob());
        const file = new File([blob], `persona-${fullscreenIndex + 1}.jpg`, {
          type: "image/jpeg",
        });
        await navigator.share({ title: "Persona", files: [file] });
      } catch {
        // cancelled
      }
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => closeFullscreen(), 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-scale-in ${
        isExiting ? "animate-fade-out" : ""
      }`}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center w-full px-4 pb-20 sm:pb-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fullscreenImage}
          alt={`Resultado ${fullscreenIndex + 1}`}
          className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
        />
      </div>

      {/* Floating action buttons */}
      <div
        className={`absolute bottom-6 sm:bottom-10 left-0 right-0 flex items-center justify-center gap-4 sm:gap-5 transition-all duration-300 ${
          showButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Save */}
        <button
          onClick={handleSave}
          className="p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/25 active:scale-95"
          title="Salvar Foto"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>

        {/* Favorite */}
        <button
          onClick={() => toggleFavorite(fullscreenImage)}
          className="p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/25 active:scale-95"
          title="Favoritar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isFavorite ? "var(--color-gold)" : "none"}
            stroke={isFavorite ? "var(--color-gold)" : "white"}
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/25 active:scale-95"
          title="Compartilhar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>
    </div>
  );
}