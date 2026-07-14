// src/components/shared/About/MobileActivityWidget.tsx
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, Variants } from "framer-motion";

// ─── Mobile Activity Widget ────────────────────────────────────────────────────
// Same data as desktop ActivityWidget, but stacked vertically for mobile screens
// Strips out heatmap grid (too dense), simplifies to key stats only

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

interface MobileActivityWidgetProps {
  accent?: string;
}

interface MobileGitHubCommitData {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
  repository: {
    full_name: string;
    html_url: string;
  };
}

const MOBILE_FALLBACK_COMMITS: MobileGitHubCommitData[] = [
  {
    sha: "f28112a",
    commit: {
      author: { name: "levi9111", date: new Date(Date.now() - 3600000 * 2).toISOString() },
      message: "feat: add GITHUB_API_TOKEN configuration to environment variables and config schema"
    },
    html_url: "https://github.com/Levi9111/portfolio-server/commit/f28112abdbee4ece7857f949a00679dae01b0563",
    repository: { full_name: "Levi9111/portfolio-server", html_url: "https://github.com/Levi9111/portfolio-server" }
  },
  {
    sha: "216445b",
    commit: {
      author: { name: "levi9111", date: new Date(Date.now() - 3600000 * 6).toISOString() },
      message: "feat: add detailed logging and error handling to AI assist controller"
    },
    html_url: "https://github.com/Levi9111/portfolio-server/commit/216445bdcdc2b2a323177dfc0a4f3421844ebefb",
    repository: { full_name: "Levi9111/portfolio-server", html_url: "https://github.com/Levi9111/portfolio-server" }
  },
  {
    sha: "c20929a",
    commit: {
      author: { name: "levi9111", date: new Date(Date.now() - 3600000 * 24).toISOString() },
      message: "chore: cors updated"
    },
    html_url: "https://github.com/Levi9111/portfolio-server/commit/c20929aa6ee8957d0f46f1a6c9fb447b37937304",
    repository: { full_name: "Levi9111/portfolio-server", html_url: "https://github.com/Levi9111/portfolio-server" }
  }
];

