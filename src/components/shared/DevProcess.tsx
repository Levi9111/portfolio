import React from "react";
import "./animations.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepVisual = "plan" | "build" | "review" | "test" | "deploy";

interface WorkflowStep {
  readonly name: string;
  readonly sub: string;
  readonly color: string; // hex accent
  readonly badge: string;
  readonly delay: number; // seconds
  readonly visual: StepVisual;
}

interface CommitBar {
  readonly color: string;
  readonly height: string; // CSS height %
  readonly delay: string; // e.g. "1.0s"
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

// ─── Status icon helper ───────────────────────────────────────────────────────

interface StatusIconProps {
  status: TestResult["status"];
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  if (status === "pass") {
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
  }
  if (status === "warn") {
    return (
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0 grid place-content-center"
        style={{ background: "rgba(251,191,36,0.15)" }}
        aria-label="Warning"
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
  }
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

// ─── Per-step visual areas ────────────────────────────────────────────────────

const PlanVisual: React.FC = () => (
  <div
    className="relative flex items-center gap-1.5 px-2.5 rounded-lg overflow-hidden"
    style={{
      height: 50,
      background: "rgba(0,0,0,0.25)",
      border: "0.5px solid rgba(255,255,255,0.06)",
    }}
    aria-label="Planning artefacts: API spec, Tickets, ERD"
  >
    <span
      className="absolute top-0 bottom-0 w-px animate-scan-x"
      style={{ background: "rgba(167,139,250,0.7)" }}
      aria-hidden="true"
    />
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

const BuildVisual: React.FC = () => (
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
        className="w-2 rounded-sm animate-bar-fill-up"
        style={{
          background: bar.color,
          height: bar.height,
          borderRadius: "2px 2px 0 0",
          transformOrigin: "bottom",
          animationDelay: bar.delay,
        }}
        aria-hidden="true"
      />
    ))}
  </div>
);

const ReviewVisual: React.FC = () => (
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
          className="h-[3px] rounded-full animate-bar-grow"
          style={{
            background: line.color,
            width: line.width,
            animationDelay: line.delay,
          }}
          aria-hidden="true"
        />
      </div>
    ))}
  </div>
);

const TestVisual: React.FC = () => (
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
    {TEST_RESULTS.map((result) => (
      <div
        key={result.label}
        className="flex items-center gap-1.5"
        role="listitem"
        aria-label={`${result.status}: ${result.label}`}
      >
        <StatusIcon status={result.status} />
        <span
          className="text-white/25 tracking-[0.02em]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7.5 }}
        >
          {result.label}
        </span>
      </div>
    ))}
  </div>
);

const DeployVisual: React.FC = () => (
  <div
    className="flex items-center gap-2.5 px-2.5 rounded-lg"
    style={{
      height: 50,
      background: "rgba(0,0,0,0.25)",
      border: "0.5px solid rgba(255,255,255,0.06)",
    }}
    aria-label="Deployment successful"
  >
    {/* Checkmark circle */}
    <div
      className="w-[30px] h-[30px] rounded-full shrink-0 flex items-center justify-center"
      style={{
        border: "1.5px solid #22c55e",
        boxShadow: "0 0 10px rgba(34,197,94,0.25)",
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

    {/* Skeleton lines */}
    <div className="flex flex-col gap-1" aria-hidden="true">
      {(["80%", "60%", "70%"] as const).map((w, i) => (
        <div
          key={i}
          className="h-1 rounded-sm"
          style={{ width: w, background: "rgba(255,255,255,0.08)" }}
        />
      ))}
    </div>
  </div>
);

// ─── Visual dispatcher ────────────────────────────────────────────────────────

const StepVisualArea: React.FC<{ visual: StepVisual }> = ({ visual }) => {
  switch (visual) {
    case "plan":
      return <PlanVisual />;
    case "build":
      return <BuildVisual />;
    case "review":
      return <ReviewVisual />;
    case "test":
      return <TestVisual />;
    case "deploy":
      return <DeployVisual />;
  }
};

// ─── Single step row ──────────────────────────────────────────────────────────

interface StepRowProps {
  step: WorkflowStep;
  isLast: boolean;
}

const StepRow: React.FC<StepRowProps> = ({ step, isLast }) => (
  <div
    className="relative animate-fade-up-sm"
    style={{
      paddingBottom: isLast ? 0 : 18,
      animationDelay: `${step.delay}s`,
      opacity: 0,
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

      {/* Badge */}
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
    <StepVisualArea visual={step.visual} />
  </div>
);

// ─── DevProcess ───────────────────────────────────────────────────────────────

const DevProcess: React.FC = () => (
  <div
    className="w-[255px] shrink-0 relative z-[2] animate-fade-up max-md:w-full max-md:max-w-[320px] max-md:mx-auto"
    style={{ animationDelay: "0.2s" }}
  >
    {/* Card */}
    <div
      className="relative overflow-hidden rounded-2xl px-[17px] pt-[19px] pb-[22px]"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "0.5px solid rgba(167,139,250,0.15)",
      }}
    >
      {/* Radial top highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(120,80,255,0.08) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* ── Card header ──────────────────────────────────────── */}
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

      {/* ── Timeline ─────────────────────────────────────────── */}
      <div
        className="relative pl-[27px] flex flex-col"
        role="list"
        aria-label="Development workflow steps"
      >
        {/* Vertical track line */}
        <div
          className="absolute left-2 top-[11px] w-px rounded overflow-hidden"
          style={{
            bottom: 11,
            background: "rgba(255,255,255,0.06)",
          }}
          aria-hidden="true"
        >
          <div
            className="absolute top-0 left-0 right-0 rounded animate-draw-line"
            style={{
              background: "linear-gradient(to bottom,#a78bfa,#818cf8,#34d399)",
            }}
          />
        </div>

        {STEPS.map((step, i) => (
          <div key={step.name} role="listitem">
            <StepRow step={step} isLast={i === STEPS.length - 1} />
          </div>
        ))}
      </div>
    </div>

    {/* ── Floating availability tag ─────────────────────────── */}
    <div
      className="mt-3 flex items-center justify-center gap-1.5 rounded-full px-[18px] py-2 animate-fade-up-sm"
      style={{
        background: "rgba(10,5,28,0.9)",
        border: "0.5px solid rgba(167,139,250,0.2)",
        backdropFilter: "blur(8px)",
        animationDelay: "1.8s",
        opacity: 0,
      }}
      aria-label="Currently available for work"
    >
      <span
        className="w-1.5 h-1.5 rounded-full bg-green-400 animate-blink-dot-slow"
        style={{ boxShadow: "0 0 6px rgba(34,197,94,0.7)" }}
        aria-hidden="true"
      />
      <span
        className="text-white/50 tracking-[0.04em]"
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}
      >
        Available for work
      </span>
    </div>
  </div>
);

export default DevProcess;
