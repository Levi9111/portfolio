import React, { useRef, useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  readonly name: string;
  readonly type: string;
  readonly pct: number;
  readonly color: string;
  readonly animDelay: string;
  readonly pulsDelay: string;
}

interface TechPill {
  readonly icon: string;
  readonly label: string;
  readonly color: string;
  readonly bgAlpha: string;
  readonly borderAlpha: string;
}

interface Commit {
  readonly hash: string;
  readonly msg: string;
  readonly branch: string;
  readonly color: string;
  readonly time: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS: readonly Project[] = [
  {
    name: "E-Commerce Platform",
    type: "React · Node · MongoDB",
    pct: 87,
    color: "#a78bfa",
    animDelay: "0.3s",
    pulsDelay: "0s",
  },
  {
    name: "Task Manager App",
    type: "Next.js · Socket.io",
    pct: 64,
    color: "#f472b6",
    animDelay: "0.4s",
    pulsDelay: "0.4s",
  },
  {
    name: "Weather Dashboard",
    type: "React · D3.js · API",
    pct: 95,
    color: "#34d399",
    animDelay: "0.5s",
    pulsDelay: "0.8s",
  },
  {
    name: "Analytics Platform",
    type: "Next.js · Python · ML",
    pct: 42,
    color: "#fbbf24",
    animDelay: "0.6s",
    pulsDelay: "1.2s",
  },
] as const;

const TECH_PILLS: readonly TechPill[] = [
  {
    icon: "⚡",
    label: "MERN Stack",
    color: "#a78bfa",
    bgAlpha: "rgba(167,139,250,0.08)",
    borderAlpha: "rgba(167,139,250,0.2)",
  },
  {
    icon: "◉",
    label: "TypeScript",
    color: "#34d399",
    bgAlpha: "rgba(52,211,153,0.08)",
    borderAlpha: "rgba(52,211,153,0.2)",
  },
  {
    icon: "✦",
    label: "Open to work",
    color: "#fbbf24",
    bgAlpha: "rgba(251,191,36,0.08)",
    borderAlpha: "rgba(251,191,36,0.2)",
  },
] as const;

const COMMITS: readonly Commit[] = [
  {
    hash: "a3f9c12",
    msg: "feat: add auth middleware",
    branch: "main",
    color: "#34d399",
    time: "just now",
  },
  {
    hash: "b7e2d45",
    msg: "fix: resolve CORS on /api/v2",
    branch: "hotfix",
    color: "#f472b6",
    time: "1m ago",
  },
  {
    hash: "c1a8f67",
    msg: "perf: lazy load dashboard chunks",
    branch: "main",
    color: "#34d399",
    time: "3m ago",
  },
  {
    hash: "d4b3e90",
    msg: "feat: stripe webhook handler",
    branch: "feature",
    color: "#a78bfa",
    time: "6m ago",
  },
  {
    hash: "e9c5a23",
    msg: "chore: upgrade Next.js 14",
    branch: "main",
    color: "#34d399",
    time: "12m ago",
  },
  {
    hash: "f2d7b56",
    msg: "test: unit tests for auth module",
    branch: "test",
    color: "#fbbf24",
    time: "18m ago",
  },
  {
    hash: "g6e1c89",
    msg: "fix: mobile nav z-index overflow",
    branch: "hotfix",
    color: "#f472b6",
    time: "24m ago",
  },
  {
    hash: "h8a4d12",
    msg: "feat: real-time notifications",
    branch: "feature",
    color: "#a78bfa",
    time: "31m ago",
  },
] as const;

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView(
  threshold = 0.15,
): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, seen];
}

function useCommitStream(seen: boolean, intervalMs = 2400): Commit[] {
  const [visible, setVisible] = useState<Commit[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [idx, setIdx] = useState(0);

  // Seed first 2 on reveal
  useEffect(() => {
    if (!seen) return;
    setVisible([...COMMITS].slice(0, 2));
    setIdx(2);
  }, [seen]);

  // Rotate one commit in every interval
  useEffect(() => {
    if (!seen) return;
    const t = setInterval(() => {
      setIdx((i) => {
        const next = i % COMMITS.length;
        setVisible((prev) => [COMMITS[next], ...prev].slice(0, 4));
        return next + 1;
      });
    }, intervalMs);
    return () => clearInterval(t);
  }, [seen, intervalMs]);

  return visible;
}

function useTypewriter(
  text: string,
  seen: boolean,
  speed = 40,
  startDelay = 700,
): string {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!seen) return;
    let i = 0;
    setDisplay("");
    const delay = setTimeout(() => {
      const timer = setInterval(() => {
        i++;
        setDisplay(text.slice(0, i));
        if (i >= text.length) clearInterval(timer);
      }, speed);
      return () => clearInterval(timer);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, seen, speed, startDelay]);

  return display;
}

