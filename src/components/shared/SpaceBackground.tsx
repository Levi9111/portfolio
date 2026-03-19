/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useRef, useEffect, useCallback } from "react";

// ─── SpaceBackground ───────────────────────────────────────────────────────
//
// Ultra-modern canvas space engine. Drop-in replacement.
// Mount once in App.tsx. All page sections: background: transparent; z-index: 1+
//
// Features:
//   • 600-star field — 6 spectral types with per-star parallax (5 depth layers)
//   • Chromatic scintillation on large stars (R/G/B channel offset shimmer)
//   • 4-spike + 4-diagonal diffraction on bright stars
//   • 6 volumetric plasma nebulae — 4-pass radial, hue rotation, breathing scale
//   • 6 volumetric dust lanes — tilted elliptical, pulsing
//   • 4 auroral curtains — each with 4 harmonic sine layers + master alpha cycle
//   • 220 quantum particles with trails, turbulence, gravity-well attraction
//   • Black hole — 8-layer accretion disk, photon ring pulse, lensing rings, dark core
//   • 9 comets with particle debris
//   • Supernova: radial shock wave + 120 spikes + core burst
//   • Hyperspace warp: 180 tunnel streaks + ring shockwaves
//   • Cinematic vignette + scanline overlay + deep-space grid
//   • Mouse parallax
//
// Imperative API (window global):
//   window.spaceBackground?.triggerNova()
//   window.spaceBackground?.triggerWarp()
//   window.spaceBackground?.toggleBlackHole()

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SpaceBackgroundHandle {
  triggerNova: () => void;
  triggerWarp: () => void;
  toggleBlackHole: () => void;
}

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  layer: number;
  color: string;
  rPhase: number;
  gPhase: number;
  bPhase: number;
  scintillate: boolean;
  spike: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  r: number;
  hue: number;
  brightness: number;
  trail: { x: number; y: number }[];
  trailMax: number;
}

interface Debris {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  r: number;
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  life: number;
  maxLife: number;
  debris: Debris[];
}

interface DustLane {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  angle: number;
  color: string;
  a: number;
  pulse: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PARALLAX_OFFSETS = [18, 14, 10, 6, 2];

// [colorHex, rMin, rMax, alphaMin, alphaMax, layer]
const SPECTRAL_TYPES: [string, number, number, number, number, number][] = [
  ["#fff9f0", 0.1, 0.45, 0.25, 0.65, 0], // M warm white
  ["#ffffff", 0.1, 0.65, 0.3, 0.75, 0], // G pure white
  ["#e8f4ff", 0.1, 0.55, 0.25, 0.7, 1], // A blue-white
  ["#c8d8ff", 0.2, 1.3, 0.4, 0.9, 2], // B blue (bright)
  ["#ffeedd", 0.15, 0.85, 0.25, 0.65, 1], // K orange-white
  ["#ffccaa", 0.1, 0.45, 0.2, 0.55, 0], // Orange dwarf
];
const STAR_COUNTS: number[] = [160, 140, 110, 60, 80, 50];

const AURORA_DEFS = [
  {
    y: 0.07,
    color: "109,40,217",
    speed: 0.00012,
    freq: 0.0028,
    phase: 0.0,
    thickness: 28,
    layers: 4,
  },
  {
    y: 0.12,
    color: "16,185,129",
    speed: 0.00009,
    freq: 0.0022,
    phase: 2.1,
    thickness: 20,
    layers: 3,
  },
  {
    y: 0.92,
    color: "236,72,153",
    speed: 0.00015,
    freq: 0.0035,
    phase: 1.4,
    thickness: 22,
    layers: 3,
  },
  {
    y: 0.87,
    color: "59,130,246",
    speed: 0.0001,
    freq: 0.003,
    phase: 3.0,
    thickness: 18,
    layers: 3,
  },
];

const NEBULA_DEFS = [
  { cx: 0.72, cy: 0.22, rx: 420, ry: 270, h: 260, a: 0.05, drift: 0.00018 },
  { cx: 0.18, cy: 0.6, rx: 360, ry: 230, h: 200, a: 0.042, drift: -0.00014 },
  { cx: 0.5, cy: 0.1, rx: 320, ry: 200, h: 280, a: 0.038, drift: 0.00022 },
  { cx: 0.88, cy: 0.78, rx: 280, ry: 185, h: 320, a: 0.028, drift: -0.00019 },
  { cx: 0.08, cy: 0.25, rx: 260, ry: 175, h: 170, a: 0.025, drift: 0.00028 },
  { cx: 0.58, cy: 0.88, rx: 340, ry: 215, h: 240, a: 0.032, drift: -0.00011 },
];

// ─── Component ────────────────────────────────────────────────────────────────

const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const stateRef = useRef({
    W: 0,
    H: 0,
    time: 0,
    nebulaTime: 0,
    stars: [] as Star[],
    particles: [] as Particle[],
    dusts: [] as DustLane[],
    comets: [] as Comet[],
    timers: [] as ReturnType<typeof setTimeout>[],
    auroraPhases: AURORA_DEFS.map((a) => a.phase),
    novaActive: false,
    novaPhase: 0,
    warpActive: false,
    warpPhase: 0,
    blackHoleActive: true,
    blackHolePhase: 0,
  });

