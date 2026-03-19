// TODO: Here the widget needs to be separated into a different component
import React, { useState, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import {
  Code2,
  Zap,
  Rocket,
  Heart,
  Trophy,
  Target,
  Sparkles,
  ArrowRight,
  GitBranch,
  Globe,
  Star,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Skill {
  readonly category: string;
  readonly icon: React.ElementType;
  readonly items: readonly string[];
  readonly accent: string;
  readonly glow: string;
}

interface Achievement {
  readonly number: string;
  readonly label: string;
  readonly icon: React.ElementType;
  readonly accent: string;
}

interface StoryItem {
  readonly accent: string;
  readonly bold: string;
  readonly text: string;
}

interface ActivityProject {
  readonly name: string;
  readonly type: string;
  readonly pct: string;
  readonly color: string;
  readonly delay: string;
  readonly pulseDelay: string;
}

interface CommitDay {
  readonly level: 0 | 1 | 2 | 3 | 4;
}

// ─── Variants ─────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.34, 1.2, 0.64, 1] },
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILLS: readonly Skill[] = [
  {
    category: "Frontend",
    icon: Code2,
    items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "HTML5", "CSS3"],
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
  },
  {
    category: "Backend",
    icon: Zap,
    items: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "REST APIs",
      "Nest.js",
    ],
    accent: "#34d399",
    glow: "rgba(52,211,153,0.15)",
  },
  {
    category: "Tools & DevOps",
    icon: Rocket,
    items: ["Git", "Vercel", "Jest", "Webpack", "Docker", "AWS"],
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.15)",
  },
  {
    category: "Design & UX",
    icon: Heart,
    items: ["Figma", "Responsive Design", "Accessibility", "User Research"],
    accent: "#f472b6",
    glow: "rgba(244,114,182,0.15)",
  },
] as const;

const ACHIEVEMENTS: readonly Achievement[] = [
  { number: "5+", label: "Years Experience", icon: Trophy, accent: "#a78bfa" },
  { number: "60+", label: "Projects Shipped", icon: Target, accent: "#60a5fa" },
  {
    number: "99%",
    label: "Client Satisfaction",
    icon: Sparkles,
    accent: "#34d399",
  },
] as const;

const STORY: readonly StoryItem[] = [
  {
    accent: "#a78bfa",
    bold: "5 years of full-stack mastery",
    text: "building production-grade web applications. From small startups to scaling platforms, I've led end-to-end development using the MERN stack — architecting systems that handle real users and real data.",
  },
  {
    accent: "#60a5fa",
    bold: "performance-first engineering",
    text: "is at the core of everything I write. I care deeply about clean architecture, type safety, and code that the next developer will actually thank you for. TDD, code reviews, and documentation aren't afterthoughts — they're the baseline.",
  },
  {
    accent: "#34d399",
    bold: "shipping at speed without breaking things",
    text: "is the real skill. CI/CD pipelines, Docker containers, cloud deployments on AWS and Vercel — I own the full lifecycle from local dev to production, and I keep iteration cycles tight.",
  },
] as const;

const ACTIVITY_PROJECTS: readonly ActivityProject[] = [
  {
    name: "E-Commerce Platform",
    type: "React · Node · MongoDB",
    pct: "92%",
    color: "#a78bfa",
    delay: "0.3s",
    pulseDelay: "0s",
  },
  {
    name: "Task Manager App",
    type: "Next.js · Socket.io",
    pct: "78%",
    color: "#60a5fa",
    delay: "0.42s",
    pulseDelay: "0.4s",
  },
  {
    name: "Analytics Dashboard",
    type: "Next.js · Python · ML",
    pct: "65%",
    color: "#34d399",
    delay: "0.54s",
    pulseDelay: "0.8s",
  },
  {
    name: "Auth Microservice",
    type: "Nest.js · JWT · Docker",
    pct: "100%",
    color: "#fbbf24",
    delay: "0.66s",
    pulseDelay: "1.2s",
  },
] as const;

