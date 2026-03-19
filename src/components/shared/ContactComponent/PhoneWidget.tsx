import React, { useState, useEffect } from "react";
import { Mail, MapPin, Phone, Send, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  screenAnim,
  fadeUp,
  PHONE_NUMBER,
  EMAIL_ADDRESS,
} from "./contactTypes";
import type { PhoneScreen } from "./contactTypes";

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useDialer(active: boolean): {
  digits: string[];
  calling: boolean;
} {
  const [digits, setDigits] = useState<string[]>([]);
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    if (!active) {
      setDigits([]);
      setCalling(false);
      return;
    }
    let i = 0;
    const timer = setInterval(() => {
      if (i < PHONE_NUMBER.length) {
        const idx = i;
        setDigits((d) => {
          const next = [...d];
          next[idx] = PHONE_NUMBER[idx];
          return next;
        });
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => setCalling(true), 500);
      }
    }, 220);
    return () => clearInterval(timer);
  }, [active]);

  return { digits, calling };
}

function useTypewriter(text: string, active: boolean, speed = 45): string {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    if (!active) {
      setDisplay("");
      return;
    }
    let i = 0;
    setDisplay("");
    const timer = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [active, text, speed]);
  return display;
}

// ─── Screens ──────────────────────────────────────────────────────────────────

const IdleScreen: React.FC = () => {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  return (
    <motion.div
      key="idle"
      variants={screenAnim}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "0 20px",
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 200,
          color: "#fff",
          letterSpacing: "-2px",
          fontFamily: "'Syne',sans-serif",
          lineHeight: 1,
        }}
      >
        {time}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.35)",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {date}
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 10.5,
          color: "rgba(255,255,255,0.18)",
          fontFamily: "'DM Sans',sans-serif",
          letterSpacing: "0.06em",
          textAlign: "center",
          lineHeight: 1.7,
        }}
      >
        Tap a button
        <br />
        to interact
      </div>
    </motion.div>
  );
};

// ─── Dialing screen — KEY FIX: highlight the digit just dialed ───────────────

const KEYPAD = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

interface DialingScreenProps {
  digits: string[];
  calling: boolean;
}

