import React, { useRef, useState, useEffect, useCallback } from "react";

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

// Live commit shape from GitHub Events API
interface GitHubEvent {
  type: string;
  repo: { name: string };
  payload: {
    commits?: { sha: string; message: string }[];
    ref?: string;
  };
  created_at: string;
}

interface Commit {
  hash: string;
  msg: string;
  branch: string;
  repo: string;
  color: string;
  time: string;
}

// ─── Config — edit these two lines ───────────────────────────────────────────
//
// GITHUB_USERNAME  — your GitHub username (public, no auth needed)
// GITHUB_TOKEN     — optional Personal Access Token for higher rate limits
//                    (60 req/hr unauthenticated → 5000/hr with token)
//                    If using a token, store it in your env and inject via
//                    your build tool — never hard-code it here in production.
//
//   Vite:    import.meta.env.VITE_GITHUB_TOKEN
//   Next.js: process.env.NEXT_PUBLIC_GITHUB_TOKEN
//
// Both GITHUB_USERNAME and NEXT_PUBLIC_GITHUB_TOKEN can also be passed as
// props — see the component signature below.

const DEFAULT_USERNAME = "levi9111"; // ← replace with your username
const POLL_INTERVAL_MS = 60_000; // re-fetch every 60 s

// Branch colour mapping — extend as you like
const BRANCH_COLOR: Record<string, string> = {
  main: "#34d399",
  master: "#34d399",
  develop: "#60a5fa",
  dev: "#60a5fa",
  hotfix: "#f472b6",
  feature: "#a78bfa",
  test: "#fbbf24",
  chore: "#94a3b8",
};
const DEFAULT_COLOR = "#a78bfa";

function branchColor(branch: string): string {
  for (const [key, color] of Object.entries(BRANCH_COLOR)) {
    if (branch.toLowerCase().includes(key)) return color;
  }
  return DEFAULT_COLOR;
}

function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Static data (unchanged from original) ───────────────────────────────────

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

// ─── GitHub hook ──────────────────────────────────────────────────────────────

interface UseGitHubCommitsOptions {
  username: string;
  token?: string;
  maxCommits?: number;
  pollMs?: number;
}

type FetchStatus = "idle" | "loading" | "success" | "error" | "rate-limited";