// Count-up number hook
function useCountUp(
  target: number,
  seen: boolean,
  duration = 1200,
  delay = 400,
): number {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!seen) return;
    let raf: number;
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        setVal(Math.round(eased * target));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [target, seen, duration, delay]);

  return val;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const LivePill: React.FC = () => (
  <div
    className="flex items-center gap-1 rounded-full px-2 py-0.5"
    style={{
      background: "rgba(34,197,94,0.1)",
      border: "0.5px solid rgba(34,197,94,0.25)",
    }}
  >
    <span
      className="w-1.5 h-1.5 rounded-full bg-green-400 animate-blink-dot"
      aria-hidden="true"
    />
    <span
      className="text-green-400 font-semibold tracking-widest"
      style={{ fontSize: 8, fontFamily: "'DM Sans', sans-serif" }}
    >
      Active
    </span>
  </div>
);

// ─── ProjectRow ───────────────────────────────────────────────────────────────

interface ProjectRowProps {
  project: Project;
  seen: boolean;
  barDelay: string;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, seen, barDelay }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="animate-slide-in-left flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all duration-200"
      style={{
        background: hovered ? `${project.color}0d` : "rgba(255,255,255,0.03)",
        border: `0.5px solid ${hovered ? project.color + "33" : "rgba(255,255,255,0.06)"}`,
        animationDelay: project.animDelay,
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pulsing dot */}
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse-dot"
        style={{
          background: project.color,
          boxShadow: `0 0 6px ${project.color}88`,
          animationDelay: project.pulsDelay,
        }}
        aria-hidden="true"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="truncate font-bold text-white/80"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 10.5,
            letterSpacing: "-0.01em",
          }}
        >
          {project.name}
        </p>
        <p
          className="text-white/20 mt-px"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8 }}
        >
          {project.type}
        </p>
      </div>

      {/* Percentage + bar */}
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span
          className="font-bold"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 9,
            color: project.color,
          }}
        >
          {project.pct}%
        </span>
        <div
          className="w-11 h-0.5 rounded-sm overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {seen && (
            <div
              className="h-full rounded-sm animate-bar-grow"
              style={{
                width: `${project.pct}%`,
                background: project.color,
                animationDelay: barDelay,
              }}
              role="progressbar"
              aria-valuenow={project.pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${project.name} progress`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ─── CommitRow ────────────────────────────────────────────────────────────────

interface CommitRowProps {
  commit: Commit;
  isNew: boolean;
}

const CommitRow: React.FC<CommitRowProps> = ({ commit, isNew }) => (
  <div
    className="flex items-start gap-2 px-2 py-1.5 rounded-md transition-all duration-150"
    style={{
      animation: isNew
        ? "slideInLeft 0.35s cubic-bezier(0.34,1.2,0.64,1) both"
        : "none",
      background: isNew ? `${commit.color}08` : "transparent",
      border: `0.5px solid ${isNew ? commit.color + "20" : "transparent"}`,
    }}
  >
    {/* Branch color pip */}
    <span
      className="w-1.5 h-1.5 rounded-full shrink-0 mt-1"
      style={{
        background: commit.color,
        boxShadow: `0 0 5px ${commit.color}66`,
      }}
      aria-hidden="true"
    />
    <div className="flex-1 min-w-0">
      <p
        className="text-white/70 truncate"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 8.5,
          letterSpacing: "0.01em",
        }}
      >
        {commit.msg}
      </p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 7.5,
            color: commit.color,
            fontWeight: 600,
          }}
        >
          {commit.branch}
        </span>
        <span
          className="text-white/20"
          style={{ fontSize: 7.5, fontFamily: "'DM Sans', sans-serif" }}
        >
          · {commit.hash} · {commit.time}
        </span>
      </div>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const DevDashboard: React.FC = () => {
  const [ref, seen] = useInView(0.15);
  const commits = useCommitStream(seen, 2400);
  const prevLen = useRef(0);
  const years = useCountUp(2, seen, 900, 500);
  const quality = useCountUp(92, seen, 1100, 700);

  // Terminal title typewriter
  const termText = useTypewriter("shanjid@studio:~/projects", seen, 42, 300);

  // Cursor blink after typewriter finishes
  const [showCursor, setShowCursor] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    prevLen.current = commits.length;
  }, [commits.length]);

  // Arc stroke offset: 88 = 0%, 7 = 92%
  const arcOffset = seen ? 7 : 88;

  return (
    <div
      ref={ref}
      className="w-[270px] shrink-0 relative z-[2] animate-fade-up max-md:w-full max-md:max-w-[340px] max-md:mx-auto"
      style={{ animationDelay: "0.1s" }}
    >
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "0.5px solid rgba(167,139,250,0.18)",
        }}
      >
        {/* Inner radial highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 60% 0%, rgba(120,80,255,0.1) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        {/* Subtle scan line */}
        {seen && (
          <div
            className="absolute left-0 right-0 h-px pointer-events-none z-10 animate-scan-x"
            style={{ background: "rgba(167,139,250,0.3)", top: "0%" }}
            aria-hidden="true"
          />
        )}

        {/* ── Chrome ─────────────────────────────────────────── */}
        <div
          className="flex items-center gap-1.5 px-3.5 py-2.5"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full opacity-70 bg-[#ff5f57]"
            aria-hidden="true"
          />
          <span
            className="w-1.5 h-1.5 rounded-full opacity-70 bg-[#ffbd2e]"
            aria-hidden="true"
          />
          <span
            className="w-1.5 h-1.5 rounded-full opacity-70 bg-[#28c840]"
            aria-hidden="true"
          />
          {/* Typewriter terminal title */}
          <span
            className="ml-1.5 font-semibold text-white/25"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 8.5,
              letterSpacing: "0.02em",
            }}
          >
            {termText}
            <span
              className="inline-block w-0.5 h-3 align-middle ml-px"
              style={{
                background: "rgba(167,139,250,0.7)",
                opacity: showCursor ? 1 : 0,
                transition: "opacity 0.1s",
              }}
              aria-hidden="true"
            />
          </span>
          <div className="flex-1" />
          <LivePill />
        </div>

        {/* ── Developer strip ─────────────────────────────────── */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-2.5 animate-fade-up-sm"
          style={{
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
            animationDelay: "0.15s",
          }}
        >
          <div
            className="w-[26px] h-[26px] rounded-full shrink-0 grid place-content-center text-white font-black"
            style={{
              background: "linear-gradient(135deg,#34d399,#059669)",
              border: "1.5px solid #0a0a0f",
              fontSize: 9,
              boxShadow: "0 0 0 1px rgba(52,211,153,0.4)",
            }}
            aria-label="Shanjid's avatar"
          >
            S
          </div>

          {/* Animated connector — pulses between green and purple */}
          <div
            className="w-4 h-px shrink-0 animate-connector-pulse"
            style={{ background: "linear-gradient(to right,#34d399,#a78bfa)" }}
            aria-hidden="true"
          />

          <div className="flex-1">
            <p
              className="font-semibold tracking-[0.05em] text-white/55"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8.5 }}
            >
              Full-Stack Developer
            </p>
            <p
              className="text-white/20 tracking-[0.03em] mt-px"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7.5 }}
            >
              MERN · TypeScript · Next.js
            </p>
          </div>

          <span
            className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0 animate-blink-dot-slow"
            style={{ boxShadow: "0 0 5px rgba(34,197,94,0.6)" }}
            aria-label="Currently online"
          />
        </div>

        {/* ── Tech pills ──────────────────────────────────────── */}
        <div
          className="flex flex-wrap gap-1.5 px-3.5 py-2.5 animate-fade-up-sm"
          style={{
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
            animationDelay: "0.2s",
          }}
        >
          {TECH_PILLS.map((pill, i) => (
            <div
              key={pill.label}
              className="flex items-center gap-1 rounded-full px-2 py-1 animate-fade-up-sm"
              style={{
                background: pill.bgAlpha,
                border: `0.5px solid ${pill.borderAlpha}`,
                animationDelay: `${0.22 + i * 0.07}s`,
              }}
            >
              <span className="text-[9px]" aria-hidden="true">
                {pill.icon}
              </span>
              <span
                className="font-semibold tracking-[0.04em] whitespace-nowrap"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 8.5,
                  color: pill.color,
                }}
              >
                {pill.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Stat strip — count-up ───────────────────────────── */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-3 animate-count-tick"
          style={{
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
            animationDelay: "0.3s",
          }}
        >
          <span
            className="text-[#a78bfa] font-black leading-none"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 30,
              letterSpacing: "-0.04em",
            }}
            aria-label={`${years} plus years`}
          >
            {years}+
          </span>
          <div>
            <p
              className="font-bold text-white/70"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 11,
                letterSpacing: "-0.01em",
              }}
            >
              Years shipping
            </p>
            <p
              className="text-white/[0.22] tracking-[0.04em] mt-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9 }}
            >
              Full-stack · Est. 2022
            </p>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────── */}
        <div className="p-3.5">
          {/* Active projects */}
          <p
            className="font-semibold tracking-[0.1em] uppercase text-white/20 mb-2"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8.5 }}
          >
            Active Projects
          </p>

          <div className="flex flex-col gap-1.5 mb-3.5">
            {PROJECTS.map((project) => (
              <ProjectRow
                key={project.name}
                project={project}
                seen={seen}
                barDelay={`calc(${project.animDelay} + 0.3s)`}
              />
            ))}
          </div>

          {/* Divider */}
          <div
            className="h-px mb-3.5"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />

          {/* Live commit stream */}
          <div className="flex items-center justify-between mb-2">
            <p
              className="font-semibold tracking-[0.1em] uppercase text-white/20"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8.5 }}
            >
              Recent Commits
            </p>
            <div
              className="flex items-center gap-1 rounded-full px-1.5 py-0.5"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "0.5px solid rgba(34,197,94,0.2)",
              }}
            >
              <span
                className="w-1 h-1 rounded-full bg-green-400 animate-blink-dot"
                aria-hidden="true"
              />
              <span
                className="text-green-400"
                style={{
                  fontSize: 7,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                }}
              >
                LIVE
              </span>
            </div>
          </div>

          <div
            className="flex flex-col gap-0.5 mb-3.5"
            style={{ minHeight: 80 }}
          >
            {commits.map((commit, i) => (
              <CommitRow
                key={`${commit.hash}-${i}`}
                commit={commit}
                isNew={i === 0}
              />
            ))}
          </div>

          {/* Divider */}
          <div
            className="h-px mb-3.5"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />

          {/* Code quality arc — count-up + animated arc */}
          <p
            className="font-semibold tracking-[0.1em] uppercase text-white/20 mb-2"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8.5 }}
          >
            Code Quality
          </p>

          <div
            className="flex items-center gap-3 animate-fade-up-sm"
            style={{ animationDelay: "0.9s" }}
          >
            {/* Animated ring */}
            <div
              className="relative w-11 h-11 shrink-0 animate-float"
              aria-hidden="true"
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                style={{ transform: "rotate(-90deg)" }}
              >
                {/* Track */}
                <circle
                  cx="22"
                  cy="22"
                  r="14"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="3"
                />
                {/* Fill arc — transitions stroke-dashoffset on seen */}
                <circle
                  cx="22"
                  cy="22"
                  r="14"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="88"
                  strokeDashoffset={arcOffset}
                  style={{
                    transition: seen
                      ? "stroke-dashoffset 1.4s 0.9s cubic-bezier(0.34,1.1,0.64,1)"
                      : "none",
                  }}
                />
              </svg>
              {/* Count-up number in centre */}
              <div
                className="absolute inset-0 grid place-content-center font-black text-[#a78bfa]"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: 11 }}
                aria-label={`${quality} percent test coverage`}
              >
                {quality}%
              </div>
            </div>

            {/* Text */}
            <div>
              <p
                className="font-bold text-white/80 mb-0.5"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 11,
                  letterSpacing: "-0.01em",
                }}
              >
                Test coverage rate
              </p>
              <p
                className="text-white/[0.22] leading-[1.5]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8.5 }}
              >
                Avg. PR review 24h
                <br />
                Clean code · Documented
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevDashboard;
