"use client";

interface GlowEffectProps {
  color: "blue" | "green" | "white";
  cx?: number | string;
  cy?: number | string;
  size?: number;
  opacity?: number;
}

const colors: Record<string, string> = {
  blue: "rgba(0,71,255,",
  green: "rgba(0,230,118,",
  white: "rgba(255,255,255,",
};

export function GlowEffect({ color, cx = "50%", cy = "50%", size = 300, opacity = 0.3 }: GlowEffectProps) {
  const c = colors[color];

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: typeof cx === "number" ? `${cx}px` : cx,
        top: typeof cy === "number" ? `${cy}px` : cy,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        background: `
          radial-gradient(circle, ${c}0.15) 0%,
          ${c}0.1) 30%,
          ${c}0.05) 60%,
          transparent 80%
        `,
        borderRadius: "50%",
        filter: "blur(40px)",
        opacity,
      }}
    />
  );
}