  // ── Builders ──────────────────────────────────────────────────────────────

  const buildStars = useCallback((W: number, H: number): Star[] => {
    const list: Star[] = [];
    SPECTRAL_TYPES.forEach(([color, rMin, rMax, aMin, aMax, layer], ti) => {
      for (let i = 0; i < STAR_COUNTS[ti]; i++) {
        const r = rMin + Math.random() * (rMax - rMin);
        list.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r,
          color,
          baseAlpha: aMin + Math.random() * (aMax - aMin),
          twinkleSpeed: 0.008 + Math.random() * 0.038,
          twinkleOffset: Math.random() * Math.PI * 2,
          layer,
          rPhase: Math.random() * Math.PI * 2,
          gPhase: Math.random() * Math.PI * 2,
          bPhase: Math.random() * Math.PI * 2,
          scintillate: r > 0.75 && Math.random() < 0.55,
          spike: r > 0.95,
        });
      }
    });
    return list;
  }, []);

  const buildParticle = useCallback(
    (W: number, H: number, init: boolean): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.1 + Math.random() * 0.4;
      const huePool = [240, 260, 280, 200, 320, 180];
      const hue =
        huePool[Math.floor(Math.random() * huePool.length)] +
        (Math.random() - 0.5) * 30;
      return {
        x: init ? Math.random() * W : -50,
        y: init ? Math.random() * H : Math.random() * H,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: init ? Math.random() * 100 : 0,
        maxLife: 150 + Math.random() * 200,
        r: 0.5 + Math.random() * 2,
        hue,
        brightness: 0.3 + Math.random() * 0.7,
        trail: [],
        trailMax: 8 + Math.floor(Math.random() * 12),
      };
    },
    [],
  );

  const buildDusts = useCallback(
    (W: number, H: number): DustLane[] => [
      {
        cx: 0.15,
        cy: 0.3,
        rx: W * 0.35,
        ry: H * 0.12,
        angle: -0.3,
        color: "rgba(80,20,120,",
        a: 0.022,
        pulse: 0.0,
      },
      {
        cx: 0.75,
        cy: 0.2,
        rx: W * 0.3,
        ry: H * 0.09,
        angle: 0.2,
        color: "rgba(20,60,160,",
        a: 0.018,
        pulse: 0.5,
      },
      {
        cx: 0.5,
        cy: 0.55,
        rx: W * 0.5,
        ry: H * 0.08,
        angle: 0.05,
        color: "rgba(140,30,80,",
        a: 0.015,
        pulse: 1.0,
      },
      {
        cx: 0.2,
        cy: 0.7,
        rx: W * 0.28,
        ry: H * 0.07,
        angle: -0.15,
        color: "rgba(20,120,80,",
        a: 0.014,
        pulse: 1.5,
      },
      {
        cx: 0.85,
        cy: 0.6,
        rx: W * 0.25,
        ry: H * 0.1,
        angle: 0.35,
        color: "rgba(100,60,200,",
        a: 0.019,
        pulse: 0.8,
      },
      {
        cx: 0.55,
        cy: 0.85,
        rx: W * 0.4,
        ry: H * 0.09,
        angle: -0.08,
        color: "rgba(50,100,180,",
        a: 0.016,
        pulse: 1.2,
      },
    ],
    [],
  );

  const buildComet = useCallback((W: number, H: number): Comet => {
    const angle = (8 + Math.random() * 35) * (Math.PI / 180);
    const speed = 8 + Math.random() * 16;
    return {
      x: Math.random() * W * 0.8,
      y: Math.random() * H * 0.45,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 80 + Math.random() * 160,
      life: 0,
      maxLife: 55 + Math.random() * 55,
      debris: Array.from({ length: 22 }, () => ({
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 1.3,
        vy: (Math.random() - 0.5) * 1.3 - 0.25,
        life: Math.floor(Math.random() * 40),
        maxLife: 25 + Math.random() * 55,
        r: 0.3 + Math.random() * 0.9,
      })),
    };
  }, []);

  // ── Imperative API ─────────────────────────────────────────────────────────

  const triggerNova = useCallback(() => {
    stateRef.current.novaActive = true;
    stateRef.current.novaPhase = 0;
  }, []);

  const triggerWarp = useCallback(() => {
    stateRef.current.warpActive = true;
    stateRef.current.warpPhase = 0;
  }, []);

  const toggleBlackHole = useCallback(() => {
    stateRef.current.blackHoleActive = !stateRef.current.blackHoleActive;
  }, []);

  // Expose on window for cross-component use
  useEffect(() => {
    (window as unknown as Record<string, unknown>)["spaceBackground"] = {
      triggerNova,
      triggerWarp,
      toggleBlackHole,
    };
    return () => {
      delete (window as unknown as Record<string, unknown>)["spaceBackground"];
    };
  }, [triggerNova, triggerWarp, toggleBlackHole]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    };
  }, []);

  // ── Main RAF effect ────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;

    const resize = () => {
      s.W = canvas.width = window.innerWidth;
      s.H = canvas.height = window.innerHeight;
      s.stars = buildStars(s.W, s.H);
      s.dusts = buildDusts(s.W, s.H);
      s.particles = Array.from({ length: 220 }, () =>
        buildParticle(s.W, s.H, true),
      );
    };

    // Schedule comets
    const scheduleComet = (delay: number) => {
      const t = setTimeout(() => {
        const c = buildComet(s.W, s.H);
        s.comets.push(c);
        const removeT = setTimeout(
          () => {
            const i = s.comets.indexOf(c);
            if (i > -1) s.comets.splice(i, 1);
            scheduleComet(3000 + Math.random() * 9000);
          },
          4500 + Math.random() * 9000,
        );
        s.timers.push(removeT);
      }, delay);
      s.timers.push(t);
    };
    for (let i = 0; i < 9; i++)
      scheduleComet(900 + i * 2500 + Math.random() * 2000);

    // ── Renderers ────────────────────────────────────────────────────────────

    const drawBg = () => {
      const { W, H } = s;
      const bg = ctx.createRadialGradient(
        W * 0.5,
        H * 0.35,
        0,
        W * 0.5,
        H * 0.5,
        Math.max(W, H) * 1.05,
      );
      bg.addColorStop(0, "rgba(8,4,22,1)");
      bg.addColorStop(0.35, "rgba(4,2,12,1)");
      bg.addColorStop(0.7, "rgba(2,1,8,1)");
      bg.addColorStop(1, "rgba(1,0,4,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      // Vignette
      const vg = ctx.createRadialGradient(
        W / 2,
        H / 2,
        Math.min(W, H) * 0.28,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.78,
      );
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.62)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);
    };

    const drawGrid = () => {
      const { W, H } = s;
      ctx.save();
      ctx.strokeStyle = "rgba(120,80,220,0.012)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawNebulae = () => {
      const { W, H, time } = s;
      s.nebulaTime += 0.0003;
      const nt = s.nebulaTime;
      NEBULA_DEFS.forEach((n, i) => {
        const cx = n.cx * W + Math.sin(nt * n.drift * 800 + i) * 35;
        const cy = n.cy * H + Math.cos(nt * n.drift * 700 + i) * 26;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(nt * n.drift * 500);
        const sc = 1 + Math.sin(nt * 0.25 + i) * 0.05;
        ctx.scale(sc, sc * 0.65);
        const passes: [number, number][] = [
          [1, 1],
          [0.65, 1.5],
          [0.38, 2.2],
          [0.18, 3.2],
        ];
        passes.forEach(([sf, am]) => {
          const rx = n.rx * sf;
          const baseA = n.a * am * (0.7 + 0.3 * Math.sin(time * 0.18 + i));
          const h1 = (n.h + time * 0.5) % 360;
          const h2 = (n.h + 40 + time * 0.3) % 360;
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
          g.addColorStop(0, `hsla(${h1},70%,55%,${(baseA * 2.0).toFixed(3)})`);
          g.addColorStop(
            0.3,
            `hsla(${h2},65%,45%,${(baseA * 1.2).toFixed(3)})`,
          );
          g.addColorStop(
            0.65,
            `hsla(${h1},60%,35%,${(baseA * 0.5).toFixed(3)})`,
          );
          g.addColorStop(1, `hsla(${h1},60%,35%,0)`);
          ctx.beginPath();
          ctx.ellipse(0, 0, rx, n.ry * sf, 0, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        });
        ctx.restore();
      });
    };

    const drawDusts = () => {
      const { time } = s;
      s.dusts.forEach((d, i) => {
        const cx = d.cx * s.W + Math.sin(time * 0.0002 + i) * 20;
        const cy = d.cy * s.H + Math.cos(time * 0.00015 + i) * 15;
        const pulse = 1 + 0.08 * Math.sin(time * 0.003 + d.pulse);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(d.angle + time * 0.00005);
        ctx.scale(pulse, pulse * 0.4);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, d.rx);
        const ba = d.a * (0.6 + 0.4 * Math.sin(time * 0.004 + i));
        g.addColorStop(0, d.color + (ba * 2.5).toFixed(3) + ")");
        g.addColorStop(0.4, d.color + (ba * 1.2).toFixed(3) + ")");
        g.addColorStop(0.75, d.color + (ba * 0.4).toFixed(3) + ")");
        g.addColorStop(1, d.color + "0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, 0, d.rx, d.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const drawAuroras = () => {
      const { W, H, time } = s;
      AURORA_DEFS.forEach((a, i) => {
        s.auroraPhases[i] += a.speed * 60;
        const phase = s.auroraPhases[i];
        const baseY = a.y * H;
        const masterAlpha =
          (Math.sin(time * 0.0004 + i * 2.1) * 0.5 + 0.5) * 0.07;
        if (masterAlpha < 0.002) return;
        for (let l = 0; l < a.layers; l++) {
          const lPhase = phase + l * 1.8;
          const lFreq = a.freq * (1 + l * 0.3);
          const lThick = a.thickness * (1 - l * 0.2);
          const lAlpha = masterAlpha * (1 - l * 0.28);
          const steps = Math.ceil(W / 3);
          ctx.save();
          ctx.beginPath();
          for (let k = 0; k <= steps; k++) {
            const x = (k / steps) * W;
            const y =
              baseY +
              Math.sin(x * lFreq + lPhase) * lThick * 3 +
              Math.sin(x * lFreq * 2.3 + lPhase * 1.4) * lThick;
            k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          for (let k = steps; k >= 0; k--) {
            const x = (k / steps) * W;
            const y =
              baseY +
              Math.sin(x * lFreq + lPhase) * lThick * 3 +
              Math.sin(x * lFreq * 2.3 + lPhase * 1.4) * lThick +
              lThick * 1.5;
            ctx.lineTo(x, y);
          }
          ctx.closePath();
          const grad = ctx.createLinearGradient(
            0,
            baseY - lThick * 5,
            0,
            baseY + lThick * 5,
          );
          grad.addColorStop(0, `rgba(${a.color},0)`);
          grad.addColorStop(0.35, `rgba(${a.color},${lAlpha.toFixed(3)})`);
          grad.addColorStop(0.65, `rgba(${a.color},${lAlpha.toFixed(3)})`);
          grad.addColorStop(1, `rgba(${a.color},0)`);
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.restore();
        }
      });
    };

    const drawStars = () => {
      const { W, H, time } = s;
      const mx = mouseRef.current.x - 0.5;
      const my = mouseRef.current.y - 0.5;
      s.stars.forEach((st) => {
        const px = PARALLAX_OFFSETS[st.layer] ?? 2;
        const tw = Math.sin(time * st.twinkleSpeed + st.twinkleOffset);
        const alpha = Math.max(0, st.baseAlpha + tw * st.baseAlpha * 0.35);
        const sx = (((st.x + mx * px) % W) + W) % W;
        const sy = (((st.y + my * px) % H) + H) % H;

        if (st.scintillate) {
          const off = st.r * 0.7;
          const rA = alpha * (0.7 + 0.3 * Math.sin(time * 0.025 + st.rPhase));
          const gA = alpha * (0.7 + 0.3 * Math.sin(time * 0.022 + st.gPhase));
          const bA = alpha * (0.7 + 0.3 * Math.sin(time * 0.028 + st.bPhase));
          ctx.globalAlpha = rA * 0.65;
          ctx.fillStyle = "rgba(255,120,100,1)";
          ctx.beginPath();
          ctx.arc(sx - off, sy, st.r * 0.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = gA * 0.65;
          ctx.fillStyle = "rgba(100,255,160,1)";
          ctx.beginPath();
          ctx.arc(sx, sy - off * 0.5, st.r * 0.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = bA * 0.65;
          ctx.fillStyle = "rgba(100,140,255,1)";
          ctx.beginPath();
          ctx.arc(sx + off, sy, st.r * 0.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(sx, sy, st.r * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = st.color;
          ctx.beginPath();
          ctx.arc(sx, sy, st.r, 0, Math.PI * 2);
          ctx.fill();
        }

        if (st.spike) {
          const sp = st.r * 5.5;
          ctx.save();
          ctx.strokeStyle = st.color;
          ctx.lineWidth = 0.4;
          ctx.globalAlpha = alpha * 0.22;
          ctx.beginPath();
          ctx.moveTo(sx - sp, sy);
          ctx.lineTo(sx + sp, sy);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(sx, sy - sp);
          ctx.lineTo(sx, sy + sp);
          ctx.stroke();
          ctx.globalAlpha = alpha * 0.1;
          ctx.beginPath();
          ctx.moveTo(sx - sp * 0.6, sy - sp * 0.6);
          ctx.lineTo(sx + sp * 0.6, sy + sp * 0.6);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(sx + sp * 0.6, sy - sp * 0.6);
          ctx.lineTo(sx - sp * 0.6, sy + sp * 0.6);
          ctx.stroke();
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      });
    };

    const updateAndDrawParticles = () => {
      const { W, H } = s;
      const bhx = W * 0.72,
        bhy = H * 0.35;

      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.life++;
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > p.trailMax) p.trail.shift();

        p.vx += (Math.random() - 0.5) * 0.022;
        p.vy += (Math.random() - 0.5) * 0.022;

        if (s.blackHoleActive) {
          const dx = bhx - p.x,
            dy = bhy - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 320 && dist > 5) {
            const force = 13000 / (dist * dist + 900);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
            if (dist < 62) p.life = p.maxLife;
          }
        }

        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 1.6) {
          p.vx *= 1.6 / spd;
          p.vy *= 1.6 / spd;
        }
        p.x += p.vx;
        p.y += p.vy;

        const dead =
          p.life >= p.maxLife ||
          p.x < -120 ||
          p.x > W + 120 ||
          p.y < -120 ||
          p.y > H + 120;
        if (dead) {
          s.particles[i] = buildParticle(W, H, false);
          continue;
        }

        const t = p.life / p.maxLife;
        const alpha = Math.min(t * 3, (1 - t) * 2, 1) * 0.7 * p.brightness;
        if (alpha < 0.01) continue;

        if (p.trail.length > 1) {
          for (let j = 1; j < p.trail.length; j++) {
            ctx.globalAlpha = (j / p.trail.length) * alpha * 0.35;
            ctx.strokeStyle = `hsla(${p.hue},80%,75%,1)`;
            ctx.lineWidth = p.r * 0.5;
            ctx.beginPath();
            ctx.moveTo(p.trail[j - 1].x, p.trail[j - 1].y);
            ctx.lineTo(p.trail[j].x, p.trail[j].y);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = alpha;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        g.addColorStop(0, `hsla(${p.hue},90%,85%,1)`);
        g.addColorStop(0.5, `hsla(${p.hue},80%,65%,0.5)`);
        g.addColorStop(1, `hsla(${p.hue},70%,50%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const drawBlackHole = () => {
      if (!s.blackHoleActive) return;
      const { W, H } = s;
      s.blackHolePhase += 0.003;
      const bh = s.blackHolePhase;
      const x = W * 0.72,
        y = H * 0.35,
        r = 62;

      ctx.save();
      for (let i = 0; i < 8; i++) {
        const sr = r + 28 + i * 19;
        const alpha =
          (0.16 - i * 0.016) * (0.55 + 0.45 * Math.sin(bh + i * 0.55));
        const hue = 18 + i * 16;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(bh * 0.45 + i * 0.2);
        ctx.scale(1, 0.22 + i * 0.032);
        ctx.beginPath();
        ctx.arc(0, 0, sr, 0, Math.PI * 2);
        const g = ctx.createLinearGradient(-sr, 0, sr, 0);
        g.addColorStop(0, `hsla(${hue},90%,65%,0)`);
        g.addColorStop(0.28, `hsla(${hue},90%,65%,${alpha.toFixed(3)})`);
        g.addColorStop(
          0.5,
          `hsla(${hue + 30},96%,82%,${(alpha * 1.9).toFixed(3)})`,
        );
        g.addColorStop(0.72, `hsla(${hue},90%,65%,${alpha.toFixed(3)})`);
        g.addColorStop(1, `hsla(${hue},90%,65%,0)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 3 + i * 0.6;
        ctx.stroke();
        ctx.restore();
      }
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = 0.07 - i * 0.018;
        ctx.strokeStyle = "rgba(180,150,255,1)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, r + 18 + i * 8, 0, Math.PI * 2);
        ctx.stroke();
      }
      const cg = ctx.createRadialGradient(x, y, 0, x, y, r);
      cg.addColorStop(0, "rgba(0,0,0,1)");
      cg.addColorStop(0.72, "rgba(0,0,0,1)");
      cg.addColorStop(0.9, "rgba(5,0,15,0.95)");
      cg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.45 + 0.45 * Math.sin(bh * 2);
      ctx.strokeStyle = "rgba(255,220,120,0.65)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x, y, r + 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const drawComets = () => {
      s.comets.forEach((c) => {
        c.life++;
        c.x += c.vx;
        c.y += c.vy;
        const t = c.life / c.maxLife;
        const alpha = (t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1) * 0.95;
        const hyp = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
        const tx = c.x - (c.vx / hyp) * c.len;
        const ty = c.y - (c.vy / hyp) * c.len;

        const gr = ctx.createLinearGradient(tx, ty, c.x, c.y);
        gr.addColorStop(0, "rgba(255,255,255,0)");
        gr.addColorStop(0.55, `rgba(180,200,255,${(alpha * 0.3).toFixed(3)})`);
        gr.addColorStop(1, `rgba(255,255,255,${alpha.toFixed(3)})`);
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(160,190,255,0.9)";
        ctx.strokeStyle = gr;
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();
        const gr2 = ctx.createLinearGradient(tx, ty, c.x, c.y);
        gr2.addColorStop(0, "rgba(100,180,255,0)");
        gr2.addColorStop(1, `rgba(100,180,255,${(alpha * 0.12).toFixed(3)})`);
        ctx.strokeStyle = gr2;
        ctx.lineWidth = 5;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = alpha;
        const hg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 9);
        hg.addColorStop(0, "rgba(255,255,255,1)");
        hg.addColorStop(0.4, "rgba(180,200,255,0.5)");
        hg.addColorStop(1, "rgba(100,140,255,0)");
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        c.debris.forEach((d) => {
          d.life++;
          if (d.life > d.maxLife) {
            d.x = c.x + (Math.random() - 0.5) * 6;
            d.y = c.y + (Math.random() - 0.5) * 6;
            d.vx = (Math.random() - 0.5) * 1.3;
            d.vy = (Math.random() - 0.5) * 1.3 - 0.25;
            d.life = 0;
            d.maxLife = 22 + Math.random() * 55;
            return;
          }
          d.x += d.vx;
          d.y += d.vy;
          d.vx *= 0.975;
          d.vy *= 0.975;
          ctx.globalAlpha = (1 - d.life / d.maxLife) * alpha * 0.45;
          ctx.fillStyle = "#b8d0ff";
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      });
    };

    const drawNova = () => {
      if (!s.novaActive) return;
      s.novaPhase += 0.011;
      if (s.novaPhase > 1) {
        s.novaActive = false;
        return;
      }
      const intensity = Math.sin(s.novaPhase * Math.PI);
      const { W, H } = s;
      const cx = W / 2,
        cy = H / 2;
      const diam = Math.max(W, H);
      ctx.save();
      const shockR = s.novaPhase * diam * 1.45;
      const shockW = diam * 0.09 * intensity;
      const sg = ctx.createRadialGradient(
        cx,
        cy,
        shockR - shockW,
        cx,
        cy,
        shockR + shockW,
      );
      sg.addColorStop(0, "rgba(255,200,50,0)");
      sg.addColorStop(
        0.35,
        `rgba(255,180,30,${(intensity * 0.42).toFixed(3)})`,
      );
      sg.addColorStop(
        0.5,
        `rgba(255,255,200,${(intensity * 0.65).toFixed(3)})`,
      );
      sg.addColorStop(0.65, `rgba(255,100,0,${(intensity * 0.42).toFixed(3)})`);
      sg.addColorStop(1, "rgba(255,50,0,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 120; i++) {
        const ang = (i / 120) * Math.PI * 2;
        const len = (0.18 + Math.random() * 0.82) * diam * 0.62 * intensity;
        const x0 = cx + Math.cos(ang) * 12,
          y0 = cy + Math.sin(ang) * 12;
        const x1 = cx + Math.cos(ang) * len,
          y1 = cy + Math.sin(ang) * len;
        const lg = ctx.createLinearGradient(x0, y0, x1, y1);
        lg.addColorStop(
          0,
          `rgba(255,220,100,${(intensity * 0.55).toFixed(3)})`,
        );
        lg.addColorStop(
          0.4,
          `rgba(255,120,20,${(intensity * 0.22).toFixed(3)})`,
        );
        lg.addColorStop(1, "rgba(255,50,0,0)");
        ctx.strokeStyle = lg;
        ctx.lineWidth = 0.8 + Math.random() * 1.5;
        ctx.globalAlpha = 0.45 + Math.random() * 0.55;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 270 * intensity);
      cg.addColorStop(0, `rgba(255,255,255,${(intensity * 0.92).toFixed(3)})`);
      cg.addColorStop(
        0.2,
        `rgba(255,240,100,${(intensity * 0.62).toFixed(3)})`,
      );
      cg.addColorStop(0.5, `rgba(255,120,20,${(intensity * 0.32).toFixed(3)})`);
      cg.addColorStop(1, "rgba(255,0,0,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    };

    const drawWarp = () => {
      if (!s.warpActive) return;
      s.warpPhase += 0.022;
      if (s.warpPhase > 1) {
        s.warpActive = false;
        return;
      }
      const intensity = Math.sin(s.warpPhase * Math.PI);
      const { W, H } = s;
      const cx = W / 2,
        cy = H / 2;
      const diam = Math.max(W, H);
      ctx.save();
      for (let i = 0; i < 180; i++) {
        const ang = (i / 180) * Math.PI * 2 + s.warpPhase * 0.5;
        const len = (0.22 + Math.random() * 0.78) * diam * 1.12 * intensity;
        const near = 22 + len * 0.05;
        const x0 = cx + Math.cos(ang) * near,
          y0 = cy + Math.sin(ang) * near;
        const x1 = cx + Math.cos(ang) * len,
          y1 = cy + Math.sin(ang) * len;
        const hue = 200 + Math.sin(ang * 3) * 40;
        const lg = ctx.createLinearGradient(x0, y0, x1, y1);
        lg.addColorStop(
          0,
          `hsla(${hue},90%,85%,${(intensity * 0.82).toFixed(3)})`,
        );
        lg.addColorStop(
          0.5,
          `hsla(${hue + 20},80%,70%,${(intensity * 0.3).toFixed(3)})`,
        );
        lg.addColorStop(1, `hsla(${hue},70%,50%,0)`);
        ctx.strokeStyle = lg;
        ctx.lineWidth = 0.5 + Math.random() * 1.3;
        ctx.globalAlpha = 0.38 + Math.random() * 0.62;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      for (let r = 0; r < 4; r++) {
        const ringR = 55 + r * 52 + s.warpPhase * diam * 0.52;
        ctx.globalAlpha = Math.max(
          0,
          (1 - s.warpPhase) * 0.32 * (1 - r * 0.22),
        );
        ctx.strokeStyle = "rgba(150,200,255,1)";
        ctx.lineWidth = 1.5 - r * 0.3;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.stroke();
      }
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 210 * intensity);
      bg.addColorStop(0, `rgba(200,220,255,${(intensity * 0.52).toFixed(3)})`);
      bg.addColorStop(1, "rgba(100,150,255,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    };

    const drawScanlines = () => {
      ctx.save();
      ctx.globalAlpha = 0.016;
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = 1;
      for (let y = 0; y < s.H; y += 3) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(s.W, y);
        ctx.stroke();
      }
      ctx.restore();
    };

    // ── RAF loop ──────────────────────────────────────────────────────────────

    const frame = () => {
      s.time++;
      ctx.clearRect(0, 0, s.W, s.H);
      drawBg();
      drawGrid();
      drawNebulae();
      drawDusts();
      drawAuroras();
      drawStars();
      updateAndDrawParticles();
      drawBlackHole();
      drawComets();
      drawNova();
      drawWarp();
      drawScanlines();
      animRef.current = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    animRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animRef.current);
      s.timers.forEach(clearTimeout);
      s.timers = [];
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [buildStars, buildParticle, buildDusts, buildComet, handleMouseMove]);

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

// ─── Usage ────────────────────────────────────────────────────────────────────
//
// App.tsx:
//   <SpaceBackground />
//   <YourSection style={{ position: "relative", zIndex: 1, background: "transparent" }} />
//
// Trigger effects from any component:
//   window.spaceBackground?.triggerNova()
//   window.spaceBackground?.triggerWarp()
//   window.spaceBackground?.toggleBlackHole()
//
// TypeScript: cast window as needed:
//   (window as unknown as { spaceBackground: SpaceBackgroundHandle }).spaceBackground.triggerNova()