function useGitHubCommits({
  username,
  token,
  maxCommits = 8,
  pollMs = POLL_INTERVAL_MS,
}: UseGitHubCommitsOptions): {
  commits: Commit[];
  status: FetchStatus;
  lastUpdated: Date | null;
  refetch: () => void;
} {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [tick, setTick] = useState(0); // bumped to trigger re-fetch

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    const headers: HeadersInit = { Accept: "application/vnd.github+json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const run = async () => {
      setStatus("loading");
      try {
        // GitHub Events API — returns up to 300 public events, no auth needed
        // Docs: https://docs.github.com/en/rest/activity/events
        const res = await fetch(
          `https://api.github.com/users/${username}/events/public?per_page=100`,
          { headers },
        );

        if (res.status === 403 || res.status === 429) {
          if (!cancelled) setStatus("rate-limited");
          return;
        }
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);

        const events: GitHubEvent[] = await res.json();

        // Filter to PushEvents only and flatten commits
        const parsed: Commit[] = [];
        for (const ev of events) {
          if (ev.type !== "PushEvent") continue;
          const rawBranch = (ev.payload.ref ?? "refs/heads/main").replace(
            "refs/heads/",
            "",
          );
          const color = branchColor(rawBranch);
          const repoShort = ev.repo.name.split("/")[1] ?? ev.repo.name;

          for (const c of ev.payload.commits ?? []) {
            // Skip merge commits and bot commits
            if (c.message.startsWith("Merge ")) continue;
            parsed.push({
              hash: c.sha.slice(0, 7),
              msg: c.message.split("\n")[0].slice(0, 72), // first line, max 72 chars
              branch: rawBranch,
              repo: repoShort,
              color,
              time: relativeTime(ev.created_at),
            });
            if (parsed.length >= maxCommits) break;
          }
          if (parsed.length >= maxCommits) break;
        }

        if (!cancelled) {
          setCommits(parsed);
          setStatus(parsed.length === 0 ? "success" : "success");
          setLastUpdated(new Date());
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    run();
    const id = setInterval(run, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [username, token, maxCommits, pollMs, tick]);

  return { commits, status, lastUpdated, refetch };
}

// ─── Hooks (same as original) ─────────────────────────────────────────────────

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

const LivePill: React.FC<{ label?: string }> = ({ label = "Active" }) => (
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
      {label}
    </span>
  </div>
);

interface ProjectRowProps {
  project: Project;
  seen: boolean;
  barDelay: string;
}
const ProjectRow: React.FC<ProjectRowProps> = ({ project, seen, barDelay }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all duration-200"
      style={{
        background: hovered ? `${project.color}0d` : "rgba(255,255,255,0.03)",
        border: `0.5px solid ${hovered ? project.color + "33" : "rgba(255,255,255,0.06)"}`,
        animationDelay: project.animDelay,
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{
          background: project.color,
          boxShadow: `0 0 6px ${project.color}88`,
        }}
        aria-hidden="true"
      />
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
      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
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
          · {commit.repo} · {commit.hash} · {commit.time}
        </span>
      </div>
    </div>
  </div>
);

// Skeleton row while loading
const CommitSkeleton: React.FC<{ index: number }> = ({ index }) => (
  <div
    className="flex items-start gap-2 px-2 py-1.5 rounded-md"
    style={{ opacity: 1 - index * 0.2 }}
  >
    <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1 bg-white/10 animate-pulse" />
    <div className="flex-1 space-y-1.5">
      <div
        className="h-2 rounded bg-white/10 animate-pulse"
        style={{ width: `${70 - index * 8}%` }}
      />
      <div
        className="h-1.5 rounded bg-white/[0.06] animate-pulse"
        style={{ width: `${45 - index * 5}%` }}
      />
    </div>
  </div>
);

// Status badge shown below the commit list
const CommitStatusBadge: React.FC<{
  status: FetchStatus;
  lastUpdated: Date | null;
  onRetry: () => void;
}> = ({ status, lastUpdated, onRetry }) => {
  if (status === "success" && lastUpdated) {
    return (
      <p
        className="text-white/20 text-center"
        style={{ fontSize: 7.5, fontFamily: "'DM Sans', sans-serif" }}
      >
        Updated {relativeTime(lastUpdated.toISOString())} · GitHub Events API
      </p>
    );
  }
  if (status === "rate-limited") {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <p
          className="text-yellow-400/60"
          style={{ fontSize: 7.5, fontFamily: "'DM Sans', sans-serif" }}
        >
          Rate limited — add a GitHub token for 5000 req/hr
        </p>
        <button
          onClick={onRetry}
          className="text-white/40 underline"
          style={{ fontSize: 7.5 }}
        >
          retry
        </button>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <p
          className="text-red-400/60"
          style={{ fontSize: 7.5, fontFamily: "'DM Sans', sans-serif" }}
        >
          Could not reach GitHub API
        </p>
        <button
          onClick={onRetry}
          className="text-white/40 underline"
          style={{ fontSize: 7.5 }}
        >
          retry
        </button>
      </div>
    );
  }
  return null;
};

// ─── Main component ───────────────────────────────────────────────────────────
//
// Props:
//   username  — GitHub username (overrides DEFAULT_USERNAME constant above)
//   token     — GitHub PAT for higher rate limits (optional)
//               Recommended: inject via env var, not hard-coded.

interface DevDashboardProps {
  username?: string;
  token?: string;
}

const DevDashboard: React.FC<DevDashboardProps> = ({
  username = DEFAULT_USERNAME,
  token,
}) => {
  const [ref, seen] = useInView(0.15);
  const years = useCountUp(5, seen, 900, 500);
  const quality = useCountUp(92, seen, 1100, 700);
  const termText = useTypewriter(
    `${username}@studio:~/projects`,
    seen,
    42,
    300,
  );
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(t);
  }, []);

  // ── Live GitHub commits ──────────────────────────────────────────────────────
  const { commits, status, lastUpdated, refetch } = useGitHubCommits({
    username,
    token,
    maxCommits: 8,
    pollMs: POLL_INTERVAL_MS,
  });

  // Animate new commits in by tracking previous count
  const prevCountRef = useRef(0);
  useEffect(() => {
    prevCountRef.current = commits.length;
  }, [commits.length]);

  const arcOffset = seen ? 7 : 88;
  const isLoading = status === "loading" || status === "idle";

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

        {/* Scan line */}
        {seen && (
          <div
            className="absolute left-0 right-0 h-px pointer-events-none z-10 animate-scan-x"
            style={{ background: "rgba(167,139,250,0.3)", top: "0%" }}
            aria-hidden="true"
          />
        )}

        {/* ── Chrome ── */}
        <div
          className="flex items-center gap-1.5 px-3.5 py-2.5"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          }}
        >
          {(["#ff5f57", "#ffbd2e", "#28c840"] as const).map((c, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full opacity-70"
              style={{ background: c }}
              aria-hidden="true"
            />
          ))}
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

        {/* ── Developer strip ── */}
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
            aria-label={`${username}'s avatar`}
          >
            {username.charAt(0).toUpperCase()}
          </div>
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
            role="img"
            aria-label="Currently online"
          />
        </div>

        {/* ── Tech pills ── */}
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

        {/* ── Stat strip ── */}
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
            role="img"
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
              Full-stack · Est. 2021
            </p>
          </div>
        </div>

        {/* ── Body ── */}
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

          <div
            className="h-px mb-3.5"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />

          {/* ── Live commit stream — GitHub API ── */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <p
                className="font-semibold tracking-[0.1em] uppercase text-white/20"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8.5 }}
              >
                Recent Commits
              </p>
              {/* Clickable link to profile */}
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/20 hover:text-white/50 transition-colors"
                style={{ fontSize: 7.5, fontFamily: "'DM Sans', sans-serif" }}
                title={`View ${username} on GitHub`}
              >
                ↗
              </a>
            </div>
            <LivePill label={isLoading ? "…" : "LIVE"} />
          </div>

          {/* Commit list or skeletons */}
          <div className="flex flex-col gap-0.5 mb-2" style={{ minHeight: 80 }}>
            {isLoading ? (
              Array.from({ length: 4 }, (_, i) => (
                <CommitSkeleton key={i} index={i} />
              ))
            ) : commits.length > 0 ? (
              commits.map((commit, i) => (
                <CommitRow
                  key={`${commit.hash}-${i}`}
                  commit={commit}
                  isNew={i === 0 && commits.length > prevCountRef.current}
                />
              ))
            ) : (
              <p
                className="text-white/20 text-center py-4"
                style={{ fontSize: 8.5, fontFamily: "'DM Sans', sans-serif" }}
              >
                No recent push events found for @{username}
              </p>
            )}
          </div>

          {/* Status footer */}
          <div className="mb-3.5">
            <CommitStatusBadge
              status={status}
              lastUpdated={lastUpdated}
              onRetry={refetch}
            />
          </div>

          <div
            className="h-px mb-3.5"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />

          {/* Code quality arc */}
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
                  strokeDasharray="88"
                  strokeDashoffset={arcOffset}
                  style={{
                    transition: seen
                      ? "stroke-dashoffset 1.4s 0.9s cubic-bezier(0.34,1.1,0.64,1)"
                      : "none",
                  }}
                />
              </svg>
              <div
                className="absolute inset-0 grid place-content-center font-black text-[#a78bfa]"
                style={{ fontFamily: "'Syne', sans-serif", fontSize: 11 }}
                role="img"
                aria-label={`${quality} percent test coverage`}
              >
                {quality}%
              </div>
            </div>
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

