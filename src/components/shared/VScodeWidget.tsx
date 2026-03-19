import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CodeToken {
  readonly text: string;
  readonly color: string;
}

interface CodeLine {
  readonly tokens: readonly CodeToken[];
}

interface FileTab {
  readonly name: string;
  readonly lang: string;
  readonly dot: string; // status dot color
  readonly active: boolean;
}

// ─── Syntax token colors (VS Code Dark+ palette) ──────────────────────────────

const T = {
  keyword: "#c792ea", // purple   — const, return, async
  fn: "#82aaff", // blue     — function names
  string: "#c3e88d", // green    — string literals
  comment: "#546e7a", // grey     — // comments
  type: "#ffcb6b", // amber    — types, interfaces
  num: "#f78c6c", // orange   — numbers
  param: "#f07178", // red-pink — parameters
  punct: "#89ddff", // cyan     — brackets, colons
  plain: "#a6accd", // muted    — plain text
  bright: "#eeffff", // white-ish — identifiers
  jsx: "#ff5370", // red      — JSX tags
  prop: "#addb67", // lime     — object props
} as const;

// ─── Code content ─────────────────────────────────────────────────────────────
// The "file" being written — split into lines of colored tokens

const CODE_LINES: readonly CodeLine[] = [
  { tokens: [{ text: "// shanjid.dev — hero section", color: T.comment }] },
  { tokens: [] },
  {
    tokens: [
      { text: "import", color: T.keyword },
      { text: " React, { ", color: T.plain },
      { text: "useState", color: T.fn },
      { text: ", ", color: T.plain },
      { text: "useEffect", color: T.fn },
      { text: " } ", color: T.plain },
      { text: "from", color: T.keyword },
      { text: " 'react'", color: T.string },
      { text: ";", color: T.punct },
    ],
  },
  {
    tokens: [
      { text: "import", color: T.keyword },
      { text: " { ", color: T.plain },
      { text: "motion", color: T.fn },
      { text: " } ", color: T.plain },
      { text: "from", color: T.keyword },
      { text: " 'framer-motion'", color: T.string },
      { text: ";", color: T.punct },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { text: "interface", color: T.keyword },
      { text: " HeroProps ", color: T.type },
      { text: "{", color: T.punct },
    ],
  },
  {
    tokens: [
      { text: "  name", color: T.prop },
      { text: ": ", color: T.punct },
      { text: "string", color: T.type },
      { text: ";", color: T.punct },
    ],
  },
  {
    tokens: [
      { text: "  role", color: T.prop },
      { text: ": ", color: T.punct },
      { text: "string", color: T.type },
      { text: ";", color: T.punct },
    ],
  },
  { tokens: [{ text: "}", color: T.punct }] },
  { tokens: [] },
  {
    tokens: [
      { text: "const", color: T.keyword },
      { text: " ", color: T.plain },
      { text: "Hero", color: T.fn },
      { text: ": ", color: T.punct },
      { text: "React.FC", color: T.type },
      { text: "<", color: T.punct },
      { text: "HeroProps", color: T.type },
      { text: ">", color: T.punct },
      { text: " = (", color: T.plain },
      { text: "{", color: T.punct },
    ],
  },
  {
    tokens: [
      { text: "  name", color: T.param },
      { text: ",", color: T.punct },
      { text: " role", color: T.param },
    ],
  },
  { tokens: [{ text: "}) => {", color: T.punct }] },
  {
    tokens: [
      { text: "  const", color: T.keyword },
      { text: " [", color: T.punct },
      { text: "visible", color: T.bright },
      { text: ", ", color: T.plain },
      { text: "setVisible", color: T.fn },
      { text: "] = ", color: T.plain },
      { text: "useState", color: T.fn },
      { text: "<", color: T.punct },
      { text: "boolean", color: T.type },
      { text: ">(", color: T.punct },
      { text: "false", color: T.keyword },
      { text: ");", color: T.punct },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { text: "  useEffect", color: T.fn },
      { text: "(() => {", color: T.punct },
    ],
  },
  {
    tokens: [
      { text: "    setVisible", color: T.fn },
      { text: "(", color: T.punct },
      { text: "true", color: T.keyword },
      { text: ");", color: T.punct },
    ],
  },
  { tokens: [{ text: "  }, []);", color: T.punct }] },
  { tokens: [] },
  {
    tokens: [
      { text: "  return", color: T.keyword },
      { text: " (", color: T.punct },
    ],
  },
  {
    tokens: [
      { text: "    <", color: T.jsx },
      { text: "motion.section", color: T.fn },
    ],
  },
  {
    tokens: [
      { text: "      className", color: T.prop },
      { text: "=", color: T.punct },
      { text: '{"hero"}', color: T.string },
    ],
  },
  {
    tokens: [
      { text: "      initial", color: T.prop },
      { text: "={{ ", color: T.punct },
      { text: "opacity", color: T.bright },
      { text: ": ", color: T.punct },
      { text: "0", color: T.num },
      { text: " }}", color: T.punct },
    ],
  },
  { tokens: [{ text: "    >", color: T.jsx }] },
  {
    tokens: [
      { text: "      <", color: T.jsx },
      { text: "h1", color: T.keyword },
      { text: ">", color: T.jsx },
      { text: "{name}", color: T.bright },
      { text: "</", color: T.jsx },
      { text: "h1", color: T.keyword },
      { text: ">", color: T.jsx },
    ],
  },
  {
    tokens: [
      { text: "    </", color: T.jsx },
      { text: "motion.section", color: T.fn },
      { text: ">", color: T.jsx },
    ],
  },
  { tokens: [{ text: "  );", color: T.punct }] },
  { tokens: [{ text: "};", color: T.punct }] },
  { tokens: [] },
  {
    tokens: [
      { text: "export default ", color: T.keyword },
      { text: "Hero", color: T.fn },
      { text: ";", color: T.punct },
    ],
  },
] as const;

