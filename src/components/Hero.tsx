import React, { useState, useEffect, useRef, useCallback } from "react";
import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import { motion, Variants } from "framer-motion";
import VSCodeWidget from "./shared/VScodeWidget";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SocialLink {
  readonly href: string;
  readonly icon: React.ElementType;
  readonly label: string;
  readonly accent: string;
}

interface StatItem {
  readonly value: string;
  readonly label: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    href: "https://github.com/levi9111",
    icon: Github,
    label: "GitHub",
    accent: "#e2e8f0",
  },
  {
    href: "https://www.linkedin.com/in/shanjid-ahmad-b77b5427b",
    icon: Linkedin,
    label: "LinkedIn",
    accent: "#60a5fa",
  },
  {
    href: "mailto:shanjidahmad502@gmail.com",
    icon: Mail,
    label: "Email",
    accent: "#a78bfa",
  },
] as const;

const TITLES: readonly string[] = [
  "Full-Stack Developer",
  "MERN Stack Engineer",
  "Next.js Specialist",
  "UI/UX Craftsman",
] as const;

const STATS: readonly StatItem[] = [
  { value: "5+", label: "Years" },
  { value: "60+", label: "Projects" },
  { value: "MERN", label: "Stack" },
  { value: "∞", label: "Curiosity" },
] as const;

// ─── Variants ─────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Particle Constellation ───────────────────────────────────────────────────
//
//  Canvas sits at z-index 3 — above scanlines (z:2), below content (z:10).
//  Particles drift upward slowly; nearby ones get connected by fading edges.
//  Mouse creates a local attractor: particles within 140px are gently pulled
//  toward the cursor, tightening the constellation in that region.
//  Accent colours match the hero's purple/violet/blue palette.
//
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseAlpha: number;
  life: number;
  maxLife: number;
  color: string;
  isGlow: boolean; // extra bloom on ~8% of particles
}

const PARTICLE_COLORS = [
  "139,92,246", // violet  (primary)
  "129,140,248", // indigo
  "96,165,250", // blue
  "167,139,250", // lavender
  "216,180,254", // soft purple
];

