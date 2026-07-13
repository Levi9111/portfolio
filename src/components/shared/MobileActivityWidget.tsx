// src/components/shared/About/MobileActivityWidget.tsx
import React, { useRef } from "react";
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
