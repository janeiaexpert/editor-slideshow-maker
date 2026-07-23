"use client";

export function GridOverlay({ time }: { time: number }) {
  const pulse = 8 + 4 * Math.sin(time * Math.PI * 4);

  return (
    <svg className="absolute inset-0 z-[1] pointer-events-none" width="100%" height="100%" viewBox="0 0 480 854">
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={i * 80}
          y1={0}
          x2={i * 80}
          y2={854}
          stroke="#0047FF"
          strokeWidth={0.5}
          opacity={pulse / 255}
        />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1={0}
          y1={i * 80}
          x2={480}
          y2={i * 80}
          stroke="#0047FF"
          strokeWidth={0.5}
          opacity={pulse / 255}
        />
      ))}
    </svg>
  );
}
