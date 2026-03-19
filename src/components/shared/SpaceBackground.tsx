import { useRef, useEffect, useCallback } from "react";

// ─── SpaceBackground ──────────────────────────────────────────────────────────
//
// One fixed canvas behind the whole portfolio.
// Features:
//   • 5-layer star field with per-star color temperature + diffraction spikes
//   • Chromatic scintillation — large stars shimmer R/G/B channels independently
//   • 6 volumetric nebula clouds, each with 3 overlapping radial passes
//   • Auroral ribbons — sinusoidal curtains of colour that drift slowly
//   • Constellation overlay — random star-graph edges that fade in/out
//   • 7 comets with particle debris trails
//   • Hyperspace warp flash — triggers every ~90 seconds
//   • Gravitational lens ripple in one corner
//   • Subtle mouse parallax (3 depth layers)
//   • Faint space-chart grid
//
// Mount once in App.tsx. All sections set background: transparent.

// ─── Types ───────────────────────────────────────────────────────────────────

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  layer: 0 | 1 | 2;
  color: string;
  // Chromatic scintillation — separate phase offsets per channel
  rPhase: number;
  gPhase: number;
  bPhase: number;
  scintillate: boolean; // only large stars scintillate
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number; // trail length
  alpha: number;
  life: number;
  max: number;
  active: boolean;
  debris: Debris[];
}

interface Debris {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
  alpha: number;
}

interface Nebula {
  cx: number; // fractional 0-1
  cy: number;
  rx: number;
  ry: number;
  c: string; // rgb prefix e.g. "rgba(109,40,217,"
  a: number; // base alpha
  r: number; // drift rate
  hue: number; // hue rotation speed
}

interface AuroralRibbon {
  y: number; // base y as fraction 0-1
  color: string;
  alpha: number;
  freq: number; // sine frequency
  phase: number;
  drift: number; // drift speed
  thickness: number;
}

interface ConstellationEdge {
  i: number; // star index
  j: number;
  alpha: number;
  targetAlpha: number;
  fadeSpeed: number;
}

interface HyperspaceState {
  active: boolean;
  phase: number; // 0-1 normalised progress
  speed: number;
}

interface LensRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  active: boolean;
}

// ─── Palette constants ────────────────────────────────────────────────────────

const STAR_COLORS = [
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#e8f0ff", // blue-white
  "#fff4e0", // warm yellow
  "#cfd8ff", // blue
  "#ffd6ff", // faint rose
  "#d0fff0", // faint cyan
];

const NEBULA_DEFS: Nebula[] = [
  {
    cx: 0.72,
    cy: 0.18,
    rx: 400,
    ry: 255,
    c: "rgba(109,40,217,",
    a: 0.044,
    r: 0.00022,
    hue: 0.0005,
  },
  {
    cx: 0.18,
    cy: 0.65,
    rx: 340,
    ry: 220,
    c: "rgba(29,78,216,",
    a: 0.038,
    r: -0.00016,
    hue: 0.0003,
  },
  {
    cx: 0.5,
    cy: 0.08,
    rx: 300,
    ry: 195,
    c: "rgba(139,92,246,",
    a: 0.032,
    r: 0.00026,
    hue: 0.0007,
  },
  {
    cx: 0.88,
    cy: 0.8,
    rx: 260,
    ry: 175,
    c: "rgba(236,72,153,",
    a: 0.022,
    r: -0.00021,
    hue: 0.0004,
  },
  {
    cx: 0.1,
    cy: 0.22,
    rx: 240,
    ry: 162,
    c: "rgba(16,185,129,",
    a: 0.02,
    r: 0.00031,
    hue: 0.0002,
  },
  {
    cx: 0.6,
    cy: 0.9,
    rx: 320,
    ry: 205,
    c: "rgba(59,130,246,",
    a: 0.026,
    r: -0.00013,
    hue: 0.0006,
  },
];

const AURORA_DEFS: AuroralRibbon[] = [
  {
    y: 0.08,
    color: "rgba(109,40,217,",
    alpha: 0,
    freq: 0.003,
    phase: 0,
    drift: 0.00008,
    thickness: 18,
  },
  {
    y: 0.14,
    color: "rgba(16,185,129,",
    alpha: 0,
    freq: 0.0025,
    phase: 1.2,
    drift: 0.00006,
    thickness: 12,
  },
  {
    y: 0.06,
    color: "rgba(59,130,246,",
    alpha: 0,
    freq: 0.004,
    phase: 2.5,
    drift: 0.0001,
    thickness: 10,
  },
  {
    y: 0.92,
    color: "rgba(236,72,153,",
    alpha: 0,
    freq: 0.0028,
    phase: 0.7,
    drift: 0.00007,
    thickness: 14,
  },
];

