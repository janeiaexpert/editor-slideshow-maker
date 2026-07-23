"use client";

import { useEffect, useRef } from "react";

const W = 480;
const H = 854;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  col: [number, number, number];
  alpha: number;
  seed: number;
}

function makeParticles(count: number): Particle[] {
  const colors: [number, number, number][] = [
    [0, 71, 255],
    [0, 230, 118],
    [255, 255, 255],
  ];
  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -0.3 - Math.random() * 0.4,
    r: 1 + Math.random() * 2,
    col: colors[i % 3],
    alpha: 30 + Math.random() * 70,
    seed: Math.random() * 100,
  }));
}

export function ParticleCanvas({ playing }: { playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    particlesRef.current = makeParticles(60);
    frameRef.current = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let anim = 0;

    const tick = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, W, H);

      const f = frameRef.current;
      for (const p of particlesRef.current) {
        const px = (p.x + p.vx * f * 0.02) % W;
        const py = (p.y + p.vy * f * 0.02) % H;
        const a = (p.alpha / 255) * (0.5 + 0.5 * Math.sin(f * 0.05 + p.seed));
        const r = p.r;

        ctx.beginPath();
        ctx.arc(px < 0 ? W + px : px, py < 0 ? H + py : py, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${a})`;
        ctx.fill();
      }

      anim = requestAnimationFrame(tick);
    };

    anim = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(anim);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
