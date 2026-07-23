"use client";

import { motion } from "framer-motion";
import { GlowEffect } from "@/components/GlowEffect";

interface Props {
  time: number;
  frame: number;
}

function show(t: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (t - start) / Math.max(end - start, 0.01)));
}

export function SceneProblem({ time }: Props) {
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
        className="rounded-full px-6 py-2 mt-[50px]"
        style={{ background: "#0028A0" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: show(time, 5.2, 5.8) }}
      >
        <span className="text-[11px] font-bold" style={{ color: "#FFFFFF" }}>
          O PROBLEMA
        </span>
      </motion.div>

      <GlowEffect color="white" cy="35%" size={250} opacity={0.3 * show(time, 5.5, 7)} />

      {/* Headlines */}
      <motion.p
        className="font-bold mt-[50px]"
        style={{ fontSize: "28px", color: "#FFFFFF" }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: show(time, 5.4, 6), y: 40 * (1 - show(time, 5.4, 6)) }}
      >
        Você responde
      </motion.p>
      <motion.p
        className="font-bold"
        style={{ fontSize: "28px", color: "#FFFFFF" }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: show(time, 5.55, 6.15), y: 40 * (1 - show(time, 5.55, 6.15)) }}
      >
        Direct o dia todo.
      </motion.p>

      {/* Stat */}
      <motion.p
        className="font-extrabold mt-[30px] leading-none"
        style={{ fontSize: "82px", color: "#2878FF" }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: show(time, 6, 7), y: 60 * (1 - springLike(show(time, 6, 7))) }}
      >
        73%
      </motion.p>

      <GlowEffect color="blue" cy="42%" size={250} opacity={0.5 * show(time, 6, 7.5)} />

      <motion.p
        className="text-[13px] font-light"
        style={{ color: "#646464" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: show(time, 6.8, 7.4) }}
      >
        dos leads some antes da resposta
      </motion.p>

      {/* Divider */}
      <motion.div
        className="h-[1px] mt-[20px]"
        style={{ background: "#00E676" }}
        initial={{ width: 0 }}
        animate={{ width: show(time, 7.2, 7.8) * 200 }}
      />

      {/* Body */}
      {[
        ["A cliente manda mensagem.", "#FFFFFF", 7.6, 8.0],
        ["Você está em reunião.", "#646464", 7.85, 8.25],
        ["Ela já comprou da concorrente.", "#00E676", 8.1, 8.5],
      ].map(([text, color, start, end], i) => (
        <motion.p
          key={i}
          className="text-[14px] mt-[12px]"
          style={{ color: color as string }}
          initial={{ opacity: 0 }}
          animate={{ opacity: show(time, start as number, end as number) }}
        >
          {text as string}
        </motion.p>
      ))}

      {/* Fade out */}
      {time > 10.5 && (
        <motion.div
          className="absolute inset-0 bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: show(time, 10.5, 11) }}
        />
      )}
    </motion.div>
  );
}

function springLike(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const s = 5;
  const d = 0.6;
  const w = s * (1 - d);
  return 1 - Math.exp(-d * s * t) * Math.cos(w * t);
}
