import React, { useRef } from "react";
import { useInView } from "framer-motion";
import {
  ArrowUpRight,
  Globe,
  Zap,
  Building2,
  User,
  Github,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectStatus = "live" | "in-progress" | "agency";

interface WidgetProject {
  readonly id: number;
  readonly name: string;
  readonly url: string;
  readonly displayUrl: string;
  readonly color: string;
  readonly status: ProjectStatus;
  readonly statusLabel: string;
  readonly icon: React.ElementType;
  readonly stack: string;
  readonly completion: number; // 0-100
  readonly animDelay: string;
  readonly pulseDelay: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const WIDGET_PROJECTS: readonly WidgetProject[] = [
  {
    id: 1,
    name: "Texor",
    url: "https://texor.cloud",
    displayUrl: "texor.cloud",
    color: "#f59e0b",
    status: "live",
    statusLabel: "Live",
    icon: Zap,
    stack: "MERN · WebSocket · Redis",
    completion: 100,
    animDelay: "0.3s",
    pulseDelay: "0s",
  },
  {
    id: 2,
    name: "UIX Design Lab",
    url: "https://uixdesignlab.com",
    displayUrl: "uixdesignlab.com",
    color: "#a78bfa",
    status: "agency",
    statusLabel: "Agency",
    icon: Building2,
    stack: "Next.js · GSAP · Framer",
    completion: 100,
    animDelay: "0.42s",
    pulseDelay: "0.4s",
  },
  {
    id: 3,
    name: "Rentezzi",
    url: "https://rentezzi.com",
    displayUrl: "rentezzi.com",
    color: "#34d399",
    status: "in-progress",
    statusLabel: "In Progress",
    icon: Globe,
    stack: "Next.js · PostgreSQL · AWS",
    completion: 72,
    animDelay: "0.54s",
    pulseDelay: "0.8s",
  },
  {
    id: 4,
    name: "Tahsin Ahmad",
    url: "https://tahsinahmad.com",
    displayUrl: "tahsinahmad.com",
    color: "#60a5fa",
    status: "live",
    statusLabel: "Live",
    icon: User,
    stack: "React · Framer Motion",
    completion: 100,
    animDelay: "0.66s",
    pulseDelay: "1.2s",
  },
] as const;

const STATUS_COLORS: Record<
  ProjectStatus,
  { bg: string; border: string; color: string }
> = {
  live: {
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.3)",
    color: "#34d399",
  },
  "in-progress": {
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.3)",
    color: "#fbbf24",
  },
  agency: {
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.3)",
    color: "#a78bfa",
  },
};

// ─── ProjectsWidget ───────────────────────────────────────────────────────────

