"use client";

import React, { useRef, useState } from "react";
import {
  ArrowUpRight,
  Zap,
  Star,
  Award,
  ShieldCheck,
  Check,
} from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
const UPWORK_PROFILE_URL =
  "https://www.upwork.com/freelancers/~0170afa1a35aac844c";

const HIGHLIGHTS = [
  {
    title: "Full-Stack Mastery",
    desc: "MERN stack, NestJS, and responsive frontends.",
    accent: "#14b86e",
  },
  {
    title: "Milestone Contracts",
    desc: "Fixed-price or hourly scopes tailored to your budget.",
    accent: "#60a5fa",
  },
  {
    title: "Clear Communication",
    desc: "Async updates, regular demos, and full transparency.",
    accent: "#a78bfa",
  },
] as const;

// ─── Animation Variants ───────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: "blur(6px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Upwork Logo SVG ──────────────────────────────────────────────────────────

const UpworkMark: React.FC<{ size?: number }> = ({ size = 20 }) => (
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

// ─── Trust Badge / Profile Card ───────────────────────────────────────────────

const ProfileCard: React.FC<{ isMobile?: boolean }> = ({
  isMobile = false,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, scale: 1.02 }}
      style={{
        width: isMobile ? "100%" : 320,
        borderRadius: 20,
        border: "1px solid rgba(20,184,110,0.25)",
        background: "rgba(5,3,15,0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: hovered ? "0 20px 48px rgba(20,184,110,0.12)" : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
        position: "relative",
        overflow: "hidden",
        padding: "24px 22px",
      }}
    >
      {/* Glow highlight */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, #14b86e, transparent)",
        }}
      />

      {/* Upwork header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#14b86e",
          }}
        >
          <UpworkMark size={18} />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Upwork Profile
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 8px",
            borderRadius: 100,
            background: "rgba(20,184,110,0.12)",
            border: "0.5px solid rgba(20,184,110,0.3)",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#14b86e",
              boxShadow: "0 0 6px #14b86e",
              animation: "upworkDotBlink 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: 8,
              fontWeight: 600,
              color: "#14b86e",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ONLINE
          </span>
        </div>
      </div>

      {/* Bio section */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(20,184,110,0.15)",
            border: "1px solid rgba(20,184,110,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 700,
            color: "#14b86e",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          SA
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                margin: 0,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Shanjid Ahmad
            </h3>
            <ShieldCheck size={14} color="#14b86e" />
          </div>
          <span
            style={{
              fontSize: 11,
              color: "rgba(200,200,240,0.45)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Full-Stack Software Engineer
          </span>
        </div>
      </div>

      {/* Ratings & Achievements */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 12,
          padding: "14px 16px",
          marginBottom: 20,
        }}
      >
        {/* Availability Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "rgba(200,200,240,0.5)" }}>
            Availability
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Zap size={11} color="#14b86e" />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: "#fff" }}>
              30+ hrs / week
            </span>
          </div>
        </div>

        {/* Rate Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "rgba(200,200,240,0.5)" }}>
            Hourly Rate
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "#fff" }}>
            $25.00 / hr
          </span>
        </div>

        {/* Success Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "rgba(200,200,240,0.5)" }}>
            Job Success
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "#14b86e" }}>
            100% Guaranteed
          </span>
        </div>

        {/* Status Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "rgba(200,200,240,0.5)" }}>
            Verification
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#60a5fa",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Identity Verified
          </span>
        </div>
      </div>

      {/* Button */}
      <a
        href={UPWORK_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "12px 20px",
          borderRadius: 12,
          border: "1px solid #14b86e",
          background: hovered
            ? "rgba(20,184,110,0.18)"
            : "rgba(20,184,110,0.1)",
          color: "#2ee08a",
          fontSize: 13,
          fontWeight: 500,
          textDecoration: "none",
          transition: "all 0.25s",
          textAlign: "center",
          width: "100%",
        }}
      >
        Hire on Upwork <ArrowUpRight size={14} />
      </a>
    </motion.div>
  );
};

// ─── Desktop Component ────────────────────────────────────────────────────────

