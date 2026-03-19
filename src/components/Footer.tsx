import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  ArrowUp,
  Github,
  Linkedin,
  Mail,
  Code2,
  Terminal,
  Wifi,
  Battery,
} from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";

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

// Lines the terminal cycles through — each starts with a prefix and has a color
interface TermLine {
  prefix: string;
  text: string;
  color: string;
  delay: number; // ms before this line starts typing
}

const TERM_LINES: readonly TermLine[] = [
  {
    prefix: "→",
    text: " shanjid@portfolio:~$ whoami",
    color: "#a78bfa",
    delay: 400,
  },
  {
    prefix: "",
    text: "  Full-Stack Developer · Chattogram, BD",
    color: "#e2e8f0",
    delay: 1200,
  },
  {
    prefix: "→",
    text: " shanjid@portfolio:~$ cat stack.txt",
    color: "#a78bfa",
    delay: 2200,
  },
  {
    prefix: "",
    text: "  MERN · Next.js · TypeScript · Docker",
    color: "#34d399",
    delay: 3000,
  },
  {
    prefix: "→",
    text: " shanjid@portfolio:~$ status --work",
    color: "#a78bfa",
    delay: 4000,
  },
  {
    prefix: "",
    text: "  ✓ Available for new projects",
    color: "#34d399",
    delay: 4800,
  },
  {
    prefix: "→",
    text: " shanjid@portfolio:~$ echo $VIBE",
    color: "#a78bfa",
    delay: 5800,
  },
  {
    prefix: "",
    text: "  Ship fast. Break nothing. 🚀",
    color: "#fbbf24",
    delay: 6600,
  },
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

// ─── Live Clock ────────────────────────────────────────────────────────────────

const LiveClock: React.FC = () => {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = time.getHours().toString().padStart(2, "0");
  const mm = time.getMinutes().toString().padStart(2, "0");
  const ss = time.getSeconds().toString().padStart(2, "0");

  return (
    <span style={{ fontFamily: "'Syne', monospace", letterSpacing: "0.05em" }}>
      {hh}:{mm}
      <span
        style={{
          color: "#a78bfa",
          animation: "colonBlink 1s step-end infinite",
        }}
      >
        :
      </span>
      {ss}
    </span>
  );
};

// ─── Terminal Widget ──────────────────────────────────────────────────────────

const TerminalWidget: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typedChars, setTypedChars] = useState<number>(0);
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [phase, setPhase] = useState<"typing" | "waiting" | "done">("typing");
  const [batteryPct] = useState(() => Math.floor(Math.random() * 30) + 65); // 65-94%

  // Type line by line, then pause, then restart
  useEffect(() => {
    if (phase === "done") {
      const restart = setTimeout(() => {
        setVisibleLines(0);
        setTypedChars(0);
        setCurrentLine(0);
        setPhase("typing");
      }, 3500);
      return () => clearTimeout(restart);
    }

    if (phase === "waiting") {
      const next = setTimeout(() => {
        if (currentLine + 1 < TERM_LINES.length) {
          setCurrentLine((l) => l + 1);
          setTypedChars(0);
          setPhase("typing");
        } else {
          setPhase("done");
        }
      }, 600);
      return () => clearTimeout(next);
    }

    // typing phase
    const line = TERM_LINES[currentLine];
    const fullText = line.prefix + line.text;
    if (typedChars < fullText.length) {
      const delay = line.prefix === "→" ? 38 : 22; // commands type slower than output
      const t = setTimeout(() => setTypedChars((c) => c + 1), delay);
      return () => clearTimeout(t);
    } else {
      // finished this line
      setVisibleLines((l) => l + 1);
      setPhase("waiting");
    }
  }, [phase, typedChars, currentLine]);

  const allRendered = TERM_LINES.slice(0, visibleLines);
  const currentFull = TERM_LINES[currentLine]
    ? TERM_LINES[currentLine].prefix + TERM_LINES[currentLine].text
    : "";

  return (
    <div
      style={{
        background: "rgba(5,3,15,0.7)",
        border: "0.5px solid rgba(167,139,250,0.2)",
        borderRadius: 14,
        overflow: "hidden",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        width: "100%",
        maxWidth: 480,
      }}
    >
      {/* Terminal chrome */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          padding: "8px 13px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* Traffic lights */}
        {(["#ff5f57", "#ffbd2e", "#28c840"] as const).map((c) => (
          <span
            key={c}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: c,
              opacity: 0.75,
              display: "block",
            }}
          />
        ))}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Terminal size={10} color="rgba(200,200,240,0.4)" />
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            shanjid — bash
          </span>
        </div>
        {/* Status row: wifi + battery + clock */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Wifi size={9} color="rgba(52,211,153,0.7)" />
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Battery size={9} color="rgba(200,200,240,0.4)" />
            <span
              style={{
                fontSize: 8,
                color: "rgba(200,200,240,0.35)",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {batteryPct}%
            </span>
          </div>
          <span
            style={{
              fontSize: 8,
              color: "rgba(200,200,240,0.4)",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            <LiveClock />
          </span>
        </div>
      </div>

      {/* Terminal body */}
      <div
        style={{
          padding: "14px 16px",
          minHeight: 180,
          fontFamily: "'DM Sans', monospace",
          fontSize: 12,
          lineHeight: 1.7,
        }}
      >
        {/* Completed lines */}
        {allRendered.map((line, i) => (
          <div key={i} style={{ color: line.color, opacity: 0.9 }}>
            {line.prefix + line.text}
          </div>
        ))}

        {/* Currently typing line */}
        {phase !== "done" && (
          <div style={{ color: TERM_LINES[currentLine]?.color || "#fff" }}>
            {currentFull.slice(0, typedChars)}
            <span
              style={{
                animation: "cursorBlink 1s step-end infinite",
                color: "#a78bfa",
              }}
            >
              ▋
            </span>
          </div>
        )}

        {/* Idle cursor when done */}
        {phase === "done" && (
          <div style={{ color: "#a78bfa", opacity: 0.6 }}>
            → shanjid@portfolio:~${" "}
            <span style={{ animation: "cursorBlink 1s step-end infinite" }}>
              ▋
            </span>
          </div>
        )}
      </div>
    </div>
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
          overflow: visible;
          padding: 80px 0 40px;
        }

        /* Top separator */
        #footer-section::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent);
          pointer-events: none;
        }

        /* Terminal cursor blink */
        @keyframes cursorBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes colonBlink   { 0%,100%{opacity:1} 50%{opacity:0.2} }

        /* Scroll-to-top button pulse ring */
        @keyframes scrollPulse {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        /* Heartbeat */
        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          14%     { transform: scale(1.3); }
          28%     { transform: scale(1); }
          42%     { transform: scale(1.2); }
          56%     { transform: scale(1); }
        }

        /* Social icon tooltip */
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

        /* Tech badge */
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
                {/* Pulse ring */}
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

            {/* ── Bottom row: copyright + tech badges ── */}
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
              {/* Copyright */}
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

              {/* Made with */}
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

              {/* Tech badges */}
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
            .footer-bottom {
              flex-direction: column !important;
              align-items: center !important;
              text-align: center;
            }
          }
        `}</style>
      </footer>
    </>
  );
};

export default Footer;