const ParticleConstellation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particles = useRef<Particle[]>([]);

  // ── helpers ──────────────────────────────────────────────────────────────
  const spawnParticle = useCallback(
    (W: number, H: number, init = false): Particle => {
      const colorRgb =
        PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      return {
        x: Math.random() * W,
        y: init ? Math.random() * H : H + 8,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.45 + 0.12), // always drift upward
        r: Math.random() * 1.8 + 0.4,
        baseAlpha: Math.random() * 0.55 + 0.2,
        life: 0,
        maxLife: Math.random() * 280 + 140,
        color: colorRgb,
        isGlow: Math.random() < 0.08,
      };
    },
    [],
  );

  // ── mouse ─────────────────────────────────────────────────────────────────
  const onMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  // ── main effect ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = 0,
      H = 0;
    const PARTICLE_COUNT = 110;
    const CONNECT_DIST = 90; // px — max edge length
    const ATTRACT_RADIUS = 140; // px — mouse pull zone
    const ATTRACT_FORCE = 0.018;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      // Re-seed on resize
      particles.current = Array.from({ length: PARTICLE_COUNT }, () =>
        spawnParticle(W, H, true),
      );
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const section = canvas.closest("#hero-section") as HTMLElement | null;
    section?.addEventListener("mousemove", onMouseMove);
    section?.addEventListener("mouseleave", onMouseLeave);

    // ── draw loop ─────────────────────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const ps = particles.current;

      // 1. update positions
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];

        // Mouse attraction
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < ATTRACT_RADIUS && dist > 1) {
          const force =
            ((ATTRACT_RADIUS - dist) / ATTRACT_RADIUS) * ATTRACT_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Damping so velocity doesn't explode
        p.vx *= 0.97;
        p.vy *= 0.97;

        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Respawn when life ends or particle escapes top
        if (p.life > p.maxLife || p.y < -12) {
          ps[i] = spawnParticle(W, H, false);
        }
      }

      // 2. draw edges between close particles
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            // Fade edge as distance grows; also fade by both particles' life
            const lifeAlpha = Math.min(
              Math.min(ps[i].life / 40, 1) *
                Math.min(
                  1 - Math.max(0, (ps[i].life - ps[i].maxLife + 40) / 40),
                  1,
                ),
              Math.min(ps[j].life / 40, 1) *
                Math.min(
                  1 - Math.max(0, (ps[j].life - ps[j].maxLife + 40) / 40),
                  1,
                ),
            );
            const alpha = (1 - d / CONNECT_DIST) * 0.18 * lifeAlpha;

            // Edge colour: blend between the two particle colours
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = `rgba(167,139,250,1)`; // lavender mid-tone
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. draw particles
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        const fadeIn = Math.min(p.life / 40, 1);
        const fadeOut = Math.min(
          1 - Math.max(0, (p.life - p.maxLife + 40) / 40),
          1,
        );
        const alpha = fadeIn * fadeOut * p.baseAlpha;

        if (p.isGlow) {
          // Bloom ring
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          grd.addColorStop(0, `rgba(${p.color},${(alpha * 0.9).toFixed(3)})`);
          grd.addColorStop(0.4, `rgba(${p.color},${(alpha * 0.3).toFixed(3)})`);
          grd.addColorStop(1, `rgba(${p.color},0)`);
          ctx.fillStyle = grd;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Solid core dot
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgba(${p.color},1)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      section?.removeEventListener("mousemove", onMouseMove);
      section?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [spawnParticle, onMouseMove, onMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 3, // above scanlines (z:2), below content (z:10)
        pointerEvents: "none",
      }}
    />
  );
};

// ─── Typewriter ───────────────────────────────────────────────────────────────

const Typewriter: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "erasing">("typing");

  useEffect(() => {
    const current = TITLES[index];
    let t: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayed.length < current.length) {
        t = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          52,
        );
      } else {
        t = setTimeout(() => setPhase("pause"), 1900);
      }
    } else if (phase === "pause") {
      t = setTimeout(() => setPhase("erasing"), 380);
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed((d) => d.slice(0, -1)), 28);
      } else {
        setIndex((i) => (i + 1) % TITLES.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(t);
  }, [displayed, phase, index]);

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {displayed}
      <span
        style={{
          display: "inline-block",
          color: "#a78bfa",
          animation: "heroCursorBlink 1s step-end infinite",
          fontWeight: 300,
          marginLeft: 1,
        }}
      >
        |
      </span>
    </span>
  );
};

// ─── Social Icon ──────────────────────────────────────────────────────────────

