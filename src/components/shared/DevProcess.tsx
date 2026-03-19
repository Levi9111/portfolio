"use client";

import React, { useRef, useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepVisual = "plan" | "build" | "review" | "test" | "deploy";

interface WorkflowStep {
  readonly name: string;
  readonly sub: string;
  readonly color: string;
  readonly badge: string;
  readonly delay: number;
  readonly visual: StepVisual;
}

interface CommitBar {
  readonly color: string;
  readonly height: string;
  readonly delay: string;
}

interface ReviewLine {
  readonly lineNum: string;
  readonly color: string;
  readonly width: string;
  readonly delay: string;
}

interface TestResult {
  readonly label: string;
  readonly status: "pass" | "warn" | "fail";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS: readonly WorkflowStep[] = [
  {
    name: "Plan",
    sub: "Requirements & architecture",
    color: "#60a5fa",
    badge: "Scope",
    delay: 0.6,
    visual: "plan",
  },
  {
    name: "Build",
    sub: "Feature development",
    color: "#a78bfa",
    badge: "Code",
    delay: 0.8,
    visual: "build",
  },
  {
    name: "Review",
    sub: "PR review & refactor",
    color: "#f472b6",
    badge: "QA",
    delay: 1.0,
    visual: "review",
  },
  {
    name: "Test",
    sub: "Unit · Integration · E2E",
    color: "#818cf8",
    badge: "Validate",
    delay: 1.2,
    visual: "test",
  },
  {
    name: "Deploy",
    sub: "CI/CD · Vercel · Docker",
    color: "#34d399",
    badge: "Ship ✓",
    delay: 1.4,
    visual: "deploy",
  },
] as const;

const COMMIT_BARS: readonly CommitBar[] = [
  { color: "#a78bfa", height: "55%", delay: "1.0s" },
  { color: "#60a5fa", height: "80%", delay: "1.05s" },
  { color: "#a78bfa", height: "40%", delay: "1.1s" },
  { color: "#34d399", height: "90%", delay: "1.15s" },
  { color: "#f472b6", height: "65%", delay: "1.2s" },
  { color: "#a78bfa", height: "75%", delay: "1.25s" },
  { color: "#60a5fa", height: "50%", delay: "1.3s" },
  { color: "#34d399", height: "85%", delay: "1.35s" },
] as const;

const REVIEW_LINES: readonly ReviewLine[] = [
  { lineNum: "12", color: "#f472b6", width: "72%", delay: "1.2s" },
  { lineNum: "47", color: "#a78bfa", width: "45%", delay: "1.3s" },
  { lineNum: "89", color: "#f472b6", width: "88%", delay: "1.4s" },
] as const;

const TEST_RESULTS: readonly TestResult[] = [
  { label: "Auth middleware · 12 tests", status: "pass" },
  { label: "API endpoints · 38 tests", status: "pass" },
  { label: "UI components · running…", status: "warn" },
] as const;

// Contribution heatmap data — 7 cols × 7 rows = 49 cells
// intensity 0–4: 0=empty, 1=light, 2=mid, 3=dark, 4=full
const HEATMAP: readonly number[] = [
  0, 1, 0, 2, 1, 0, 0, 1, 2, 3, 1, 2, 1, 0, 2, 3, 4, 3, 1, 2, 1, 1, 2, 3, 4, 3,
  2, 1, 0, 1, 2, 3, 4, 3, 2, 0, 0, 1, 2, 3, 4, 3, 0, 0, 0, 1, 2, 3, 4,
] as const;

const HEATMAP_COLORS: Record<number, string> = {
  0: "rgba(255,255,255,0.04)",
  1: "rgba(167,139,250,0.18)",
  2: "rgba(167,139,250,0.38)",
  3: "rgba(167,139,250,0.62)",
  4: "rgba(167,139,250,0.88)",
};

// ─── Scroll hook ──────────────────────────────────────────────────────────────

function useInView(
  threshold = 0.12,
): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
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

// ─── Blinking "running" test label hook ───────────────────────────────────────

function useRunningLabel(base: string, seen: boolean): string {
  const [dots, setDots] = useState("");
  useEffect(() => {
    if (!seen) return;
    const t = setInterval(
      () => setDots((d) => (d.length >= 3 ? "" : d + ".")),
      480,
    );
    return () => clearInterval(t);
  }, [seen]);
  // Replace trailing "…" with animated dots
  return base.replace("running…", `running${dots}`);
}

// ─── Heatmap cell count-up hook ───────────────────────────────────────────────

function useHeatmapReveal(
  seen: boolean,
  total: number,
  intervalMs = 28,
): number {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setRevealed(i);
      if (i >= total) clearInterval(t);
    }, intervalMs);
    return () => clearInterval(t);
  }, [seen, total, intervalMs]);
  return revealed;
}

