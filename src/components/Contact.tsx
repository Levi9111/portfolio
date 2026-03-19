import React, { useState, useRef, useEffect } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { motion, useInView, Variants, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

// ─── EmailJS config ───────────────────────────────────────────────────────────

const SERVICE_ID = import.meta.env.VITE_EMAIL_JS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY;
const AUTO_REPLY_TEMPLATE = import.meta.env
  .VITE_EMAIL_JS_AUTO_REPLY_TEMPLATE_ID;

// ─── Types ────────────────────────────────────────────────────────────────────

type FormStatus = "idle" | "loading" | "success" | "error";
type PhoneScreen = "idle" | "dialing" | "calling" | "email" | "map";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ─── Variants ─────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};
const fadeRight: Variants = {
  hidden: { opacity: 0, x: 28, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};
const screenAnim: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, scale: 0.96, y: -8, transition: { duration: 0.25 } },
};

// ─── Phone Dialer Hook ────────────────────────────────────────────────────────

const PHONE_NUMBER = "01626974685";

function useDialer(active: boolean) {
  const [digits, setDigits] = useState<string[]>([]);
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    if (!active) {
      setDigits([]);
      setCalling(false);
      return;
    }
    let i = 0;
    const dial = setInterval(() => {
      if (i < PHONE_NUMBER.length) {
        setDigits((d) => [...d, PHONE_NUMBER[i]]);
        i++;
      } else {
        clearInterval(dial);
        setTimeout(() => setCalling(true), 400);
      }
    }, 200);
    return () => clearInterval(dial);
  }, [active]);

  return { digits, calling };
}

// ─── Typewriter Hook ──────────────────────────────────────────────────────────

function useTypewriter(text: string, active: boolean, speed = 45) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    if (!active) {
      setDisplay("");
      return;
    }
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [active, text, speed]);
  return display;
}

// ─── Phone Screen: Idle ───────────────────────────────────────────────────────

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
          fontSize: 52,
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
          fontSize: 13,
          color: "rgba(255,255,255,0.4)",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {date}
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 11,
          color: "rgba(255,255,255,0.2)",
          fontFamily: "'DM Sans',sans-serif",
          letterSpacing: "0.08em",
          textAlign: "center",
        }}
      >
        Tap a contact button
        <br />
        to interact
      </div>
    </motion.div>
  );
};

// ─── Phone Screen: Dialing ────────────────────────────────────────────────────

