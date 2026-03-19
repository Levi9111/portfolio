import React, { useState, useEffect } from "react";
import { Terminal, Wifi, Battery } from "lucide-react";

// Lines the terminal cycles through — each starts with a prefix and has a color
interface TermLine {
  prefix: string;
  text: string;
  color: string;
  delay: number; // ms before this line starts typing
}

const TERM_LINES: readonly TermLine[] = [
  {
    prefix: "→",
    text: " shanjid@portfolio:~$ whoami",
    color: "#a78bfa",
    delay: 400,
  },
  {
    prefix: "",
    text: "  Full-Stack Developer · Chattogram, BD",
    color: "#e2e8f0",
    delay: 1200,
  },
  {
    prefix: "→",
    text: " shanjid@portfolio:~$ cat stack.txt",
    color: "#a78bfa",
    delay: 2200,
  },
  {
    prefix: "",
    text: "  MERN · Next.js · TypeScript · Docker",
    color: "#34d399",
    delay: 3000,
  },
  {
    prefix: "→",
    text: " shanjid@portfolio:~$ status --work",
    color: "#a78bfa",
    delay: 4000,
  },
  {
    prefix: "",
    text: "  ✓ Available for new projects",
    color: "#34d399",
    delay: 4800,
  },
  {
    prefix: "→",
    text: " shanjid@portfolio:~$ echo $VIBE",
    color: "#a78bfa",
    delay: 5800,
  },
  {
    prefix: "",
    text: "  Ship fast. Break nothing. 🚀",
    color: "#fbbf24",
    delay: 6600,
  },
] as const;

// ─── Live Clock ────────────────────────────────────────────────────────────────

const LiveClock: React.FC = () => {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = time.getHours().toString().padStart(2, "0");
  const mm = time.getMinutes().toString().padStart(2, "0");
  const ss = time.getSeconds().toString().padStart(2, "0");

  return (
    <span style={{ fontFamily: "'Syne', monospace", letterSpacing: "0.05em" }}>
      {hh}:{mm}
      <span
        style={{
          color: "#a78bfa",
          animation: "colonBlink 1s step-end infinite",
        }}
      >
        :
      </span>
      {ss}
    </span>
  );
};

// ─── Terminal Widget ──────────────────────────────────────────────────────────

const TerminalWidget: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typedChars, setTypedChars] = useState<number>(0);
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [phase, setPhase] = useState<"typing" | "waiting" | "done">("typing");
  const [batteryPct] = useState(() => Math.floor(Math.random() * 30) + 65); // 65-94%

  // Type line by line, then pause, then restart
  useEffect(() => {
    if (phase === "done") {
      const restart = setTimeout(() => {
        setVisibleLines(0);
        setTypedChars(0);
        setCurrentLine(0);
        setPhase("typing");
      }, 3500);
      return () => clearTimeout(restart);
    }

    if (phase === "waiting") {
      const next = setTimeout(() => {
        if (currentLine + 1 < TERM_LINES.length) {
          setCurrentLine((l) => l + 1);
          setTypedChars(0);
          setPhase("typing");
        } else {
          setPhase("done");
        }
      }, 600);
      return () => clearTimeout(next);
    }

    // typing phase
    const line = TERM_LINES[currentLine];
    const fullText = line.prefix + line.text;
    if (typedChars < fullText.length) {
      const delay = line.prefix === "→" ? 38 : 22; // commands type slower than output
      const t = setTimeout(() => setTypedChars((c) => c + 1), delay);
      return () => clearTimeout(t);
    } else {
      // finished this line
      setVisibleLines((l) => l + 1);
      setPhase("waiting");
    }
  }, [phase, typedChars, currentLine]);

  const allRendered = TERM_LINES.slice(0, visibleLines);
  const currentFull = TERM_LINES[currentLine]
    ? TERM_LINES[currentLine].prefix + TERM_LINES[currentLine].text
    : "";

  return (
    <div
      style={{
        background: "rgba(5,3,15,0.7)",
        border: "0.5px solid rgba(167,139,250,0.2)",
        borderRadius: 14,
        overflow: "hidden",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        width: "100%",
        maxWidth: 480,
      }}
    >
      {/* Terminal chrome */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          padding: "8px 13px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* Traffic lights */}
        {(["#ff5f57", "#ffbd2e", "#28c840"] as const).map((c) => (
          <span
            key={c}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: c,
              opacity: 0.75,
              display: "block",
            }}
          />
        ))}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Terminal size={10} color="rgba(200,200,240,0.4)" />
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            shanjid — bash
          </span>
        </div>
        {/* Status row: wifi + battery + clock */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Wifi size={9} color="rgba(52,211,153,0.7)" />
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Battery size={9} color="rgba(200,200,240,0.4)" />
            <span
              style={{
                fontSize: 8,
                color: "rgba(200,200,240,0.35)",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {batteryPct}%
            </span>
          </div>
          <span
            style={{
              fontSize: 8,
              color: "rgba(200,200,240,0.4)",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            <LiveClock />
          </span>
        </div>
      </div>

      {/* Terminal body */}
      <div
        style={{
          padding: "14px 16px",
          minHeight: 180,
          fontFamily: "'DM Sans', monospace",
          fontSize: 12,
          lineHeight: 1.7,
        }}
      >
        {/* Completed lines */}
        {allRendered.map((line, i) => (
          <div key={i} style={{ color: line.color, opacity: 0.9 }}>
            {line.prefix + line.text}
          </div>
        ))}

        {/* Currently typing line */}
        {phase !== "done" && (
          <div style={{ color: TERM_LINES[currentLine]?.color || "#fff" }}>
            {currentFull.slice(0, typedChars)}
            <span
              style={{
                animation: "cursorBlink 1s step-end infinite",
                color: "#a78bfa",
              }}
            >
              ▋
            </span>
          </div>
        )}

        {/* Idle cursor when done */}
        {phase === "done" && (
          <div style={{ color: "#a78bfa", opacity: 0.6 }}>
            → shanjid@portfolio:~${" "}
            <span style={{ animation: "cursorBlink 1s step-end infinite" }}>
              ▋
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalWidget;