const FILE_TABS: readonly FileTab[] = [
  { name: "Hero.tsx", lang: "tsx", dot: "#34d399", active: true },
  { name: "About.tsx", lang: "tsx", dot: "#60a5fa", active: false },
  { name: "styles.css", lang: "css", dot: "#f472b6", active: false },
] as const;

const FILE_TREE = [
  { name: "src", indent: 0, icon: "📁", open: true },
  { name: "components", indent: 1, icon: "📂", open: true },
  { name: "Hero.tsx", indent: 2, icon: "⚛", active: true },
  { name: "About.tsx", indent: 2, icon: "⚛", active: false },
  { name: "Footer.tsx", indent: 2, icon: "⚛", active: false },
  { name: "hooks", indent: 1, icon: "📂", open: true },
  { name: "useInView.ts", indent: 2, icon: "📄", active: false },
  { name: "animations.css", indent: 1, icon: "🎨", active: false },
  { name: "App.tsx", indent: 0, icon: "⚛", active: false },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Flatten a code line into a plain string (for character counting)
const lineText = (line: CodeLine): string =>
  line.tokens.map((t) => t.text).join("");

// ─── VSCodeWidget ─────────────────────────────────────────────────────────────

const VSCodeWidget: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  // Which lines are fully "typed" and how many chars on the current line
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentChars, setCurrentChars] = useState(0);
  const [cursorLine, setCursorLine] = useState(0);
  const [cursorCol, setCursorCol] = useState(0);
  const [blinkOn, setBlinkOn] = useState(true);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setBlinkOn((b) => !b), 530);
    return () => clearInterval(id);
  }, []);

  // Typing engine
  useEffect(() => {
    if (!inView) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const typeLine = (lineIdx: number, charIdx: number) => {
      if (lineIdx >= CODE_LINES.length) {
        // All done — restart after pause
        timeoutId = setTimeout(() => {
          setVisibleLines(0);
          setCurrentChars(0);
          setCursorLine(0);
          setCursorCol(0);
          typeLine(0, 0);
        }, 3000);
        return;
      }

      const line = CODE_LINES[lineIdx];
      const full = lineText(line);

      if (charIdx <= full.length) {
        setCurrentChars(charIdx);
        setCursorLine(lineIdx);
        setCursorCol(charIdx);

        const delay =
          full.length === 0
            ? 80 // blank lines fast
            : full.startsWith("//")
              ? 45 // comments medium
              : 30 + Math.random() * 25; // code: 30-55ms/char

        timeoutId = setTimeout(() => typeLine(lineIdx, charIdx + 1), delay);
      } else {
        // Line done — move to next
        setVisibleLines(lineIdx + 1);
        setCurrentChars(0);
        timeoutId = setTimeout(() => typeLine(lineIdx + 1, 0), 80);
      }
    };

    timeoutId = setTimeout(() => typeLine(0, 0), 600);
    return () => clearTimeout(timeoutId);
  }, [inView]);

  // Render a partial line (for the currently typing line)
  const renderPartialLine = useCallback((line: CodeLine, charCount: number) => {
    let remaining = charCount;
    const parts: React.ReactNode[] = [];
    line.tokens.forEach((token, ti) => {
      if (remaining <= 0) return;
      const chunk = token.text.slice(0, remaining);
      remaining -= token.text.length;
      parts.push(
        <span key={ti} style={{ color: token.color }}>
          {chunk}
        </span>,
      );
    });
    return parts;
  }, []);

  // Render a full completed line
  const renderFullLine = useCallback((line: CodeLine, li: number) => {
    if (line.tokens.length === 0) return <span>&nbsp;</span>;
    return line.tokens.map((token, ti) => (
      <span key={`${li}-${ti}`} style={{ color: token.color }}>
        {token.text}
      </span>
    ));
  }, []);

  const totalLines = CODE_LINES.length;
  const scrollTop = Math.max(0, cursorLine - 14) * 20; // auto-scroll: 20px per line

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      style={{
        width: "100%",
        maxWidth: 520,
        borderRadius: 16,
        overflow: "hidden",
        border: "0.5px solid rgba(139,92,246,0.2)",
        background: "rgba(5,3,15,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow:
          "0 24px 80px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(139,92,246,0.15)",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      }}
      aria-label="Live VS Code session widget"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap');

        .vsc-scrollable::-webkit-scrollbar { width: 4px; }
        .vsc-scrollable::-webkit-scrollbar-track { background: transparent; }
        .vsc-scrollable::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.25); border-radius: 2px; }
      `}</style>

      {/* ── Title bar ── */}
      <div
        style={{
          background: "rgba(30,22,50,0.9)",
          borderBottom: "0.5px solid rgba(255,255,255,0.05)",
          padding: "9px 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Traffic lights */}
        {(["#ff5f57", "#ffbd2e", "#28c840"] as const).map((c, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: c,
              opacity: 0.85,
              flexShrink: 0,
            }}
          />
        ))}
        {/* Title */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <span
            style={{
              fontSize: 11,
              color: "rgba(200,200,240,0.45)",
              letterSpacing: "0.3px",
            }}
          >
            Hero.tsx — shanjid-portfolio
          </span>
        </div>
        {/* Activity dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#34d399",
              boxShadow: "0 0 6px rgba(52,211,153,0.7)",
              animation: "vscPulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: "rgba(52,211,153,0.6)",
              letterSpacing: "1px",
            }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* ── File tabs ── */}
      <div
        style={{
          background: "rgba(20,15,38,0.95)",
          borderBottom: "0.5px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "stretch",
          height: 34,
          overflowX: "auto",
        }}
      >
        {FILE_TABS.map((tab) => (
          <div
            key={tab.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 14px",
              borderRight: "0.5px solid rgba(255,255,255,0.05)",
              background: tab.active ? "rgba(255,255,255,0.04)" : "transparent",
              borderBottom: tab.active
                ? `1px solid ${tab.dot}`
                : "1px solid transparent",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: tab.dot,
                opacity: tab.active ? 1 : 0.35,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.2px",
                color: tab.active
                  ? "rgba(220,220,245,0.9)"
                  : "rgba(200,200,240,0.35)",
                whiteSpace: "nowrap",
              }}
            >
              {tab.name}
            </span>
          </div>
        ))}
      </div>

      {/* ── Editor body: sidebar + code ── */}
      <div style={{ display: "flex", height: 280 }}>
        {/* File tree sidebar */}
        <div
          style={{
            width: 140,
            flexShrink: 0,
            background: "rgba(18,12,34,0.9)",
            borderRight: "0.5px solid rgba(255,255,255,0.04)",
            padding: "8px 0",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "rgba(200,200,240,0.3)",
              padding: "0 12px 6px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Explorer
          </div>
          {FILE_TREE.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: `3px ${12 + (item.indent || 0) * 10}px`,
                background: (item as any).active
                  ? "rgba(139,92,246,0.12)"
                  : "transparent",
                cursor: "default",
              }}
            >
              <span style={{ fontSize: 10, flexShrink: 0 }}>{item.icon}</span>
              <span
                style={{
                  fontSize: 10.5,
                  color: (item as any).active
                    ? "rgba(220,220,245,0.9)"
                    : "rgba(200,200,240,0.38)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>

        {/* Code panel */}
        <div
          className="vsc-scrollable"
          style={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Code lines container — auto-scrolls */}
          <div
            style={{
              paddingTop: 8,
              transform: `translateY(-${scrollTop}px)`,
              transition: "transform 0.12s ease",
            }}
          >
            {/* Completed lines */}
            {CODE_LINES.slice(0, visibleLines).map((line, li) => (
              <div
                key={li}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 20,
                  paddingLeft: 8,
                  background:
                    li === cursorLine
                      ? "rgba(255,255,255,0.025)"
                      : "transparent",
                }}
              >
                {/* Line number */}
                <span
                  style={{
                    width: 28,
                    textAlign: "right",
                    paddingRight: 12,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.2)",
                    userSelect: "none",
                    flexShrink: 0,
                  }}
                >
                  {li + 1}
                </span>
                {/* Code */}
                <span style={{ fontSize: 12, lineHeight: "20px" }}>
                  {renderFullLine(line, li)}
                </span>
              </div>
            ))}

            {/* Currently typing line */}
            {visibleLines < totalLines && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 20,
                  paddingLeft: 8,
                  background: "rgba(255,255,255,0.035)",
                }}
              >
                <span
                  style={{
                    width: 28,
                    textAlign: "right",
                    paddingRight: 12,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    userSelect: "none",
                    flexShrink: 0,
                  }}
                >
                  {visibleLines + 1}
                </span>
                <span style={{ fontSize: 12, lineHeight: "20px" }}>
                  {renderPartialLine(CODE_LINES[visibleLines], currentChars)}
                  {/* Blinking block cursor */}
                  <span
                    style={{
                      display: "inline-block",
                      width: 7,
                      height: 14,
                      background: blinkOn ? "#a78bfa" : "transparent",
                      verticalAlign: "middle",
                      borderRadius: 1,
                      marginLeft: 1,
                      boxShadow: blinkOn
                        ? "0 0 6px rgba(167,139,250,0.7)"
                        : "none",
                      transition: "background 0.05s, box-shadow 0.05s",
                    }}
                    aria-hidden="true"
                  />
                </span>
              </div>
            )}

            {/* Empty trailing lines */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`empty-${i}`}
                style={{
                  height: 20,
                  paddingLeft: 8,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    width: 28,
                    textAlign: "right",
                    paddingRight: 12,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.1)",
                    userSelect: "none",
                    flexShrink: 0,
                  }}
                >
                  {visibleLines + i + 2}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div
        style={{
          background: "rgba(109,40,217,0.75)",
          borderTop: "0.5px solid rgba(167,139,250,0.2)",
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          gap: 8,
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.3px",
            }}
          >
            ⎇ main
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>
            TypeScript React
          </span>
        </div>

        {/* Right: cursor position */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.65)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            Ln {cursorLine + 1}, Col {cursorCol + 1}
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
            UTF-8
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
            TSX
          </span>
        </div>
      </div>

      {/* Keyframe for activity dot */}
      <style>{`
        @keyframes vscPulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.4;transform:scale(1.4)}
        }
      `}</style>
    </motion.div>
  );
};

export default VSCodeWidget;