// ─── Status icon ──────────────────────────────────────────────────────────────

const StatusIcon: React.FC<{
  status: TestResult["status"];
  running?: boolean;
}> = ({ status, running }) => {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setBlink((b) => !b), 600);
    return () => clearInterval(t);
  }, [running]);

  if (status === "pass")
    return (
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0 grid place-content-center"
        style={{ background: "rgba(52,211,153,0.2)" }}
        aria-label="Pass"
      >
        <svg width="7" height="7" viewBox="0 0 8 8" aria-hidden="true">
          <polyline
            points="1,4 3,6 7,2"
            stroke="#34d399"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );

  if (status === "warn")
    return (
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0 grid place-content-center"
        style={{
          background: `rgba(251,191,36,${running && blink ? "0.35" : "0.15"})`,
          transition: "background 0.3s",
        }}
        aria-label="Running"
      >
        <svg width="7" height="7" viewBox="0 0 8 8" aria-hidden="true">
          <line
            x1="4"
            y1="1"
            x2="4"
            y2="5"
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="4" cy="6.5" r=".8" fill="#fbbf24" />
        </svg>
      </span>
    );

  return (
    <span
      className="w-2.5 h-2.5 rounded-full shrink-0 grid place-content-center"
      style={{ background: "rgba(239,68,68,0.2)" }}
      aria-label="Fail"
    >
      <svg width="7" height="7" viewBox="0 0 8 8" aria-hidden="true">
        <line
          x1="2"
          y1="2"
          x2="6"
          y2="6"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="2"
          x2="2"
          y2="6"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};

// ─── Step visuals ─────────────────────────────────────────────────────────────

const PlanVisual: React.FC<{ seen: boolean }> = ({ seen }) => (
  <div
    className="relative flex items-center gap-1.5 px-2.5 rounded-lg overflow-hidden"
    style={{
      height: 50,
      background: "rgba(0,0,0,0.25)",
      border: "0.5px solid rgba(255,255,255,0.06)",
    }}
    aria-label="Planning artefacts"
  >
    {/* Scanline — only renders after seen, position:relative on parent clips it */}
    {seen && (
      <span
        className="absolute top-0 bottom-0 w-px animate-scan-x"
        style={{ background: "rgba(96,165,250,0.6)", zIndex: 2 }}
        aria-hidden="true"
      />
    )}
    {(["API spec", "Tickets", "ERD"] as const).map((label, i) => (
      <span
        key={label}
        className="text-[7.5px] font-semibold tracking-[0.04em] rounded-[3px] px-1.5 py-0.5 whitespace-nowrap shrink-0"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color:
            i === 0 ? "#60a5fa" : i === 2 ? "#a78bfa" : "rgba(255,255,255,0.3)",
          background:
            i === 0
              ? "rgba(96,165,250,0.14)"
              : i === 2
                ? "rgba(167,139,250,0.12)"
                : "rgba(255,255,255,0.04)",
          border: `0.5px solid ${i === 0 ? "rgba(96,165,250,0.28)" : i === 2 ? "rgba(167,139,250,0.25)" : "rgba(255,255,255,0.06)"}`,
        }}
      >
        {label}
      </span>
    ))}
  </div>
);

