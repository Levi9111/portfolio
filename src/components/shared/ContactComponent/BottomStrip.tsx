import React from "react";
import { Clock, CheckCircle2, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, SOCIAL_LINKS } from "./contactTypes";

// ─── Availability Widget ──────────────────────────────────────────────────────

const AvailabilityWidget: React.FC = () => (
  <div
    style={{
      padding: "16px 18px",
      borderRadius: 14,
      border: "1px solid rgba(52,211,153,0.2)",
      background: "rgba(52,211,153,0.05)",
      backdropFilter: "blur(12px)",
      flex: 1,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#34d399",
            boxShadow: "0 0 8px rgba(52,211,153,0.7)",
            display: "block",
            animation: "cDotPulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#34d399",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Available for work
        </span>
      </div>
      <Zap size={14} color="#34d399" />
    </div>
    <div style={{ display: "flex", gap: 10 }}>
      {(
        [
          { icon: Clock, label: "Response", value: "< 24h", accent: "#a78bfa" },
          {
            icon: CheckCircle2,
            label: "Status",
            value: "Open",
            accent: "#34d399",
          },
        ] as const
      ).map(({ icon: Icon, label, value, accent }) => (
        <div
          key={label}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 4,
            }}
          >
            <Icon size={10} color={accent} />
            <span
              style={{
                fontSize: 8.5,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "rgba(200,200,240,0.32)",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {label}
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// ─── Social Links ─────────────────────────────────────────────────────────────

const SocialLinks: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      justifyContent: "center",
    }}
  >
    {SOCIAL_LINKS.map((s) => {
      const Icon = s.icon;
      return (
        <motion.a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          whileHover={{ scale: 1.08, x: 3 }}
          whileTap={{ scale: 0.92 }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(200,200,240,0.5)",
            textDecoration: "none",
            transition: "border-color 0.22s, color 0.22s, background 0.22s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = `${s.accent}55`;
            el.style.color = s.accent;
            el.style.background = `${s.accent}10`;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "rgba(255,255,255,0.08)";
            el.style.color = "rgba(200,200,240,0.5)";
            el.style.background = "rgba(255,255,255,0.03)";
          }}
        >
          <Icon size={18} />
        </motion.a>
      );
    })}
  </div>
);

// ─── Bottom Strip ─────────────────────────────────────────────────────────────

const BottomStrip: React.FC = () => (
  <motion.div
    variants={fadeUp}
    className="cc-bottom"
    style={{
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: 20,
      alignItems: "center",
      marginTop: 20,
    }}
  >
    <AvailabilityWidget />
    <SocialLinks />
  </motion.div>
);

export default BottomStrip;
