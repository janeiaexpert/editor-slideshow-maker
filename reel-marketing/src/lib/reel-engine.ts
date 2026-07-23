import { ThreeScene } from "./three-scene";

const W = 1080, H = 1920;
const FPS = 30;
const DUR = 30;

const BLACK = [10, 10, 10] as const;
const WHITE: [number, number, number] = [255, 255, 255];
const BLUE: [number, number, number] = [0, 71, 255];
const BLUE_L: [number, number, number] = [40, 120, 255];
const BLUE_D: [number, number, number] = [0, 40, 160];
const GREEN: [number, number, number] = [0, 230, 118];
const GRAY1 = [28, 28, 28] as const;
const GRAY2 = [60, 60, 60] as const;
const GRAY3 = [100, 100, 100] as const;

interface Particle {
  x: number; y: number; vx: number; vy: number;
  r: number; col: [number, number, number]; alpha: number; seed: number;
}

function clamp(v: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, v)); }

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

class ParticleSystem {
  parts: Particle[] = [];
  constructor(count = 60) {
    const cols: [number, number, number][] = [BLUE, GREEN, WHITE];
    for (let i = 0; i < count; i++) {
      this.parts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4, vy: -0.3 - Math.random() * 0.4,
        r: 1 + Math.random() * 2, col: cols[i % 3],
        alpha: 30 + Math.random() * 70, seed: Math.random() * 100,
      });
    }
  }
  draw(ctx: CanvasRenderingContext2D, frame: number) {
    for (const p of this.parts) {
      let px = (p.x + p.vx * frame * 0.02) % W;
      let py = (p.y + p.vy * frame * 0.02) % H;
      if (px < 0) px += W; if (py < 0) py += H;
      const a = (p.alpha / 255) * (0.5 + 0.5 * Math.sin(frame * 0.05 + p.seed));
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${a})`;
      ctx.fill();
    }
  }
}

export class ReelEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w = W; h = H;
  particles = new ParticleSystem(60);
  threeScene: ThreeScene | null = null;

  constructor(canvas: HTMLCanvasElement, threeScene?: ThreeScene) {
    this.canvas = canvas;
    canvas.width = W; canvas.height = H;
    this.ctx = canvas.getContext("2d")!;
    this.threeScene = threeScene ?? null;
  }

  render(time: number) {
    const frame = time * FPS;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, W, H);
    this.drawBackground(time);
    this.drawGrid(time);
    this.particles.draw(ctx, frame);
    this.dispatchScenes(time);
    this.drawBars(time);
    this.drawCorners(time);
    // Handle tag always present
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#646464";
    ctx.font = "24px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("@jane.iaexpert  ·  Jane Santana", W / 2, H - 40);
    ctx.restore();

    // Composite 3D scene on top (only during specific scenes, with reduced opacity)
    if (this.threeScene && time < 30) {
      this.threeScene.render(time);
      ctx.save();
      // Lower opacity during text-heavy scenes
      const opacity = (time < 5 || (time >= 11 && time < 19)) ? 0.35 :
                      (time >= 25) ? 0.5 : 0.25;
      ctx.globalAlpha = opacity;
      ctx.drawImage(this.threeScene.canvas, 0, 0);
      ctx.restore();
    }
  }

  private dispatchScenes(time: number) {
    if (time < 5) this.sceneIntro(time);
    else if (time < 11) this.sceneProblem(time);
    else if (time < 19) this.sceneSolution(time);
    else if (time < 25) this.sceneProof(time);
    else this.sceneCta(time);
  }

  // ─── BACKGROUND ──────────────────────────────────────────────
  private drawBackground(time: number) {
    const ctx = this.ctx;
    // Base black
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    const pulse = 1 + 0.3 * Math.sin(time * Math.PI * 2);
    const topBlue = Math.min(0.18 * pulse * 5, 1);
    grad.addColorStop(0, `rgb(${lerp(10, BLUE[0], topBlue)},${lerp(10, BLUE[1], topBlue)},${lerp(10, BLUE[2], topBlue)})`);
    grad.addColorStop(0.18, "#0A0A0A");
    grad.addColorStop(1, "#0A0A0A");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // ─── GRID ────────────────────────────────────────────────────
  private drawGrid(time: number) {
    const ctx = this.ctx;
    const pulse = 8 + 4 * Math.sin(time * Math.PI * 4);
    ctx.strokeStyle = `rgba(0,71,255,${pulse / 255})`;
    ctx.lineWidth = 1;
    const spacing = 90;
    for (let x = 0; x <= W; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += spacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  // ─── GLOW ────────────────────────────────────────────────────
  private drawGlow(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, color: [number, number, number], alpha: number) {
    if (alpha <= 0) return;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},${alpha * 0.15})`);
    grad.addColorStop(0.3, `rgba(${color[0]},${color[1]},${color[2]},${alpha * 0.1})`);
    grad.addColorStop(0.6, `rgba(${color[0]},${color[1]},${color[2]},${alpha * 0.03})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // ─── BARS ────────────────────────────────────────────────────
  private drawBars(time: number) {
    const ctx = this.ctx;
    const a = Math.min(255, time * 30);
    ctx.fillStyle = `rgba(0,71,255,${a / 255})`;
    ctx.fillRect(0, 0, W, 8);
    ctx.fillRect(0, H - 8, W, 8);
  }

  // ─── CORNERS ──────────────────────────────────────────────────
  private drawCorners(time: number) {
    const ctx = this.ctx;
    if (time > 25) return; // handled by CTA scene
    const a = Math.min(255, time * 30);
    if (a <= 0) return;
    const s = 44, p = 52;
    ctx.strokeStyle = `rgba(0,230,118,${a / 255})`;
    ctx.lineWidth = 4;
    // TL
    ctx.beginPath(); ctx.moveTo(p, p); ctx.lineTo(p + s, p); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p, p); ctx.lineTo(p, p + s); ctx.stroke();
    // TR
    ctx.beginPath(); ctx.moveTo(W - p - s, p); ctx.lineTo(W - p, p); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - p, p); ctx.lineTo(W - p, p + s); ctx.stroke();
    // BL
    ctx.beginPath(); ctx.moveTo(p, H - p); ctx.lineTo(p + s, H - p); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p, H - p - s); ctx.lineTo(p, H - p); ctx.stroke();
    // BR
    ctx.beginPath(); ctx.moveTo(W - p - s, H - p); ctx.lineTo(W - p, H - p); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - p, H - p - s); ctx.lineTo(W - p, H - p); ctx.stroke();
  }

  // ─── UTILITY ──────────────────────────────────────────────────
  private show(t: number, s: number, e: number) {
    return clamp((t - s) / (e - s));
  }
  private spring(t: number, s = 6, d = 0.65) {
    t = clamp(t); if (t <= 0) return 0; if (t >= 1) return 1;
    const w = s * (1 - d);
    return 1 - Math.exp(-d * s * t) * Math.cos(w * t);
  }
  private easeOut3(t: number) { return 1 - (1 - clamp(t)) ** 3; }
  private easeInOut(t: number) { t = clamp(t); return t * t * (3 - 2 * t); }

  private drawCentered(ctx: CanvasRenderingContext2D, text: string, y: number, size: number, weight: string, color: string, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px Poppins, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, W / 2, y);
    ctx.restore();
  }

  private drawLeft(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, weight: string, color: string, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px Poppins, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  private pill(ctx: CanvasRenderingContext2D, cx: number, y: number, text: string, size: number, bg: string, fg: string, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `600 ${size}px Poppins, sans-serif`;
    const m = ctx.measureText(text);
    const tw = m.width;
    const px = 28, py = 14, th = size * 1.2;
    const x1 = cx - tw / 2 - px;
    const x2 = cx + tw / 2 + px;
    ctx.fillStyle = bg;
    this.roundRect(ctx, x1, y, x2 - x1, th + py * 2, 16);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cx, y + (th + py * 2) / 2);
    ctx.restore();
  }

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  private opacity(time: number, start: number, end: number): number {
    return clamp(this.easeOut3((time - start) / (end - start)));
  }

  // ═══════════════════════════════════════════════════════════════
  // SCENE 1: INTRO (0–5s)
  // ═══════════════════════════════════════════════════════════════
  private sceneIntro(time: number) {
    const ctx = this.ctx;
    const t = time;

    this.drawGlow(ctx, W / 2, 600, 400, BLUE, 0.4 * this.opacity(t, 0, 2));

    // Tag
    this.drawCentered(ctx, "JANE SANTANA", 160, 26, "500", "#00E676", this.opacity(t, 0.3, 1));

    // Separator
    const sepW = 200 * this.easeOut3(this.opacity(t, 0.5, 1.5));
    ctx.fillStyle = `rgba(0,71,255,${0.7 * this.easeOut3(this.opacity(t, 0.5, 1.5))})`;
    ctx.fillRect(W / 2 - sepW / 2, 210, sepW, 2);

    // Headlines
    const lines: [string, number, string, number][] = [
      ["O fluxo que", 40, "#FFFFFF", 0.6],
      ["qualifica", 40, "#FFFFFF", 0.75],
      ["clientes no", 40, "#FFFFFF", 0.9],
      ["Direct", 52, "#2878FF", 1.05],
      ["sem você", 32, "#646464", 1.3],
      ["estar lá.", 32, "#646464", 1.45],
    ];
    let ly = 270;
    for (const [text, size, color, start] of lines) {
      const p = this.opacity(t, start, start + 0.6);
      const off = (1 - this.spring(p)) * 50;
      this.drawCentered(ctx, text, ly + off, size, "700", color, p);
      ly += size + 10;
    }

    // Subtext
    this.drawCentered(ctx, "IA aplicada a negócios", H - 400, 28, "300", "#646464", this.opacity(t, 2.5, 3.2));
    this.drawCentered(ctx, "Automação · Qualificação · Conversão", H - 340, 22, "200", "#3C3C3C", this.opacity(t, 2.5, 3.2));

    // Fade out
    if (t > 4.5) {
      ctx.fillStyle = `rgba(10,10,10,${this.easeInOut((t - 4.5) / 0.5)})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SCENE 2: PROBLEM (5–11s)
  // ═══════════════════════════════════════════════════════════════
  private sceneProblem(time: number) {
    const ctx = this.ctx;
    const t = time;

    // Eyebrow
    this.pill(ctx, W / 2, 180, "O PROBLEMA", 22, "#0028A0", "#FFFFFF", this.opacity(t, 5.2, 5.8));

    this.drawGlow(ctx, W / 2, 520, 250, WHITE, 0.3 * this.opacity(t, 5.5, 7));

    // Headlines
    this.drawCentered(ctx, "Você responde", 300, 52, "700", "#FFFFFF", this.opacity(t, 5.4, 6));
    this.drawCentered(ctx, "Direct o dia todo.", 370, 52, "700", "#FFFFFF", this.opacity(t, 5.55, 6.15));

    // Stat
    const pStat = this.opacity(t, 6, 7);
    const sOff = (1 - this.spring(pStat, 5, 0.6)) * 60;
    this.drawCentered(ctx, "73%", 500 + sOff, 160, "800", "#2878FF", pStat);
    this.drawGlow(ctx, W / 2, 580, 250, BLUE, 0.5 * pStat);

    this.drawCentered(ctx, "dos leads some antes da resposta", 720, 28, "300", "#646464", this.opacity(t, 6.8, 7.4));

    // Divider
    const divW = 260 * this.easeOut3(this.opacity(t, 7.2, 7.8));
    ctx.fillStyle = `rgba(0,230,118,${0.8 * this.easeOut3(this.opacity(t, 7.2, 7.8))})`;
    ctx.fillRect(W / 2 - divW / 2, 760, divW, 2);

    // Body
    const body: [string, string, number][] = [
      ["A cliente manda mensagem.", "#FFFFFF", 7.6],
      ["Você está em reunião.", "#646464", 7.85],
      ["Ela já comprou da concorrente.", "#00E676", 8.1],
    ];
    let by = 790;
    for (const [text, color, start] of body) {
      this.drawCentered(ctx, text, by, 28, color === "#646464" ? "300" : "500", color, this.opacity(t, start, start + 0.4));
      by += 50;
    }

    if (t > 10.5) {
      ctx.fillStyle = `rgba(10,10,10,${this.easeInOut((t - 10.5) / 0.5)})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SCENE 3: SOLUTION (11–19s) with animated chat
  // ═══════════════════════════════════════════════════════════════
  private sceneSolution(time: number) {
    const ctx = this.ctx;
    const t = time;

    this.pill(ctx, W / 2, 140, "O FLUXO", 22, "#00E676", "#0A0A0A", this.opacity(t, 11.2, 11.8));
    this.drawGlow(ctx, W / 2, 160, 200, GREEN, 0.3 * this.opacity(t, 11.2, 11.8));

    this.drawCentered(ctx, "3 etapas.", 250, 64, "700", "#FFFFFF", this.opacity(t, 11.4, 12));
    this.drawCentered(ctx, "Zero atendente humano.", 330, 30, "500", "#2878FF", this.opacity(t, 11.6, 12.2));

    // Chat box
    const boxP = this.opacity(t, 11.8, 12.4);
    const boxA = Math.min(240, 240 * boxP);
    if (boxA > 10) {
      const bx = 60, bw = W - 120, by = 400, bh = 700;
      ctx.fillStyle = `rgba(28,28,28,${boxA / 255})`;
      this.roundRect(ctx, bx, by, bw, bh, 22);
      ctx.fill();
      ctx.strokeStyle = `rgba(0,40,160,${boxA / 510})`;
      ctx.lineWidth = 2;
      this.roundRect(ctx, bx, by, bw, bh, 22);
      ctx.stroke();

      // Chat header
      const hdA = Math.min(boxA, 255 * this.opacity(t, 12, 12.4));
      this.drawLeft(ctx, "Direct  ·  fluxo ativo", bx + 24, by + 30, 22, "700", "#FFFFFF", hdA / 255);
      ctx.fillStyle = `rgba(0,230,118,${hdA / 255})`;
      ctx.beginPath();
      ctx.arc(bx + bw - 40, by + 30, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(0,40,160,${hdA / 510})`;
      ctx.fillRect(bx, by + 64, bw, 2);

      // Messages
      const msgs: [string, boolean, number][] = [
        ["Oi! Quero saber mais 👋", false, 12.3],
        ["Olá! 3 perguntas rápidas:", true, 12.9],
        ["1. Você já tem negócio?", true, 13.4],
        ["Sim, 18k/mês", false, 14.0],
        ["2. Qual sua maior dor hoje?", true, 14.5],
        ["Tempo no operacional", false, 15.1],
        ["✓ Perfil identificado", true, 15.6],
        ["🟢 Link enviado automaticamente", true, 16.2],
      ];

      let my = by + 80;
      for (const [text, isIa, showAt] of msgs) {
        if (t < showAt) break;
        const msgP = Math.min(1, (t - showAt) * 6);
        const msgA = 240 * this.easeOut3(msgP);
        const offY = (1 - (1 - msgP) ** 5) * 20;

        ctx.save();
        ctx.globalAlpha = msgA / 255;
        ctx.font = "500 24px Poppins, sans-serif";
        const tm = ctx.measureText(text);
        const tw = tm.width;
        const pad = 16;
        const bw2 = Math.min(tw + pad * 2, 500);
        const bh2 = 32 + pad * 2;

        const bx1 = isIa ? bx + 16 : bx + bw - 16 - bw2;
        const by1 = my + offY;

        ctx.fillStyle = isIa ? "rgba(0,40,160,0.9)" : "rgba(60,60,60,0.9)";
        this.roundRect(ctx, bx1, by1, bw2, bh2, 14);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = isIa ? "left" : "right";
        ctx.textBaseline = "middle";
        const tx = isIa ? bx1 + pad : bx1 + bw2 - pad;
        ctx.fillText(text, tx, by1 + bh2 / 2);
        ctx.restore();

        my += bh2 + 8;
      }
    }

    // Step labels
    const steps: [number, string][] = [
      [12.5, "① Gatilho de entrada"],
      [14.8, "② Qualificação silenciosa"],
      [16.0, "③ Rota personalizada"],
    ];
    let sy = 1140;
    for (const [showAt, text] of steps) {
      this.drawCentered(ctx, text, sy, 26, "500", "#00E676", this.opacity(t, showAt, showAt + 0.6));
      sy += 42;
    }

    if (t > 18.5) {
      ctx.fillStyle = `rgba(10,10,10,${this.easeInOut((t - 18.5) / 0.5)})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SCENE 4: PROOF (19–25s)
  // ═══════════════════════════════════════════════════════════════
  private sceneProof(time: number) {
    const ctx = this.ctx;
    const t = time;

    this.pill(ctx, W / 2, 140, "RESULTADO REAL", 22, "#0028A0", "#FFFFFF", this.opacity(t, 19.2, 19.8));

    this.drawCentered(ctx, "Ana Castro,", 260, 56, "700", "#FFFFFF", this.opacity(t, 19.4, 20));
    this.drawCentered(ctx, "mentora de finanças.", 320, 30, "300", "#646464", this.opacity(t, 19.6, 20.2));

    // Cards
    const cards: [string, string[], [number, number, number], number][] = [
      ["68%", ["clientes", "qualificadas", "autom."], BLUE, 0],
      ["-4h", ["por semana", "no atend.", "manual"], GREEN, 0.25],
      ["+31%", ["taxa de", "fechamento", "em 30 dias"], WHITE, 0.5],
    ];

    const cardW = 290, cardH = 280, gap = 24;
    const totalW = 3 * cardW + 2 * gap;
    const startX = (W - totalW) / 2;
    const cardY = 400;

    for (let i = 0; i < cards.length; i++) {
      const [val, lines, color, delay] = cards[i];
      const cp = this.opacity(t, 20 + delay, 20.6 + delay);
      const ca = 255 * cp;
      const cyOff = (1 - this.spring(cp, 5, 0.65)) * 50;
      const cx = startX + i * (cardW + gap);

      if (ca > 5) {
        ctx.fillStyle = `rgba(28,28,28,${ca / 255})`;
        this.roundRect(ctx, cx, cardY + cyOff, cardW, cardH + cyOff, 18);
        ctx.fill();

        // Accent line
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${ca / 255})`;
        ctx.fillRect(cx + 16, cardY + cyOff + 14, cardW - 32, 4);

        // Glow on card
        if (i === 0) this.drawGlow(ctx, cx + cardW / 2, cardY + cardH / 2, 150, BLUE, 0.3 * (ca / 255));
        if (i === 1) this.drawGlow(ctx, cx + cardW / 2, cardY + cardH / 2, 120, GREEN, 0.2 * (ca / 255));

        // Value
        this.drawCentered(ctx, val, cardY + 60 + cyOff, 56, "800", `rgb(${color[0]},${color[1]},${color[2]})`, ca / 255);

        // Label lines
        for (let j = 0; j < lines.length; j++) {
          this.drawCentered(ctx, lines[j], cardY + 130 + j * 30 + cyOff, 22, "200", "rgba(255,255,255,0.6)", ca / 255);
        }
      }
    }

    // Quote
    const qP = this.opacity(t, 22, 22.8);
    if (qP > 0) {
      ctx.save();
      ctx.globalAlpha = qP;
      ctx.fillStyle = "rgba(28,28,28,0.8)";
      this.roundRect(ctx, 70, 760, W - 140, 200, 16);
      ctx.fill();
      ctx.fillStyle = `rgba(0,71,255,${qP})`;
      ctx.fillRect(70, 760, 6, 200);

      ctx.fillStyle = "#646464";
      ctx.font = "500 28px Poppins, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      // Quote text with wrapping (simple)
      ctx.fillText("\"Quando eu entro na conversa,", 110, 800);
      ctx.fillText("a cliente já está pronta.", 110, 840);
      ctx.fillStyle = "#2878FF";
      ctx.font = "600 28px Poppins, sans-serif";
      ctx.fillText("Eu só apareço pra fechar.\"", 110, 880);

      ctx.fillStyle = "#3C3C3C";
      ctx.font = "200 22px Poppins, sans-serif";
      ctx.fillText("— Ana Castro, Mentora de Finanças", 110, 930);
      ctx.restore();
    }

    // Divider
    const divW = 220 * this.easeOut3(this.opacity(t, 23, 23.6));
    ctx.fillStyle = `rgba(0,230,118,${0.7 * this.easeOut3(this.opacity(t, 23, 23.6))})`;
    ctx.fillRect(W / 2 - divW / 2, 1000, divW, 2);

    // Body
    this.drawCentered(ctx, "Configura uma vez.", 1056, 30, "500", "#FFFFFF", this.opacity(t, 23.2, 23.8));
    this.drawCentered(ctx, "Funciona 24h por dia.", 1104, 30, "500", "#FFFFFF", this.opacity(t, 23.4, 24));

    if (t > 24.5) {
      ctx.fillStyle = `rgba(10,10,10,${this.easeInOut((t - 24.5) / 0.5)})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SCENE 5: CTA (25–30s)
  // ═══════════════════════════════════════════════════════════════
  private sceneCta(time: number) {
    const ctx = this.ctx;
    const t = time;

    // Flash entry
    const flash = (1 - clamp((t - 25) / 0.5)) * 0.8;
    if (flash > 0) {
      ctx.fillStyle = `rgba(0,71,255,${flash})`;
      ctx.fillRect(0, 0, W, H);
    }

    // Bold bars
    ctx.fillStyle = "#0047FF";
    ctx.fillRect(0, 0, W, 14);
    ctx.fillRect(0, H - 14, W, 14);
    // Green corners
    const ca = Math.min(255, 255 * this.easeOut3(this.opacity(t, 25.1, 25.7)));
    ctx.strokeStyle = `rgba(0,230,118,${ca / 255})`;
    ctx.lineWidth = 4;
    const s = 54, p = 52;
    ctx.beginPath(); ctx.moveTo(p, p); ctx.lineTo(p + s, p); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p, p); ctx.lineTo(p, p + s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - p - s, p); ctx.lineTo(W - p, p); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - p, p); ctx.lineTo(W - p, p + s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p, H - p); ctx.lineTo(p + s, H - p); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p, H - p - s); ctx.lineTo(p, H - p); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - p - s, H - p); ctx.lineTo(W - p, H - p); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - p, H - p - s); ctx.lineTo(W - p, H - p); ctx.stroke();

    this.drawGlow(ctx, W / 2, H / 2 - 100, 450, BLUE, 0.6 * this.opacity(t, 25, 26.5));

    // "COMENTA"
    const p1 = this.opacity(t, 25.2, 25.8);
    const off1 = (1 - this.spring(p1, 6, 0.65)) * 50;
    this.drawCentered(ctx, "COMENTA", 400 + off1, 90, "800", "#FFFFFF", p1);

    // "DIRECT" pill
    const p2 = this.opacity(t, 25.5, 26.1);
    const scale = 0.7 + 0.3 * Math.min(1, p2 * 2);
    ctx.save();
    ctx.globalAlpha = p2;
    const pillW = 340, pillH = 100;
    ctx.fillStyle = "#0047FF";
    this.roundRect(ctx, W / 2 - pillW / 2, 500, pillW, pillH, 20);
    ctx.fill();
    this.drawGlow(ctx, W / 2, 550, 200, BLUE, 0.5 * p2);
    ctx.restore();
    this.drawCentered(ctx, "DIRECT", 550, 60, "800", "#FFFFFF", p2);

    // Sub
    this.drawCentered(ctx, "que te mando o fluxo completo", 720, 32, "300", "#646464", this.opacity(t, 26.2, 26.8));

    // Divider
    const divW = 200 * this.easeOut3(this.opacity(t, 26.6, 27));
    ctx.fillStyle = `rgba(0,230,118,${0.9 * this.easeOut3(this.opacity(t, 26.6, 27))})`;
    ctx.fillRect(W / 2 - divW / 2, 770, divW, 2);

    // Handle
    this.drawCentered(ctx, "@jane.iaexpert", 820, 42, "700", "#2878FF", this.opacity(t, 26.8, 27.4));

    // Save hint
    this.drawCentered(ctx, "Salva · Compartilha · Aplica 👇", 890, 28, "200", "#646464", this.opacity(t, 27.4, 28));

    // Pulsing green dot
    const dotP = this.opacity(t, 27, 27.6);
    if (dotP > 0) {
      const dotR = 12 + 6 * Math.sin(time * 0.25 * 60);
      this.drawGlow(ctx, W / 2, 960, 80, GREEN, 0.4 * dotP);
      ctx.fillStyle = `rgba(0,230,118,${dotP})`;
      ctx.beginPath();
      ctx.arc(W / 2, 960, dotR, 0, Math.PI * 2);
      ctx.fill();
    }

    // Final fade
    if (t > 29.3) {
      ctx.fillStyle = `rgba(10,10,10,${this.easeInOut((t - 29.3) / 0.7)})`;
      ctx.fillRect(0, 0, W, H);
    }
  }
}