const BuildVisual: React.FC<{ seen: boolean }> = ({ seen }) => (
  <div
    className="flex items-end gap-0.5 px-2 rounded-lg overflow-hidden justify-center"
    style={{
      height: 50,
      background: "rgba(0,0,0,0.25)",
      border: "0.5px solid rgba(255,255,255,0.06)",
      paddingTop: 8,
      paddingBottom: 8,
    }}
    aria-label="Commit history bar chart"
    role="img"
  >
    {COMMIT_BARS.map((bar, i) => (
      <div
        key={i}
        className="w-2 rounded-sm"
        style={{
          background: bar.color,
          height: seen ? bar.height : "0%",
          borderRadius: "2px 2px 0 0",
          transition: `height 1.1s ${bar.delay} cubic-bezier(0.34,1.1,0.64,1)`,
        }}
        aria-hidden="true"
      />
    ))}
  </div>
);

const ReviewVisual: React.FC<{ seen: boolean }> = ({ seen }) => (
  <div
    className="flex flex-col gap-[5px] px-2 rounded-lg"
    style={{
      height: 50,
      background: "rgba(0,0,0,0.25)",
      border: "0.5px solid rgba(255,255,255,0.06)",
      paddingTop: 10,
      paddingBottom: 10,
    }}
    aria-label="Code review diff lines"
    role="img"
  >
    {REVIEW_LINES.map((line) => (
      <div key={line.lineNum} className="flex items-center gap-1.5">
        <span
          className="w-3.5 text-right text-white/15"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7 }}
          aria-hidden="true"
        >
          {line.lineNum}
        </span>
        <div
          className="h-[3px] rounded-full"
          style={{
            background: line.color,
            width: seen ? line.width : "0%",
            transition: `width 1.2s ${line.delay} cubic-bezier(0.34,1.2,0.64,1)`,
          }}
          aria-hidden="true"
        />
      </div>
    ))}
  </div>
);

