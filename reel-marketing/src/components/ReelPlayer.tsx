"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ReelEngine } from "@/lib/reel-engine";
import { ThreeScene } from "@/lib/three-scene";

const W = 1080, H = 1920;
const DURATION = 30;

export function ReelPlayer() {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [showUI, setShowUI] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ReelEngine | null>(null);
  const threeRef = useRef<ThreeScene | null>(null);
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Init engine + 3D scene
  useEffect(() => {
    if (!canvasRef.current) return;
    threeRef.current = new ThreeScene();
    engineRef.current = new ReelEngine(canvasRef.current, threeRef.current);
    return () => {
      engineRef.current = null;
      threeRef.current?.destroy();
      threeRef.current = null;
    };
  }, []);

  // Scale canvas to fit container
  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      const ch = cw * (H / W);
      const canvas = canvasRef.current;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!playing) return;
    lastRef.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setTime((prev) => {
        const next = prev + dt;
        if (next >= DURATION) { setPlaying(false); return DURATION; }
        return next;
      });
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [playing]);

  // Render frame
  useEffect(() => {
    engineRef.current?.render(time);
  }, [time]);

  const toggleUI = useCallback(() => setShowUI((p) => !p), []);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    setTime(Math.min(DURATION, Math.max(0, pct * DURATION)));
  };

  const handleRestart = () => { setTime(0); setPlaying(true); };

  // ─── EXPORT ─────────────────────────────────────────────────
  const handleExport = async () => {
    if (!canvasRef.current) return;
    setExporting(true);
    setExportProgress(0);

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30);
    const chunks: BlobPart[] = [];

    // Prefer webm with VP9 for quality
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";

    const recorder = new MediaRecorder(stream, { mimeType: mime });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reel-jane-iaexpert.${mime.includes("mp4") ? "mp4" : "webm"}`;
      a.click();
      URL.revokeObjectURL(url);
      setExporting(false);
      setExportProgress(0);
    };

    // Update progress
    const progressInterval = setInterval(() => {
      setExportProgress((p) => Math.min(0.99, p + 0.02));
    }, 600);

    // Record for exactly 30s
    recorder.start();
    setTime(0);
    setPlaying(true);

    // Wait for playback to finish
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        recorder.stop();
        clearInterval(progressInterval);
        setExportProgress(1);
        resolve();
      }, (DURATION + 0.5) * 1000);
    });

    setPlaying(false);
  };

  return (
    <div className="relative" style={{ width: "min(90vh * 9/16, 100vw - 32px)", maxWidth: 480 }}>
      {/* Reel container */}
      <div
        ref={containerRef}
        className="reel-container cursor-pointer select-none overflow-hidden"
        onClick={toggleUI}
        style={{ boxShadow: "0 0 60px rgba(0,71,255,0.15)" }}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* Top progress bar */}
        <div
          className="absolute top-0 left-0 h-[2px] z-10 transition-all duration-100"
          style={{
            width: `${(time / DURATION) * 100}%`,
            background: "linear-gradient(90deg, #0047FF, #00E676)",
          }}
        />
      </div>

      {/* Controls */}
      <div
        className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
          showUI ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setPlaying((p) => !p); }}
          className="px-3 py-1.5 text-xs rounded-full border transition-colors hover:border-gray-500"
          style={{ borderColor: "#3C3C3C", color: "#FFFFFF" }}
        >
          {playing ? "⏸" : "▶"}
        </button>

        <div
          className="flex-1 h-1.5 rounded-full cursor-pointer relative"
          style={{ background: "#1C1C1C" }}
          onClick={(e) => { e.stopPropagation(); handleSeek(e); }}
        >
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              width: `${(time / DURATION) * 100}%`,
              background: "linear-gradient(90deg, #0047FF, #00E676)",
            }}
          />
        </div>

        <span className="text-[10px] font-mono shrink-0" style={{ color: "#646464", minWidth: 60, textAlign: "right" }}>
          {Math.floor(time / 60)}:{String(Math.floor(time) % 60).padStart(2, "0")} / 0:30
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); handleRestart(); }}
          className="px-3 py-1.5 text-xs rounded-full border transition-colors hover:border-gray-500"
          style={{ borderColor: "#3C3C3C", color: "#FFFFFF" }}
          disabled={exporting}
        >
          ↺
        </button>

        {/* Export button */}
        <button
          onClick={(e) => { e.stopPropagation(); handleExport(); }}
          disabled={exporting}
          className="px-3 py-1.5 text-xs rounded-full border transition-colors font-medium"
          style={{
            borderColor: exporting ? "#3C3C3C" : "#0047FF",
            color: exporting ? "#646464" : "#0047FF",
          }}
        >
          {exporting ? `${Math.round(exportProgress * 100)}%` : "Exportar"}
        </button>
      </div>
    </div>
  );
}
