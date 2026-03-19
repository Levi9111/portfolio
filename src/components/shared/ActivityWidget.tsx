import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActivityProject {
  readonly name: string;
  readonly type: string;
  readonly pct: number; // 0-100
  readonly color: string;
  readonly animDelay: string;
  readonly pulseDelay: string;
}

interface CommitDay {
  readonly level: 0 | 1 | 2 | 3 | 4;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ACTIVITY_PROJECTS: readonly ActivityProject[] = [
  {
    name: "E-Commerce Platform",
    type: "React · Node · MongoDB",
    pct: 92,
    color: "#a78bfa",
    animDelay: "0.3s",
    pulseDelay: "0s",
  },
  {
    name: "Task Manager App",
    type: "Next.js · Socket.io",
    pct: 78,
    color: "#60a5fa",
    animDelay: "0.42s",
    pulseDelay: "0.4s",
  },
  {
    name: "Analytics Dashboard",
    type: "Next.js · Python · ML",
    pct: 65,
    color: "#34d399",
    animDelay: "0.54s",
    pulseDelay: "0.8s",
  },
  {
    name: "Auth Microservice",
    type: "Nest.js · JWT · Docker",
    pct: 100,
    color: "#fbbf24",
    animDelay: "0.66s",
    pulseDelay: "1.2s",
  },
] as const;

// 7 cols × 5 rows = 35 days
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
  1: "rgba(167,139,250,0.22)",
  2: "rgba(167,139,250,0.44)",
  3: "rgba(167,139,250,0.68)",
  4: "#a78bfa",
};

// Commit counts that cycle live (simulating new commits rolling in)
const LIVE_COMMIT_SEQUENCES: readonly number[] = [
  1247, 1248, 1249, 1250, 1251, 1252,
] as const;

// ─── LiveClock ────────────────────────────────────────────────────────────────

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
    <span
      style={{ fontFamily: "'DM Sans', monospace", letterSpacing: "0.05em" }}
    >
      {hh}
      <span
        style={{
          animation: "widgetColonBlink 1s step-end infinite",
          color: "#a78bfa",
        }}
      >
        :
      </span>
      {mm}
      <span
        style={{
          animation: "widgetColonBlink 1s step-end infinite",
          color: "#a78bfa",
        }}
      >
        :
      </span>
      {ss}
    </span>
  );
};

// ─── LiveCommitCount ──────────────────────────────────────────────────────────
// Ticks up every 8–14 seconds to simulate a new commit landing

const LiveCommitCount: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const bump = () => {
      setFlash(true);
      setIdx((i) => (i + 1) % LIVE_COMMIT_SEQUENCES.length);
      setTimeout(() => setFlash(false), 600);
      // Schedule next random bump 8-14s later
      setTimeout(bump, 8000 + Math.random() * 6000);
    };
    const first = setTimeout(bump, 9000 + Math.random() * 5000);
    return () => clearTimeout(first);
  }, []);

  return (
    <span
      style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 18,
        fontWeight: 800,
        color: flash ? "#34d399" : "#fff",
        letterSpacing: "-0.03em",
        transition: "color 0.3s",
        background: flash ? "none" : "linear-gradient(135deg,#fff,#a78bfa)",
        WebkitBackgroundClip: flash ? undefined : "text",
        WebkitTextFillColor: flash ? undefined : "transparent",
        backgroundClip: flash ? undefined : "text",
      }}
    >
      {LIVE_COMMIT_SEQUENCES[idx]}+
    </span>
  );
};

// ─── LiveProjectBar ───────────────────────────────────────────────────────────
// Each project bar subtly animates its width ±2% around its base value

interface LiveBarProps {
  project: ActivityProject;
  visible: boolean;
}