const TestVisual: React.FC<{ seen: boolean }> = ({ seen }) => {
  const runningLabel = useRunningLabel(TEST_RESULTS[2].label, seen);
  const labels = [TEST_RESULTS[0].label, TEST_RESULTS[1].label, runningLabel];

  return (
    <div
      className="flex flex-col gap-[5px] px-2 rounded-lg"
      style={{
        height: 50,
        background: "rgba(0,0,0,0.25)",
        border: "0.5px solid rgba(255,255,255,0.06)",
        paddingTop: 8,
        paddingBottom: 8,
      }}
      role="list"
      aria-label="Test results"
    >
      {TEST_RESULTS.map((result, i) => (
        <div
          key={result.label}
          className="flex items-center gap-1.5"
          role="listitem"
        >
          <StatusIcon
            status={result.status}
            running={result.status === "warn" && seen}
          />
          <span
            className="text-white/25 tracking-[0.02em]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7.5 }}
          >
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  );
};

const DeployVisual: React.FC<{ seen: boolean }> = ({ seen }) => {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => {
      const interval = setInterval(() => setPulse((p) => !p), 1600);
      return () => clearInterval(interval);
    }, 2200);
    return () => clearTimeout(t);
  }, [seen]);

  return (
    <div
      className="flex items-center gap-2.5 px-2.5 rounded-lg"
      style={{
        height: 50,
        background: "rgba(0,0,0,0.25)",
        border: "0.5px solid rgba(255,255,255,0.06)",
      }}
      aria-label="Deployment successful"
    >
      {/* Pulsing checkmark */}
      <div
        className="w-[30px] h-[30px] rounded-full shrink-0 flex items-center justify-center"
        style={{
          border: "1.5px solid #22c55e",
          boxShadow: pulse
            ? "0 0 0 5px rgba(34,197,94,0)"
            : "0 0 12px rgba(34,197,94,0.35)",
          transition: "box-shadow 0.8s ease",
        }}
        aria-hidden="true"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <polyline
            points="2,7 6,11 12,3"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-deliver-check"
            style={{ strokeDasharray: 30 }}
          />
        </svg>
      </div>

      <div className="flex flex-col gap-1" aria-hidden="true">
        {/* "Deployed" label */}
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 8,
            color: "#34d399",
            fontWeight: 600,
            letterSpacing: "0.06em",
          }}
        >
          DEPLOYED ✓
        </span>
        {(["80%", "60%"] as const).map((w, i) => (
          <div
            key={i}
            className="h-1 rounded-sm"
            style={{ width: w, background: "rgba(255,255,255,0.08)" }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Contribution heatmap ─────────────────────────────────────────────────────

const ContributionHeatmap: React.FC<{ seen: boolean }> = ({ seen }) => {
  const revealed = useHeatmapReveal(seen, HEATMAP.length, 22);
  const totalContribs = 247; // displayed count

  return (
    <div
      className="mt-3 rounded-2xl px-4 py-3 animate-fade-up-sm"
      style={{
        background: "rgba(10,5,28,0.85)",
        border: "0.5px solid rgba(167,139,250,0.18)",
        backdropFilter: "blur(8px)",
        animationDelay: "1.8s",
        opacity: seen ? undefined : 0,
      }}
      aria-label="GitHub contribution activity"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          {/* GitHub icon */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="rgba(167,139,250,0.7)"
            aria-hidden="true"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span
            className="text-white/30 font-semibold tracking-[0.06em] uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8.5 }}
          >
            Contributions
          </span>
        </div>
        <span
          className="font-bold text-[#a78bfa]"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 11,
            letterSpacing: "-0.02em",
          }}
        >
          {seen ? totalContribs : 0}
          <span
            className="text-white/20 font-normal"
            style={{ fontSize: 8, letterSpacing: "0.02em", marginLeft: 2 }}
          >
            this yr
          </span>
        </span>
      </div>

      {/* 7×7 heatmap grid */}
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
        aria-hidden="true"
      >
        {HEATMAP.map((intensity, i) => (
          <div
            key={i}
            className="rounded-[2px]"
            style={{
              aspectRatio: "1",
              background:
                i < revealed
                  ? HEATMAP_COLORS[intensity]
                  : "rgba(255,255,255,0.04)",
              transition: "background 0.15s ease",
              boxShadow:
                i < revealed && intensity >= 3
                  ? `0 0 4px rgba(167,139,250,${intensity === 4 ? 0.5 : 0.3})`
                  : "none",
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-2">
        <span
          className="text-white/15"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7 }}
        >
          Less
        </span>
        <div className="flex items-center gap-0.5">
          {[0, 1, 2, 3, 4].map((v) => (
            <div
              key={v}
              className="w-2 h-2 rounded-[2px]"
              style={{ background: HEATMAP_COLORS[v] }}
              aria-hidden="true"
            />
          ))}
        </div>
        <span
          className="text-white/15"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7 }}
        >
          More
        </span>
      </div>
    </div>
  );
};

// ─── Step row ─────────────────────────────────────────────────────────────────

interface StepRowProps {
  step: WorkflowStep;
  isLast: boolean;
  seen: boolean;
}

const StepRow: React.FC<StepRowProps> = ({ step, isLast, seen }) => (
  <div
    className="relative animate-fade-up-sm"
    style={{
      paddingBottom: isLast ? 0 : 18,
      animationDelay: seen ? `${step.delay}s` : "999s", // delay only after seen
    }}
  >
    {/* Timeline dot */}
    <div
      className="absolute -left-5 top-[7px] w-2.5 h-2.5 rounded-full animate-dot-pop animate-float-lg"
      style={{
        background: step.color,
        boxShadow: `0 0 8px ${step.color}88`,
        animationDelay: `${step.delay}s, ${step.delay + 0.4}s`,
      }}
      aria-hidden="true"
    />

    {/* Header */}
    <div className="flex items-center justify-between mb-1.5">
      <div>
        <p
          className="font-bold text-white/85"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 12,
            letterSpacing: "-0.01em",
            marginBottom: 1,
          }}
        >
          {step.name}
        </p>
        <p
          className="text-white/25 tracking-[0.04em]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9 }}
        >
          {step.sub}
        </p>
      </div>
      <span
        className="rounded font-semibold tracking-[0.06em] uppercase px-1.5 py-0.5 shrink-0"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 8,
          color: step.color,
          background: `${step.color}18`,
          border: `0.5px solid ${step.color}33`,
        }}
      >
        {step.badge}
      </span>
    </div>

    {/* Per-step visual */}
    {step.visual === "plan" && <PlanVisual seen={seen} />}
    {step.visual === "build" && <BuildVisual seen={seen} />}
    {step.visual === "review" && <ReviewVisual seen={seen} />}
    {step.visual === "test" && <TestVisual seen={seen} />}
    {step.visual === "deploy" && <DeployVisual seen={seen} />}
  </div>
);

