import { useRef, useEffect, useCallback } from "react";

// ─── SpaceBackground ───────────────────────────────────────────────────────────
// Renders ONE full-page canvas fixed behind all sections.
// Mount this once in App — every section sits transparently on top.
// No cursor glow effect. Pure deep-space: layered stars, nebulae, shooting stars,
// subtle mouse parallax per star depth layer.

const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 }); // normalized -0.5 → 0.5

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

    // ── Resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      stars = buildStars();
    };

    // ── Star types ───────────────────────────────────────────────────────────
    interface Star {
      x: number;
      y: number;
      r: number;
      baseAlpha: number;
      twinkleSpeed: number;
      twinkleOffset: number;
      layer: 0 | 1 | 2;
      color: string;
    }

    const STAR_COLORS = [
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#e8eeff",
      "#fff4e0",
      "#cfd8ff",
      "#ffd6ff",
    ];

    const buildStars = (): Star[] => {
      const list: Star[] = [];
      const cfg: [number, number, number, number, number, 0 | 1 | 2][] = [
        // count  rMin  rMax  aMin  aMax  layer
        [300, 0.22, 0.55, 0.1, 0.42, 0], // far — many, tiny, dim
        [140, 0.5, 1.3, 0.25, 0.55, 1], // mid
        [45, 1.0, 2.4, 0.5, 1.0, 2], // near — few, bright, large
      ];
      cfg.forEach(([n, rMin, rMax, aMin, aMax, layer]) => {
        for (let i = 0; i < n; i++) {
          list.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: rMin + Math.random() * (rMax - rMin),
            baseAlpha: aMin + Math.random() * (aMax - aMin),
            twinkleSpeed: 0.003 + Math.random() * 0.014,
            twinkleOffset: Math.random() * Math.PI * 2,
            layer,
            color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          });
        }
      });
      return list;
    };

    let stars: Star[] = [];

    // ── Parallax per layer ───────────────────────────────────────────────────
    const PARALLAX = [5, 11, 22]; // px shift at full mouse deflection

    // ── Shooting stars ───────────────────────────────────────────────────────
    interface Shoot {
      x: number;
      y: number;
      vx: number;
      vy: number;
      len: number;
      alpha: number;
      life: number;
      max: number;
      active: boolean;
    }

    const shoots: Shoot[] = Array.from({ length: 7 }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      len: 0,
      alpha: 0,
      life: 0,
      max: 0,
      active: false,
    }));

    const spawnShoot = (s: Shoot) => {
      const ang = (15 + Math.random() * 35) * (Math.PI / 180);
      const spd = 9 + Math.random() * 13;
      s.x = Math.random() * W * 0.82;
      s.y = Math.random() * H * 0.45;
      s.vx = Math.cos(ang) * spd;
      s.vy = Math.sin(ang) * spd;
      s.len = 90 + Math.random() * 130;
      s.alpha = 0;
      s.life = 0;
      s.max = 55 + Math.random() * 45;
      s.active = true;
    };

    // Stagger initial spawns so they don't all fire at once
    shoots.forEach((s, i) =>
      setTimeout(() => spawnShoot(s), 1500 + i * 3000 + Math.random() * 2000),
    );

    // ── Nebula gas clouds ────────────────────────────────────────────────────
    const NEBULAS = [
      {
        cx: 0.72,
        cy: 0.18,
        rx: 380,
        ry: 240,
        c: "rgba(109,40,217,",
        a: 0.042,
        r: 0.0002,
      },
      {
        cx: 0.18,
        cy: 0.65,
        rx: 320,
        ry: 210,
        c: "rgba(29,78,216,",
        a: 0.036,
        r: -0.00015,
      },
      {
        cx: 0.5,
        cy: 0.08,
        rx: 280,
        ry: 180,
        c: "rgba(139,92,246,",
        a: 0.03,
        r: 0.00025,
      },
      {
        cx: 0.88,
        cy: 0.8,
        rx: 240,
        ry: 160,
        c: "rgba(236,72,153,",
        a: 0.02,
        r: -0.0002,
      },
      {
        cx: 0.1,
        cy: 0.22,
        rx: 220,
        ry: 150,
        c: "rgba(16,185,129,",
        a: 0.018,
        r: 0.0003,
      },
      {
        cx: 0.6,
        cy: 0.9,
        rx: 300,
        ry: 190,
        c: "rgba(59,130,246,",
        a: 0.024,
        r: -0.00012,
      },
    ];
    let na = 0; // nebula angle accumulator

    // ── Draw loop ────────────────────────────────────────────────────────────
    let time = 0;
    const draw = () => {
      time++;
      na += 0.0003;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, W, H);

      // Deep-space radial gradient base
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

      // ── Nebulae ────────────────────────────────────────────────────────────
      NEBULAS.forEach((n) => {
        const cx = n.cx * W + Math.sin(na * n.r * 1000 + n.cx) * 28;
        const cy = n.cy * H + Math.cos(na * n.r * 900 + n.cy) * 20;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(na * n.r * 500);
        const scl = 1 + Math.sin(na * 0.28) * 0.04;
        ctx.scale(scl, scl * 0.72);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, n.rx);
        g.addColorStop(0, n.c + n.a * 1.9 + ")");
        g.addColorStop(0.38, n.c + n.a * 1.15 + ")");
        g.addColorStop(0.72, n.c + n.a * 0.42 + ")");
        g.addColorStop(1, n.c + "0)");
        ctx.beginPath();
        ctx.ellipse(0, 0, n.rx, n.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.restore();
      });

      // ── Stars ──────────────────────────────────────────────────────────────
      stars.forEach((s) => {
        const px = PARALLAX[s.layer];
        const tw = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
        const a = Math.max(0, s.baseAlpha + tw * s.baseAlpha * 0.32);

        // Wrap coords for seamless parallax scrolling
        const sx = (((s.x + mx * px) % W) + W) % W;
        const sy = (((s.y + my * px) % H) + H) % H;

        // Diffraction spikes on large near stars
        if (s.r > 1.3) {
          const spike = s.r * 3.8;
          ctx.save();
          ctx.globalAlpha = a * 0.18;
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

        ctx.globalAlpha = a;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // ── Shooting stars ─────────────────────────────────────────────────────
      shoots.forEach((s) => {
        if (!s.active) return;
        s.life++;
        s.x += s.vx;
        s.y += s.vy;

        const t = s.life / s.max;
        s.alpha = (t < 0.18 ? t / 0.18 : t > 0.72 ? (1 - t) / 0.28 : 1) * 0.88;

        const hyp = Math.hypot(s.vx, s.vy);
        const tx = s.x - (s.vx / hyp) * s.len;
        const ty = s.y - (s.vy / hyp) * s.len;

        const gr = ctx.createLinearGradient(tx, ty, s.x, s.y);
        gr.addColorStop(0, "rgba(255,255,255,0)");
        gr.addColorStop(
          0.55,
          `rgba(210,220,255,${(s.alpha * 0.35).toFixed(3)})`,
        );
        gr.addColorStop(1, `rgba(255,255,255,${s.alpha.toFixed(3)})`);

        ctx.save();
        ctx.strokeStyle = gr;
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        ctx.shadowBlur = 5;
        ctx.shadowColor = "rgba(200,215,255,0.55)";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.restore();

        // Bright head dot
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (s.life >= s.max) {
          s.active = false;
          setTimeout(() => spawnShoot(s), 3500 + Math.random() * 9000);
        }
      });

      // ── Faint space-chart grid ─────────────────────────────────────────────
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

    // ── Boot ──────────────────────────────────────────────────────────────────
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
