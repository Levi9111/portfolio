import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  readonly name: string;
  readonly type: string;
  readonly pct: string;
  readonly color: string; // Tailwind text + bar color (CSS var)
  readonly animDelay: string; // e.g. "0.3s"
  readonly pulsDelay: string; // e.g. "0s"
}

interface TechPill {
  readonly icon: string;
  readonly label: string;
  readonly color: string; // accent hex
  readonly bgAlpha: string; // rgba bg
  readonly borderAlpha: string; // rgba border
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PROJECTS: readonly Project[] = [
  {
    name: "E-Commerce Platform",
    type: "React · Node · MongoDB",
    pct: "87%",
    color: "#a78bfa",
    animDelay: "0.3s",
    pulsDelay: "0s",
  },
  {
    name: "Task Manager App",
    type: "Next.js · Socket.io",
    pct: "64%",
    color: "#f472b6",
    animDelay: "0.4s",
    pulsDelay: "0.4s",
  },
  {
    name: "Weather Dashboard",
    type: "React · D3.js · API",
    pct: "95%",
    color: "#34d399",
    animDelay: "0.5s",
    pulsDelay: "0.8s",
  },
  {
    name: "Analytics Platform",
    type: "Next.js · Python · ML",
    pct: "42%",
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
      style={{ fontSize: 8 }}
    >
      Active
    </span>
  </div>
);

// ─── ProjectRow ───────────────────────────────────────────────────────────────

interface ProjectRowProps {
  project: Project;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project }) => (
  <div
    className="animate-slide-in-left flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors duration-200"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "0.5px solid rgba(255,255,255,0.06)",
      animationDelay: project.animDelay,
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLDivElement).style.borderColor =
        "rgba(167,139,250,0.2)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.borderColor =
        "rgba(255,255,255,0.06)";
    }}
  >
    {/* Dot */}
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

    {/* Meta */}
    <div className="flex flex-col items-end gap-0.5 shrink-0">
      <span
        className="font-bold"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 9,
          color: project.color,
        }}
      >
        {project.pct}
      </span>
      {/* Progress bar */}
      <div
        className="w-11 h-0.5 rounded-sm overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-sm animate-bar-grow"
          style={{
            width: project.pct,
            background: project.color,
            animationDelay: `calc(${project.animDelay} + 0.3s)`,
          }}
          role="progressbar"
          aria-valuenow={parseInt(project.pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${project.name} progress`}
        />
      </div>
    </div>
  </div>
);

// ─── DevDashboard ─────────────────────────────────────────────────────────────

const DevDashboard: React.FC = () => (
  <div
    className="w-[270px] shrink-0 relative z-[2] animate-fade-up max-md:w-full max-md:max-w-[340px] max-md:mx-auto"
    style={{ animationDelay: "0.1s" }}
  >
    {/* Card */}
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "0.5px solid rgba(167,139,250,0.18)",
      }}
    >
      {/* Radial top highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 0%, rgba(120,80,255,0.1) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* ── Chrome bar ─────────────────────────────────────── */}
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
        <span
          className="ml-1.5 font-semibold tracking-[0.08em] uppercase text-white/20"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9 }}
        >
          Shanjid Ahmad
        </span>
        <div className="flex-1" />
        <LivePill />
      </div>

      {/* ── Stack strip ──────────────────────────────────────── */}
      <div
        className="flex items-center gap-2.5 px-3.5 py-2.5 animate-fade-up-sm"
        style={{
          borderBottom: "0.5px solid rgba(255,255,255,0.05)",
          animationDelay: "0.15s",
        }}
      >
        {/* Avatar */}
        <div
          className="w-[26px] h-[26px] rounded-full shrink-0 grid place-content-center text-white font-black"
          style={{
            background: "linear-gradient(135deg,#a78bfa,#818cf8)",
            border: "1.5px solid #0a0a0f",
            fontSize: 9,
            boxShadow: "0 0 0 1px rgba(167,139,250,0.4)",
          }}
          aria-label="Shanjid's avatar"
        >
          S
        </div>

        {/* Animated connector line */}
        <div
          className="w-4 h-px shrink-0 animate-connector-pulse"
          style={{ background: "linear-gradient(to right,#a78bfa,#34d399)" }}
          aria-hidden="true"
        />

        {/* Info */}
        <div className="flex-1">
          <p
            className="font-semibold tracking-[0.05em] text-white/55"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8.5 }}
          >
            Full-Stack Developer
          </p>
          <p
            className="text-white/20 tracking-[0.04em] mt-px"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7.5 }}
          >
            MERN · TypeScript · Next.js
          </p>
        </div>

        {/* Online dot */}
        <span
          className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0 animate-blink-dot-slow"
          style={{ boxShadow: "0 0 5px rgba(34,197,94,0.6)" }}
          aria-label="Currently online"
        />
      </div>

      {/* ── Tech pills ───────────────────────────────────────── */}
      <div
        className="flex flex-wrap gap-1.5 px-3.5 py-2.5 animate-fade-up-sm"
        style={{
          borderBottom: "0.5px solid rgba(255,255,255,0.05)",
          animationDelay: "0.2s",
        }}
      >
        {TECH_PILLS.map((pill) => (
          <div
            key={pill.label}
            className="flex items-center gap-1 rounded-full px-2 py-1"
            style={{
              background: pill.bgAlpha,
              border: `0.5px solid ${pill.borderAlpha}`,
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

      {/* ── Stat strip ───────────────────────────────────────── */}
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
          aria-label="2 plus years"
        >
          2+
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

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="p-3.5">
        <p
          className="font-semibold tracking-[0.1em] uppercase text-white/20 mb-2"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8.5 }}
        >
          Active Projects
        </p>

        <div className="flex flex-col gap-1.5 mb-3.5">
          {PROJECTS.map((project) => (
            <ProjectRow key={project.name} project={project} />
          ))}
        </div>

        {/* Divider */}
        <div
          className="h-px mb-3.5"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />

        {/* Code quality ring */}
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
          {/* Ring */}
          <div className="relative w-11 h-11 shrink-0 animate-float">
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
              className="absolute inset-0 grid place-content-center font-black text-[#a78bfa]"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: 11 }}
              aria-label="92 percent test coverage"
            >
              92%
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

export default DevDashboard;