// ─── DevProcess ───────────────────────────────────────────────────────────────

const DevProcess: React.FC = () => {
  const [ref, seen] = useInView(0.12);
  // Card-level scanline position state
  const [scanTop, setScanTop] = useState(0);

  useEffect(() => {
    if (!seen) return;
    let pos = 0;
    const t = setInterval(() => {
      pos = (pos + 0.4) % 100;
      setScanTop(pos);
    }, 16);
    return () => clearInterval(t);
  }, [seen]);

  return (
    <div
      ref={ref}
      className="w-[255px] shrink-0 relative z-[2] max-md:w-full max-md:max-w-[320px] max-md:mx-auto"
      style={{ opacity: seen ? 1 : 0, transition: "opacity 0.6s 0.2s ease" }}
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-2xl px-[17px] pt-[19px] pb-[22px]"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "0.5px solid rgba(167,139,250,0.15)",
        }}
      >
        {/* Radial highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(120,80,255,0.08) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        {/* Card-level continuous scanline — JS-driven for smooth looping */}
        {seen && (
          <div
            className="absolute left-0 right-0 h-px pointer-events-none z-10"
            style={{
              top: `${scanTop}%`,
              background:
                "linear-gradient(to right, transparent, rgba(167,139,250,0.25), transparent)",
              opacity: scanTop > 85 ? (100 - scanTop) / 15 : 1, // fade out near bottom
            }}
            aria-hidden="true"
          />
        )}

        {/* ── Card header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="font-semibold tracking-[0.1em] uppercase text-white/20"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10 }}
          >
            Dev Workflow
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-green-400 animate-blink-dot"
              aria-hidden="true"
            />
            <span
              className="font-semibold tracking-[0.08em] uppercase text-green-400"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9 }}
            >
              Live
            </span>
          </div>
        </div>

        {/* ── Timeline ────────────────────────────────────────── */}
        <div
          className="relative pl-[27px] flex flex-col"
          role="list"
          aria-label="Development workflow steps"
        >
          {/* Vertical track */}
          <div
            className="absolute left-2 top-[11px] w-px rounded overflow-hidden"
            style={{ bottom: 11, background: "rgba(255,255,255,0.06)" }}
            aria-hidden="true"
          >
            <div
              className="absolute top-0 left-0 right-0 rounded animate-draw-line"
              style={{
                background:
                  "linear-gradient(to bottom,#a78bfa,#818cf8,#34d399)",
              }}
            />
          </div>

          {STEPS.map((step, i) => (
            <div key={step.name} role="listitem">
              <StepRow
                step={step}
                isLast={i === STEPS.length - 1}
                seen={seen}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Contribution heatmap ── */}
      {/* TODO: Need to replace it with actual Github stats */}
      <ContributionHeatmap seen={seen} />
    </div>
  );
};

export default DevProcess;