const ProjectsWidget: React.FC = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  //   const inView = useInView(widgetRef, { once: true, margin: "-5%" });

  const liveCount = WIDGET_PROJECTS.filter(
    (p) => p.status !== "in-progress",
  ).length;
  const totalBuilt = 60;

  return (
    <div
      ref={widgetRef}
      className="animate-fade-up"
      style={{
        width: 280,
        flexShrink: 0,
        fontFamily: "'DM Sans', sans-serif",
        animationDelay: "0.2s",
      }}
    >
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
              "radial-gradient(ellipse at 60% 0%, rgba(120,80,255,0.1), transparent 65%)",
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
            Projects
          </span>
          <div style={{ flex: 1 }} />
          {/* Live count badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(52,211,153,0.1)",
              border: "0.5px solid rgba(52,211,153,0.25)",
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
              {liveCount} Live
            </span>
          </div>
        </div>

        {/* ── Identity strip ── */}
        <div
          className="animate-fade-up-sm"
          style={{
            padding: "10px 13px",
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            gap: 9,
            animationDelay: "0.15s",
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
            className="animate-connector-pulse"
            style={{
              width: 14,
              height: 1,
              background: "linear-gradient(to right,#a78bfa,#34d399)",
              flexShrink: 0,
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
              Shanjid Ahmad
            </p>
            <p
              style={{
                fontSize: 7.5,
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.04em",
                marginTop: 1,
              }}
            >
              Full-Stack · 5 years
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
            aria-label="Online"
          />
        </div>

        {/* ── Headline stat ── */}
        <div
          className="animate-count-tick"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 13px",
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
            animationDelay: "0.25s",
          }}
        >
          <span
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: "#a78bfa",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            {totalBuilt}+
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
              Projects shipped
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
        </div>

        {/* ── Project list ── */}
        <div style={{ padding: "13px" }}>
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
            Featured Work
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 13,
            }}
          >
            {WIDGET_PROJECTS.map((p) => {
              const Icon = p.icon;
              const st = STATUS_COLORS[p.status];
              return (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-slide-in-left"
                  style={{
                    textDecoration: "none",
                    background: "rgba(255,255,255,0.03)",
                    border: "0.5px solid rgba(255,255,255,0.06)",
                    borderRadius: 8,
                    padding: "9px 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    animationDelay: p.animDelay,
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = `${p.color}40`;
                    el.style.background = `${p.color}08`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.06)";
                    el.style.background = "rgba(255,255,255,0.03)";
                  }}
                  aria-label={`Visit ${p.name} at ${p.displayUrl}`}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: `${p.color}15`,
                      border: `0.5px solid ${p.color}28`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={13} color={p.color} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.85)",
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
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.stack}
                    </p>
                  </div>

                  {/* Right: status + completion */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        padding: "2px 7px",
                        borderRadius: 4,
                        background: st.bg,
                        border: `0.5px solid ${st.border}`,
                      }}
                    >
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: st.color,
                          display: "block",
                        }}
                        aria-hidden="true"
                      />
                      <span
                        style={{
                          fontSize: 7.5,
                          fontWeight: 600,
                          color: st.color,
                          letterSpacing: "0.3px",
                        }}
                      >
                        {p.statusLabel}
                      </span>
                    </div>
                    {/* Progress bar */}
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
                          width: `${p.completion}%`,
                          background:
                            p.completion === 100
                              ? p.color
                              : `linear-gradient(to right, ${p.color}88, ${p.color})`,
                          borderRadius: 1,
                          animationDelay: `calc(${p.animDelay} + 0.3s)`,
                        }}
                        role="progressbar"
                        aria-valuenow={p.completion}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${p.name} completion`}
                      />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* ── Divider ── */}
          <div
            style={{
              height: ".5px",
              background: "rgba(255,255,255,0.05)",
              marginBottom: 13,
            }}
          />

          {/* ── Stack summary ── */}
          <p
            style={{
              fontSize: 8.5,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              marginBottom: 9,
            }}
          >
            Tech Used
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              marginBottom: 13,
            }}
          >
            {(
              [
                "React",
                "Next.js",
                "Node.js",
                "TypeScript",
                "MongoDB",
                "PostgreSQL",
                "Docker",
                "AWS",
                "Redis",
              ] as const
            ).map((tech, i) => (
              <span
                key={tech}
                className="animate-fade-up-sm"
                style={{
                  fontSize: 8.5,
                  fontWeight: 500,
                  letterSpacing: "0.3px",
                  padding: "3px 8px",
                  borderRadius: 5,
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(255,255,255,0.07)",
                  color: "rgba(200,200,230,0.5)",
                  animationDelay: `${0.8 + i * 0.04}s`,
                  opacity: 0,
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* ── GitHub CTA ── */}
          <a
            href="https://github.com/levi9111"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              textDecoration: "none",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(167,139,250,0.35)";
              el.style.background = "rgba(167,139,250,0.07)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.08)";
              el.style.background = "rgba(255,255,255,0.03)";
            }}
            aria-label="Visit GitHub profile @levi9111"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Github size={14} color="rgba(200,200,240,0.5)" />
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.65)",
                    margin: 0,
                    letterSpacing: "-0.01em",
                    fontFamily: "'Syne',sans-serif",
                  }}
                >
                  github.com/levi9111
                </p>
                <p
                  style={{
                    fontSize: 8,
                    color: "rgba(255,255,255,0.22)",
                    marginTop: 1,
                  }}
                >
                  See all repositories
                </p>
              </div>
            </div>
            <ArrowUpRight size={13} color="rgba(200,200,240,0.35)" />
          </a>
        </div>
      </div>

      {/* ── Floating open-source tag ── */}
      <div
        className="animate-fade-up-sm"
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
          animationDelay: "1.8s",
          opacity: 0,
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
          aria-hidden="true"
        />
        <span
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.04em",
          }}
        >
          Open to collaborations
        </span>
      </div>
    </div>
  );
};

export default ProjectsWidget;