interface SocialIconProps {
  href: string;
  icon: React.ElementType;
  label: string;
  accent: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({
  href,
  icon: Icon,
  label,
  accent,
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    variants={fadeUp}
    whileHover={{ scale: 1.12, y: -3 }}
    whileTap={{ scale: 0.92 }}
    style={{
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 46,
      height: 46,
      borderRadius: 14,
      border: "1px solid rgba(139,92,246,0.2)",
      background: "rgba(10,5,28,0.4)",
      backdropFilter: "blur(12px)",
      color: "rgba(200,200,240,0.7)",
      textDecoration: "none",
      overflow: "hidden",
      transition: "border-color 0.25s, color 0.25s, background 0.25s",
    }}
    onMouseEnter={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.borderColor = `${accent}55`;
      el.style.color = accent;
      el.style.background = `${accent}14`;
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.borderColor = "rgba(139,92,246,0.2)";
      el.style.color = "rgba(200,200,240,0.7)";
      el.style.background = "rgba(10,5,28,0.4)";
    }}
  >
    <Icon size={18} />
    <span
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg,rgba(255,255,255,0.1),transparent)",
        transform: "translateX(-100%)",
        transition: "transform 0.5s ease",
        pointerEvents: "none",
      }}
      className="hero-social-sheen"
    />
    <span
      style={{
        position: "absolute",
        bottom: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(10,5,28,0.95)",
        color: "rgba(200,200,240,0.9)",
        fontSize: 10,
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        padding: "5px 10px",
        borderRadius: 6,
        border: "0.5px solid rgba(139,92,246,0.2)",
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.2s",
        whiteSpace: "nowrap",
        fontFamily: "'DM Sans', sans-serif",
      }}
      className="hero-social-tip"
    >
      {label}
    </span>
  </motion.a>
);

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero: React.FC = () => {
  const scrollToAbout = () => {
    document
      .getElementById("about-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        #hero-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          background: transparent;
          overflow: hidden;
          padding: 100px 0 80px;
        }

        #hero-section::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(2,1,10,0.45) 75%, rgba(2,1,10,0.82) 100%);
          pointer-events: none; z-index: 1;
        }

        .hero-scanlines {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.016) 3px, rgba(0,0,0,0.016) 4px);
          pointer-events: none; z-index: 2;
        }

        /* z-index ladder:
           0  SpaceBackground (fixed canvas, App-level)
           1  #hero-section::after vignette
           2  .hero-scanlines
           3  ParticleConstellation canvas       ← NEW
           10 .hero-inner (all content)
        */

        .hero-inner {
          position: relative; z-index: 10;
          width: 100%; max-width: 1200px;
          margin: 0 auto; padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
        }

        .hero-left { display: flex; flex-direction: column; align-items: flex-start; }

        .hero-eyebrow {
          font-size: 10px; font-weight: 500;
          letter-spacing: 5px; text-transform: uppercase;
          color: rgba(139,92,246,0.85);
          margin-bottom: 22px;
          display: flex; align-items: center; gap: 10px;
          font-family: 'DM Sans', sans-serif;
        }
        .hero-eyebrow::before {
          content: ''; display: block;
          width: 24px; height: 1px;
          background: rgba(139,92,246,0.45);
        }

        .hero-name {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(52px, 8vw, 96px);
          line-height: 1.0; color: #fff;
          letter-spacing: -2px;
          margin-bottom: 18px;
        }
        .hero-name-first { display: block; color: rgba(255,255,255,0.92); }
        .hero-name-last {
          display: block; font-style: italic;
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: heroHue 8s ease-in-out infinite;
        }
        @keyframes heroHue { 0%,100%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(25deg)} }

        .hero-subtitle {
          font-size: clamp(15px, 2.2vw, 19px); font-weight: 300;
          color: rgba(200,200,230,0.6); margin-bottom: 20px;
          height: 30px; display: flex; align-items: center; letter-spacing: 0.2px;
        }
        @keyframes heroCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

        .hero-sep {
          width: 48px; height: 1px;
          background: linear-gradient(90deg, rgba(139,92,246,0.6), transparent);
          margin-bottom: 20px; position: relative;
        }
        .hero-sep::before {
          content: ''; position: absolute; left: 0; top: -2px;
          width: 4px; height: 4px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 6px #a78bfa;
        }

        .hero-desc {
          font-size: clamp(13px, 1.6vw, 15px); font-weight: 300;
          color: rgba(180,180,215,0.48); max-width: 420px;
          line-height: 1.85; margin-bottom: 36px; letter-spacing: 0.1px;
        }

        .hero-actions { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
        .social-row { display: flex; gap: 10px; }

        .hero-social-sheen { pointer-events: none; }
        a:hover .hero-social-sheen { transform: translateX(100%) !important; }
        a:hover .hero-social-tip   { opacity: 1 !important; }

        .scroll-btn {
          position: relative; width: 46px; height: 46px; border-radius: 50%;
          border: 1px solid rgba(139,92,246,0.25); background: rgba(10,5,28,0.35);
          backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(200,200,240,0.5);
          transition: border-color 0.25s, color 0.25s, background 0.25s;
          overflow: visible; flex-shrink: 0;
        }
        .scroll-btn:hover { border-color: rgba(139,92,246,0.55); color: #a78bfa; background: rgba(139,92,246,0.1); }
        .scroll-btn::before {
          content: ''; position: absolute; inset: -3px; border-radius: 50%;
          border: 1px solid rgba(139,92,246,0.15);
          animation: heroRingPulse 2.5s ease-in-out infinite;
        }
        @keyframes heroRingPulse { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.75);opacity:0} }
        .scroll-btn svg { animation: heroBounce 2s ease-in-out infinite; }
        @keyframes heroBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }

        .hero-stats {
          display: flex; align-items: center; gap: 0; margin-top: 40px;
          padding: 16px 0; border-top: 1px solid rgba(255,255,255,0.05); width: 100%;
        }
        .hero-stat { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 0 8px; }
        .hero-stat:not(:last-child) { border-right: 1px solid rgba(139,92,246,0.12); }
        .stat-val {
          font-family: 'Syne', sans-serif; font-size: clamp(20px, 3vw, 28px); font-weight: 800;
          background: linear-gradient(135deg, #fff, #a78bfa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          line-height: 1; letter-spacing: -0.03em;
        }
        .stat-label { font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(180,180,220,0.32); font-family: 'DM Sans', sans-serif; }

        .hero-right { display: flex; justify-content: center; align-items: center; }

        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr !important; gap: 48px; text-align: center; }
          .hero-left { align-items: center; }
          .hero-eyebrow { justify-content: center; }
          .hero-eyebrow::before { display: none; }
          .hero-sep { margin-left: auto; margin-right: auto; }
          .hero-desc { margin-left: auto; margin-right: auto; }
          .hero-actions { justify-content: center; }
          .hero-right { justify-content: center; }
        }
        @media (max-width: 540px) {
          #hero-section { padding: 88px 0 60px; }
          .hero-name { letter-spacing: -1.5px; }
          .hero-actions { gap: 14px; }
        }
      `}</style>

      <section id="hero-section">
        {/* z:2 — scanlines */}
        <div className="hero-scanlines" />

        {/* z:3 — particle constellation (above scanlines, below content) */}
        <ParticleConstellation />

        {/* z:10 — all content */}
        <div className="hero-inner">
          {/* ── LEFT COLUMN ── */}
          <motion.div
            className="hero-left"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div className="hero-eyebrow" variants={fadeUp}>
              Portfolio · 2026
            </motion.div>

            <motion.h1 className="hero-name" variants={fadeUp}>
              <span className="hero-name-first">Shanjid</span>
              <span className="hero-name-last">Ahmad</span>
            </motion.h1>

            <motion.div className="hero-subtitle" variants={fadeUp}>
              <Typewriter />
            </motion.div>

            <motion.div className="hero-sep" variants={fadeUp} />

            <motion.p className="hero-desc" variants={fadeUp}>
              I architect and ship full-stack web products — from API design to
              pixel-perfect interfaces. Five years of turning ideas into
              production-grade reality with the MERN stack, Next.js, and
              TypeScript.
            </motion.p>

            <motion.div className="hero-actions" variants={stagger}>
              <div className="social-row">
                {SOCIAL_LINKS.map((link) => (
                  <SocialIcon key={link.label} {...link} />
                ))}
              </div>

              <motion.button
                className="scroll-btn"
                variants={fadeUp}
                onClick={scrollToAbout}
                aria-label="Scroll to about section"
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                <ArrowDown size={17} />
              </motion.button>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.4,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <span className="stat-val">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN ── */}
          <motion.div
            className="hero-right"
            variants={fadeRight}
            initial="hidden"
            animate="show"
          >
            <VSCodeWidget />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;
