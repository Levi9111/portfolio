// src/components/shared/Projects/ProjectVisuals.tsx
import React from "react";
import { ArrowUpRight, Package, CheckCircle2 } from "lucide-react";
import type { ProjectCategory } from "../../../data/projects";

interface VisualProps {
  accent: string;
  hovered: boolean;
}

// ── Agency (UIX Design Lab) ─────────────────────────────────────────────────
// Client site nav mock + admin ERP stat strip underneath — signals "two apps, one portal"
export const AgencyVisual: React.FC<VisualProps> = ({ accent, hovered }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: 13,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.02em",
        }}
      >
        UIX Design Lab
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["Work", "Process", "Contact"].map((n) => (
          <div
            key={n}
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.35)",
              fontFamily: "'DM Sans',sans-serif",
              letterSpacing: "1px",
            }}
          >
            {n}
          </div>
        ))}
      </div>
    </div>

    <div
      style={{
        height: 10,
        borderRadius: 5,
        background: "rgba(255,255,255,0.12)",
        width: "85%",
      }}
    />
    <div
      style={{
        height: 10,
        borderRadius: 5,
        background: "rgba(255,255,255,0.07)",
        width: "55%",
      }}
    />

    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 16px",
        borderRadius: 100,
        background: accent,
        fontSize: 9,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "0.5px",
        fontFamily: "'DM Sans',sans-serif",
        width: "fit-content",
      }}
    >
      See Our Work <ArrowUpRight size={10} />
    </div>

    {/* Admin ERP strip — small dashboard bars beneath the "client site" to imply the second app */}
    <div
      style={{
        marginTop: "auto",
        padding: "10px 12px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          fontSize: 8,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: `${accent}99`,
          flexShrink: 0,
        }}
      >
        Admin ERP
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 3,
          height: 20,
          flex: 1,
        }}
      >
        {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              borderRadius: "1px 1px 0 0",
              background: hovered ? accent : `${accent}55`,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ── E-commerce (Subaashghor) ────────────────────────────────────────────────
// Storefront product grid + a "synced" order pulse to imply the 4-app ecosystem
export const EcommerceVisual: React.FC<VisualProps> = ({ accent, hovered }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: 12,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        Subaashghor
      </div>
      <div
        style={{
          padding: "3px 9px",
          borderRadius: 100,
          background: `${accent}20`,
          border: `0.5px solid ${accent}40`,
          fontSize: 8,
          color: accent,
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 600,
          letterSpacing: "1px",
        }}
      >
        LUXURY
      </div>
    </div>

    {/* Product grid */}
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            aspectRatio: "1",
            borderRadius: 10,
            background: `${accent}12`,
            border: `0.5px solid ${accent}28`,
            transition: "transform 0.3s",
            transform: hovered ? `translateY(-${(i + 1) * 2}px)` : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: `${accent}40`,
            }}
          />
        </div>
      ))}
    </div>

    {/* Order sync row — tiny "web → server → admin → mobile" pulse chain */}
    <div
      style={{
        marginTop: "auto",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {["Web", "API", "Admin", "App"].map((label, i, arr) => (
        <React.Fragment key={label}>
          <div
            style={{
              padding: "4px 8px",
              borderRadius: 6,
              fontSize: 8,
              fontFamily: "'DM Sans',sans-serif",
              color: `${accent}cc`,
              background: `${accent}14`,
              border: `0.5px solid ${accent}28`,
            }}
          >
            {label}
          </div>
          {i < arr.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 1,
                background: `${accent}30`,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -1.5,
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: accent,
                  boxShadow: `0 0 6px ${accent}`,
                  animation: "subaashSyncDot 2.4s ease-in-out infinite",
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
      <style>{`
        @keyframes subaashSyncDot {
          0% { left: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  </div>
);

// ── CLI (create-express-modular) ────────────────────────────────────────────
// Terminal window mock with a fake scaffolding output — the most literal, and most fun, one
export const CliVisual: React.FC<VisualProps> = ({ accent, hovered }) => {
  const lines = [
    {
      text: "npx create-express-modular my-api",
      color: "rgba(255,255,255,0.85)",
      prefix: "$",
    },
    { text: "✔ Selecting database — Mongoose", color: accent, prefix: null },
    { text: "✔ Selecting validator — Zod", color: accent, prefix: null },
    { text: "✔ Scaffolding modules...", color: accent, prefix: null },
    { text: "✔ Project ready", color: "#34d399", prefix: null },
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          borderRadius: 12,
          background: "rgba(0,0,0,0.45)",
          border: `0.5px solid ${accent}30`,
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
          {["#f87171", "#fbbf24", "#34d399"].map((c) => (
            <span
              key={c}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: c,
                opacity: 0.6,
              }}
            />
          ))}
          <span
            style={{
              marginLeft: 8,
              fontSize: 8,
              color: "rgba(255,255,255,0.25)",
              fontFamily: "'DM Sans',sans-serif",
              letterSpacing: "1px",
            }}
          >
            zsh
          </span>
        </div>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'JetBrains Mono','Fira Code',monospace",
              fontSize: 10.5,
              color: l.color,
              opacity: hovered ? 1 : 0.85,
              display: "flex",
              gap: 6,
            }}
          >
            {l.prefix && <span style={{ color: accent }}>{l.prefix}</span>}
            <span>{l.text}</span>
          </div>
        ))}
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: 12,
            background: accent,
            animation: "cliCursorBlink 1s step-end infinite",
            marginTop: 2,
          }}
        />
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}
      >
        <Package size={11} color={accent} />
        <span
          style={{
            fontSize: 9,
            color: `${accent}99`,
            fontFamily: "'DM Sans',sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          npm · open source · MIT
        </span>
      </div>
      <style>{`@keyframes cliCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
};

// ── TaskFlow ─────────────────────────────────────────────────────────────────
// Kanban columns with a live "socket ping" dot — implies the WebSocket real-time layer
export const TaskflowVisual: React.FC<VisualProps> = ({ accent, hovered }) => {
  const columns = [
    { label: "To Do", count: 4, items: 2 },
    { label: "In Progress", count: 3, items: 3 },
    { label: "Done", count: 6, items: 1 },
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          TaskFlow
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#34d399",
              boxShadow: "0 0 6px rgba(52,211,153,0.7)",
              animation: "tfSocketPulse 1.8s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: 8,
              color: "rgba(52,211,153,0.8)",
              fontFamily: "'DM Sans',sans-serif",
              letterSpacing: "1px",
            }}
          >
            LIVE
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flex: 1 }}>
        {columns.map((col, ci) => (
          <div
            key={col.label}
            style={{
              flex: 1,
              borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.07)",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.5px",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {col.label} · {col.count}
            </div>
            {Array.from({ length: col.items }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 18,
                  borderRadius: 6,
                  background: `${accent}${ci === 1 ? "22" : "12"}`,
                  border: `0.5px solid ${accent}30`,
                  transition: "transform 0.3s",
                  transform:
                    hovered && ci === 1 ? `translateX(${i * 1}px)` : "none",
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <CheckCircle2 size={11} color={accent} />
        <span
          style={{
            fontSize: 9,
            color: `${accent}99`,
            fontFamily: "'DM Sans',sans-serif",
            letterSpacing: "0.3px",
          }}
        >
          NestJS · WebSocket event bus
        </span>
      </div>
      <style>{`@keyframes tfSocketPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }`}</style>
    </div>
  );
};

// ── Dispatcher ─────────────────────────────────────────────────────────────
const ProjectVisual: React.FC<VisualProps & { category: ProjectCategory }> = ({
  category,
  accent,
  hovered,
}) => {
  switch (category) {
    case "agency":
      return <AgencyVisual accent={accent} hovered={hovered} />;
    case "ecommerce":
      return <EcommerceVisual accent={accent} hovered={hovered} />;
    case "cli":
      return <CliVisual accent={accent} hovered={hovered} />;
    case "taskflow":
      return <TaskflowVisual accent={accent} hovered={hovered} />;
  }
};

export default ProjectVisual;
