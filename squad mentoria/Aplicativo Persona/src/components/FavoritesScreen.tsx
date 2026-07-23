"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";

export default function FavoritesScreen() {
  const { favorites, setScreen, openFullscreen, toggleFavorite } = useApp();
  const [isExiting, setIsExiting] = useState(false);

  const goBack = () => {
    setIsExiting(true);
    setTimeout(() => setScreen("results"), 300);
  };

  return (
    <div
      className={`flex flex-col min-h-screen animate-fade-in ${
        isExiting ? "animate-fade-out" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-10 sm:pt-12 pb-3 sm:pb-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={goBack}
            className="p-2 transition-opacity hover:opacity-60"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ color: "var(--color-primary)" }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2
            className="text-lg sm:text-2xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-serif)", color: "var(--color-primary)" }}
          >
            Meu Book de Favoritos
          </h2>
        </div>
        {favorites.length > 0 && (
          <span className="text-[10px] sm:text-xs font-light" style={{ color: "var(--color-light)" }}>
            {favorites.length} {favorites.length === 1 ? "foto" : "fotos"}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 pb-8 sm:pb-10">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              style={{ color: "var(--color-light)" }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p
              className="mt-4 text-sm font-light"
              style={{ color: "var(--color-light)" }}
            >
              Nenhum favorito ainda.
            </p>
            <p
              className="mt-1 text-xs font-light text-center max-w-[250px]"
              style={{ color: "var(--color-light)" }}
            >
              Toque no icone de coracao nas fotos para salva-las aqui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {favorites.map((img, i) => (
              <div
                key={i}
                className="animate-scale-in cursor-pointer rounded-xl overflow-hidden relative group"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
                }}
                onClick={() => openFullscreen(img, i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Favorito ${i + 1}`}
                  className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-end p-2 opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const link = document.createElement("a");
                        link.href = img;
                        link.download = `persona-favorito-${i + 1}.jpg`;
                        link.click();
                      }}
                      className="p-1.5 sm:p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(img);
                      }}
                      className="p-1.5 sm:p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-red-400/60 transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-gold)" stroke="var(--color-gold)" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}