const DialingScreen: React.FC<{ digits: string[]; calling: boolean }> = ({
  digits,
  calling,
}) => {
  const displayStr = digits.join("");
  const formatted =
    displayStr.length > 5
      ? `${displayStr.slice(0, 5)} ${displayStr.slice(5)}`
      : displayStr;

  if (calling) {
    return (
      <motion.div
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
        }}
      >
        {/* Ripple rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 80 + i * 32,
              height: 80 + i * 32,
              borderRadius: "50%",
              border: "1px solid rgba(52,211,153,0.35)",
              animation: `contactRipple 2s ${i * 0.4}s ease-out infinite`,
            }}
            aria-hidden="true"
          />
        ))}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#34d399,#059669)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Phone size={26} color="#fff" />
        </div>
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Syne',sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Shanjid Ahmad
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#34d399",
              marginTop: 4,
              fontFamily: "'DM Sans',sans-serif",
              animation: "contactDotPulse 1.5s ease-in-out infinite",
            }}
          >
            Calling…
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              marginTop: 4,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            +880 {PHONE_NUMBER}
          </div>
        </div>
        <a
          href={`tel:+880${PHONE_NUMBER}`}
          style={{
            marginTop: 8,
            padding: "8px 20px",
            borderRadius: 999,
            background: "#34d399",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            textDecoration: "none",
            fontFamily: "'DM Sans',sans-serif",
            letterSpacing: "0.05em",
            zIndex: 1,
          }}
        >
          Call Now ↗
        </a>
      </motion.div>
    );
  }

  const KEYS = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];

  return (
    <motion.div
      variants={screenAnim}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "12px 14px",
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
            fontSize: 26,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "2px",
            minHeight: 36,
            textAlign: "center",
          }}
        >
          {formatted}
          <span
            style={{
              opacity: 0.4,
              animation: "contactBlink 1s step-end infinite",
            }}
          >
            |
          </span>
        </div>
      </div>
      {/* Keypad */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 6,
        }}
      >
        {KEYS.map((row, ri) =>
          row.map((k, ki) => {
            const idx = ri * 3 + ki;
            const isNext = idx === digits.length;
            return (
              <div
                key={k}
                style={{
                  height: 36,
                  borderRadius: 10,
                  background: isNext
                    ? "rgba(52,211,153,0.25)"
                    : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isNext ? "rgba(52,211,153,0.5)" : "rgba(255,255,255,0.08)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 600,
                  color: isNext ? "#34d399" : "rgba(255,255,255,0.6)",
                  fontFamily: "'Syne',sans-serif",
                  transition: "all 0.15s",
                }}
              >
                {k}
              </div>
            );
          }),
        )}
      </div>
      {/* Green dial button */}
      <div
        style={{
          marginTop: 8,
          height: 36,
          borderRadius: 10,
          background: "rgba(52,211,153,0.15)",
          border: "1px solid rgba(52,211,153,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <Phone size={14} color="#34d399" />
        <span
          style={{
            fontSize: 11,
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

// ─── Phone Screen: Email ──────────────────────────────────────────────────────

const EMAIL_ADDRESS = "shanjidahmad502@gmail.com";

const EmailScreen: React.FC<{ active: boolean }> = ({ active }) => {
  const typed = useTypewriter(EMAIL_ADDRESS, active, 48);
  return (
    <motion.div
      variants={screenAnim}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "16px 14px",
        gap: 10,
      }}
    >
      {/* Mail header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          paddingBottom: 10,
          borderBottom: "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "rgba(96,165,250,0.15)",
            border: "1px solid rgba(96,165,250,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Mail size={13} color="#60a5fa" />
        </div>
        <div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            New Message
          </div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(96,165,250,0.7)",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Gmail
          </div>
        </div>
      </div>
      {/* To field */}
      <div>
        <div
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            fontFamily: "'DM Sans',sans-serif",
            marginBottom: 4,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          To
        </div>
        <div
          style={{
            padding: "7px 10px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            border: "0.5px solid rgba(96,165,250,0.3)",
            fontSize: 12,
            color: "#60a5fa",
            fontFamily: "'DM Sans',sans-serif",
            letterSpacing: "0.01em",
            minHeight: 28,
          }}
        >
          {typed}
          <span
            style={{
              opacity: 0.5,
              animation: "contactBlink 1s step-end infinite",
            }}
          >
            |
          </span>
        </div>
      </div>
      {/* Subject skeleton */}
      <div>
        <div
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            fontFamily: "'DM Sans',sans-serif",
            marginBottom: 4,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Subject
        </div>
        <div
          style={{
            height: 26,
            borderRadius: 8,
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.06)",
          }}
        />
      </div>
      {/* Body skeleton lines */}
      <div
        style={{
          flex: 1,
          padding: "8px 10px",
          borderRadius: 8,
          background: "rgba(255,255,255,0.02)",
          border: "0.5px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        {[85, 70, 90, 55].map((w, i) => (
          <div
            key={i}
            style={{
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.07)",
              width: `${w}%`,
            }}
          />
        ))}
      </div>
      {/* Send button */}
      <a
        href={`mailto:${EMAIL_ADDRESS}`}
        style={{
          height: 32,
          borderRadius: 9,
          background: "rgba(96,165,250,0.2)",
          border: "1px solid rgba(96,165,250,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          textDecoration: "none",
        }}
      >
        <Send size={11} color="#60a5fa" />
        <span
          style={{
            fontSize: 10,
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

// ─── Phone Screen: Map ────────────────────────────────────────────────────────

const MapScreen: React.FC = () => (
  <motion.div
    variants={screenAnim}
    initial="hidden"
    animate="show"
    exit="exit"
    style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "14px",
      gap: 12,
    }}
  >
    {/* Map area */}
    <div
      style={{
        flex: 1,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        background: "#0d1117",
        border: "0.5px solid rgba(167,139,250,0.2)",
      }}
    >
      {/* Grid lines simulating map */}
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
      {/* Subtle roads */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: 0,
          right: 0,
          height: "1.5px",
          background: "rgba(255,255,255,0.08)",
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
      {/* Location pin */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      >
        {/* Ripples */}
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 40 + i * 24,
              height: 40 + i * 24,
              borderRadius: "50%",
              border: "1px solid rgba(167,139,250,0.4)",
              animation: `contactRipple 2s ${i * 0.6}s ease-out infinite`,
            }}
            aria-hidden="true"
          />
        ))}
        {/* Pin */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50% 50% 50% 0",
            background: "#a78bfa",
            transform: "rotate(-45deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(167,139,250,0.5)",
          }}
        >
          <MapPin
            size={12}
            color="#fff"
            style={{ transform: "rotate(45deg)" }}
          />
        </div>
      </div>
    </div>
    {/* Location card */}
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        background: "rgba(167,139,250,0.08)",
        border: "0.5px solid rgba(167,139,250,0.25)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "rgba(167,139,250,0.6)",
          fontFamily: "'DM Sans',sans-serif",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 3,
        }}
      >
        Location
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#fff",
          fontFamily: "'Syne',sans-serif",
        }}
      >
        Chattogram, Bangladesh
      </div>
      <div
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.3)",
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
        height: 30,
        borderRadius: 9,
        background: "rgba(167,139,250,0.15)",
        border: "1px solid rgba(167,139,250,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        textDecoration: "none",
      }}
    >
      <MapPin size={11} color="#a78bfa" />
      <span
        style={{
          fontSize: 10,
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

// ─── Phone Mockup ─────────────────────────────────────────────────────────────

interface PhoneMockupProps {
  screen: PhoneScreen;
  dialerState: { digits: string[]; calling: boolean };
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ screen, dialerState }) => (
  <div style={{ position: "relative", width: 220, flexShrink: 0 }}>
    {/* Phone shell */}
    <div
      style={{
        width: 220,
        borderRadius: 36,
        background: "linear-gradient(160deg,#1a1a2e,#0f0f1a)",
        border: "1.5px solid rgba(255,255,255,0.12)",
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
        position: "relative",
        overflow: "hidden",
        paddingBottom: 8,
      }}
    >
      {/* Side volume buttons */}
      <div
        style={{
          position: "absolute",
          left: -4,
          top: 80,
          width: 3.5,
          height: 28,
          borderRadius: "3px 0 0 3px",
          background: "rgba(255,255,255,0.12)",
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: "absolute",
          left: -4,
          top: 116,
          width: 3.5,
          height: 28,
          borderRadius: "3px 0 0 3px",
          background: "rgba(255,255,255,0.12)",
        }}
        aria-hidden="true"
      />
      {/* Power button */}
      <div
        style={{
          position: "absolute",
          right: -4,
          top: 96,
          width: 3.5,
          height: 36,
          borderRadius: "0 3px 3px 0",
          background: "rgba(255,255,255,0.12)",
        }}
        aria-hidden="true"
      />

      {/* Status bar */}
      <div
        style={{
          padding: "10px 18px 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 600,
          }}
        >
          {new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
        {/* Notch / camera pill */}
        <div
          style={{
            width: 60,
            height: 16,
            borderRadius: 999,
            background: "#0a0a0f",
            border: "0.5px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
            }}
          />
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "0.5px solid rgba(255,255,255,0.2)",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <div
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            5G
          </div>
          {/* Battery */}
          <div
            style={{
              width: 18,
              height: 9,
              borderRadius: 2,
              border: "0.8px solid rgba(255,255,255,0.3)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -3,
                top: "25%",
                bottom: "25%",
                width: 2.5,
                background: "rgba(255,255,255,0.3)",
                borderRadius: "0 1px 1px 0",
              }}
            />
            <div
              style={{
                margin: 1.5,
                height: "calc(100% - 3px)",
                background: "#34d399",
                borderRadius: 1,
                width: "70%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Screen area */}
      <div
        style={{
          margin: "4px 10px 0",
          borderRadius: 24,
          background: "#08080f",
          overflow: "hidden",
          height: 340,
          position: "relative",
        }}
      >
        <AnimatePresence mode="wait">
          {screen === "idle" && <IdleScreen key="idle" />}
          {(screen === "dialing" || screen === "calling") && (
            <DialingScreen
              key="dialing"
              digits={dialerState.digits}
              calling={dialerState.calling}
            />
          )}
          {screen === "email" && <EmailScreen key="email" active />}
          {screen === "map" && <MapScreen key="map" />}
        </AnimatePresence>
      </div>

      {/* Home indicator */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 10,
          paddingBottom: 4,
        }}
      >
        <div
          style={{
            width: 60,
            height: 4,
            borderRadius: 2,
            background: "rgba(255,255,255,0.2)",
          }}
        />
      </div>
    </div>
  </div>
);

// ─── Contact trigger buttons ──────────────────────────────────────────────────

interface TriggerBtnProps {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
  active: boolean;
  onClick: () => void;
  href?: string;
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
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "13px 16px",
      borderRadius: 14,
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      border: `1px solid ${active ? accent + "55" : "rgba(255,255,255,0.08)"}`,
      background: active ? `${accent}10` : "rgba(255,255,255,0.03)",
      transition: "all 0.25s",
      position: "relative",
      overflow: "hidden",
    }}
    aria-pressed={active}
  >
    {/* Left accent bar */}
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
        transition: "opacity 0.25s",
        boxShadow: `0 0 8px ${accent}`,
      }}
      aria-hidden="true"
    />
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 11,
        flexShrink: 0,
        background: `${accent}14`,
        border: `1px solid ${accent}28`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.3s",
        transform: active ? "scale(1.1) rotate(-5deg)" : "scale(1)",
      }}
    >
      <Icon size={18} color={accent} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "rgba(200,200,240,0.38)",
          fontFamily: "'DM Sans',sans-serif",
          margin: "0 0 3px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 13,
          fontWeight: 400,
          color: active ? "#fff" : "rgba(220,220,245,0.7)",
          fontFamily: "'Outfit',sans-serif",
          margin: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transition: "color 0.25s",
        }}
      >
        {value}
      </p>
    </div>
    <ArrowUpRight
      size={13}
      color={accent}
      style={{
        opacity: active ? 1 : 0.3,
        transition: "opacity 0.25s",
        flexShrink: 0,
      }}
    />
  </button>
);

