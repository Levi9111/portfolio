import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | "idle"
  | "countdown"
  | "launching"
  | "flying"
  | "landing"
  | "exploding"
  | "done";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  shape: "rect" | "circle" | "triangle";
}

// ─── SVG Rocket ───────────────────────────────────────────────────────────────

interface RocketSvgProps {
  size?: number;
  glowing?: boolean;
}

const RocketSvg: React.FC<RocketSvgProps> = ({
  size = 80,
  glowing = false,
}) => (
  <svg
    width={size}
    height={size * 2.2}
    viewBox="0 0 80 176"
    fill="none"
    style={{
      filter: glowing
        ? "drop-shadow(0 0 12px rgba(167,139,250,0.9)) drop-shadow(0 0 28px rgba(251,191,36,0.5))"
        : "none",
      transition: "filter 0.3s",
    }}
    aria-hidden="true"
  >
    {/* Nose cone */}
    <path
      d="M40 4 C40 4 20 36 18 56 L62 56 C60 36 40 4 40 4Z"
      fill="url(#rng)"
    />
    <ellipse cx="40" cy="8" rx="4" ry="5" fill="rgba(255,255,255,0.22)" />
    {/* Body */}
    <rect x="18" y="56" width="44" height="72" rx="4" fill="url(#rbg)" />
    <line
      x1="18"
      y1="80"
      x2="62"
      y2="80"
      stroke="rgba(255,255,255,0.07)"
      strokeWidth="1"
    />
    <line
      x1="18"
      y1="104"
      x2="62"
      y2="104"
      stroke="rgba(255,255,255,0.07)"
      strokeWidth="1"
    />
    {/* Stripes */}
    <rect x="18" y="60" width="44" height="7" fill="url(#rsg)" opacity="0.65" />
    <rect
      x="18"
      y="121"
      width="44"
      height="7"
      fill="url(#rsg)"
      opacity="0.65"
    />
    {/* Window */}
    <circle
      cx="40"
      cy="88"
      r="11"
      fill="#0a0a1a"
      stroke="rgba(255,255,255,0.18)"
      strokeWidth="1.5"
    />
    <circle cx="40" cy="88" r="7.5" fill="url(#rwg)" />
    <ellipse
      cx="37"
      cy="84.5"
      rx="3"
      ry="2"
      fill="rgba(255,255,255,0.28)"
      transform="rotate(-20 37 84.5)"
    />
    {/* Left fin */}
    <path d="M18 100 L4 136 L18 128Z" fill="url(#rfg)" />
    {/* Right fin */}
    <path d="M62 100 L76 136 L62 128Z" fill="url(#rfg)" />
    {/* Exhaust bell */}
    <path d="M24 128 L14 154 L66 154 L56 128Z" fill="url(#rbellg)" />
    <path d="M28 128 L20 150 L60 150 L52 128Z" fill="rgba(0,0,0,0.4)" />
    <rect x="22" y="126" width="36" height="5" rx="2" fill="url(#rring)" />
    {/* Nozzle */}
    <ellipse cx="40" cy="154" rx="26" ry="5" fill="#050508" />
    <ellipse cx="40" cy="154" rx="20" ry="3.5" fill="#0a0a12" />
    {/* Bolts */}
    {[30, 40, 50].map((x) => (
      <circle key={x} cx={x} cy="60" r="1.5" fill="rgba(255,255,255,0.18)" />
    ))}

    <defs>
      <linearGradient id="rng" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#c4b5fd" />
        <stop offset="50%" stopColor="#f0e9ff" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      <linearGradient id="rbg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="35%" stopColor="#ddd6fe" />
        <stop offset="65%" stopColor="#ede9fe" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
      <linearGradient id="rsg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="rfg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#5b21b6" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      <linearGradient id="rbellg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4c1d95" />
        <stop offset="100%" stopColor="#1e1b2e" />
      </linearGradient>
      <linearGradient id="rring" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6d28d9" />
        <stop offset="50%" stopColor="#c4b5fd" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
      <radialGradient id="rwg" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="60%" stopColor="#1e3a5f" />
        <stop offset="100%" stopColor="#0a1628" />
      </radialGradient>
    </defs>
  </svg>
);

// ─── Flame ────────────────────────────────────────────────────────────────────

