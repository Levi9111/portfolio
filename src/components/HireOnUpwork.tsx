// src/components/HireOnUpwork.tsx
import React, { useRef, useState } from "react";
import { Star, CheckCircle2, ArrowUpRight, Zap } from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
const UPWORK_PROFILE_URL =
  "https://www.upwork.com/freelancers/~0170afa1a35aac844c";

const HIGHLIGHTS = [
  "Full-stack MERN & NestJS delivery",
  "Fixed-price or hourly engagements",
  "Clear scope, async-friendly communication",
] as const;

// ─── Variants ─────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(6px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Upwork Logo Mark (inline SVG, no external asset needed) ─────────────────

const UpworkMark: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M23.5 12.5c-2.6 0-4.6 1.7-5.4 4.3-1-1.6-1.8-3.5-2.3-5.1h-3.2v7.4c0 1.5-1.2 2.7-2.7 2.7s-2.7-1.2-2.7-2.7v-7.4H4v7.4c0 3.3 2.7 6 6 6 2.4 0 4.4-1.4 5.4-3.4l.6-1.3c.3 1 .6 2.1.9 3.1l.9 3.2h3.1l-1.6-5.4c1 .7 2.2 1.1 3.5 1.1 3.3 0 6-2.7 6-6s-2.7-6-6.3-6zm.1 8.7c-1.4 0-2.6-.9-3-2.2.4-1.9 1.4-3.2 3-3.2 1.4 0 2.6 1.2 2.6 2.7s-1.2 2.7-2.6 2.7z"
      fill="currentColor"
    />
  </svg>
);

// ─── Hire On Upwork Section ────────────────────────────────────────────────────

const HireOnUpwork: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        #upwork-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          padding: 100px 0;
          background: transparent;
          overflow: visible;
        }
        #upwork-section::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(20,184,110,0.25), transparent);
          pointer-events: none;
        }

        @keyframes upworkPulseRing {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes upworkDotBlink {
          0%,100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .upwork-card { position: relative; }
        @media (max-width: 860px) {
          .upwork-card-inner { grid-template-columns: 1fr !important; text-align: center; }
          .upwork-card-inner .upwork-highlights { align-items: center !important; }
          .upwork-card-inner .upwork-highlights li { justify-content: center; }
        }
      `}</style>

      <section id="upwork-section" ref={sectionRef}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1000,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="upwork-card"
            style={{
              borderRadius: 26,
              overflow: "hidden",
              border: `1px solid ${hovered ? "rgba(20,184,110,0.4)" : "rgba(20,184,110,0.2)"}`,
              background:
                "radial-gradient(ellipse at 15% 0%, rgba(20,184,110,0.12) 0%, rgba(5,3,15,0.7) 55%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              transition: "border-color 0.35s",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Top accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "8%",
                right: "8%",
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(20,184,110,0.7), transparent)",
              }}
              aria-hidden="true"
            />

            <div
              className="upwork-card-inner"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 40,
                alignItems: "center",
                padding: "48px 48px",
              }}
            >
              {/* ── Left: copy ── */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate={isInView ? "show" : "hidden"}
              >
                {/* Availability badge */}
                <motion.div
                  variants={fadeUp}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 14px",
                    borderRadius: 100,
                    border: "1px solid rgba(20,184,110,0.3)",
                    background: "rgba(20,184,110,0.08)",
                    marginBottom: 20,
                  }}
                >
                  <span style={{ position: "relative", width: 7, height: 7 }}>
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background: "#14b86e",
                        boxShadow: "0 0 6px rgba(20,184,110,0.7)",
                        animation: "upworkDotBlink 2s ease-in-out infinite",
                      }}
                    />
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "1.2px",
                      textTransform: "uppercase",
                      color: "#14b86e",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Open for freelance work
                  </span>
                </motion.div>

                <motion.h2
                  variants={fadeUp}
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: "clamp(30px, 4.2vw, 44px)",
                    fontWeight: 400,
                    lineHeight: 1.15,
                    color: "#fff",
                    letterSpacing: "-0.5px",
                    margin: "0 0 16px",
                  }}
                >
                  Prefer to hire through{" "}
                  <span style={{ fontStyle: "italic", color: "#14b86e" }}>
                    Upwork
                  </span>
                  ?
                </motion.h2>

                <motion.p
                  variants={fadeUp}
                  style={{
                    fontSize: 14,
                    fontWeight: 300,
                    lineHeight: 1.8,
                    color: "rgba(190,190,220,0.55)",
                    maxWidth: 460,
                    margin: "0 0 24px",
                  }}
                >
                  Escrow protection, verified reviews, and milestone-based
                  payments — everything you need to hire with confidence.
                </motion.p>

                {/* Highlights */}
                <motion.ul
                  variants={fadeUp}
                  className="upwork-highlights"
                  style={{
                    listStyle: "none",
                    margin: "0 0 28px",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {HIGHLIGHTS.map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        fontSize: 13,
                        color: "rgba(200,200,230,0.65)",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      <CheckCircle2
                        size={14}
                        color="#14b86e"
                        style={{ flexShrink: 0 }}
                      />
                      {item}
                    </li>
                  ))}
                </motion.ul>

                {/* CTA button */}
                <motion.div variants={fadeUp}>
                  <a
                    href={UPWORK_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "14px 28px",
                      borderRadius: 14,
                      border: "1px solid rgba(20,184,110,0.5)",
                      background: "rgba(20,184,110,0.14)",
                      color: "#2ee08a",
                      fontSize: 14,
                      fontWeight: 500,
                      textDecoration: "none",
                      overflow: "hidden",
                      transition: "all 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(20,184,110,0.24)";
                      el.style.borderColor = "rgba(20,184,110,0.85)";
                      el.style.transform = "translateY(-2px)";
                      el.style.boxShadow = "0 10px 30px rgba(20,184,110,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "rgba(20,184,110,0.14)";
                      el.style.borderColor = "rgba(20,184,110,0.5)";
                      el.style.transform = "none";
                      el.style.boxShadow = "none";
                    }}
                  >
                    <UpworkMark size={17} />
                    View Upwork Profile
                    <ArrowUpRight size={15} style={{ opacity: 0.7 }} />
                  </a>
                </motion.div>
              </motion.div>
              {/* ── Right: rating badge ── */}

              <motion.div
                variants={scaleIn}
                initial="hidden"
                animate={isInView ? "show" : "hidden"}
                style={{
                  position: "relative",
                  width: 168,
                  height: 168,
                  borderRadius: "50%",
                  border: "1px solid rgba(20,184,110,0.3)",
                  background: "rgba(3,2,12,0.6)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                {/* Pulsing ring */}
                <span
                  style={{
                    position: "absolute",
                    inset: -3,
                    borderRadius: "50%",
                    border: "1px solid rgba(20,184,110,0.25)",
                    animation: "upworkPulseRing 2.6s ease-in-out infinite",
                  }}
                  aria-hidden="true"
                />
                <UpworkMark size={24} />
                <span
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.02em",
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  Professional Profile
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Zap size={10} color="#14b86e" />
                  <span
                    style={{
                      fontSize: 9,
                      color: "rgba(200,200,240,0.45)",
                      letterSpacing: "0.5px",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    5+ yrs experience
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HireOnUpwork;
