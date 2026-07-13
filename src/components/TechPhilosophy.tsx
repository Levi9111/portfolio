// src/components/TechPhilosophy.tsx
import React, { useRef, useState } from "react";
import {
  ShieldCheck,
  GitBranch,
  Layers3,
  TestTube2,
  Gauge,
  Copy,
  Check,
} from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Principle {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly icon: React.ElementType;
  readonly accent: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRINCIPLES: readonly Principle[] = [
  {
    id: 1,
    title: "Type Safety, End to End",
    description:
      "Strict TypeScript across the stack, with Zod schemas validating every request boundary — errors get caught at compile time and the API's edge, not in production.",
    icon: ShieldCheck,
    accent: "#a78bfa",
  },
  {
    id: 2,
    title: "Consistent Error Handling",
    description:
      "Every backend follows the same contract — a catchAsync wrapper, a custom AppError class, and a single sendResponse shape — so failures are predictable across modules and projects.",
    icon: Layers3,
    accent: "#34d399",
  },
  {
    id: 3,
    title: "Modular by Default",
    description:
      "Features live in self-contained modules with their own routes, controllers, and schemas. Scaffolding tools like create-express-modular exist because I don't want to rebuild this structure by hand every time.",
    icon: GitBranch,
    accent: "#60a5fa",
  },
  {
    id: 4,
    title: "Motion With Intent",
    description:
      "Animation is driven by orchestrated variants and staggerChildren, never manual delays. Every transition respects useReducedMotion and stays on GPU-safe transforms — polish shouldn't cost performance or accessibility.",
    icon: Gauge,
    accent: "#f472b6",
  },
  {
    id: 5,
    title: "Tests and Docs, Not Afterthoughts",
    description:
      "Code reviews, documentation, and test coverage are part of shipping — not cleanup done later. A README rewrite or a missing test case is treated as unfinished work.",
    icon: TestTube2,
    accent: "#fbbf24",
  },
] as const;

// ─── Variants ─────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: "blur(6px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Principle Row ────────────────────────────────────────────────────────────

const PrincipleRow: React.FC<{ principle: Principle; index: number }> = ({
  principle,
}) => {
  const [hovered, setHovered] = useState(false);
  const Icon = principle.icon;

  return (
    <motion.div
      variants={fadeLeft}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        display: "flex",
        gap: 16,
        padding: "18px 18px",
        borderRadius: 16,
        border: `1px solid ${hovered ? principle.accent + "35" : "rgba(255,255,255,0.06)"}`,
        background: hovered
          ? `${principle.accent}08`
          : "rgba(255,255,255,0.015)",
        transition: "border-color 0.3s, background 0.3s",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: `${principle.accent}14`,
          border: `1px solid ${principle.accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "transform 0.3s",
          transform: hovered ? "scale(1.08) rotate(-3deg)" : "scale(1)",
        }}
      >
        <Icon size={19} color={principle.accent} />
      </div>
      <div>
        <h3
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 15,
            fontWeight: 500,
            color: "#fff",
            margin: "0 0 6px",
            letterSpacing: "-0.1px",
          }}
        >
          {principle.title}
        </h3>
        <p
          style={{
            fontSize: 12.5,
            fontWeight: 300,
            lineHeight: 1.75,
            color: "rgba(190,190,220,0.5)",
            margin: 0,
          }}
        >
          {principle.description}
        </p>
      </div>
    </motion.div>
  );
};

// ─── Code Snippet Widget ──────────────────────────────────────────────────────
// Shows the actual catchAsync/AppError pattern used across projects — proof, not claim.
// CodeSnippetWidget — replaces the static block in TechPhilosophy.tsx

const CODE_LINES: readonly { text: string; color?: string; indent?: number }[] =
  [
    { text: "export const createUser = catchAsync(", color: "#a78bfa" },
    { text: "async (req, res) => {", indent: 1 },
    {
      text: "const data = userSchema.parse(req.body);",
      indent: 2,
      color: "#34d399",
    },
    { text: "", indent: 0 },
    { text: "const user = await User.create(data);", indent: 2 },
    { text: "if (!user) {", indent: 2 },
    {
      text: "throw new AppError(400, 'Creation failed');",
      indent: 3,
      color: "#fbbf24",
    },
    { text: "}", indent: 2 },
    { text: "", indent: 0 },
    { text: "sendResponse(res, {", indent: 2, color: "#60a5fa" },
    { text: "statusCode: 201,", indent: 3 },
    { text: "message: 'User created',", indent: 3 },
    { text: "data: user,", indent: 3 },
    { text: "});", indent: 2 },
    { text: "}", indent: 0 },
    { text: ");", indent: 0 },
  ];

const lineVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.5 + i * 0.09,
    },
  }),
};

const CodeSnippetWidget: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(widgetRef, { once: true, margin: "-10%" });

  const handleCopy = async () => {
    const text = CODE_LINES.map(
      (l) => "  ".repeat(l.indent ?? 0) + l.text,
    ).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked — fail silently
    }
  };

  // Cursor appears once every line has finished animating in
  const totalRevealTime = 0.5 + CODE_LINES.length * 0.09;

  const pipelineSteps = [
    {
      num: "01",
      title: "Validation Boundary",
      tech: "Zod Schema",
      desc: "Incoming JSON is parsed and sanitized at the edge. Invalid payloads reject automatically before hitting the controller.",
      color: "#a78bfa"
    },
    {
      num: "02",
      title: "Boilerplate Rescue",
      tech: "catchAsync wrapper",
      desc: "Eliminates global try-catch noise. Unhandled controller errors bubble cleanly to the main express middleware handler.",
      color: "#34d399"
    },
    {
      num: "03",
      title: "Operational Failure",
      tech: "AppError class",
      desc: "Extends Native Error class with explicit HTTP status codes, differentiating operational failures from server crashes.",
      color: "#fbbf24"
    },
    {
      num: "04",
      title: "Unified Delivery",
      tech: "sendResponse helper",
      desc: "Enforces a strict global API response shape: statusCode, success status message, and typed data payload.",
      color: "#60a5fa"
    }
  ];

  return (
    <>
      {/* Desktop View */}
      <motion.div
        ref={widgetRef}
        variants={scaleIn}
        className="phi-widget-desktop"
        style={{
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(139,92,246,0.2)",
          background: "rgba(3,2,12,0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "0.5px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}
          >
            <div
              style={{ display: "flex", gap: 5, flexShrink: 0 }}
              aria-hidden="true"
            >
              {["#f87171", "#fbbf24", "#34d399"].map((c) => (
                <span
                  key={c}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: c,
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
            <span
              style={{
                marginLeft: 6,
                fontSize: 11,
                color: "rgba(200,200,240,0.4)",
                fontFamily: "'DM Sans',sans-serif",
                letterSpacing: "0.3px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              user.controller.ts
            </span>
          </div>
          <motion.button
            onClick={handleCopy}
            whileTap={{ scale: 0.94 }}
            aria-label="Copy code snippet"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 7,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              cursor: "pointer",
              fontSize: 10.5,
              color: copied ? "#34d399" : "rgba(200,200,240,0.55)",
              fontFamily: "'DM Sans',sans-serif",
              transition: "color 0.2s",
              flexShrink: 0,
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </motion.button>
        </div>

        {/* Code body — no horizontal scroll: smaller font, tighter indent, lines sized to fit */}
        <div style={{ padding: "16px 18px", overflowX: "hidden" }}>
          {CODE_LINES.map((line, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={lineVariants}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              style={{
                fontFamily: "'JetBrains Mono','Fira Code',monospace",
                fontSize: 11,
                lineHeight: 1.85,
                color: line.color ?? "rgba(220,220,245,0.75)",
                paddingLeft: (line.indent ?? 0) * 14,
                whiteSpace: "pre",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {line.text || "\u00A0"}
            </motion.div>
          ))}

          {/* Blinking cursor — appears after the last line finishes typing in */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: totalRevealTime, duration: 0.2 }}
            style={{
              display: "inline-block",
              width: 6,
              height: 12,
              background: "#a78bfa",
              marginLeft: 2,
              animation: isInView
                ? "philCursorBlink 1s step-end infinite"
                : "none",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Footer strip */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "0.5px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#34d399",
              boxShadow: "0 0 6px rgba(52,211,153,0.6)",
              display: "block",
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
          <span
            style={{
              fontSize: 10.5,
              color: "rgba(200,200,240,0.35)",
              fontFamily: "'DM Sans',sans-serif",
              letterSpacing: "0.3px",
            }}
          >
            Same pattern across every backend I ship
          </span>
        </div>
      </motion.div>

      {/* Mobile View */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="phi-widget-mobile"
        style={{
          width: "100%",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(139,92,246,0.18)",
          background: "rgba(3,2,12,0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "24px 20px",
          boxSizing: "border-box"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(200,200,240,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
            Pipeline Architecture
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
            <span style={{ fontSize: 9, fontWeight: 600, color: "#34d399", fontFamily: "'DM Sans', sans-serif" }}>SECURE API</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {pipelineSteps.map((step) => (
            <div
              key={step.num}
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.04)",
                background: "rgba(255,255,255,0.015)",
                display: "flex",
                gap: 12
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: `${step.color}15`,
                  border: `1px solid ${step.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: step.color,
                  fontFamily: "'Syne', sans-serif",
                  flexShrink: 0
                }}
              >
                {step.num}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{step.title}</span>
                  <span style={{ fontSize: 8.5, padding: "1px 5px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "rgba(200,200,250,0.6)", fontFamily: "'DM Sans', sans-serif" }}>{step.tech}</span>
                </div>
                <p style={{ fontSize: 10.5, color: "rgba(200,200,240,0.4)", lineHeight: 1.5, margin: "5px 0 0" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};
// ─── Tech Philosophy Section ──────────────────────────────────────────────────

const TechPhilosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        #philosophy-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          padding: 140px 0 120px;
          background: transparent;
          overflow: visible;
        }
        #philosophy-section::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent);
          pointer-events: none;
        }

        .phi-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 7px 16px; border-radius: 100px;
          border: 1px solid rgba(139,92,246,0.2);
          background: rgba(5,3,15,0.5);
          backdrop-filter: blur(12px);
          font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(167,139,250,0.85); margin-bottom: 20px;
        }
        .phi-eyebrow::before {
          content: ''; display: block; width: 20px; height: 1px;
          background: rgba(139,92,246,0.5);
        }

        .phi-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(44px, 7vw, 76px);
          line-height: 1.05; color: #fff; letter-spacing: -1.5px;
        }
        .phi-title-accent {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: phiHue 8s ease-in-out infinite;
        }
        @keyframes phiHue { 0%,100%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(25deg)} }

        .phi-divider {
          width: 64px; height: 1px; margin: 24px auto 0;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
          position: relative;
        }
        .phi-divider::after {
          content: ''; position: absolute; top: -2px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 8px #a78bfa;
        }

        .phi-desc {
          font-size: 15px; font-weight: 300;
          color: rgba(190,190,220,0.45); max-width: 540px;
          line-height: 1.8; margin: 20px auto 0;
        }

        .phi-body {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 48px;
          align-items: start;
        }

        .phi-widget-desktop {
          display: block;
        }
        .phi-widget-mobile {
          display: none;
        }

        @media (max-width: 1000px) {
          .phi-body { grid-template-columns: 1fr; }
          .phi-body > *:last-child { max-width: 480px; margin: 0 auto; }
        }
        @media (max-width: 768px) {
          #philosophy-section { padding: 100px 0 80px; }
          .phi-widget-desktop {
            display: none !important;
          }
          .phi-widget-mobile {
            display: block !important;
          }
        }
      `}</style>

      <section id="philosophy-section" ref={sectionRef}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* Header */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <motion.div variants={fadeUp}>
              <div className="phi-eyebrow">How I Build</div>
            </motion.div>
            <motion.h2 className="phi-title" variants={fadeUp}>
              Engineering <span className="phi-title-accent">Philosophy</span>
            </motion.h2>
            <motion.div variants={fadeUp}>
              <div className="phi-divider" />
            </motion.div>
            <motion.p className="phi-desc" variants={fadeUp}>
              Principles I hold to across every project — the same patterns show
              up whether it's a client app or an open-source tool.
            </motion.p>
          </motion.div>

          {/* Body: principles | code widget */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="phi-body"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PRINCIPLES.map((principle, i) => (
                <PrincipleRow
                  key={principle.id}
                  principle={principle}
                  index={i}
                />
              ))}
            </div>

            <CodeSnippetWidget />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TechPhilosophy;