const Flame: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => (
  <div
    style={{ position: "relative", width: 52, height: 90, margin: "0 auto" }}
  >
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 52,
        height: 90 * intensity,
        background:
          "radial-gradient(ellipse at 50% 100%,#fbbf24 0%,#f97316 35%,#ef4444 65%,transparent 100%)",
        borderRadius: "50% 50% 30% 30%",
        animation: "rflameF 0.08s ease-in-out infinite alternate",
        opacity: intensity,
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 28,
        height: 60 * intensity,
        background:
          "radial-gradient(ellipse at 50% 100%,#fefce8 0%,#fde68a 40%,#fbbf24 80%,transparent 100%)",
        borderRadius: "50% 50% 30% 30%",
        animation: "rflameF 0.06s ease-in-out infinite alternate-reverse",
        opacity: intensity,
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: -10,
        left: "50%",
        transform: "translateX(-50%)",
        width: 60,
        height: 20,
        background:
          "radial-gradient(ellipse,rgba(251,191,36,0.4) 0%,transparent 70%)",
        opacity: intensity,
      }}
    />
  </div>
);

// ─── Launch Pad ───────────────────────────────────────────────────────────────

const LaunchPad: React.FC = () => (
  <div style={{ position: "relative", width: 160, margin: "0 auto" }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 28,
        width: 40,
        height: 4,
        background: "linear-gradient(to right,#374151,#6b7280)",
        borderRadius: 2,
        transform: "rotate(-8deg)",
        transformOrigin: "left",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 12,
        width: 4,
        height: 24,
        background: "#4b5563",
        borderRadius: 2,
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 0,
        bottom: 28,
        width: 40,
        height: 4,
        background: "linear-gradient(to left,#374151,#6b7280)",
        borderRadius: 2,
        transform: "rotate(8deg)",
        transformOrigin: "right",
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 0,
        bottom: 12,
        width: 4,
        height: 24,
        background: "#4b5563",
        borderRadius: 2,
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 100,
        height: 8,
        background: "linear-gradient(to right,#374151,#9ca3af,#374151)",
        borderRadius: "3px 3px 0 0",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 120,
        height: 5,
        background: "#1f2937",
        borderRadius: "0 0 2px 2px",
      }}
    />
    {[-28, 0, 28].map((x) => (
      <div
        key={x}
        style={{
          position: "absolute",
          bottom: 5,
          left: `calc(50% + ${x}px)`,
          width: 6,
          height: 18,
          background: "#374151",
          borderRadius: 1,
          transform: "translateX(-50%)",
        }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        bottom: -4,
        left: "50%",
        transform: "translateX(-50%)",
        width: 80,
        height: 8,
        background: "#111827",
        borderRadius: "0 0 4px 4px",
      }}
    />
    {[-20, 20].map((x) => (
      <div
        key={x}
        style={{
          position: "absolute",
          bottom: 10,
          left: `calc(50% + ${x}px)`,
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#ef4444",
          boxShadow: "0 0 6px #ef4444",
          animation: "rpadBlink 1s ease-in-out infinite",
        }}
      />
    ))}
  </div>
);

// ─── Stars ────────────────────────────────────────────────────────────────────

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 3,
}));

const Stars: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      opacity: visible ? 1 : 0,
      transition: "opacity 1s",
    }}
    aria-hidden="true"
  >
    {STARS.map((s) => (
      <div
        key={s.id}
        style={{
          position: "absolute",
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: s.size,
          height: s.size,
          borderRadius: "50%",
          background: "#fff",
          opacity: 0.4,
          animation: `rstarT 2s ${s.delay}s ease-in-out infinite alternate`,
        }}
      />
    ))}
  </div>
);

// ─── Countdown ────────────────────────────────────────────────────────────────

const Countdown: React.FC<{ count: number }> = ({ count }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={count}
      initial={{ scale: 2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: "clamp(80px,18vw,160px)",
          fontWeight: 800,
          color: "#fff",
          textShadow:
            "0 0 40px rgba(167,139,250,0.8), 0 0 80px rgba(251,191,36,0.4)",
        }}
      >
        {count === 0 ? "🚀" : count}
      </div>
    </motion.div>
  </AnimatePresence>
);

// ─── Flying Rocket — eases to LAND at top, does NOT vanish ───────────────────

interface FlyingRocketProps {
  onLanded: () => void;
}

const LAND_Y = 60; // px from top of viewport where rocket stops
const TRAIL_COLOR =
  "linear-gradient(to bottom, rgba(167,139,250,0.7), rgba(251,191,36,0.3), transparent)";