// Commit graph: 7 cols × 5 rows = 35 days
const COMMIT_GRID: readonly CommitDay[] = [
  { level: 1 },
  { level: 2 },
  { level: 0 },
  { level: 3 },
  { level: 1 },
  { level: 2 },
  { level: 1 },
  { level: 0 },
  { level: 3 },
  { level: 4 },
  { level: 2 },
  { level: 1 },
  { level: 0 },
  { level: 2 },
  { level: 2 },
  { level: 1 },
  { level: 3 },
  { level: 2 },
  { level: 4 },
  { level: 3 },
  { level: 1 },
  { level: 1 },
  { level: 0 },
  { level: 2 },
  { level: 3 },
  { level: 2 },
  { level: 1 },
  { level: 3 },
  { level: 3 },
  { level: 4 },
  { level: 2 },
  { level: 1 },
  { level: 3 },
  { level: 4 },
  { level: 2 },
] as const;

const COMMIT_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "rgba(255,255,255,0.04)",
  1: "rgba(167,139,250,0.25)",
  2: "rgba(167,139,250,0.45)",
  3: "rgba(167,139,250,0.7)",
  4: "#a78bfa",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SkillTagProps {
  label: string;
  accent: string;
  glow: string;
}

const SkillTag: React.FC<SkillTagProps> = ({ label, accent, glow }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.span
      variants={scaleIn}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.08, y: -2 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 14px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 400,
        letterSpacing: "0.2px",
        cursor: "default",
        border: `1px solid ${hovered ? accent + "55" : "rgba(255,255,255,0.08)"}`,
        background: hovered ? glow : "rgba(255,255,255,0.04)",
        color: hovered ? accent : "rgba(200,200,230,0.6)",
        transition: "border-color 0.25s, background 0.25s, color 0.25s",
        backdropFilter: "blur(10px)",
        boxShadow: hovered ? `0 0 18px ${glow}` : "none",
      }}
    >
      {label}
    </motion.span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  number: string;
  label: string;
  icon: React.ElementType;
  accent: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({
  number,
  label,
  icon: Icon,
  accent,
  index,
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, scale: 1.03 }}
      style={{
        position: "relative",
        padding: "32px 24px",
        borderRadius: 20,
        textAlign: "center",
        cursor: "default",
        border: `1px solid ${hovered ? accent + "44" : "rgba(255,255,255,0.07)"}`,
        background: hovered
          ? `radial-gradient(circle at 50% 0%, ${accent}12, rgba(5,3,15,0.55))`
          : "rgba(5,3,15,0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        transition: "border-color 0.3s, background 0.3s",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: `${accent}14`,
          border: `1px solid ${accent}28`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          transition: "transform 0.3s",
          transform: hovered ? "scale(1.12) rotate(-4deg)" : "scale(1)",
        }}
      >
        <Icon size={24} color={accent} />
      </div>
      <div
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 42,
          lineHeight: 1,
          marginBottom: 8,
          background: `linear-gradient(135deg, #fff, ${accent})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontSize: 12,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "rgba(180,180,210,0.4)",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
};

// ─── Activity Widget ──────────────────────────────────────────────────────────
// Inline developer dashboard card — no extra file needed

const ActivityWidget: React.FC = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const inView = useInView(widgetRef, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={widgetRef}
      variants={fadeRight}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="w-full"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Main card ── */}
      <div
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "0.5px solid rgba(167,139,250,0.18)",
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Radial highlight */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at 65% 0%, rgba(120,80,255,0.1) 0%, transparent 65%)",
          }}
        />

        {/* Chrome */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderBottom: "0.5px solid rgba(255,255,255,0.06)",
            padding: "9px 13px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {(["#ff5f57", "#ffbd2e", "#28c840"] as const).map((c) => (
            <span
              key={c}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: c,
                opacity: 0.7,
                display: "block",
              }}
            />
          ))}
          <span
            style={{
              marginLeft: 6,
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            shanjid.dev — activity
          </span>
          <div style={{ flex: 1 }} />
          {/* Live pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(34,197,94,0.1)",
              border: "0.5px solid rgba(34,197,94,0.25)",
              borderRadius: 999,
              padding: "3px 8px",
            }}
          >
            <span
              className="animate-blink-dot"
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#22c55e",
                display: "block",
              }}
            />
            <span
              style={{
                fontSize: 8,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "#22c55e",
              }}
            >
              Active
            </span>
          </div>
        </div>

        {/* Dev identity strip */}
        <motion.div
          variants={slideUp}
          style={{
            padding: "10px 13px",
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#a78bfa,#818cf8)",
              border: "1.5px solid #0a0a0f",
              display: "grid",
              placeContent: "center",
              fontSize: 9,
              fontWeight: 800,
              color: "#fff",
              flexShrink: 0,
              boxShadow: "0 0 0 1px rgba(167,139,250,0.4)",
            }}
          >
            S
          </div>
          <div
            className="animate-connector-pulse"
            style={{
              width: 14,
              height: 1,
              background: "linear-gradient(to right,#a78bfa,#34d399)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 8.5,
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: "rgba(255,255,255,0.55)",
                margin: 0,
              }}
            >
              Full-Stack Developer · 5 years
            </p>
            <p
              style={{
                fontSize: 7.5,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.04em",
                marginTop: 1,
              }}
            >
              MERN · TypeScript · Next.js · Docker
            </p>
          </div>
          <span
            className="animate-blink-dot-slow"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#22c55e",
              flexShrink: 0,
              boxShadow: "0 0 5px rgba(34,197,94,0.6)",
              display: "block",
            }}
          />
        </motion.div>

        {/* Specialty pills */}
        <motion.div
          variants={slideUp}
          style={{
            display: "flex",
            gap: 5,
            flexWrap: "wrap",
            padding: "10px 13px",
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
          }}
        >
          {(
            [
              {
                icon: "⚡",
                label: "MERN Stack",
                color: "#a78bfa",
                bg: "rgba(167,139,250,0.08)",
                border: "rgba(167,139,250,0.2)",
              },
              {
                icon: "◉",
                label: "TypeScript",
                color: "#34d399",
                bg: "rgba(52,211,153,0.08)",
                border: "rgba(52,211,153,0.2)",
              },
              {
                icon: "✦",
                label: "Open to work",
                color: "#fbbf24",
                bg: "rgba(251,191,36,0.08)",
                border: "rgba(251,191,36,0.2)",
              },
            ] as const
          ).map((p) => (
            <div
              key={p.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: p.bg,
                border: `0.5px solid ${p.border}`,
                borderRadius: 999,
                padding: "4px 9px",
              }}
            >
              <span style={{ fontSize: 9 }}>{p.icon}</span>
              <span
                style={{
                  fontSize: 8.5,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: p.color,
                  whiteSpace: "nowrap",
                }}
              >
                {p.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Headline stat */}
        <motion.div
          variants={slideUp}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 13px",
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
          }}
        >
          <span
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: 30,
              fontWeight: 800,
              color: "#a78bfa",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            5+
          </span>
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(255,255,255,0.7)",
                fontFamily: "'Syne',sans-serif",
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              Years shipping
            </p>
            <p
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.22)",
                letterSpacing: "0.04em",
                marginTop: 2,
              }}
            >
              Full-stack · Est. 2019
            </p>
          </div>
        </motion.div>

        {/* Active projects */}
        <div style={{ padding: "13px 13px 0" }}>
          <p
            style={{
              fontSize: 8.5,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              marginBottom: 8,
            }}
          >
            Recent Projects
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 13,
            }}
          >
            {ACTIVITY_PROJECTS.map((p) => (
              <motion.div
                key={p.name}
                variants={slideUp}
                className="animate-slide-in-left"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  padding: "9px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  animationDelay: p.delay,
                  transition: "border-color 0.2s",
                }}
                whileHover={{ borderColor: "rgba(167,139,250,0.2)" }}
              >
                <span
                  className="animate-pulse-dot"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: p.color,
                    boxShadow: `0 0 6px ${p.color}88`,
                    flexShrink: 0,
                    display: "block",
                    animationDelay: p.pulseDelay,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.8)",
                      letterSpacing: "-0.01em",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.name}
                  </p>
                  <p
                    style={{
                      fontSize: 8,
                      color: "rgba(255,255,255,0.2)",
                      marginTop: 1,
                    }}
                  >
                    {p.type}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 3,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: p.color,
                      fontFamily: "'Syne',sans-serif",
                    }}
                  >
                    {p.pct}
                  </span>
                  <div
                    style={{
                      width: 44,
                      height: 2,
                      borderRadius: 1,
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="animate-bar-grow"
                      style={{
                        height: "100%",
                        width: p.pct,
                        background: p.color,
                        borderRadius: 1,
                        animationDelay: `calc(${p.delay} + 0.3s)`,
                      }}
                      role="progressbar"
                      aria-valuenow={parseInt(p.pct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Commit heatmap */}
        <div style={{ padding: "0 13px 13px" }}>
          <div
            style={{
              height: ".5px",
              background: "rgba(255,255,255,0.05)",
              marginBottom: 13,
            }}
          />
          <p
            style={{
              fontSize: 8.5,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              marginBottom: 8,
            }}
          >
            Commit Activity
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              gap: 3,
            }}
          >
            {COMMIT_GRID.map((day, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  delay: 0.6 + i * 0.018,
                  duration: 0.35,
                  ease: [0.34, 1.2, 0.64, 1],
                }}
                title={`Level ${day.level}`}
                style={{
                  height: 10,
                  borderRadius: 2,
                  background: COMMIT_COLORS[day.level],
                  transition: "background 0.2s",
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            <span
              style={{
                fontSize: 7,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.04em",
              }}
            >
              5 weeks
            </span>
            <span
              style={{
                fontSize: 7,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.04em",
              }}
            >
              today
            </span>
          </div>
        </div>

        {/* Code quality ring */}
        <div style={{ padding: "0 13px 14px" }}>
          <div
            style={{
              height: ".5px",
              background: "rgba(255,255,255,0.05)",
              marginBottom: 13,
            }}
          />
          <p
            style={{
              fontSize: 8.5,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              marginBottom: 10,
            }}
          >
            Code Quality
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              className="animate-float"
              style={{
                position: "relative",
                width: 44,
                height: 44,
                flexShrink: 0,
              }}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                style={{ transform: "rotate(-90deg)" }}
                aria-hidden="true"
              >
                <circle
                  cx="22"
                  cy="22"
                  r="14"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="3"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="14"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-spin-arc"
                  style={{ strokeDasharray: 88 }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeContent: "center",
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#a78bfa",
                }}
              >
                92%
              </div>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.8)",
                  letterSpacing: "-0.01em",
                  marginBottom: 2,
                }}
              >
                Test coverage rate
              </p>
              <p
                style={{
                  fontSize: 8.5,
                  color: "rgba(255,255,255,0.22)",
                  lineHeight: 1.5,
                }}
              >
                Avg. PR review 24h
                <br />
                Clean code · Documented
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating availability tag */}
      <motion.div
        variants={slideUp}
        style={{
          marginTop: 11,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          background: "rgba(10,5,28,0.9)",
          border: "0.5px solid rgba(167,139,250,0.2)",
          borderRadius: 999,
          padding: "8px 18px",
          backdropFilter: "blur(8px)",
        }}
      >
        <span
          className="animate-blink-dot-slow"
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 6px rgba(34,197,94,0.7)",
            display: "block",
          }}
        />
        <span
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.04em",
          }}
        >
          Available for work
        </span>
      </motion.div>
    </motion.div>
  );
};

// ─── About ────────────────────────────────────────────────────────────────────

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        #about-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          padding: 140px 0 120px;
          background: transparent;
          overflow: visible;
        }

        #about-section::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent);
          pointer-events: none;
        }

        /* ── Eyebrow ── */
        .about-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 7px 16px; border-radius: 100px;
          border: 1px solid rgba(139,92,246,0.2);
          background: rgba(5,3,15,0.5);
          backdrop-filter: blur(12px);
          font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(167,139,250,0.85); margin-bottom: 20px;
        }
        .about-eyebrow::before {
          content: ''; display: block; width: 20px; height: 1px;
          background: rgba(139,92,246,0.5);
        }

        /* ── Title ── */
        .about-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(48px, 7vw, 80px);
          line-height: 1.05; color: #fff; letter-spacing: -1.5px;
        }
        .about-title-accent {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: hueAbout 8s ease-in-out infinite;
        }
        @keyframes hueAbout { 0%,100%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(25deg)} }

        /* ── Divider ── */
        .about-divider {
          width: 64px; height: 1px; margin: 24px auto 0;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
          position: relative;
        }
        .about-divider::after {
          content: ''; position: absolute; top: -2px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 8px #a78bfa;
        }

        /* ── Story ── */
        .story-item {
          position: relative; padding-left: 24px;
          font-size: 15px; font-weight: 300;
          color: rgba(190,190,220,0.55); line-height: 1.85;
        }
        .story-dot {
          position: absolute; left: 0; top: 9px;
          width: 8px; height: 8px; border-radius: 50%;
        }
        .story-dot::after {
          content: ''; position: absolute; inset: -4px; border-radius: 50%;
          border: 1px solid currentColor; opacity: 0.25;
          animation: dotring 2s ease-in-out infinite;
        }
        @keyframes dotring { 0%,100%{transform:scale(1);opacity:.25} 50%{transform:scale(1.6);opacity:0} }

        /* ── CTA button ── */
        .about-cta {
          position: relative; display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; border-radius: 14px;
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.3);
          color: rgba(200,180,255,0.9);
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 400;
          cursor: default; overflow: hidden;
          transition: background 0.25s, border-color 0.25s, color 0.25s, transform 0.2s, box-shadow 0.25s;
          backdrop-filter: blur(12px);
        }
        .about-cta:hover {
          background: rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.6);
          color: #c4b5fd; transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(139,92,246,0.2);
        }
        .about-cta .sheen {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%);
          transform: translateX(-100%); transition: transform 0.6s ease;
        }
        .about-cta:hover .sheen { transform: translateX(100%); }

        /* ── Skill groups ── */
        .skill-group {
          padding: 20px 24px; border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(5,3,15,0.42);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: border-color 0.3s, background 0.3s;
        }
        .skill-group:hover {
          border-color: rgba(255,255,255,0.1);
          background: rgba(5,3,15,0.55);
        }
        .skill-cat-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .skill-cat-name {
          font-size: 13px; font-weight: 500;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(200,200,240,0.5);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          #about-section { padding: 100px 0 80px; }
        }
      `}</style>

      <section id="about-section" ref={sectionRef}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* ── Section header ────────────────────────────────── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{ textAlign: "center", marginBottom: 72 }}
          >
            <motion.div variants={fadeUp}>
              <div className="about-eyebrow">Get to know me</div>
            </motion.div>
            <motion.h2 className="about-title" variants={fadeUp}>
              About <span className="about-title-accent">Me</span>
            </motion.h2>
            <motion.div variants={fadeUp}>
              <div className="about-divider" />
            </motion.div>
          </motion.div>

          {/* ── Stat cards ────────────────────────────────────── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 88,
            }}
          >
            {ACHIEVEMENTS.map((a, i) => (
              <StatCard key={a.label} {...a} index={i} />
            ))}
          </motion.div>

          {/* ── Three-column body: story | skills | widget ─────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 300px",
              gap: 40,
              alignItems: "start",
            }}
            className="about-body-grid"
          >
            {/* ── Story ────────────────────────────────────────── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
            >
              <motion.h3
                variants={fadeUp}
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(26px, 3.5vw, 38px)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                  marginBottom: 32,
                }}
              >
                Five years of{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  shipping
                </span>
              </motion.h3>

              <motion.div
                variants={stagger}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  marginBottom: 40,
                }}
              >
                {STORY.map(({ accent, bold, text }, i) => (
                  <motion.div
                    key={i}
                    variants={fadeLeft}
                    className="story-item"
                  >
                    <div
                      className="story-dot"
                      style={{
                        background: accent,
                        color: accent,
                        boxShadow: `0 0 8px ${accent}`,
                      }}
                    />
                    <p>
                      With{" "}
                      <strong style={{ color: accent, fontWeight: 500 }}>
                        {bold}
                      </strong>{" "}
                      {text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Quick-fire stats row */}
              <motion.div
                variants={fadeUp}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 12,
                  marginBottom: 36,
                  padding: "16px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {(
                  [
                    {
                      icon: GitBranch,
                      value: "1.2k+",
                      label: "Commits",
                      color: "#a78bfa",
                    },
                    {
                      icon: Globe,
                      value: "8+",
                      label: "Countries",
                      color: "#60a5fa",
                    },
                    {
                      icon: Star,
                      value: "340+",
                      label: "GitHub ★",
                      color: "#fbbf24",
                    },
                  ] as const
                ).map(({ icon: Icon, value, label, color }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <Icon
                      size={14}
                      color={color}
                      style={{ margin: "0 auto 6px", display: "block" }}
                    />
                    <p
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#fff",
                        letterSpacing: "-0.03em",
                        margin: "0 0 2px",
                        background: `linear-gradient(135deg,#fff,${color})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {value}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "rgba(180,180,210,0.35)",
                        margin: 0,
                      }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <button
                  className="about-cta"
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <span className="sheen" />
                  <Rocket size={16} />
                  Let's Work Together
                  <ArrowRight size={15} style={{ opacity: 0.6 }} />
                </button>
              </motion.div>
            </motion.div>

            {/* ── Skills ───────────────────────────────────────── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
            >
              <motion.h3
                variants={fadeUp}
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(22px, 3vw, 32px)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                  marginBottom: 28,
                }}
              >
                Stack &{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    background: "linear-gradient(135deg,#34d399,#60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Tools
                </span>
              </motion.h3>

              <motion.div
                variants={stagger}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {SKILLS.map((group) => {
                  const Icon = group.icon;
                  return (
                    <motion.div
                      key={group.category}
                      variants={fadeUp}
                      className="skill-group"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 14,
                        }}
                      >
                        <div
                          className="skill-cat-icon"
                          style={{
                            background: `${group.accent}14`,
                            border: `1px solid ${group.accent}28`,
                          }}
                        >
                          <Icon size={18} color={group.accent} />
                        </div>
                        <span className="skill-cat-name">{group.category}</span>
                      </div>
                      <motion.div
                        variants={stagger}
                        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                      >
                        {group.items.map((skill) => (
                          <SkillTag
                            key={skill}
                            label={skill}
                            accent={group.accent}
                            glow={group.glow}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* ── Activity Widget ───────────────────────────────── */}
            <ActivityWidget />
          </div>

          {/* Responsive: stack columns on smaller screens */}
          <style>{`
            .about-body-grid {
              grid-template-columns: 1fr 1fr 300px;
            }
            @media (max-width: 1100px) {
              .about-body-grid {
                grid-template-columns: 1fr 1fr;
              }
              .about-body-grid > *:last-child {
                grid-column: 1 / -1;
                max-width: 360px;
                margin: 0 auto;
              }
            }
            @media (max-width: 680px) {
              .about-body-grid {
                grid-template-columns: 1fr;
              }
              .about-body-grid > *:last-child {
                grid-column: auto;
                max-width: 100%;
              }
            }
          `}</style>
        </div>
      </section>
    </>
  );
};

export default About;
