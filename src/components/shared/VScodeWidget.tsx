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
  readonly dot: string;
  readonly active: boolean;
}

// ─── Syntax token colors (VS Code Dark+ palette) ──────────────────────────────

const T = {
  keyword: "#c792ea",
  fn: "#82aaff",
  string: "#c3e88d",
  comment: "#546e7a",
  type: "#ffcb6b",
  num: "#f78c6c",
  param: "#f07178",
  punct: "#89ddff",
  plain: "#a6accd",
  bright: "#eeffff",
  jsx: "#ff5370",
  prop: "#addb67",
} as const;

// ─── Code content ─────────────────────────────────────────────────────────────

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
  { name: "Hero.tsx", dot: "#34d399", active: true },
  { name: "About.tsx", dot: "#60a5fa", active: false },
  { name: "styles.css", dot: "#f472b6", active: false },
] as const;

// File tree — no emoji, use text glyphs that render consistently cross-platform
const FILE_TREE = [
  { name: "src", indent: 0, glyph: "▾", muted: false },
  { name: "components", indent: 1, glyph: "▾", muted: false },
  { name: "Hero.tsx", indent: 2, glyph: " ", muted: false, active: true },
  { name: "About.tsx", indent: 2, glyph: " ", muted: true, active: false },
  { name: "Footer.tsx", indent: 2, glyph: " ", muted: true, active: false },
  { name: "hooks", indent: 1, glyph: "▾", muted: false },
  { name: "useInView.ts", indent: 2, glyph: " ", muted: true, active: false },
  { name: "animations.css", indent: 1, glyph: " ", muted: true, active: false },
  { name: "App.tsx", indent: 0, glyph: " ", muted: true, active: false },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const lineText = (line: CodeLine): string =>
  line.tokens.map((t) => t.text).join("");

// ─── Hook: container width ────────────────────────────────────────────────────
// Tracks the rendered width so we can hide the sidebar on narrow screens.

const useContainerWidth = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [width, setWidth] = useState(999);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return width;
};

// ─── VSCodeWidget ─────────────────────────────────────────────────────────────