const FlyingRocket: React.FC<FlyingRocketProps> = ({ onLanded }) => {
  const startY = window.innerHeight - 160;
  const [posY, setPosY] = useState(startY);
  const rafRef = useRef<number>();
  const startRef = useRef<number | null>(null);
  const landedRef = useRef(false);
  const duration = 1800; // ms — matches smooth scroll duration approx

  useEffect(() => {
    const animate = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic — starts fast, decelerates into landing
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startY + (LAND_Y - startY) * eased;

      setPosY(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else if (!landedRef.current) {
        landedRef.current = true;
        setPosY(LAND_Y);
        // Brief pause at top, then explode
        setTimeout(() => onLanded(), 300);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onLanded, startY]);

  const trailHeight = Math.max(0, posY - LAND_Y + window.innerHeight);

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        top: posY,
        transform: "translateX(-50%)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {/* Trail */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "100%",
          transform: "translateX(-50%)",
          width: 3,
          height: trailHeight,
          background: TRAIL_COLOR,
          opacity: 0.8,
        }}
        aria-hidden="true"
      />
      <RocketSvg size={56} glowing />
      <div style={{ marginTop: -8 }}>
        <Flame intensity={1} />
      </div>
    </div>
  );
};

// ─── Explosion — always at LAND_Y on screen ───────────────────────────────────

const PARTICLE_COLORS = [
  "#fbbf24",
  "#f97316",
  "#ef4444",
  "#a78bfa",
  "#60a5fa",
  "#34d399",
  "#f472b6",
  "#fef08a",
  "#c4b5fd",
];