// ─── Availability Widget ──────────────────────────────────────────────────────

const AvailabilityWidget: React.FC = () => (
  <motion.div
    variants={fadeUp}
    style={{
      padding: "16px 18px",
      borderRadius: 14,
      border: "1px solid rgba(52,211,153,0.2)",
      background: "rgba(52,211,153,0.05)",
      backdropFilter: "blur(12px)",
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
            animation: "contactDotPulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#34d399",
            fontFamily: "'DM Sans',sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          Available for work
        </span>
      </div>
      <Zap size={14} color="#34d399" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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
              marginBottom: 5,
            }}
          >
            <Icon size={11} color={accent} />
            <span
              style={{
                fontSize: 9,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "rgba(200,200,240,0.35)",
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
  </motion.div>
);

// ─── Form Field ───────────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  name: string;
  label: string;
  hint?: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  disabled: boolean;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

const Field: React.FC<FieldProps> = ({
  id,
  name,
  label,
  hint,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled,
  required,
  multiline,
  rows = 5,
}) => {
  const [focused, setFocused] = useState(false);
  const base: React.CSSProperties = {
    width: "100%",
    outline: "none",
    padding: "12px 16px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 300,
    fontFamily: "'Outfit',sans-serif",
    color: "#fff",
    background: focused ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focused ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
    boxShadow: focused ? "0 0 0 3px rgba(139,92,246,0.12)" : "none",
    transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
    backdropFilter: "blur(8px)",
    resize: "none" as const,
  };
  return (
    <motion.div variants={fadeUp}>
      <label
        htmlFor={id}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 7,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.5px",
            color: "rgba(200,200,240,0.6)",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          {label}
          {required && (
            <span style={{ color: "#a78bfa", marginLeft: 3 }}>*</span>
          )}
        </span>
        {hint && (
          <span
            style={{
              fontSize: 10,
              color: "rgba(200,200,240,0.3)",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {hint}
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...base, display: "block" }}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={base}
        />
      )}
    </motion.div>
  );
};

// ─── Contact Section ──────────────────────────────────────────────────────────

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const [screen, setScreen] = useState<PhoneScreen>("idle");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  // Dialer state
  const dialerState = useDialer(screen === "dialing" || screen === "calling");

  // Auto-advance dialing → calling
  useEffect(() => {
    if (dialerState.calling && screen === "dialing") setScreen("calling");
  }, [dialerState.calling, screen]);

  const handleTrigger = (next: PhoneScreen) => {
    setScreen((prev) => (prev === next ? "idle" : next));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        PUBLIC_KEY,
      );
      await emailjs.send(
        SERVICE_ID,
        AUTO_REPLY_TEMPLATE,
        {
          name: formData.name,
          title: formData.subject,
          to_email: formData.email,
        },
        PUBLIC_KEY,
      );
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const loading = status === "loading";

  const SOCIAL_LINKS = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/levi9111",
      accent: "#e2e8f0",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/shanjid-ahmad-b77b5427b",
      accent: "#60a5fa",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        #contact-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          padding: 140px 0 120px;
          background: transparent;
          overflow: visible;
        }
        #contact-section::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent);
          pointer-events: none;
        }
        .contact-inner {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto; padding: 0 32px;
        }
        .contact-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 7px 16px; border-radius: 100px;
          border: 1px solid rgba(139,92,246,0.2);
          background: rgba(5,3,15,0.5); backdrop-filter: blur(12px);
          font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(167,139,250,0.85); margin-bottom: 20px;
        }
        .contact-eyebrow::before { content:''; display:block; width:20px; height:1px; background:rgba(139,92,246,0.5); }
        .contact-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(40px, 6.5vw, 76px);
          line-height: 1.05; color: #fff; letter-spacing: -1.5px;
        }
        .contact-title-accent {
          font-style: italic;
          background: linear-gradient(135deg,#a78bfa 0%,#818cf8 45%,#38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: contactHue 8s ease-in-out infinite;
        }
        @keyframes contactHue { 0%,100%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(25deg)} }
        .contact-divider {
          width:64px; height:1px; margin:24px auto 0;
          background:linear-gradient(90deg,transparent,rgba(139,92,246,0.6),transparent); position:relative;
        }
        .contact-divider::after {
          content:''; position:absolute; top:-2px; left:50%; transform:translateX(-50%);
          width:4px; height:4px; border-radius:50%; background:#a78bfa; box-shadow:0 0 8px #a78bfa;
        }

        /* Main body grid */
        .contact-body {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 40px;
          align-items: start;
        }

        /* Left panel: phone + triggers */
        .contact-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Phone + buttons side by side on desktop */
        .contact-phone-row {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .contact-triggers {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* Animations */
        @keyframes contactDotPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(1.5); }
        }
        @keyframes contactRipple {
          0%   { transform:translate(-50%,-50%) scale(0.7); opacity:0.8; }
          100% { transform:translate(-50%,-50%) scale(1);   opacity:0; }
        }
        @keyframes contactBlink {
          0%,100% { opacity:1; }
          50%      { opacity:0; }
        }

        /* Form */
        #contact-section input::placeholder,
        #contact-section textarea::placeholder { color:rgba(200,200,240,0.25); }
        #contact-section input:disabled,
        #contact-section textarea:disabled { opacity:0.5; cursor:not-allowed; }

        .contact-submit {
          width:100%; padding:14px 24px; border-radius:13px;
          border:1px solid rgba(139,92,246,0.4);
          background:rgba(139,92,246,0.15);
          color:rgba(200,180,255,0.95);
          font-family:'Outfit',sans-serif; font-size:15px; font-weight:500;
          cursor:pointer; position:relative; overflow:hidden;
          display:flex; align-items:center; justify-content:center; gap:9px;
          transition:background 0.25s,border-color 0.25s,color 0.25s,transform 0.2s,box-shadow 0.25s;
          backdrop-filter:blur(12px); letter-spacing:0.3px;
        }
        .contact-submit:hover:not(:disabled) {
          background:rgba(139,92,246,0.28); border-color:rgba(139,92,246,0.7);
          color:#d4bbff; transform:translateY(-2px); box-shadow:0 10px 36px rgba(139,92,246,0.25);
        }
        .contact-submit:disabled { opacity:0.6; cursor:not-allowed; }
        .contact-submit .sheen {
          position:absolute; inset:0;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%);
          transform:translateX(-100%); transition:transform 0.65s ease;
        }
        .contact-submit:hover:not(:disabled) .sheen { transform:translateX(100%); }
        @keyframes spin { to { transform:rotate(360deg); } }
        .contact-spinner {
          width:18px; height:18px; border-radius:50%;
          border:2px solid rgba(200,180,255,0.25); border-top-color:rgba(200,180,255,0.9);
          animation:spin 0.7s linear infinite;
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .contact-body { grid-template-columns: 1fr; gap: 32px; }
        }
        @media (max-width: 640px) {
          #contact-section { padding: 80px 0 72px; }
          .contact-inner { padding: 0 16px; }
          /* Stack phone above triggers */
          .contact-phone-row { flex-direction: column; align-items: center; }
          .contact-triggers { width: 100%; }
        }
        @media (max-width: 480px) {
          .contact-name-email { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section id="contact-section" ref={sectionRef}>
        <div className="contact-inner">
          {/* ── Header ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{ textAlign: "center", marginBottom: 72 }}
          >
            <motion.div variants={fadeUp}>
              <div className="contact-eyebrow">Let's collaborate</div>
            </motion.div>
            <motion.h2 className="contact-title" variants={fadeUp}>
              Let's <span className="contact-title-accent">Connect</span>
            </motion.h2>
            <motion.div variants={fadeUp}>
              <div className="contact-divider" />
            </motion.div>
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: 15,
                fontWeight: 300,
                color: "rgba(190,190,220,0.5)",
                maxWidth: 500,
                margin: "20px auto 0",
                lineHeight: 1.8,
              }}
            >
              Have a project in mind or just want to say hello? I read every
              message and reply within 24 hours.
            </motion.p>
          </motion.div>

          {/* ── Body ── */}
          <div className="contact-body">
            {/* ── Left: phone widget + triggers + availability + social ── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="contact-left"
            >
              {/* Sub-heading */}
              <motion.h3
                variants={fadeUp}
                style={{
                  fontFamily: "'Instrument Serif',serif",
                  fontSize: "clamp(20px,3vw,28px)",
                  fontWeight: 400,
                  color: "#fff",
                  letterSpacing: "-0.4px",
                  margin: 0,
                }}
              >
                Get in{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  touch
                </span>
              </motion.h3>

              <motion.p
                variants={fadeUp}
                style={{
                  fontSize: 13.5,
                  fontWeight: 300,
                  color: "rgba(190,190,220,0.45)",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                Open to freelance projects, full-time roles, and technical
                consulting. Based in Chattogram — working globally.
              </motion.p>

              {/* Phone mockup + trigger buttons */}
              <motion.div variants={fadeUp} className="contact-phone-row">
                <PhoneMockup screen={screen} dialerState={dialerState} />

                <div className="contact-triggers">
                  <TriggerBtn
                    icon={Phone}
                    label="WhatsApp"
                    value="+880 1626 974685"
                    accent="#34d399"
                    active={screen === "dialing" || screen === "calling"}
                    onClick={() => handleTrigger("dialing")}
                  />
                  <TriggerBtn
                    icon={Mail}
                    label="Email"
                    value="shanjidahmad502@gmail.com"
                    accent="#60a5fa"
                    active={screen === "email"}
                    onClick={() => handleTrigger("email")}
                  />
                  <TriggerBtn
                    icon={MapPin}
                    label="Location"
                    value="Chattogram, Bangladesh"
                    accent="#a78bfa"
                    active={screen === "map"}
                    onClick={() => handleTrigger("map")}
                  />
                </div>
              </motion.div>

              {/* Availability */}
              <AvailabilityWidget />

              {/* Social links */}
              <motion.div
                variants={fadeUp}
                style={{ display: "flex", gap: 10 }}
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
                      whileHover={{ scale: 1.1, y: -2 }}
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
                        color: "rgba(200,200,240,0.55)",
                        textDecoration: "none",
                        transition:
                          "border-color 0.25s,color 0.25s,background 0.25s",
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
                        el.style.color = "rgba(200,200,240,0.55)";
                        el.style.background = "rgba(255,255,255,0.03)";
                      }}
                    >
                      <Icon size={18} />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* ── Right: contact form ── */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
            >
              <div
                style={{
                  padding: "36px 32px",
                  borderRadius: 22,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(5,3,15,0.5)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background:
                      "radial-gradient(ellipse at 50% -20%,rgba(139,92,246,0.1),transparent 65%)",
                  }}
                  aria-hidden="true"
                />
                <motion.form
                  onSubmit={handleSubmit}
                  noValidate
                  variants={stagger}
                  initial="hidden"
                  animate={isInView ? "show" : "hidden"}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                    className="contact-name-email"
                  >
                    <Field
                      id="name"
                      name="name"
                      label="Name"
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <Field
                      id="email"
                      name="email"
                      label="Email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <Field
                    id="subject"
                    name="subject"
                    label="Subject"
                    hint="optional"
                    placeholder="Project idea / inquiry topic"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <Field
                    id="message"
                    name="message"
                    label="Message"
                    required
                    multiline
                    rows={5}
                    placeholder="Tell me about your project, or just say hello!"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 16px",
                        borderRadius: 11,
                        background: "rgba(52,211,153,0.1)",
                        border: "1px solid rgba(52,211,153,0.25)",
                      }}
                    >
                      <CheckCircle2 size={16} color="#34d399" />
                      <p
                        style={{
                          fontSize: 13,
                          color: "#34d399",
                          margin: 0,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        Message sent! I'll get back to you within 24 hours.
                      </p>
                    </motion.div>
                  )}
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 16px",
                        borderRadius: 11,
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.25)",
                      }}
                    >
                      <XCircle size={16} color="#f87171" />
                      <p
                        style={{
                          fontSize: 13,
                          color: "#f87171",
                          margin: 0,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        {!formData.name || !formData.email || !formData.message
                          ? "Please fill in all required fields."
                          : "Something went wrong. Please try again."}
                      </p>
                    </motion.div>
                  )}

                  <motion.div variants={fadeUp}>
                    <button
                      type="submit"
                      disabled={loading || status === "success"}
                      className="contact-submit"
                    >
                      <span className="sheen" aria-hidden="true" />
                      {loading ? (
                        <>
                          <span
                            className="contact-spinner"
                            aria-hidden="true"
                          />
                          Sending…
                        </>
                      ) : status === "success" ? (
                        <>
                          <CheckCircle2 size={17} />
                          Message Sent
                        </>
                      ) : (
                        <>
                          <Send size={17} />
                          Send Message
                        </>
                      )}
                    </button>
                  </motion.div>
                </motion.form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