const DialingScreen: React.FC<DialingScreenProps> = ({ digits, calling }) => {
  const raw = digits.join("");
  const formatted = raw.length > 5 ? `${raw.slice(0, 5)} ${raw.slice(5)}` : raw;
  const lastDigit = digits.length > 0 ? digits[digits.length - 1] : null;

  if (calling)
    return (
      <motion.div
        key="calling"
        variants={screenAnim}
        initial="hidden"
        animate="show"
        exit="exit"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          position: "relative",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 72 + i * 28,
              height: 72 + i * 28,
              borderRadius: "50%",
              border: "1px solid rgba(52,211,153,0.35)",
              top: "50%",
              left: "50%",
              animation: `cRipple 2s ${i * 0.4}s ease-out infinite`,
            }}
            aria-hidden="true"
          />
        ))}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#34d399,#059669)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Phone size={24} color="#fff" />
        </div>
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Syne',sans-serif",
            }}
          >
            Shanjid Ahmad
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#34d399",
              marginTop: 3,
              fontFamily: "'DM Sans',sans-serif",
              animation: "cDotPulse 1.5s ease-in-out infinite",
            }}
          >
            Calling…
          </div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.25)",
              marginTop: 3,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            +880 {PHONE_NUMBER}
          </div>
        </div>
        <a
          href={`tel:+880${PHONE_NUMBER}`}
          style={{
            marginTop: 6,
            padding: "7px 18px",
            borderRadius: 999,
            background: "#34d399",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            textDecoration: "none",
            fontFamily: "'DM Sans',sans-serif",
            zIndex: 1,
          }}
        >
          Call Now ↗
        </a>
      </motion.div>
    );

  return (
    <motion.div
      key="dialing"
      variants={screenAnim}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "10px 12px",
      }}
    >
      {/* Number display */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "2px",
            textAlign: "center",
          }}
        >
          {formatted || <span style={{ opacity: 0.2 }}>—</span>}
          <span
            style={{ opacity: 0.35, animation: "cBlink 1s step-end infinite" }}
          >
            |
          </span>
        </div>
      </div>
      {/* Keypad — highlight the digit that was JUST pressed (lastDigit match) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 5,
        }}
      >
        {KEYPAD.map((row, ri) =>
          row.map((k, ki) => {
            // A key is "active" if it matches the last dialed digit AND it's currently being pressed
            // We track by digit value — for repeated digits we flash briefly
            const isActive = k === lastDigit && digits.length > 0;
            return (
              <div
                key={`${ri}-${ki}`}
                style={{
                  height: 34,
                  borderRadius: 9,
                  background: isActive
                    ? "rgba(52,211,153,0.3)"
                    : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isActive ? "rgba(52,211,153,0.6)" : "rgba(255,255,255,0.08)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  color: isActive ? "#34d399" : "rgba(255,255,255,0.55)",
                  fontFamily: "'Syne',sans-serif",
                  boxShadow: isActive
                    ? "0 0 10px rgba(52,211,153,0.25)"
                    : "none",
                  transition: "all 0.12s",
                }}
              >
                {k}
              </div>
            );
          }),
        )}
      </div>
      <div
        style={{
          marginTop: 6,
          height: 32,
          borderRadius: 9,
          background: "rgba(52,211,153,0.12)",
          border: "1px solid rgba(52,211,153,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <Phone size={12} color="#34d399" />
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#34d399",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Dialing…
        </span>
      </div>
    </motion.div>
  );
};

const EmailScreen: React.FC<{ active: boolean }> = ({ active }) => {
  const typed = useTypewriter(EMAIL_ADDRESS, active, 45);
  return (
    <motion.div
      key="email"
      variants={screenAnim}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "14px 12px",
        gap: 9,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          paddingBottom: 9,
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: "rgba(96,165,250,0.15)",
            border: "1px solid rgba(96,165,250,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Mail size={12} color="#60a5fa" />
        </div>
        <div>
          <div
            style={{
              fontSize: 9.5,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            New Message · Gmail
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: 8.5,
            color: "rgba(255,255,255,0.22)",
            fontFamily: "'DM Sans',sans-serif",
            marginBottom: 3,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          To
        </div>
        <div
          style={{
            padding: "6px 9px",
            borderRadius: 7,
            background: "rgba(255,255,255,0.04)",
            border: "0.5px solid rgba(96,165,250,0.3)",
            fontSize: 11,
            color: "#60a5fa",
            fontFamily: "'DM Sans',sans-serif",
            minHeight: 26,
          }}
        >
          {typed}
          <span
            style={{ opacity: 0.4, animation: "cBlink 1s step-end infinite" }}
          >
            |
          </span>
        </div>
      </div>
      <div
        style={{
          height: 24,
          borderRadius: 7,
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(255,255,255,0.06)",
        }}
      />
      <div
        style={{
          flex: 1,
          padding: "7px 9px",
          borderRadius: 7,
          background: "rgba(255,255,255,0.02)",
          border: "0.5px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {[80, 65, 88, 50].map((w, i) => (
          <div
            key={i}
            style={{
              height: 3.5,
              borderRadius: 2,
              background: "rgba(255,255,255,0.07)",
              width: `${w}%`,
            }}
          />
        ))}
      </div>
      <a
        href={`mailto:${EMAIL_ADDRESS}`}
        style={{
          height: 30,
          borderRadius: 8,
          background: "rgba(96,165,250,0.18)",
          border: "1px solid rgba(96,165,250,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          textDecoration: "none",
        }}
      >
        <Send size={10} color="#60a5fa" />
        <span
          style={{
            fontSize: 9.5,
            fontWeight: 600,
            color: "#60a5fa",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Open in Gmail ↗
        </span>
      </a>
    </motion.div>
  );
};

const MapScreen: React.FC = () => (
  <motion.div
    key="map"
    variants={screenAnim}
    initial="hidden"
    animate="show"
    exit="exit"
    style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "12px",
      gap: 10,
    }}
  >
    <div
      style={{
        flex: 1,
        borderRadius: 11,
        overflow: "hidden",
        position: "relative",
        background: "#0d1117",
        border: "0.5px solid rgba(167,139,250,0.2)",
      }}
    >
      {[20, 40, 60, 80].map((p) => (
        <React.Fragment key={p}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${p}%`,
              height: "0.5px",
              background: "rgba(255,255,255,0.04)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${p}%`,
              width: "0.5px",
              background: "rgba(255,255,255,0.04)",
            }}
          />
        </React.Fragment>
      ))}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: 0,
          right: 0,
          height: "1.5px",
          background: "rgba(255,255,255,0.07)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "38%",
          top: 0,
          bottom: 0,
          width: "1.5px",
          background: "rgba(255,255,255,0.06)",
        }}
      />
      <div style={{ position: "absolute", top: "50%", left: "50%", zIndex: 2 }}>
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 36 + i * 22,
              height: 36 + i * 22,
              borderRadius: "50%",
              border: "1px solid rgba(167,139,250,0.4)",
              top: "50%",
              left: "50%",
              animation: `cRipple 2s ${i * 0.6}s ease-out infinite`,
            }}
            aria-hidden="true"
          />
        ))}
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50% 50% 50% 0",
            background: "#a78bfa",
            transform: "rotate(-45deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(167,139,250,0.5)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <MapPin
            size={11}
            color="#fff"
            style={{ transform: "rotate(45deg)" }}
          />
        </div>
      </div>
    </div>
    <div
      style={{
        padding: "9px 11px",
        borderRadius: 9,
        background: "rgba(167,139,250,0.08)",
        border: "0.5px solid rgba(167,139,250,0.22)",
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "rgba(167,139,250,0.6)",
          fontFamily: "'DM Sans',sans-serif",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 2,
        }}
      >
        Location
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#fff",
          fontFamily: "'Syne',sans-serif",
        }}
      >
        Chattogram, Bangladesh
      </div>
      <div
        style={{
          fontSize: 9,
          color: "rgba(255,255,255,0.28)",
          fontFamily: "'DM Sans',sans-serif",
          marginTop: 2,
        }}
      >
        22.3569° N, 91.7832° E · Working globally
      </div>
    </div>
    <a
      href="https://maps.google.com/?q=Chattogram,Bangladesh"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        height: 28,
        borderRadius: 8,
        background: "rgba(167,139,250,0.14)",
        border: "1px solid rgba(167,139,250,0.32)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        textDecoration: "none",
      }}
    >
      <MapPin size={10} color="#a78bfa" />
      <span
        style={{
          fontSize: 9.5,
          fontWeight: 600,
          color: "#a78bfa",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        Open in Google Maps ↗
      </span>
    </a>
  </motion.div>
);

// ─── Phone Shell ──────────────────────────────────────────────────────────────

interface PhoneMockupProps {
  screen: PhoneScreen;
  digits: string[];
  calling: boolean;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({
  screen,
  digits,
  calling,
}) => {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return (
    <div style={{ width: 210, flexShrink: 0 }}>
      <div
        style={{
          width: 210,
          borderRadius: 34,
          background: "linear-gradient(160deg,#1a1a2e,#0f0f1a)",
          border: "1.5px solid rgba(255,255,255,0.11)",
          boxShadow:
            "0 28px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
          position: "relative",
          paddingBottom: 6,
          overflow: "visible",
        }}
      >
        {/* Buttons */}
        <div
          style={{
            position: "absolute",
            left: -4,
            top: 76,
            width: 3.5,
            height: 26,
            borderRadius: "3px 0 0 3px",
            background: "rgba(255,255,255,0.11)",
          }}
          aria-hidden="true"
        />
        <div
          style={{
            position: "absolute",
            left: -4,
            top: 110,
            width: 3.5,
            height: 26,
            borderRadius: "3px 0 0 3px",
            background: "rgba(255,255,255,0.11)",
          }}
          aria-hidden="true"
        />
        <div
          style={{
            position: "absolute",
            right: -4,
            top: 90,
            width: 3.5,
            height: 34,
            borderRadius: "0 3px 3px 0",
            background: "rgba(255,255,255,0.11)",
          }}
          aria-hidden="true"
        />
        {/* Status bar */}
        <div
          style={{
            padding: "9px 16px 3px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.65)",
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 600,
            }}
          >
            {time}
          </span>
          <div
            style={{
              width: 56,
              height: 15,
              borderRadius: 999,
              background: "#0a0a0f",
              border: "0.5px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.14)",
              }}
            />
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                border: "0.5px solid rgba(255,255,255,0.18)",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <span
              style={{
                fontSize: 8.5,
                color: "rgba(255,255,255,0.45)",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              5G
            </span>
            <div
              style={{
                width: 16,
                height: 8,
                borderRadius: 2,
                border: "0.7px solid rgba(255,255,255,0.28)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: -2.5,
                  top: "25%",
                  bottom: "25%",
                  width: 2,
                  background: "rgba(255,255,255,0.28)",
                  borderRadius: "0 1px 1px 0",
                }}
              />
              <div
                style={{
                  margin: 1.2,
                  height: "calc(100% - 2.4px)",
                  background: "#34d399",
                  borderRadius: 1,
                  width: "70%",
                }}
              />
            </div>
          </div>
        </div>
        {/* Screen */}
        <div
          style={{
            margin: "3px 9px 0",
            borderRadius: 22,
            background: "#08080f",
            overflow: "hidden",
            height: 320,
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait">
            {screen === "idle" ? (
              <IdleScreen key="idle" />
            ) : screen === "dialing" || screen === "calling" ? (
              <DialingScreen key="dial" digits={digits} calling={calling} />
            ) : screen === "email" ? (
              <EmailScreen key="email" active />
            ) : screen === "map" ? (
              <MapScreen key="map" />
            ) : null}
          </AnimatePresence>
        </div>
        {/* Home bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 9,
            paddingBottom: 3,
          }}
        >
          <div
            style={{
              width: 54,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.18)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Trigger button ───────────────────────────────────────────────────────────

interface TriggerBtnProps {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
  active: boolean;
  onClick: () => void;
}

const TriggerBtn: React.FC<TriggerBtnProps> = ({
  icon: Icon,
  label,
  value,
  accent,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "12px 14px",
      borderRadius: 13,
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      border: `1px solid ${active ? accent + "55" : "rgba(255,255,255,0.07)"}`,
      background: active ? `${accent}10` : "rgba(255,255,255,0.03)",
      transition: "all 0.22s",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: "15%",
        bottom: "15%",
        width: 3,
        borderRadius: 2,
        background: accent,
        opacity: active ? 1 : 0,
        transition: "opacity 0.22s",
        boxShadow: `0 0 8px ${accent}`,
      }}
      aria-hidden="true"
    />
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        flexShrink: 0,
        background: `${accent}14`,
        border: `1px solid ${accent}28`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.28s",
        transform: active ? "scale(1.1) rotate(-5deg)" : "scale(1)",
      }}
    >
      <Icon size={16} color={accent} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "rgba(200,200,240,0.35)",
          fontFamily: "'DM Sans',sans-serif",
          margin: "0 0 2px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 12.5,
          color: active ? "#fff" : "rgba(220,220,245,0.65)",
          fontFamily: "'Outfit',sans-serif",
          margin: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transition: "color 0.22s",
        }}
      >
        {value}
      </p>
    </div>
    <ArrowUpRight
      size={12}
      color={accent}
      style={{
        opacity: active ? 1 : 0.25,
        transition: "opacity 0.22s",
        flexShrink: 0,
      }}
    />
  </button>
);

// ─── Phone Widget (shell card + phone + triggers) ─────────────────────────────

interface PhoneWidgetProps {
  screen: PhoneScreen;
  digits: string[];
  calling: boolean;
  onTrigger: (s: PhoneScreen) => void;
}

const PhoneWidget: React.FC<PhoneWidgetProps> = ({
  screen,
  digits,
  calling,
  onTrigger,
}) => (
  <motion.div
    variants={fadeUp}
    style={{
      borderRadius: 20,
      background: "rgba(5,3,15,0.5)",
      border: "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      overflow: "hidden",
      position: "relative",
    }}
  >
    {/* Card top radial */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse at 40% 0%,rgba(52,211,153,0.06),transparent 60%)",
      }}
      aria-hidden="true"
    />

    {/* Chrome bar */}
    <div
      style={{
        padding: "10px 16px",
        borderBottom: "0.5px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.025)",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#ff5f57",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#ffbd2e",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#28c840",
          opacity: 0.7,
        }}
      />
      <span
        style={{
          marginLeft: 6,
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.18)",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        Contact
      </span>
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "rgba(34,197,94,0.1)",
          border: "0.5px solid rgba(34,197,94,0.25)",
          borderRadius: 999,
          padding: "2px 7px",
        }}
      >
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#22c55e",
            animation: "cDotPulse 1.6s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 8,
            fontWeight: 600,
            color: "#22c55e",
            letterSpacing: "0.06em",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Online
        </span>
      </div>
    </div>

    {/* Body */}
    <div style={{ padding: "20px 18px 22px" }}>
      {/* Phone + triggers */}
      <div
        className="cc-phone-row"
        style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
      >
        <PhoneMockup screen={screen} digits={digits} calling={calling} />
        <div
          className="cc-triggers"
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}
        >
          <TriggerBtn
            icon={Phone}
            label="WhatsApp"
            value="+880 1626 974685"
            accent="#34d399"
            active={screen === "dialing" || screen === "calling"}
            onClick={() => onTrigger("dialing")}
          />
          <TriggerBtn
            icon={Mail}
            label="Email"
            value="shanjidahmad502@gmail.com"
            accent="#60a5fa"
            active={screen === "email"}
            onClick={() => onTrigger("email")}
          />
          <TriggerBtn
            icon={MapPin}
            label="Location"
            value="Chattogram, Bangladesh"
            accent="#a78bfa"
            active={screen === "map"}
            onClick={() => onTrigger("map")}
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export default PhoneWidget;