const Explosion: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const cx = window.innerWidth / 2;
  const cy = LAND_Y + 60; // center of explosion — at the rocket's body

  const particles = useRef<Particle[]>(
    Array.from({ length: 36 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 36 + (Math.random() - 0.5) * 0.4;
      const speed = 3 + Math.random() * 9;
      return {
        id: i,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 3,
        color:
          PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        size: 3 + Math.random() * 7,
        rotation: Math.random() * 360,
        shape: (["rect", "circle", "triangle"] as const)[
          Math.floor(Math.random() * 3)
        ],
      };
    }),
  );

  const [tick, setTick] = useState(0);
  const rafRef = useRef<number>();
  const doneRef = useRef(false);

  useEffect(() => {
    let t = 0;
    const run = () => {
      t++;
      setTick(t);
      if (t < 100) {
        rafRef.current = requestAnimationFrame(run);
      } else if (!doneRef.current) {
        doneRef.current = true;
        setTimeout(onDone, 300);
      }
    };
    rafRef.current = requestAnimationFrame(run);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {/* Flash */}
      {tick < 10 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `rgba(251,191,36,${0.55 * (1 - tick / 10)})`,
          }}
        />
      )}
      {/* Shockwave */}
      {tick < 40 && (
        <div
          style={{
            position: "absolute",
            top: cy,
            left: cx,
            width: tick * 9,
            height: tick * 9,
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            border: `2px solid rgba(251,191,36,${Math.max(0, 0.9 - tick / 40)})`,
          }}
        />
      )}
      {/* BOOM text */}
      {tick > 2 && tick < 40 && (
        <div
          style={{
            position: "absolute",
            top: cy - 60,
            left: "50%",
            transform: `translateX(-50%) scale(${Math.min(1, tick / 8)})`,
            fontFamily: "'Syne',sans-serif",
            fontSize: 52,
            fontWeight: 800,
            color: "#fbbf24",
            textShadow: "0 0 24px rgba(251,191,36,0.9)",
            opacity: Math.max(0, 1 - (tick - 22) / 18),
            whiteSpace: "nowrap",
          }}
        >
          💥 BOOM
        </div>
      )}
      {/* Particles with gravity */}
      {particles.current.map((p) => {
        const x = p.x + p.vx * tick;
        const y = p.y + p.vy * tick + 0.28 * tick * tick;
        const opacity = Math.max(0, 1 - tick / 75);
        const rot = p.rotation + tick * p.vx * 4;
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity,
              transform: `translate(-50%,-50%) rotate(${rot}deg)`,
            }}
          >
            {p.shape === "circle" && (
              <div
                style={{
                  width: p.size,
                  height: p.size,
                  borderRadius: "50%",
                  background: p.color,
                  boxShadow: `0 0 ${p.size}px ${p.color}`,
                }}
              />
            )}
            {p.shape === "rect" && (
              <div
                style={{
                  width: p.size * 2.2,
                  height: p.size * 0.55,
                  background: p.color,
                  borderRadius: 1,
                }}
              />
            )}
            {p.shape === "triangle" && (
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: `${p.size * 0.6}px solid transparent`,
                  borderRight: `${p.size * 0.6}px solid transparent`,
                  borderBottom: `${p.size}px solid ${p.color}`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Section ─────────────────────────────────────────────────────────────

const RocketLaunch: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-10%" });

  const [phase, setPhase] = useState<Phase>("idle");
  const [countdown, setCountdown] = useState(3);
  const [showFlame, setShowFlame] = useState(false);

  // Smooth scroll to top — fires when flying starts
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Countdown → launch sequence
  useEffect(() => {
    if (phase !== "countdown") return;
    setCountdown(3);
    setShowFlame(false);

    const t1 = setTimeout(() => setCountdown(2), 1000);
    const t2 = setTimeout(() => setCountdown(1), 2000);
    const t3 = setTimeout(() => {
      setCountdown(0);
      setShowFlame(true);
    }, 3000);
    const t4 = setTimeout(() => setPhase("launching"), 3600);
    const t5 = setTimeout(() => {
      setPhase("flying");
      scrollToTop(); // scroll and rocket fly in sync
    }, 4400);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [phase, scrollToTop]);

  const handleLaunch = () => {
    if (phase === "idle") setPhase("countdown");
  };

  // Called by FlyingRocket when it reaches LAND_Y
  const handleLanded = useCallback(() => setPhase("exploding"), []);

  // Called by Explosion when particles finish
  const handleExplosionDone = useCallback(() => {
    setPhase("done");
    setTimeout(() => {
      setPhase("idle");
      setShowFlame(false);
    }, 2500);
  }, []);

  return (
    <>
      <style>{`
        @keyframes rflameF  { from{transform:scaleX(1) scaleY(1)} to{transform:scaleX(1.1) scaleY(0.92)} }
        @keyframes rHover   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes rLift    { from{transform:translateY(0);opacity:1} to{transform:translateY(-180px);opacity:0} }
        @keyframes rpadBlink{ 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes rstarT   { from{opacity:0.15;transform:scale(0.8)} to{opacity:0.8;transform:scale(1.2)} }
        @keyframes rSmoke   { from{transform:translateY(0) scale(1);opacity:0.5} to{transform:translateY(-70px) scale(2.8);opacity:0} }
        @keyframes rGlow    { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
        .rl-btn {
          display:inline-flex; align-items:center; gap:10px;
          padding:14px 32px; border-radius:999px;
          border:1px solid rgba(167,139,250,0.4);
          background:rgba(167,139,250,0.12); color:#c4b5fd;
          font-family:'Syne',sans-serif; font-size:15px; font-weight:700;
          cursor:pointer; letter-spacing:0.04em;
          transition:all 0.25s; position:relative; overflow:hidden;
        }
        .rl-btn::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.08) 50%,transparent 60%);
          transform:translateX(-100%); transition:transform 0.6s;
        }
        .rl-btn:hover:not(:disabled)::before { transform:translateX(100%); }
        .rl-btn:hover:not(:disabled) {
          background:rgba(167,139,250,0.22); border-color:rgba(167,139,250,0.7);
          color:#e9d5ff; transform:translateY(-3px);
          box-shadow:0 12px 40px rgba(167,139,250,0.25);
        }
        .rl-btn:disabled { opacity:0.45; cursor:not-allowed; }
      `}</style>

      {/* Countdown overlay */}
      {phase === "countdown" && <Countdown count={countdown} />}

      {/* Flying rocket — lands at top, does not vanish */}
      {phase === "flying" && <FlyingRocket onLanded={handleLanded} />}

      {/* Explosion at top of viewport */}
      {phase === "exploding" && <Explosion onDone={handleExplosionDone} />}

      {/* Section */}
      <motion.div
        ref={sectionRef}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          background: "#0a0a0f",
          borderRadius: 20,
          position: "relative",
          overflow: "hidden",
          padding: "64px 24px 56px",
          textAlign: "center",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        <Stars visible={isInView} />

        {/* Noise overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
            pointerEvents: "none",
            zIndex: 1,
          }}
          aria-hidden="true"
        />

        {/* Ground glow */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 280,
            height: 2,
            background:
              "linear-gradient(to right,transparent,rgba(167,139,250,0.5),rgba(251,191,36,0.3),transparent)",
            animation: "rGlow 3s ease-in-out infinite",
          }}
          aria-hidden="true"
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Label */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: 999,
              border: "0.5px solid rgba(167,139,250,0.2)",
              background: "rgba(167,139,250,0.06)",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#a78bfa",
                boxShadow: "0 0 6px rgba(167,139,250,0.6)",
                animation: "rpadBlink 1.8s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "rgba(167,139,250,0.7)",
              }}
            >
              Launch Control
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: "clamp(28px,5vw,48px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 10px",
            }}
          >
            Back to{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#a78bfa,#818cf8,#f472b6)",
                backgroundSize: "200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              the top
            </span>
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.28)",
              marginBottom: 48,
            }}
          >
            Initiate launch sequence · Your rocket will fly you to the top
          </p>

          {/* Rocket + pad */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: 12,
            }}
          >
            {/* Smoke (countdown 0 + launching) */}
            {(phase === "launching" ||
              (phase === "countdown" && countdown === 0)) &&
              [-18, 0, 18].map((x, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    bottom: 24,
                    left: `calc(50% + ${x}px)`,
                    width: 14 + i * 4,
                    height: 14 + i * 4,
                    borderRadius: "50%",
                    background: "rgba(160,160,190,0.35)",
                    animation: `rSmoke 0.9s ${i * 0.1}s ease-out infinite`,
                  }}
                  aria-hidden="true"
                />
              ))}

            {/* Static rocket (hidden while flying/exploding) */}
            {phase !== "flying" &&
              phase !== "exploding" &&
              phase !== "done" && (
                <div
                  style={{
                    animation:
                      phase === "idle"
                        ? "rHover 3s ease-in-out infinite"
                        : phase === "launching"
                          ? "rLift 0.85s ease-in forwards"
                          : "none",
                  }}
                >
                  <RocketSvg
                    size={72}
                    glowing={
                      phase === "launching" ||
                      (phase === "countdown" && countdown === 0)
                    }
                  />
                  <div
                    style={{
                      marginTop: -12,
                      opacity: showFlame ? 1 : 0,
                      transition: "opacity 0.3s",
                    }}
                  >
                    <Flame intensity={showFlame ? 1 : 0} />
                  </div>
                </div>
              )}

            {/* Done state */}
            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                style={{ fontSize: 56, marginBottom: 8, display: "block" }}
              >
                🌟
              </motion.div>
            )}
          </div>

          {phase !== "flying" && phase !== "exploding" && <LaunchPad />}

          {/* Button */}
          <div style={{ marginTop: 36 }}>
            <button
              className="rl-btn"
              onClick={handleLaunch}
              disabled={phase !== "idle"}
              aria-label="Launch rocket to top of page"
            >
              {phase === "idle" && (
                <>
                  <span style={{ fontSize: 18 }}>🚀</span> Launch
                </>
              )}
              {phase === "countdown" && (
                <>
                  <span style={{ fontSize: 18 }}>⏱</span> T–
                  {countdown > 0 ? countdown : "0"}…
                </>
              )}
              {phase === "launching" && (
                <>
                  <span style={{ fontSize: 18 }}>🔥</span> Ignition!
                </>
              )}
              {phase === "flying" && (
                <>
                  <span style={{ fontSize: 18 }}>📡</span> In flight…
                </>
              )}
              {phase === "exploding" && (
                <>
                  <span style={{ fontSize: 18 }}>💥</span> Impact!
                </>
              )}
              {phase === "done" && (
                <>
                  <span style={{ fontSize: 18 }}>✓</span> Mission complete
                </>
              )}
            </button>
          </div>

          <p
            style={{
              marginTop: 14,
              fontSize: 11,
              color: "rgba(255,255,255,0.18)",
              letterSpacing: "0.06em",
              height: 16,
            }}
          >
            {phase === "idle" && "All systems nominal · Ready for launch"}
            {phase === "countdown" &&
              `T-minus ${countdown > 0 ? countdown : "zero"} and counting…`}
            {phase === "launching" && "Main engines ignited · Hold on!"}
            {phase === "flying" && "Ascending to orbit · Scroll synced"}
            {phase === "exploding" && "Contact! Payload delivered."}
            {phase === "done" && "Welcome back to the top 🌟"}
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default RocketLaunch;