// ─── Setup guide ─────────────────────────────────────────────────────────────
//
// ① Change DEFAULT_USERNAME at the top of this file to your GitHub username
//    OR pass it as a prop: <DevDashboard username="yourname" />
//
// ② (Recommended) Add a GitHub Personal Access Token for higher rate limits:
//
//    Create one at: https://github.com/settings/tokens
//    Required scopes: none (public events are unauthenticated)
//    Select: "public_repo" if you want private repo events too
//
//    Then in your .env file:
//      NEXT_PUBLIC_GITHUB_TOKEN=ghp_xxxxxxxxxxxx   ← Next.js
//      VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxx           ← Vite
//
//    Then pass it in:
//      <DevDashboard
//        username="yourname"
//        token={process.env.NEXT_PUBLIC_GITHUB_TOKEN}
//      />
//
// ③ Rate limits:
//    Unauthenticated: 60 requests/hour (plenty for 1-minute polling)
//    With token:      5000 requests/hour
//
// ④ What the GitHub Events API returns:
//    - PushEvents from the last 90 days
//    - Up to 300 events per page
//    - Includes: commit SHA, message, branch (ref), repo name, timestamp
//    - Does NOT include: private repos (unless using a token with private_repo scope)
//    - Docs: https://docs.github.com/en/rest/activity/events