const MobileCommitTerminal: React.FC<{ inView: boolean; accent: string }> = ({ inView, accent }) => {
  const [commits, setCommits] = useState<MobileGitHubCommitData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchCommits = async () => {
      const baseUrl = import.meta.env.VITE_API_URL || "https://portfolio-server-xf38.onrender.com/api/v1";
      try {
        const response = await fetch(`${baseUrl}/profiles/github-commits`);
        if (!response.ok) throw new Error("Fetch failed");
        const json = await response.json();
        if (active && json.success && Array.isArray(json.data)) {
          setCommits(json.data);
        }
      } catch (err) {
        console.error("Error fetching commits:", err);
        if (active) {
          setCommits(MOBILE_FALLBACK_COMMITS);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    if (inView) {
      fetchCommits();
    }
    return () => {
      active = false;
    };
  }, [inView]);

  return (
    <div
      style={{
        background: "rgba(5, 3, 15, 0.45)",
        borderBottom: "0.5px solid rgba(255, 255, 255, 0.05)",
        padding: "12px",
        fontFamily: "'Fira Code', 'Courier New', monospace",
        fontSize: 8.5,
        lineHeight: 1.4,
        color: "rgba(255, 255, 255, 0.8)",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "rgba(255, 255, 255, 0.3)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontSize: 7.5,
          marginBottom: 8
        }}
      >
        <span>git log (central feed)</span>
        <span style={{ color: "#34d399" }}>● sync</span>
      </div>

      {loading ? (
        <div style={{ padding: "6px 0", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
          <span className="animate-pulse">Loading commits...</span>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5
          }}
        >
          {commits.slice(0, 3).map((item, idx) => {
            const shortRepo = item.repository?.full_name?.split("/")[1] || "repo";
            return (
              <a
                key={item.sha + idx}
                href={item.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 5,
                  textDecoration: "none",
                  color: "inherit",
                  padding: "3px",
                  borderRadius: 3,
                  transition: "background 0.2s, padding-left 0.2s"
                }}
                className="commit-row-hover-mobile"
              >
                <span style={{ color: accent, fontWeight: "bold", flexShrink: 0 }}>
                  [{shortRepo}]
                </span>
                <span style={{ color: "#fbbf24", flexShrink: 0 }}>
                  {item.sha.substring(0, 7)}
                </span>
                <span
                  style={{
                    color: "rgba(255, 255, 255, 0.85)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1
                  }}
                >
                  {item.commit.message.split("\n")[0]}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

const MobileActivityWidget: React.FC<MobileActivityWidgetProps> = ({
  accent = "#a78bfa",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <>
      <style>{`
        @keyframes mobileStatusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
        @keyframes mobileColonBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        .commit-row-hover-mobile:hover {
          background: rgba(167, 139, 250, 0.08);
          padding-left: 6px !important;
          color: #fff !important;
        }
      `}</style>

      <motion.div
        ref={ref}
        variants={stagger}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {/* Chrome bar — simplified for mobile */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            borderRadius: "10px 10px 0 0",
            background: "rgba(255,255,255,0.03)",
            borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {["#f87171", "#fbbf24", "#34d399"].map((c) => (
              <span
                key={c}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: c,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontSize: 8,
              color: "rgba(200,200,240,0.3)",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Activity
          </span>
          <div style={{ width: 20 }} /> {/* Spacer for alignment */}
        </motion.div>

        {/* Identity strip */}
        <motion.div
          variants={fadeUp}
          style={{
            padding: "10px 12px",
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
            background: "rgba(5,3,15,0.6)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: `${accent}18`,
                border: `1px solid ${accent}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: accent }}>
                SA
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Shanjid Ahmad
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(200,200,240,0.4)",
                  marginTop: 2,
                }}
              >
                @levi9111
              </div>
            </div>
          </div>
        </motion.div>

        {/* Working on */}
        <motion.div
          variants={fadeUp}
          style={{
            padding: "12px",
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
            background: "rgba(5,3,15,0.55)",
          }}
        >
          <div
            style={{
              fontSize: 8,
              color: "rgba(200,200,240,0.35)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Currently
          </div>
          <div
            style={{
              fontSize: 12,
              color: accent,
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Building TaskFlow
          </div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(200,200,240,0.45)",
              marginTop: 3,
            }}
          >
            NestJS + React, real-time
          </div>
        </motion.div>

        {/* Tech pills — 2 column grid instead of long row */}
        <motion.div
          variants={fadeUp}
          style={{
            padding: "12px",
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
            background: "rgba(5,3,15,0.55)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
          }}
        >
          {["React", "Node.js", "TypeScript", "MongoDB"].map((tech) => (
            <div
              key={tech}
              style={{
                padding: "6px 8px",
                borderRadius: 6,
                fontSize: 9,
                border: `1px solid ${accent}28`,
                background: `${accent}10`,
                color: accent,
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {tech}
            </div>
          ))}
        </motion.div>

        {/* Stats strip — vertical stack */}
        <motion.div
          variants={fadeUp}
          style={{
            padding: "12px",
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
            background: "rgba(5,3,15,0.55)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {[
            { num: "5+", label: "Years building" },
            { num: "10+", label: "Projects shipped" },
            { num: "100%", label: "Code coverage goal" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 8,
                borderBottom:
                  i < 2 ? "0.5px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "rgba(200,200,240,0.5)",
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: accent,
                }}
              >
                {stat.num}
              </span>
            </div>
          ))}
        </motion.div>

        <MobileCommitTerminal inView={isInView} accent={accent} />

        {/* Status footer */}
        <motion.div
          variants={fadeUp}
          style={{
            padding: "10px 12px",
            borderRadius: "0 0 10px 10px",
            background: "rgba(5,3,15,0.7)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#34d399",
              boxShadow: "0 0 6px rgba(52,211,153,0.6)",
              animation: "mobileStatusPulse 2s ease-in-out infinite",
              display: "block",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: "rgba(52,211,153,0.85)",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.3px",
            }}
          >
            Available for work
          </span>
        </motion.div>
      </motion.div>
    </>
  );
};

export default MobileActivityWidget;