const VSCodeWidget: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(wrapperRef);

  // Hide sidebar below 380px, shrink font below 440px
  const showSidebar = containerWidth >= 380;
  const compactMode = containerWidth < 440;
  // Sidebar width scales with container — never wider than 130px
  const sidebarW = Math.min(130, Math.floor(containerWidth * 0.28));
  // Code font size: 11px on compact, 12px normal
  const codeFontSize = compactMode ? 11 : 12;
  // Line height in px — keep proportional
  const lineH = compactMode ? 18 : 20;
  // Editor body height — taller on wider screens (min 200, max 300)
  const editorH = Math.min(
    300,
    Math.max(200, Math.floor(containerWidth * 0.55)),
  );
  // How many visible lines before we start scrolling
  const visibleLineCount = Math.floor(editorH / lineH);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

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
            ? 80
            : full.startsWith("//")
              ? 45
              : 30 + Math.random() * 25;
        timeoutId = setTimeout(() => typeLine(lineIdx, charIdx + 1), delay);
      } else {
        setVisibleLines(lineIdx + 1);
        setCurrentChars(0);
        timeoutId = setTimeout(() => typeLine(lineIdx + 1, 0), 80);
      }
    };

    timeoutId = setTimeout(() => typeLine(0, 0), 600);
    return () => clearTimeout(timeoutId);
  }, [inView]);

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

  const renderFullLine = useCallback((line: CodeLine, li: number) => {
    if (line.tokens.length === 0) return <span>&nbsp;</span>;
    return line.tokens.map((token, ti) => (
      <span key={`${li}-${ti}`} style={{ color: token.color }}>
        {token.text}
      </span>
    ));
  }, []);

  const totalLines = CODE_LINES.length;
  // Auto-scroll: keep cursor in view, centre it once past halfway point
  const scrollTop =
    Math.max(0, cursorLine - Math.floor(visibleLineCount * 0.6)) * lineH;

  // Line number column width — always enough for 2 digits + padding
  const lineNumW = compactMode ? 24 : 28;

  return (
    // Outer wrapper: full width, measures itself
    <div ref={wrapperRef} style={{ width: "100%" }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        style={{
          width: "100%", // fills the column, not a fixed max-width
          borderRadius: 16,
          overflow: "hidden",
          border: "0.5px solid rgba(139,92,246,0.2)",
          background: "rgba(5,3,15,0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(139,92,246,0.15)",
          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          // Prevent any child text from forcing the widget wider than its parent
          minWidth: 0,
        }}
        aria-label="Live VS Code session widget"
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap');
          .vsc-code-scroll { overflow: hidden; position: relative; flex: 1; min-width: 0; }
          .vsc-code-scroll::-webkit-scrollbar { width: 3px; }
          .vsc-code-scroll::-webkit-scrollbar-track { background: transparent; }
          .vsc-code-scroll::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.25); border-radius: 2px; }
          @keyframes vscPulse {
            0%,100%{opacity:1;transform:scale(1)}
            50%{opacity:.4;transform:scale(1.4)}
          }
        `}</style>

        {/* ── Title bar ── */}
        <div
          style={{
            background: "rgba(30,22,50,0.9)",
            borderBottom: "0.5px solid rgba(255,255,255,0.05)",
            padding: compactMode ? "7px 10px" : "9px 14px",
            display: "flex",
            alignItems: "center",
            gap: compactMode ? 6 : 8,
            minWidth: 0,
          }}
        >
          {(["#ff5f57", "#ffbd2e", "#28c840"] as const).map((c, i) => (
            <div
              key={i}
              style={{
                width: compactMode ? 8 : 10,
                height: compactMode ? 8 : 10,
                borderRadius: "50%",
                background: c,
                opacity: 0.85,
                flexShrink: 0,
              }}
            />
          ))}
          {/* Title — truncates gracefully */}
          <div
            style={{
              flex: 1,
              textAlign: "center",
              overflow: "hidden",
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontSize: compactMode ? 10 : 11,
                color: "rgba(200,200,240,0.45)",
                letterSpacing: "0.3px",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Hero.tsx — shanjid-portfolio
            </span>
          </div>
          {/* Live indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
            }}
          >
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
            {!compactMode && (
              <span
                style={{
                  fontSize: 9,
                  color: "rgba(52,211,153,0.6)",
                  letterSpacing: "1px",
                }}
              >
                LIVE
              </span>
            )}
          </div>
        </div>

        {/* ── File tabs ── */}
        <div
          style={
            {
              background: "rgba(20,15,38,0.95)",
              borderBottom: "0.5px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "stretch",
              height: compactMode ? 28 : 34,
              overflowX: "auto",
              // Hide scrollbar on mobile — tabs are small enough
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            } as React.CSSProperties
          }
        >
          {FILE_TABS.map((tab) => (
            <div
              key={tab.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: compactMode ? 4 : 6,
                padding: compactMode ? "0 10px" : "0 14px",
                borderRight: "0.5px solid rgba(255,255,255,0.05)",
                background: tab.active
                  ? "rgba(255,255,255,0.04)"
                  : "transparent",
                borderBottom: tab.active
                  ? `1px solid ${tab.dot}`
                  : "1px solid transparent",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: compactMode ? 6 : 8,
                  height: compactMode ? 6 : 8,
                  borderRadius: "50%",
                  background: tab.dot,
                  opacity: tab.active ? 1 : 0.35,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: compactMode ? 10 : 11,
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

        {/* ── Editor body: [sidebar] + code ── */}
        <div style={{ display: "flex", height: editorH, minWidth: 0 }}>
          {/* File tree sidebar — hidden on narrow containers */}
          {showSidebar && (
            <div
              style={{
                width: sidebarW,
                flexShrink: 0,
                background: "rgba(18,12,34,0.9)",
                borderRight: "0.5px solid rgba(255,255,255,0.04)",
                padding: "8px 0",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: compactMode ? 8 : 9,
                  fontWeight: 600,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "rgba(200,200,240,0.3)",
                  padding: `0 ${compactMode ? 8 : 12}px 6px`,
                  fontFamily: "system-ui, sans-serif",
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
                    gap: 4,
                    padding: `2px ${compactMode ? 6 : 10}px 2px ${(compactMode ? 6 : 10) + (item.indent ?? 0) * (compactMode ? 8 : 10)}px`,
                    background: (item as typeof item & { active?: boolean })
                      .active
                      ? "rgba(139,92,246,0.12)"
                      : "transparent",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      fontSize: compactMode ? 9 : 10,
                      color: "rgba(200,200,240,0.45)",
                      flexShrink: 0,
                      fontFamily: "monospace",
                      lineHeight: 1,
                    }}
                  >
                    {item.glyph}
                  </span>
                  <span
                    style={{
                      fontSize: compactMode ? 9.5 : 10.5,
                      color: (item as typeof item & { active?: boolean }).active
                        ? "rgba(220,220,245,0.9)"
                        : item.muted
                          ? "rgba(200,200,240,0.32)"
                          : "rgba(200,200,240,0.55)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: "16px",
                    }}
                  >
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Code panel */}
          <div className="vsc-code-scroll">
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
                    height: lineH,
                    paddingLeft: 8,
                    background:
                      li === cursorLine
                        ? "rgba(255,255,255,0.025)"
                        : "transparent",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      width: lineNumW,
                      minWidth: lineNumW,
                      textAlign: "right",
                      paddingRight: compactMode ? 8 : 12,
                      fontSize: compactMode ? 10 : 11,
                      color: "rgba(255,255,255,0.2)",
                      userSelect: "none",
                      flexShrink: 0,
                    }}
                  >
                    {li + 1}
                  </span>
                  <span
                    style={{
                      fontSize: codeFontSize,
                      lineHeight: `${lineH}px`,
                      whiteSpace: "pre", // keeps code spacing intact
                      overflow: "hidden", // never pushes container wider
                    }}
                  >
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
                    height: lineH,
                    paddingLeft: 8,
                    background: "rgba(255,255,255,0.035)",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      width: lineNumW,
                      minWidth: lineNumW,
                      textAlign: "right",
                      paddingRight: compactMode ? 8 : 12,
                      fontSize: compactMode ? 10 : 11,
                      color: "rgba(255,255,255,0.35)",
                      userSelect: "none",
                      flexShrink: 0,
                    }}
                  >
                    {visibleLines + 1}
                  </span>
                  <span
                    style={{
                      fontSize: codeFontSize,
                      lineHeight: `${lineH}px`,
                      whiteSpace: "pre",
                      overflow: "hidden",
                    }}
                  >
                    {renderPartialLine(CODE_LINES[visibleLines], currentChars)}
                    {/* Blinking block cursor */}
                    <span
                      style={{
                        display: "inline-block",
                        width: compactMode ? 6 : 7,
                        height: compactMode ? 12 : 14,
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

              {/* Trailing empty lines */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  style={{
                    height: lineH,
                    paddingLeft: 8,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      width: lineNumW,
                      textAlign: "right",
                      paddingRight: compactMode ? 8 : 12,
                      fontSize: compactMode ? 10 : 11,
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
            height: compactMode ? 20 : 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${compactMode ? 8 : 12}px`,
            gap: 8,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: compactMode ? 6 : 10,
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <span
              style={{
                fontSize: compactMode ? 9 : 10,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.3px",
                whiteSpace: "nowrap",
              }}
            >
              ⎇ main
            </span>
            {!compactMode && (
              <span
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.55)",
                  whiteSpace: "nowrap",
                }}
              >
                TypeScript React
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: compactMode ? 6 : 10,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: compactMode ? 9 : 10,
                color: "rgba(255,255,255,0.65)",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              Ln {cursorLine + 1}, Col {cursorCol + 1}
            </span>
            {!compactMode && (
              <>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
                  UTF-8
                </span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
                  TSX
                </span>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VSCodeWidget;