const HireOnUpworkDesktop: React.FC<{ isInView: boolean }> = ({ isInView }) => {
  return (
    <div
      className="upwork-desktop"
      style={{
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto",
        padding: "0 24px",
      }}
    >
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        style={{
          position: "relative",
          borderRadius: 28,
          padding: "54px 54px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
          background:
            "radial-gradient(circle at 10% 20%, rgba(20,184,110,0.08) 0%, rgba(139,92,246,0.02) 50%, rgba(5,3,15,0.65) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(20,184,110,0.4), transparent)",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 54,
            alignItems: "center",
          }}
        >
          {/* Left Block */}
          <motion.div variants={stagger}>
            {/* Tag */}
            <motion.div
              variants={fadeUp}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 12px",
                borderRadius: 100,
                border: "1px solid rgba(20,184,110,0.25)",
                background: "rgba(20,184,110,0.06)",
                marginBottom: 18,
              }}
            >
              <Award size={13} color="#14b86e" />
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#14b86e",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Top Rated Partner
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 44,
                lineHeight: 1.12,
                color: "#fff",
                letterSpacing: "-1px",
                margin: "0 0 16px",
              }}
            >
              Prefer working through{" "}
              <span style={{ fontStyle: "italic", color: "#14b86e" }}>
                Upwork
              </span>
              ?
            </motion.h2>

            <motion.p
              variants={fadeUp}
              style={{
                fontSize: 14.5,
                fontWeight: 300,
                lineHeight: 1.8,
                color: "rgba(190,190,220,0.55)",
                maxWidth: 480,
                margin: "0 0 32px",
              }}
            >
              Get total contract security, verified work timelines, and secure
              escrow protection. Hire with complete peace of mind using your
              preferred platform.
            </motion.p>

            {/* highlights cards */}
            <motion.div
              variants={stagger}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                maxWidth: 540,
              }}
            >
              {HIGHLIGHTS.map((h) => (
                <motion.div
                  key={h.title}
                  variants={fadeUp}
                  style={{
                    padding: "16px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.05)",
                    background: "rgba(255,255,255,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: `${h.accent}15`,
                        border: `1px solid ${h.accent}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check size={10} color={h.accent} />
                    </span>
                    <span
                      style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}
                    >
                      {h.title}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(200,200,240,0.4)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {h.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Block (Profile Card) */}
          <ProfileCard />
        </div>
      </motion.div>
    </div>
  );
};

// ─── Mobile Component ─────────────────────────────────────────────────────────

const HireOnUpworkMobile: React.FC<{ isInView: boolean }> = ({ isInView }) => {
  return (
    <div
      className="upwork-mobile"
      style={{
        padding: "0 20px",
        width: "100%",
        maxWidth: 640,
        margin: "0 auto",
      }}
    >
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        style={{
          borderRadius: 22,
          padding: "32px 24px",
          border: "1px solid rgba(255,255,255,0.06)",
          background:
            "radial-gradient(circle at 50% 0%, rgba(20,184,110,0.08) 0%, rgba(5,3,15,0.6) 100%)",
          backdropFilter: "blur(16px)",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div style={{ textAlign: "center" }}>
          {/* Tag */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 100,
              border: "1px solid rgba(20,184,110,0.25)",
              background: "rgba(20,184,110,0.06)",
              marginBottom: 14,
            }}
          >
            <Award size={12} color="#14b86e" />
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#14b86e",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Top Rated Dev
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 34,
              lineHeight: 1.15,
              color: "#fff",
              letterSpacing: "-0.5px",
              margin: "0 0 10px",
            }}
          >
            Prefer working through{" "}
            <span style={{ fontStyle: "italic", color: "#14b86e" }}>
              Upwork
            </span>
            ?
          </h2>

          <p
            style={{
              fontSize: 13.5,
              fontWeight: 300,
              lineHeight: 1.7,
              color: "rgba(190,190,220,0.5)",
              margin: 0,
            }}
          >
            Get secure escrow protection, milestone-based releases, and
            certified timelines.
          </p>
        </div>

        {/* Profile Card */}
        <ProfileCard isMobile />

        {/* Highlights List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.title}
              style={{
                display: "flex",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.04)",
                background: "rgba(255,255,255,0.015)",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: `${h.accent}15`,
                  border: `1px solid ${h.accent}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <Check size={10} color={h.accent} />
              </span>
              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#fff",
                    display: "block",
                  }}
                >
                  {h.title}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(200,200,240,0.4)",
                    lineHeight: 1.4,
                    display: "block",
                    marginTop: 2,
                  }}
                >
                  {h.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ─── Hire On Upwork ────────────────────────────────────────────────────────────

const HireOnUpwork: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-12%" });

  return (
    <>
      <style>{`
        #upwork-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          padding: 120px 0;
          background: transparent;
          overflow: visible;
        }
        #upwork-section::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(20,184,110,0.2), transparent);
          pointer-events: none;
        }

        .upwork-desktop {
          display: block;
        }
        .upwork-mobile {
          display: none;
        }

        @keyframes upworkDotBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.08); }
        }

        @media (max-width: 768px) {
          .upwork-desktop {
            display: none !important;
          }
          .upwork-mobile {
            display: block !important;
          }
          #upwork-section {
            padding: 80px 0 60px;
          }
        }
      `}</style>

      <section id="upwork-section" ref={sectionRef}>
        {/* Desktop View */}
        <HireOnUpworkDesktop isInView={isInView} />

        {/* Mobile View */}
        <HireOnUpworkMobile isInView={isInView} />
      </section>
    </>
  );
};

export default HireOnUpwork;
