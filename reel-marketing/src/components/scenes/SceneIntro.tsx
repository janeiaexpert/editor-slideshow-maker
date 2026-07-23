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

export function SceneIntro({ time }: Props) {
  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center pt-[5%]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      transition={{ duration: 0.3 }}
    >
      <GlowEffect color="blue" cy="35%" size={400} opacity={0.4 * show(time, 0, 2)} />

      {/* Tag */}
      <motion.p
        className="text-[11px] font-medium tracking-[2px] mt-[60px]"
        style={{ color: "#00E676" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: show(time, 0.3, 1) * 0.9 }}
      >
        JANE SANTANA
      </motion.p>

      {/* Separator */}
      <motion.div
        className="h-[1px] mt-[8px]"
        style={{ background: "#0047FF", width: 0 }}
        animate={{ width: show(time, 0.5, 1.5) * 200 }}
        transition={{ ease: "easeOut" }}
      />

      {/* Headlines */}
      <div className="flex flex-col items-center mt-[30px] gap-0 leading-tight">
        {[
          ["O fluxo que", 36, "#FFFFFF", 0.6],
          ["qualifica", 36, "#FFFFFF", 0.75],
          ["clientes no", 36, "#FFFFFF", 0.9],
          ["Direct", 48, "#2878FF", 1.05],
          ["sem você", 30, "#646464", 1.3],
          ["estar lá.", 30, "#646464", 1.45],
        ].map(([text, size, color, start], i) => (
          <motion.p
            key={i}
            className="font-bold leading-tight"
            style={{ fontSize: `${size}px`, color: color as string }}
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: show(time, start as number, (start as number) + 0.6),
              y: 40 * (1 - springLike(show(time, start as number, (start as number) + 0.6))),
            }}
            transition={{ ease: "easeOut" }}
          >
            {text as string}
          </motion.p>
        ))}
      </div>

      {/* Subtext */}
      <motion.p
        className="absolute text-[13px] font-light"
        style={{ bottom: "18%", color: "#646464", opacity: 0 }}
        animate={{ opacity: show(time, 2.5, 3.2) }}
      >
        IA aplicada a negócios
      </motion.p>
      <motion.p
        className="absolute text-[11px] font-light"
        style={{ bottom: "14%", color: "#3C3C3C", opacity: 0 }}
        animate={{ opacity: show(time, 2.5, 3.2) }}
      >
        Automação · Qualificação · Conversão
      </motion.p>

      {/* Fade out */}
      {time > 4.5 && (
        <motion.div
          className="absolute inset-0 bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: show(time, 4.5, 5) }}
        />
      )}
    </motion.div>
  );
}

function springLike(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const s = 6;
  const d = 0.65;
  const w = s * (1 - d);
  return 1 - Math.exp(-d * s * t) * Math.cos(w * t);
}
