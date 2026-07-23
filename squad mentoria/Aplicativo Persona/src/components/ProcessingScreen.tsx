"use client";

import { useState, useEffect, useRef } from "react";
import { useApp } from "@/lib/app-context";

const MESSAGES = [
  "A IA esta capturando sua essencia...",
  "Refinando cada detalhe do seu estilo...",
  "Quase pronto, preparando seus looks...",
];

export default function ProcessingScreen() {
  const { uploadedImage, screen } = useApp();
  const [currentMsg, setCurrentMsg] = useState(0);
  const [msgOpacity, setMsgOpacity] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let idx = 0;
    const cycle = () => {
      setMsgOpacity(0);
      setTimeout(() => {
        idx = (idx + 1) % MESSAGES.length;
        setCurrentMsg(idx);
        setMsgOpacity(1);
      }, 800);
      timerRef.current = setTimeout(cycle, 2800);
    };
    timerRef.current = setTimeout(cycle, 2800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (screen !== "processing") return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 animate-fade-in">
      {/* Title */}
      <h2
        className="text-xl sm:text-2xl font-semibold mb-8 sm:mb-12 tracking-tight"
        style={{ fontFamily: "var(--font-serif)", color: "var(--color-primary)" }}
      >
        Persona
      </h2>

      {/* Dynamic message */}
      <p
        className="text-base sm:text-lg font-light mb-8 sm:mb-10 text-center transition-opacity duration-700"
        style={{
          fontFamily: "var(--font-serif)",
          color: "var(--color-secondary)",
          opacity: msgOpacity,
          minHeight: "28px",
        }}
      >
        {MESSAGES[currentMsg]}
      </p>

      {/* Image with processing ring */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] processing-ring rounded-full" />

        {/* Spinning ring */}
        <div className="absolute w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] processing-spin rounded-full border border-[var(--color-gold)] opacity-40" />

        {/* Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute particle"
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "var(--color-gold)",
              top: `${30 + Math.sin(i * 1.05) * 45}%`,
              left: `${50 + Math.cos(i * 1.05) * 45}%`,
              animationDelay: `${i * 0.35}s`,
              opacity: 0.7,
            }}
          />
        ))}

        {/* User image */}
        <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-full overflow-hidden">
          {uploadedImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={uploadedImage}
              alt="Processando"
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(100%) blur(8px) brightness(0.8)" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 rounded-full" />
        </div>
      </div>

      {/* Status text */}
      <p
        className="mt-8 sm:mt-10 text-[10px] sm:text-xs font-light tracking-wider uppercase"
        style={{ color: "var(--color-light)" }}
      >
        IA Gerando seus estilos
      </p>
    </div>
  );
}