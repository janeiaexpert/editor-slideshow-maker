"use client";

import { motion } from "framer-motion";
import { GlowEffect } from "@/components/GlowEffect";

interface Props {
  time: number;
  frame: number;
}

function show(t: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (t - start) / (end - start)));
}

const MESSAGES: [string, boolean, number][] = [
  ["Oi! Quero saber mais 👋", false, 12.3],
  ["Olá! 3 perguntas rápidas:", true, 12.9],
  ["1. Você já tem negócio?", true, 13.4],
  ["Sim, 18k/mês", false, 14.0],
  ["2. Qual sua maior dor hoje?", true, 14.5],
  ["Tempo no operacional", false, 15.1],
  ["✓ Perfil identificado", true, 15.6],
  ["🟢 Link enviado automaticamente", true, 16.2],
];

export function SceneSolution({ time }: Props) {
  const t = time;

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center pt-[5%]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.3 }}
    >
      {/* Eyebrow */}
      <motion.div
        className="rounded-full px-6 py-2 mt-[30px]"
        style={{ background: "#00E676" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: show(t, 11.2, 11.8) }}
      >
        <span className="text-[11px] font-bold" style={{ color: "#0A0A0A" }}>
          O FLUXO
        </span>
      </motion.div>

      <GlowEffect color="green" cy="12%" size={200} opacity={0.3 * show(t, 11.2, 11.8)} />

      {/* Title */}
      <motion.p
        className="font-bold mt-[20px]"
        style={{ fontSize: "34px", color: "#FFFFFF" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: show(t, 11.4, 12), y: 30 * (1 - show(t, 11.4, 12)) }}
      >
        3 etapas.
      </motion.p>
      <motion.p
        className="text-[16px] font-medium"
        style={{ color: "#2878FF" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: show(t, 11.6, 12.2), y: 30 * (1 - show(t, 11.6, 12.2)) }}
      >
        Zero atendente humano.
      </motion.p>

      {/* Chat box */}
      <motion.div
        className="relative w-[85%] rounded-2xl mt-[20px] p-4"
        style={{
          background: "#1C1C1C",
          border: "1px solid rgba(0,40,160,0.3)",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: show(t, 11.8, 12.4), scale: 1 }}
        transition={{ ease: "easeOut" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between mb-3 pb-3"
          style={{ borderBottom: "1px solid rgba(0,40,160,0.2)" }}
        >
          <span className="text-[10px] font-bold" style={{ color: "#FFFFFF" }}>
            Direct · fluxo ativo
          </span>
          <span className="w-2 h-2 rounded-full" style={{ background: "#00E676" }} />
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-2 min-h-[280px]">
          {MESSAGES.map(([text, isIa, showAt]) => {
            const p = Math.min(1, Math.max(0, (t - showAt) * 6));
            if (p <= 0) return null;
            const opacity = Math.min(1, p);
            const yOff = (1 - easeOut5(p)) * 20;

            return (
              <motion.div
                key={showAt}
                className={`flex ${isIa ? "justify-start" : "justify-end"}`}
                style={{ opacity, transform: `translateY(${yOff}px)` }}
              >
                <div
                  className={`px-3 py-2 rounded-xl max-w-[80%] text-[12px]`}
                  style={{
                    background: isIa ? "#0028A0" : "#3C3C3C",
                    color: "#FFFFFF",
                  }}
                >
                  {text}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Step labels */}
      <div className="flex flex-col items-center mt-[15px] gap-[8px]">
        {[
          [12.5, "① Gatilho de entrada"],
          [14.8, "② Qualificação silenciosa"],
          [16.0, "③ Rota personalizada"],
        ].map(([showAt, text]) => (
          <motion.p
            key={showAt as number}
            className="text-[12px] font-medium"
            style={{ color: "#00E676" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: show(t, showAt as number, (showAt as number) + 0.6) }}
          >
            {text as string}
          </motion.p>
        ))}
      </div>

      {/* Fade out */}
      {t > 18.5 && (
        <motion.div
          className="absolute inset-0 bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: show(t, 18.5, 19) }}
        />
      )}
    </motion.div>
  );
}

function easeOut5(v: number): number {
  return 1 - (1 - Math.min(1, Math.max(0, v))) ** 5;
}