// ─── SpaceBackground ──────────────────────────────────────────────────────────

const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX / window.innerWidth - 0.5,
      y: e.clientY / window.innerHeight - 0.5,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0,
      H = 0;

    // ── Star field ────────────────────────────────────────────────────────────
    let stars: Star[] = [];

    const buildStars = (): Star[] => {
      const list: Star[] = [];
      const cfg: [number, number, number, number, number, 0 | 1 | 2][] = [
        [320, 0.18, 0.52, 0.08, 0.4, 0],
        [150, 0.5, 1.3, 0.25, 0.55, 1],
        [55, 1.0, 2.6, 0.5, 1.0, 2],
      ];
      cfg.forEach(([n, rMin, rMax, aMin, aMax, layer]) => {
        for (let i = 0; i < n; i++) {
          const r = rMin + Math.random() * (rMax - rMin);
          list.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r,
            baseAlpha: aMin + Math.random() * (aMax - aMin),
            twinkleSpeed: 0.003 + Math.random() * 0.014,
            twinkleOffset: Math.random() * Math.PI * 2,
            layer,
            color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
            rPhase: Math.random() * Math.PI * 2,
            gPhase: Math.random() * Math.PI * 2,
            bPhase: Math.random() * Math.PI * 2,
            scintillate: r > 1.6 && Math.random() < 0.6,
          });
        }
      });
      return list;
    };

    const PARALLAX = [5, 12, 24];

    // ── Comets ────────────────────────────────────────────────────────────────
    const MAX_DEBRIS = 18;

    const makeDebris = (): Debris => ({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      life: 0,
      max: 30 + Math.random() * 50,
      r: 0.4 + Math.random() * 0.9,
      alpha: 0,
    });

    const comets: Comet[] = Array.from({ length: 7 }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      len: 0,
      alpha: 0,
      life: 0,
      max: 0,
      active: false,
      debris: Array.from({ length: MAX_DEBRIS }, makeDebris),
    }));

    const spawnComet = (c: Comet) => {
      const ang = (10 + Math.random() * 40) * (Math.PI / 180);
      const spd = 9 + Math.random() * 14;
      c.x = Math.random() * W * 0.85;
      c.y = Math.random() * H * 0.48;
      c.vx = Math.cos(ang) * spd;
      c.vy = Math.sin(ang) * spd;
      c.len = 100 + Math.random() * 140;
      c.alpha = 0;
      c.life = 0;
      c.max = 55 + Math.random() * 50;
      c.active = true;
      // Scatter debris from head
      c.debris.forEach((d) => {
        Object.assign(d, makeDebris());
        d.x = c.x;
        d.y = c.y;
        d.life = 0;
      });
    };

    comets.forEach((c, i) =>
      setTimeout(() => spawnComet(c), 1500 + i * 3200 + Math.random() * 2000),
    );

    // ── Auroral ribbons ────────────────────────────────────────────────────────
    const auroras: AuroralRibbon[] = AURORA_DEFS.map((a) => ({ ...a }));
    let auroraTime = 0;

    // Slowly fade each aurora in and out on its own cycle
    const updateAuroras = () => {
      auroraTime += 0.0004;
      auroras.forEach((a, i) => {
        const t = Math.sin(auroraTime * 0.7 + i * 1.8) * 0.5 + 0.5; // 0-1
        a.alpha = t * 0.04 * (1 + Math.sin(auroraTime * 0.3 + i));
        a.phase += a.drift;
      });
    };

    const drawAurora = (a: AuroralRibbon) => {
      if (a.alpha < 0.001) return;
      ctx.save();
      const baseY = a.y * H;
      const steps = Math.ceil(W / 4);
      const grad = ctx.createLinearGradient(
        0,
        baseY - a.thickness * 2,
        0,
        baseY + a.thickness * 2,
      );
      grad.addColorStop(0, a.color + "0)");
      grad.addColorStop(0.4, a.color + a.alpha.toFixed(3) + ")");
      grad.addColorStop(0.6, a.color + a.alpha.toFixed(3) + ")");
      grad.addColorStop(1, a.color + "0)");

      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * W;
        const y = baseY + Math.sin(x * a.freq + a.phase) * a.thickness * 3;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      // Build thick ribbon by going back the other way
      for (let i = steps; i >= 0; i--) {
        const x = (i / steps) * W;
        const y =
          baseY +
          Math.sin(x * a.freq + a.phase) * a.thickness * 3 +
          a.thickness;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    };

    // ── Constellations ────────────────────────────────────────────────────────
    let constEdges: ConstellationEdge[] = [];
    const MAX_CONST_EDGES = 18;

    const buildConstellations = () => {
      constEdges = [];
      // Pick mid/near-layer stars as vertices — a random spanning subset
      const candidates = stars
        .map((s, i) => ({ s, i }))
        .filter(({ s }) => s.layer >= 1)
        .sort(() => Math.random() - 0.5)
        .slice(0, 24);

      for (let k = 0; k < MAX_CONST_EDGES && k < candidates.length - 1; k++) {
        constEdges.push({
          i: candidates[k].i,
          j: candidates[
            (k + Math.floor(Math.random() * 4) + 1) % candidates.length
          ].i,
          alpha: 0,
          targetAlpha: 0.06 + Math.random() * 0.08,
          fadeSpeed: 0.0008 + Math.random() * 0.001,
        });
      }
    };

    let constTimer = 0;
    const updateConstellations = () => {
      constTimer++;
      // Every ~12s rebuild the constellation graph
      if (constTimer % 720 === 0) buildConstellations();

      constEdges.forEach((e) => {
        // Drift alpha toward target, flip target occasionally
        if (Math.random() < 0.002)
          e.targetAlpha = e.targetAlpha > 0 ? 0 : 0.05 + Math.random() * 0.07;
        e.alpha += (e.targetAlpha - e.alpha) * e.fadeSpeed * 60;
      });
    };

    const drawConstellations = () => {
      ctx.save();
      constEdges.forEach((e) => {
        if (e.alpha < 0.005) return;
        const sa = stars[e.i],
          sb = stars[e.j];
        if (!sa || !sb) return;
        ctx.globalAlpha = e.alpha;
        ctx.strokeStyle = "rgba(167,139,250,1)";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 8]);
        ctx.beginPath();
        ctx.moveTo(sa.x, sa.y);
        ctx.lineTo(sb.x, sb.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });
      ctx.restore();
    };

    // ── Hyperspace warp ───────────────────────────────────────────────────────
    const hyper: HyperspaceState = { active: false, phase: 0, speed: 0 };

    const triggerHyperspace = () => {
      hyper.active = true;
      hyper.phase = 0;
      hyper.speed = 0.018;
    };

    // Trigger every 85-110 seconds
    const scheduleHyper = () => {
      setTimeout(
        () => {
          triggerHyperspace();
          scheduleHyper();
        },
        85000 + Math.random() * 25000,
      );
    };
    scheduleHyper();

    const drawHyperspace = () => {
      if (!hyper.active) return;
      hyper.phase += hyper.speed;
      if (hyper.phase > 1) {
        hyper.active = false;
        return;
      }

      // Bell-shaped brightness: peaks at phase=0.5
      const intensity = Math.sin(hyper.phase * Math.PI);
      const cx = W / 2,
        cy = H / 2;

      // Radial streak lines from centre
      ctx.save();
      const streakCount = 80;
      for (let i = 0; i < streakCount; i++) {
        const ang = (i / streakCount) * Math.PI * 2;
        const len = (0.3 + Math.random() * 0.7) * Math.max(W, H) * intensity;
        const x0 = cx + Math.cos(ang) * 20;
        const y0 = cy + Math.sin(ang) * 20;
        const x1 = cx + Math.cos(ang) * len;
        const y1 = cy + Math.sin(ang) * len;
        const gr = ctx.createLinearGradient(x0, y0, x1, y1);
        gr.addColorStop(
          0,
          `rgba(200,200,255,${(intensity * 0.55).toFixed(3)})`,
        );
        gr.addColorStop(1, "rgba(200,200,255,0)");
        ctx.strokeStyle = gr;
        ctx.lineWidth = 0.6 + Math.random() * 0.8;
        ctx.globalAlpha = 0.6 + Math.random() * 0.4;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }

      // Central flash
      const flash = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        180 * intensity,
      );
      flash.addColorStop(
        0,
        `rgba(220,220,255,${(intensity * 0.35).toFixed(3)})`,
      );
      flash.addColorStop(1, "rgba(220,220,255,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = flash;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    };

    // ── Gravitational lens ────────────────────────────────────────────────────
    const lensRipples: LensRipple[] = Array.from({ length: 3 }, (_, i) => ({
      x: W * 0.85,
      y: H * 0.75,
      radius: 0,
      maxRadius: 120 + i * 60,
      alpha: 0,
      active: false,
    }));

    let lensTimer = 0;
    const updateLens = () => {
      lensTimer++;
      if (lensTimer % 180 === 0) {
        // Trigger a ripple
        const r = lensRipples.find((r) => !r.active);
        if (r) {
          r.radius = 0;
          r.alpha = 0.25;
          r.active = true;
        }
      }
      lensRipples.forEach((r) => {
        if (!r.active) return;
        r.radius += 0.9;
        r.alpha -= 0.0018;
        if (r.alpha <= 0 || r.radius > r.maxRadius) {
          r.active = false;
          r.alpha = 0;
        }
      });
    };

    const drawLens = () => {
      lensRipples.forEach((r) => {
        if (!r.active) return;
        const lx = W * 0.85,
          ly = H * 0.75;
        ctx.save();
        ctx.globalAlpha = r.alpha;
        ctx.strokeStyle = "rgba(167,139,250,0.8)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(lx, ly, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner shimmer ring
        ctx.globalAlpha = r.alpha * 0.4;
        ctx.strokeStyle = "rgba(96,165,250,0.8)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(lx, ly, r.radius * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Static gravitational core indicator
      const lx = W * 0.85,
        ly = H * 0.75;
      ctx.save();
      ctx.globalAlpha = 0.03;
      const coreGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, 80);
      coreGrad.addColorStop(0, "rgba(167,139,250,0.8)");
      coreGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(lx, ly, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // ── Nebula draw ───────────────────────────────────────────────────────────
    let na = 0;

    const drawNebula = (n: Nebula) => {
      const cx = n.cx * W + Math.sin(na * n.r * 1000 + n.cx) * 30;
      const cy = n.cy * H + Math.cos(na * n.r * 900 + n.cy) * 22;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(na * n.r * 500);
      const scl = 1 + Math.sin(na * 0.28) * 0.04;
      ctx.scale(scl, scl * 0.72);

      // Three concentric passes for volumetric effect
      const passes = [
        { rx: n.rx, ry: n.ry, a: n.a * 1.0 },
        { rx: n.rx * 0.6, ry: n.ry * 0.6, a: n.a * 1.6 },
        { rx: n.rx * 0.3, ry: n.ry * 0.3, a: n.a * 2.4 },
      ];

      passes.forEach((p) => {
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.rx);
        g.addColorStop(0, n.c + (p.a * 1.9).toFixed(3) + ")");
        g.addColorStop(0.38, n.c + (p.a * 1.1).toFixed(3) + ")");
        g.addColorStop(0.72, n.c + (p.a * 0.4).toFixed(3) + ")");
        g.addColorStop(1, n.c + "0)");
        ctx.beginPath();
        ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      ctx.restore();
    };

    // ── Star draw ─────────────────────────────────────────────────────────────
    const drawStars = (time: number, mx: number, my: number) => {
      stars.forEach((s) => {
        const px = PARALLAX[s.layer];
        const tw = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
        const baseA = Math.max(0, s.baseAlpha + tw * s.baseAlpha * 0.32);

        const sx = (((s.x + mx * px) % W) + W) % W;
        const sy = (((s.y + my * px) % H) + H) % H;

        if (s.scintillate) {
          // Draw R, G, B channels at slightly offset positions for chromatic effect
          const offset = s.r * 0.6;
          const rA = baseA * (0.75 + 0.25 * Math.sin(time * 0.03 + s.rPhase));
          const gA = baseA * (0.75 + 0.25 * Math.sin(time * 0.027 + s.gPhase));
          const bA = baseA * (0.75 + 0.25 * Math.sin(time * 0.031 + s.bPhase));

          // Red channel — offset left
          ctx.globalAlpha = rA * 0.7;
          ctx.fillStyle = "rgba(255,140,140,1)";
          ctx.beginPath();
          ctx.arc(sx - offset, sy, s.r * 0.8, 0, Math.PI * 2);
          ctx.fill();

          // Green channel — centre
          ctx.globalAlpha = gA * 0.7;
          ctx.fillStyle = "rgba(140,255,180,1)";
          ctx.beginPath();
          ctx.arc(sx, sy - offset * 0.5, s.r * 0.8, 0, Math.PI * 2);
          ctx.fill();

          // Blue channel — offset right
          ctx.globalAlpha = bA * 0.7;
          ctx.fillStyle = "rgba(140,160,255,1)";
          ctx.beginPath();
          ctx.arc(sx + offset, sy, s.r * 0.8, 0, Math.PI * 2);
          ctx.fill();

          // White core
          ctx.globalAlpha = baseA;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(sx, sy, s.r * 0.55, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = baseA;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Diffraction spikes on bright stars
        if (s.r > 1.3) {
          const spike = s.r * 4.2;
          ctx.save();
          ctx.globalAlpha = baseA * 0.2;
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(sx - spike, sy);
          ctx.lineTo(sx + spike, sy);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(sx, sy - spike);
          ctx.lineTo(sx, sy + spike);
          ctx.stroke();
          ctx.restore();
        }

        ctx.globalAlpha = 1;
      });
    };

    // ── Comet draw ─────────────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const drawComet = (c: Comet, time: number) => {
      if (!c.active) return;
      c.life++;
      c.x += c.vx;
      c.y += c.vy;

      const t = c.life / c.max;
      c.alpha = (t < 0.18 ? t / 0.18 : t > 0.72 ? (1 - t) / 0.28 : 1) * 0.9;

      const hyp = Math.hypot(c.vx, c.vy);
      const tx = c.x - (c.vx / hyp) * c.len;
      const ty = c.y - (c.vy / hyp) * c.len;

      // Main streak gradient
      const gr = ctx.createLinearGradient(tx, ty, c.x, c.y);
      gr.addColorStop(0, "rgba(255,255,255,0)");
      gr.addColorStop(0.5, `rgba(210,220,255,${(c.alpha * 0.35).toFixed(3)})`);
      gr.addColorStop(1, `rgba(255,255,255,${c.alpha.toFixed(3)})`);

      ctx.save();
      ctx.strokeStyle = gr;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(200,215,255,0.6)";
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(c.x, c.y);
      ctx.stroke();

      // Secondary cyan ghost trail
      const gr2 = ctx.createLinearGradient(tx, ty, c.x, c.y);
      gr2.addColorStop(0, "rgba(100,220,255,0)");
      gr2.addColorStop(1, `rgba(100,220,255,${(c.alpha * 0.18).toFixed(3)})`);
      ctx.strokeStyle = gr2;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(c.x, c.y);
      ctx.stroke();
      ctx.restore();

      // Bright head
      ctx.save();
      ctx.globalAlpha = c.alpha;
      const headGlow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 6);
      headGlow.addColorStop(0, "rgba(255,255,255,0.9)");
      headGlow.addColorStop(0.5, "rgba(200,220,255,0.4)");
      headGlow.addColorStop(1, "rgba(200,220,255,0)");
      ctx.fillStyle = headGlow;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Debris particles
      c.debris.forEach((d) => {
        d.life++;
        if (d.life > d.max) {
          // Respawn at head position periodically
          d.x = c.x + (Math.random() - 0.5) * 4;
          d.y = c.y + (Math.random() - 0.5) * 4;
          d.vx = (Math.random() - 0.5) * 0.9;
          d.vy = (Math.random() - 0.5) * 0.9 - 0.2;
          d.life = 0;
          d.max = 30 + Math.random() * 60;
          d.alpha = 0.6 + Math.random() * 0.4;
          return;
        }
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.98;
        d.vy *= 0.98;
        const da = (1 - d.life / d.max) * d.alpha * c.alpha * 0.5;
        ctx.save();
        ctx.globalAlpha = da;
        ctx.fillStyle = "#c8d8ff";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (c.life >= c.max) {
        c.active = false;
        setTimeout(() => spawnComet(c), 3000 + Math.random() * 10000);
      }
    };

    // ── Resize ────────────────────────────────────────────────────────────────
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      stars = buildStars();
      buildConstellations();
      // Update lens position
      lensRipples.forEach((r) => {
        r.x = W * 0.85;
        r.y = H * 0.75;
      });
    };

    // ── Draw loop ─────────────────────────────────────────────────────────────
    let time = 0;

    const draw = () => {
      time++;
      na += 0.0003;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, W, H);

      // ── Background gradient
      const bg = ctx.createRadialGradient(
        W / 2,
        H * 0.3,
        0,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.95,
      );
      bg.addColorStop(0, "rgba(10,5,28,1)");
      bg.addColorStop(0.45, "rgba(5,3,15,1)");
      bg.addColorStop(1, "rgba(2,1,8,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── Nebulae (volumetric)
      NEBULA_DEFS.forEach(drawNebula);

      // ── Auroral ribbons
      updateAuroras();
      auroras.forEach(drawAurora);

      // ── Stars (chromatic scintillation on bright ones)
      drawStars(time, mx, my);

      // ── Constellation overlay
      updateConstellations();
      drawConstellations();

      // ── Gravitational lens ripples
      updateLens();
      drawLens();

      // ── Comets with debris
      comets.forEach((c) => drawComet(c, time));

      // ── Hyperspace warp flash (rare)
      drawHyperspace();

      // ── Faint space-chart grid
      ctx.strokeStyle = "rgba(139,92,246,0.018)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 90) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 90) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    // ── Boot
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default SpaceBackground;
