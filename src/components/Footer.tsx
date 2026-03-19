import React, { useRef, useEffect, useCallback } from "react";
import { Heart, ArrowUp, Github, Linkedin, Mail, Code2 } from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";
import TerminalWidget from "./shared/TerminalWidget";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SocialLink {
  readonly href: string;
  readonly icon: React.ElementType;
  readonly label: string;
  readonly accent: string;
}

interface TechBadge {
  readonly label: string;
  readonly color: string;
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

const TECH_BADGES: readonly TechBadge[] = [
  { label: "React", color: "#60a5fa" },
  { label: "TypeScript", color: "#34d399" },
  { label: "Tailwind", color: "#a78bfa" },
] as const;

// ─── Variants ─────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Particle Constellation ───────────────────────────────────────────────────
//
//  Identical system to the Hero's constellation but tuned for the footer's
//  darker, denser feel:
//
//    • 90 particles (fewer — footer is shorter than the hero)
//    • Particles drift DOWNWARD (vy positive) so they feel like they're
//      settling / sinking — different mood from the hero's upward drift
//    • Connection distance 85px
//    • Mouse attractor radius 130px
//    • Slightly warmer accent mix — still purple/violet but includes pink
//      to echo the heart icon and match the footer's softer tone
//    • z-index 0 — sits behind the ::before separator line (pseudo) and
//      all content (z:1)
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
  isGlow: boolean;
}

const FOOTER_PARTICLE_COLORS = [
  "139,92,246", // violet
  "167,139,250", // lavender
  "129,140,248", // indigo
  "96,165,250", // blue
  "244,114,182", // pink  (matches the heart icon)
];

const FooterParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particles = useRef<Particle[]>([]);

  const spawnParticle = useCallback(
    (W: number, H: number, init = false): Particle => {
      const color =
        FOOTER_PARTICLE_COLORS[
          Math.floor(Math.random() * FOOTER_PARTICLE_COLORS.length)
        ];
      return {
        x: Math.random() * W,
        // On init scatter through full height; on respawn appear at top
        y: init ? Math.random() * H : -8,
        vx: (Math.random() - 0.5) * 0.32,
        vy: Math.random() * 0.4 + 0.1, // downward drift
        r: Math.random() * 1.7 + 0.4,
        baseAlpha: Math.random() * 0.5 + 0.18,
        life: 0,
        maxLife: Math.random() * 260 + 130,
        color,
        isGlow: Math.random() < 0.08,
      };
    },
    [],
  );

  const onMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = 0,
      H = 0;
    const COUNT = 90;
    const CONNECT_DIST = 85;
    const ATTRACT_R = 130;
    const ATTRACT_FORCE = 0.016;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      particles.current = Array.from({ length: COUNT }, () =>
        spawnParticle(W, H, true),
      );
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const footer = canvas.closest("#footer-section") as HTMLElement | null;
    footer?.addEventListener("mousemove", onMouseMove);
    footer?.addEventListener("mouseleave", onMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const ps = particles.current;

      // 1. update
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];

        // Mouse attraction
        const dx = mx - p.x,
          dy = my - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < ATTRACT_R && d > 1) {
          const f = ((ATTRACT_R - d) / ATTRACT_R) * ATTRACT_FORCE;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }

        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life > p.maxLife || p.y > H + 12) {
          ps[i] = spawnParticle(W, H, false);
        }
      }

      // 2. edges
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x,
            dy = ps[i].y - ps[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            const li =
              Math.min(ps[i].life / 40, 1) *
              Math.min(
                1 - Math.max(0, (ps[i].life - ps[i].maxLife + 40) / 40),
                1,
              );
            const lj =
              Math.min(ps[j].life / 40, 1) *
              Math.min(
                1 - Math.max(0, (ps[j].life - ps[j].maxLife + 40) / 40),
                1,
              );
            const alpha = (1 - d / CONNECT_DIST) * 0.16 * Math.min(li, lj);
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = "rgba(167,139,250,1)";
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. particles
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        const fadeIn = Math.min(p.life / 40, 1);
        const fadeOut = Math.min(
          1 - Math.max(0, (p.life - p.maxLife + 40) / 40),
          1,
        );
        const alpha = fadeIn * fadeOut * p.baseAlpha;

        if (p.isGlow) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          grd.addColorStop(0, `rgba(${p.color},${(alpha * 0.85).toFixed(3)})`);
          grd.addColorStop(
            0.4,
            `rgba(${p.color},${(alpha * 0.28).toFixed(3)})`,
          );
          grd.addColorStop(1, `rgba(${p.color},0)`);
          ctx.fillStyle = grd;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }

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
      footer?.removeEventListener("mousemove", onMouseMove);
      footer?.removeEventListener("mouseleave", onMouseLeave);
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
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-5%" });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        #footer-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          background: transparent;
          overflow: hidden;
          padding: 80px 0 40px;
        }

        /* Top separator — z:1 so it sits above the canvas */
        #footer-section::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent);
          pointer-events: none; z-index: 1;
        }

        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes colonBlink  { 0%,100%{opacity:1} 50%{opacity:0.2} }

        @keyframes scrollPulse {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          14%     { transform: scale(1.3); }
          28%     { transform: scale(1); }
          42%     { transform: scale(1.2); }
          56%     { transform: scale(1); }
        }

        .footer-social:hover .footer-tooltip { opacity: 1; transform: translateX(-50%) translateY(-4px); }
        .footer-tooltip {
          position: absolute; bottom: calc(100% + 8px); left: 50%;
          transform: translateX(-50%) translateY(0px);
          background: rgba(10,5,28,0.95); color: rgba(200,200,240,0.9);
          font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
          padding: 4px 9px; border-radius: 5px;
          border: 0.5px solid rgba(139,92,246,0.2);
          pointer-events: none; opacity: 0;
          transition: opacity 0.2s, transform 0.2s;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }

        .footer-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 100px;
          border: 0.5px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(8px);
          font-size: 11px; color: rgba(200,200,230,0.5);
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.25s, color 0.25s, background 0.25s;
          cursor: default;
        }
        .footer-badge:hover {
          border-color: rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: rgba(220,220,245,0.8);
        }
      `}</style>

      <footer id="footer-section" ref={footerRef}>
        {/* Particle constellation — z:0, behind everything */}
        <FooterParticles />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 40,
            }}
          >
            {/* ── Terminal widget ── */}
            <motion.div
              variants={scaleIn}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TerminalWidget />
            </motion.div>

            {/* ── Scroll to top ── */}
            <motion.div variants={fadeUp}>
              <motion.button
                onClick={scrollToTop}
                aria-label="Back to top"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  position: "relative",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "1px solid rgba(139,92,246,0.25)",
                  background: "rgba(139,92,246,0.07)",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "rgba(200,200,240,0.6)",
                  transition:
                    "border-color 0.25s, color 0.25s, background 0.25s",
                  overflow: "visible",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(139,92,246,0.6)";
                  el.style.color = "#a78bfa";
                  el.style.background = "rgba(139,92,246,0.14)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(139,92,246,0.25)";
                  el.style.color = "rgba(200,200,240,0.6)";
                  el.style.background = "rgba(139,92,246,0.07)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: -2,
                    borderRadius: "50%",
                    border: "1px solid rgba(139,92,246,0.2)",
                    animation: "scrollPulse 2.5s ease-in-out infinite",
                  }}
                  aria-hidden="true"
                />
                <ArrowUp size={18} />
              </motion.button>
            </motion.div>

            {/* ── Name + tagline ── */}
            <motion.div variants={fadeUp} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: "clamp(28px, 5vw, 44px)",
                  color: "#fff",
                  letterSpacing: "-0.5px",
                  lineHeight: 1.1,
                  marginBottom: 10,
                  background:
                    "linear-gradient(135deg, #fff 40%, rgba(167,139,250,0.85) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Shanjid Ahmad
              </p>
              <p
                style={{
                  fontSize: 12,
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: "rgba(200,200,240,0.3)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Full-Stack Developer · Chattogram, BD
              </p>
            </motion.div>

            {/* ── Social icons ── */}
            <motion.div variants={stagger} style={{ display: "flex", gap: 12 }}>
              {SOCIAL_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    variants={fadeUp}
                    className="footer-social"
                    whileHover={{ scale: 1.12, y: -3 }}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      position: "relative",
                      width: 46,
                      height: 46,
                      borderRadius: 13,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(8px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(200,200,240,0.55)",
                      textDecoration: "none",
                      transition:
                        "border-color 0.25s, color 0.25s, background 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = `${link.accent}55`;
                      el.style.color = link.accent;
                      el.style.background = `${link.accent}10`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "rgba(255,255,255,0.08)";
                      el.style.color = "rgba(200,200,240,0.55)";
                      el.style.background = "rgba(255,255,255,0.03)";
                    }}
                  >
                    <Icon size={18} />
                    <span className="footer-tooltip">{link.label}</span>
                  </motion.a>
                );
              })}
            </motion.div>

            {/* ── Divider ── */}
            <motion.div
              variants={fadeUp}
              style={{ width: "100%", position: "relative" }}
            >
              <div
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(139,92,246,0.2), transparent)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: -3,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(139,92,246,0.6)",
                  boxShadow: "0 0 8px rgba(139,92,246,0.5)",
                }}
              />
            </motion.div>

            {/* ── Bottom row ── */}
            <motion.div
              variants={stagger}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                flexWrap: "wrap",
                gap: 16,
              }}
              className="footer-bottom"
            >
              <motion.p
                variants={fadeUp}
                style={{
                  fontSize: 12.5,
                  color: "rgba(200,200,240,0.35)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                © 2026 Shanjid Ahmad. All rights reserved.
              </motion.p>

              <motion.p
                variants={fadeUp}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  color: "rgba(200,200,240,0.3)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <Code2 size={12} color="#60a5fa" style={{ flexShrink: 0 }} />
                Made with
                <Heart
                  size={12}
                  color="#f472b6"
                  fill="#f472b6"
                  style={{
                    flexShrink: 0,
                    animation: "heartbeat 2s ease-in-out infinite",
                  }}
                />
                using React & Tailwind
              </motion.p>

              <motion.div
                variants={stagger}
                style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
              >
                {TECH_BADGES.map((badge) => (
                  <motion.span
                    key={badge.label}
                    variants={fadeUp}
                    className="footer-badge"
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: badge.color,
                        boxShadow: `0 0 5px ${badge.color}`,
                        display: "block",
                        flexShrink: 0,
                        animation: "cursorBlink 2.5s ease-in-out infinite",
                        animationDelay: `${TECH_BADGES.indexOf(badge) * 0.5}s`,
                      }}
                    />
                    {badge.label}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .footer-bottom { flex-direction: column !important; align-items: center !important; text-align: center; }
          }
        `}</style>
      </footer>
    </>
  );
};

export default Footer;
