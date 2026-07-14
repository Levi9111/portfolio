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
  { value: "30+", label: "Projects" },
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

  return <canvas ref={canvasRef} className="hero-canvas" />;
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
    <span className="hero-typewriter-container">
      {displayed}
      <span className="hero-typewriter-cursor">|</span>
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
    className="hero-social-btn"
    style={{
      "--accent": accent,
      "--accent-border": `${accent}55`,
      "--accent-bg": `${accent}14`,
    } as React.CSSProperties}
  >
    <Icon size={18} />
    <span className="hero-social-sheen" />
    <span className="hero-social-tip">{label}</span>
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
              <span className="hero-name-first inline-block">Shanjid</span>
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