const LiveProjectBar: React.FC<LiveBarProps> = ({ project, visible }) => {
  const [pct, setPct] = useState(project.pct);
  const [isUpdating, setIsUpdating] = useState(false);

  // Only the in-progress ones drift slightly
  useEffect(() => {
    if (project.pct >= 100) return;
    const drift = () => {
      setIsUpdating(true);
      const delta = (Math.random() - 0.3) * 1.5; // slight upward bias
      setPct((p) => Math.min(99, Math.max(project.pct - 2, p + delta)));
      setTimeout(() => setIsUpdating(false), 400);
      setTimeout(drift, 5000 + Math.random() * 7000);
    };
    const t = setTimeout(drift, 3000 + Math.random() * 4000);
    return () => clearTimeout(t);
  }, [project.pct]);

  return (
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
          color: isUpdating ? "#34d399" : project.color,
          fontFamily: "'Syne', sans-serif",
          transition: "color 0.3s",
        }}
      >
        {project.pct >= 100 ? "100%" : `${Math.round(pct)}%`}
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
          className={visible ? "animate-bar-grow" : ""}
          style={{
            height: "100%",
            width: `${project.pct >= 100 ? 100 : pct}%`,
            background: isUpdating
              ? "linear-gradient(to right, #34d399, " + project.color + ")"
              : project.color,
            borderRadius: 1,
            animationDelay: `calc(${project.animDelay} + 0.3s)`,
            transition:
              "width 0.8s cubic-bezier(0.34,1.2,0.64,1), background 0.3s",
          }}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${project.name} progress`}
        />
      </div>
    </div>
  );
};

// ─── LiveHeatmap ──────────────────────────────────────────────────────────────
// One random cell pulses brighter every few seconds (new commit lands)

const LiveHeatmap: React.FC<{ inView: boolean }> = ({ inView }) => {
  const [grid, setGrid] = useState([...COMMIT_GRID]);
  const [flashCell, setFlashCell] = useState<number | null>(null);

  useEffect(() => {
    const bump = () => {
      // Pick a non-zero cell and bump it slightly
      const idx = Math.floor(Math.random() * grid.length);
      setFlashCell(idx);
      setGrid((g) => {
        const next = [...g] as typeof grid;
        const cur = next[idx].level;
        next[idx] = {
          level: Math.min(4, cur < 4 ? cur + 1 : cur) as 0 | 1 | 2 | 3 | 4,
        };
        return next;
      });
      setTimeout(() => setFlashCell(null), 800);
      setTimeout(bump, 4000 + Math.random() * 5000);
    };
    const t = setTimeout(bump, 5000 + Math.random() * 3000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}
      aria-label="Commit activity heatmap"
    >
      {grid.map((day, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            inView
              ? {
                  opacity: 1,
                  scale: flashCell === i ? 1.3 : 1,
                  background:
                    flashCell === i ? "#34d399" : COMMIT_COLORS[day.level],
                }
              : {}
          }
          transition={
            flashCell === i
              ? { duration: 0.25, ease: "easeOut" }
              : {
                  delay: 0.6 + i * 0.018,
                  duration: 0.35,
                  ease: [0.34, 1.2, 0.64, 1],
                }
          }
          title={`Commits level ${day.level}`}
          style={{ height: 10, borderRadius: 2 }}
        />
      ))}
    </div>
  );
};

// ─── LiveCodeRing ─────────────────────────────────────────────────────────────
// The code quality ring counts up to 92% on mount then animates

const LiveCodeRing: React.FC<{ inView: boolean }> = ({ inView }) => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const target = 92;
    let current = 0;
    const step = () => {
      current += 1 + Math.random() * 2;
      if (current >= target) {
        setPct(target);
        return;
      }
      setPct(Math.floor(current));
      setTimeout(step, 30);
    };
    const t = setTimeout(step, 800);
    return () => clearTimeout(t);
  }, [inView]);

  // arc = circumference * (pct/100), circumference ≈ 88
  const dash = (pct / 100) * 88;

  return (
    <div
      className="animate-float"
      style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}
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
          style={{
            strokeDasharray: 88,
            strokeDashoffset: 88 - dash,
            transition: "stroke-dashoffset 0.3s ease",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeContent: "center",
          fontFamily: "'Syne', sans-serif",
          fontSize: 11,
          fontWeight: 800,
          color: "#a78bfa",
        }}
        aria-label={`${pct}% test coverage`}
      >
        {pct}%
      </div>
    </div>
  );
};

// ─── ActivityWidget ───────────────────────────────────────────────────────────

const ActivityWidget: React.FC = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const inView = useInView(widgetRef, { once: true, margin: "-5%" });

  // "Currently working on" text cycles through project names
  const [workingIdx, setWorkingIdx] = useState(0);
  const [workingVisible, setWorkingVisible] = useState(true);

  useEffect(() => {
    const cycle = () => {
      setWorkingVisible(false);
      setTimeout(() => {
        setWorkingIdx((i) => (i + 1) % ACTIVITY_PROJECTS.length);
        setWorkingVisible(true);
      }, 350);
      setTimeout(cycle, 4500);
    };
    const t = setTimeout(cycle, 4500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      ref={widgetRef}
      variants={{
        hidden: { opacity: 0, x: 28, filter: "blur(4px)" },
        show: {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="w-full"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @keyframes widgetColonBlink { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes statusPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        @keyframes connPulse { 0%,100%{opacity:.3} 50%{opacity:.9} }
      `}</style>

      {/* ── Card ── */}
      <div
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "0.5px solid rgba(167,139,250,0.18)",
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Radial top highlight */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at 65% 0%, rgba(120,80,255,0.1), transparent 65%)",
          }}
          aria-hidden="true"
        />

        {/* ── Chrome bar ── */}
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
              aria-hidden="true"
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
          {/* Live clock */}
          <span
            style={{
              fontSize: 8,
              color: "rgba(200,200,240,0.35)",
              marginRight: 8,
            }}
          >
            <LiveClock />
          </span>
          {/* Active pill */}
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
              aria-hidden="true"
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

        {/* ── Identity strip ── */}
        <div
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
            aria-hidden="true"
          >
            S
          </div>
          <div
            style={{
              width: 14,
              height: 1,
              background: "linear-gradient(to right,#a78bfa,#34d399)",
              flexShrink: 0,
              animation: "connPulse 2s ease-in-out infinite",
            }}
            aria-hidden="true"
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
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#22c55e",
              flexShrink: 0,
              boxShadow: "0 0 5px rgba(34,197,94,0.6)",
              display: "block",
              animation: "statusPulse 2s ease-in-out infinite",
            }}
            aria-label="Online"
          />
        </div>

        {/* ── "Currently working on" live ticker ── */}
        <div
          style={{
            padding: "8px 13px",
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            minHeight: 34,
          }}
        >
          <span
            style={{
              fontSize: 8,
              color: "rgba(200,200,240,0.3)",
              letterSpacing: "0.05em",
              flexShrink: 0,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Working on
          </span>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div
              style={{
                opacity: workingVisible ? 1 : 0,
                transform: workingVisible
                  ? "translateY(0)"
                  : "translateY(-4px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: ACTIVITY_PROJECTS[workingIdx].color,
                  fontFamily: "'Syne',sans-serif",
                  letterSpacing: "-0.01em",
                }}
              >
                {ACTIVITY_PROJECTS[workingIdx].name}
              </span>
            </div>
          </div>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: ACTIVITY_PROJECTS[workingIdx].color,
              flexShrink: 0,
              boxShadow: `0 0 6px ${ACTIVITY_PROJECTS[workingIdx].color}`,
              transition: "background 0.3s, box-shadow 0.3s",
              animation: "statusPulse 1.8s ease-in-out infinite",
            }}
            aria-hidden="true"
          />
        </div>

        {/* ── Specialty pills ── */}
        <div
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
              <span style={{ fontSize: 9 }} aria-hidden="true">
                {p.icon}
              </span>
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
        </div>

        {/* ── Headline stat with live commit counter ── */}
        <div
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
          <div style={{ flex: 1 }}>
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
          {/* Live commit count */}
          <div style={{ textAlign: "right" }}>
            <LiveCommitCount />
            <p
              style={{
                fontSize: 8,
                color: "rgba(255,255,255,0.22)",
                marginTop: 1,
                letterSpacing: "0.04em",
              }}
            >
              commits
            </p>
          </div>
        </div>

        {/* ── Active projects ── */}
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
                className="animate-slide-in-left"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  padding: "9px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  animationDelay: p.animDelay,
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
                  aria-hidden="true"
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
                <LiveProjectBar project={p} visible={inView} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Commit heatmap ── */}
        <div style={{ padding: "0 13px 13px" }}>
          <div
            style={{
              height: ".5px",
              background: "rgba(255,255,255,0.05)",
              marginBottom: 13,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <p
              style={{
                fontSize: 8.5,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
                margin: 0,
              }}
            >
              Commit Activity
            </p>
            <span
              style={{
                fontSize: 8,
                color: "rgba(52,211,153,0.6)",
                fontFamily: "'DM Sans',sans-serif",
                letterSpacing: "0.5px",
              }}
            >
              Live
            </span>
          </div>
          <LiveHeatmap inView={inView} />
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
              5 weeks ago
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

        {/* ── Code quality ring (counts up on mount) ── */}
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
            <LiveCodeRing inView={inView} />
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

      {/* ── Floating availability tag ── */}
      <div
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
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 6px rgba(34,197,94,0.7)",
            display: "block",
            animation: "statusPulse 2s ease-in-out infinite",
          }}
          aria-hidden="true"
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
      </div>
    </motion.div>
  );
};

export default ActivityWidget;
