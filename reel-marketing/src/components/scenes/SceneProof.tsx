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

const CARDS: [string, string, "blue" | "green" | "white", number][] = [
  ["68%", "clientes\nqualificadas\nautom.", "blue", 0],
  ["-4h", "por semana\nno atend.\nmanual", "green", 0.25],
  ["+31%", "taxa de\nfechamento\nem 30 dias", "white", 0.5],
];

export function SceneProof({ time }: Props) {
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
        style={{ background: "#0028A0" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: show(time, 19.2, 19.8) }}
      >
        <span className="text-[11px] font-bold" style={{ color: "#FFFFFF" }}>
          RESULTADO REAL
        </span>
      </motion.div>

      {/* Name */}
      <motion.p
        className="font-bold mt-[30px]"
        style={{ fontSize: "30px", color: "#FFFFFF" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: show(time, 19.4, 20), y: 30 * (1 - show(time, 19.4, 20)) }}
      >
        Ana Castro,
      </motion.p>
      <motion.p
        className="text-[16px] font-light"
        style={{ color: "#646464" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: show(time, 19.6, 20.2), y: 30 * (1 - show(time, 19.6, 20.2)) }}
      >
        mentora de finanças.
      </motion.p>

      {/* Cards */}
      <div className="flex gap-[6px] mt-[20px] px-[8%] w-full">
        {CARDS.map(([val, label, color, delay]) => {
          const p = show(time, 20 + delay, 20.6 + delay);
          const opacity = Math.min(1, p);
          const yOff = (1 - springLike(p)) * 40;

          return (
            <motion.div
              key={val}
              className="flex-1 rounded-xl p-3 flex flex-col items-center"
              style={{
                background: "#1C1C1C",
                opacity,
                transform: `translateY(${yOff}px)`,
                boxShadow: color === "blue" ? "0 0 30px rgba(0,71,255,0.15)" : "none",
              }}
            >
              {/* Accent line */}
              <div
                className="w-[80%] h-[3px] rounded-full mb-3"
                style={{
                  background: color === "blue" ? "#0047FF" : color === "green" ? "#00E676" : "#FFFFFF",
                }}
              />

              {/* Value */}
              <p
                className="font-extrabold text-[28px] leading-none"
                style={{
                  color: color === "blue" ? "#2878FF" : color === "green" ? "#00E676" : "#FFFFFF",
                }}
              >
                {val}
              </p>

              {/* Label */}
              <p
                className="text-[9px] font-light text-center mt-2 leading-tight"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {label.split("\n").map((l, i) => (
                  <span key={i}>
                    {l}
                    <br />
                  </span>
                ))}
              </p>

              {color === "blue" && <GlowEffect color="blue" cx="50%" cy="50%" size={120} opacity={0.3 * opacity} />}
              {color === "green" && <GlowEffect color="green" cx="50%" cy="50%" size={100} opacity={0.2 * opacity} />}
            </motion.div>
          );
        })}
      </div>

      {/* Quote */}
      <motion.div
        className="relative w-[84%] rounded-xl mt-[20px] overflow-hidden flex"
        style={{ background: "#1C1C1C", opacity: 0 }}
        animate={{ opacity: show(time, 22, 22.8) }}
      >
        <div className="w-[5px] shrink-0" style={{ background: "#0047FF" }} />
        <div className="p-4">
          <p className="text-[12px] font-medium leading-relaxed" style={{ color: "#646464" }}>
            &ldquo;Quando eu entro na conversa, a cliente já está pronta. Eu só apareço pra fechar.&rdquo;
          </p>
          <p className="text-[10px] font-light mt-2" style={{ color: "#3C3C3C" }}>
            — Ana Castro, Mentora de Finanças
          </p>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div
        className="h-[1px] mt-[18px]"
        style={{ background: "#00E676" }}
        initial={{ width: 0 }}
        animate={{ width: show(time, 23, 23.6) * 150 }}
      />

      {/* Body */}
      <motion.p
        className="text-[15px] font-medium mt-[15px]"
        style={{ color: "#FFFFFF" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: show(time, 23.2, 23.8) }}
      >
        Configura uma vez.
      </motion.p>
      <motion.p
        className="text-[15px] font-medium"
        style={{ color: "#FFFFFF" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: show(time, 23.4, 24) }}
      >
        Funciona 24h por dia.
      </motion.p>

      {/* Fade out */}
      {time > 24.5 && (
        <motion.div
          className="absolute inset-0 bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: show(time, 24.5, 25) }}
        />
      )}
    </motion.div>
  );
}

function springLike(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const s = 5;
  const d = 0.65;
  const w = s * (1 - d);
  return 1 - Math.exp(-d * s * t) * Math.cos(w * t);
}
