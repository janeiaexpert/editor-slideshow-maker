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

export function SceneCta({ time }: Props) {
  // Flash at start
  const flash = show(time, 25, 25.5);

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center pt-[5%]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.3 }}
    >
      {/* Flash */}
      {flash > 0 && (
        <div
          className="absolute inset-0 z-50 pointer-events-none"
          style={{ background: `rgba(0,71,255,${flash * 0.8})` }}
        />
      )}

      <GlowEffect color="blue" cy="45%" size={450} opacity={0.6 * show(time, 25, 26.5)} />

      {/* "COMENTA" */}
      <motion.p
        className="font-extrabold mt-[120px] leading-none"
        style={{ fontSize: "48px", color: "#FFFFFF" }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: show(time, 25.2, 25.8), y: 50 * (1 - springLike(show(time, 25.2, 25.8), 6, 0.65)) }}
      >
        COMENTA
      </motion.p>

      {/* "DIRECT" pill */}
      <motion.div
        className="rounded-xl px-8 py-3 mt-[10px]"
        style={{ background: "#0047FF" }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: show(time, 25.5, 26.1), scale: 0.7 + 0.3 * Math.min(1, show(time, 25.5, 26.1) * 2) }}
        transition={{ ease: "easeOut" }}
      >
        <GlowEffect color="blue" cx="50%" cy="50%" size={180} opacity={0.5 * show(time, 25.5, 26.1)} />
        <p className="font-extrabold text-[32px]" style={{ color: "#FFFFFF" }}>
          DIRECT
        </p>
      </motion.div>

      {/* Sub */}
      <motion.p
        className="text-[16px] font-light mt-[30px]"
        style={{ color: "#646464" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: show(time, 26.2, 26.8) }}
      >
        que te mando o fluxo completo
      </motion.p>

      {/* Divider */}
      <motion.div
        className="h-[1px] mt-[12px]"
        style={{ background: "#00E676" }}
        initial={{ width: 0 }}
        animate={{ width: show(time, 26.6, 27) * 160 }}
      />

      {/* Handle */}
      <motion.p
        className="font-bold mt-[10px]"
        style={{ fontSize: "22px", color: "#2878FF" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: show(time, 26.8, 27.4) }}
      >
        @jane.iaexpert
      </motion.p>

      {/* Save hint */}
      <motion.p
        className="text-[13px] font-light mt-[10px]"
        style={{ color: "#646464" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: show(time, 27.4, 28) }}
      >
        Salva · Compartilha · Aplica 👇
      </motion.p>

      {/* Pulsing dot */}
      <motion.div
        className="mt-[15px] w-[20px] h-[20px] rounded-full"
        style={{ background: "#00E676", opacity: 0 }}
        animate={{
          opacity: show(time, 27, 27.6),
          scale: [1, 1.3, 1],
          boxShadow: ["0 0 10px rgba(0,230,118,0.3)", "0 0 25px rgba(0,230,118,0.6)", "0 0 10px rgba(0,230,118,0.3)"],
        }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      <GlowEffect color="green" cy="75%" size={80} opacity={0.4 * show(time, 27, 28)} />

      {/* Final fade */}
      {time > 29.3 && (
        <motion.div
          className="absolute inset-0 bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: show(time, 29.3, 30) }}
        />
      )}
    </motion.div>
  );
}

function springLike(t: number, s = 6, d = 0.65): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const w = s * (1 - d);
  return 1 - Math.exp(-d * s * t) * Math.cos(w * t);
}
