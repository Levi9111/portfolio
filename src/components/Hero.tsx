import React, { useState, useEffect } from "react";
import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import { motion, Variants } from "framer-motion";

// ─── Variants ──────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideIn: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Constants ─────────────────────────────────────────────────────────────────

const socialLinks = [
  { href: "https://github.com/levi9111", icon: Github, label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/shanjid-ahmad-b77b5427b",
    icon: Linkedin,
    label: "LinkedIn",
  },
  { href: "mailto:shanjidahmad502@gmail.com", icon: Mail, label: "Email" },
];

const TITLES = [
  "Full-Stack Developer",
  "MERN Stack Engineer",
  "UI/UX Craftsman",
  "Problem Solver",
];

// ─── Typewriter ────────────────────────────────────────────────────────────────

const Typewriter: React.FC = () => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "erasing">("typing");

  useEffect(() => {
    const current = TITLES[titleIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (displayed.length < current.length) {
        timeout = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          55,
        );
      } else {
        timeout = setTimeout(() => setPhase("pause"), 1800);
      }
    } else if (phase === "pause") {
      timeout = setTimeout(() => setPhase("erasing"), 400);
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
      } else {
        setTitleIndex((i) => (i + 1) % TITLES.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, titleIndex]);

  return (
    <span className="typewriter-wrap">
      {displayed}
      <span className="cursor-blink">|</span>
    </span>
  );
};

// ─── Social Icon ────────────────────────────────────────────────────────────────

const SocialIcon: React.FC<{
  href: string;
  icon: React.ElementType;
  label: string;
  index: number;
}> = ({ href, icon: Icon, label, index }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="social-icon"
    variants={slideIn}
    custom={index}
    whileHover={{ scale: 1.12, y: -3 }}
    whileTap={{ scale: 0.92 }}
  >
    <Icon size={18} />
    <span className="social-tooltip">{label}</span>
    <div className="social-sheen" />
  </motion.a>
);

// ─── Hero ───────────────────────────────────────────────────────────────────────

const Hero: React.FC = () => {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600&display=swap');

        #hero-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          /* Transparent — SpaceBackground canvas shows through */
          background: transparent;
        }

        /* Vignette to deepen edges without covering the stars */
        #hero-section::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(2,1,10,0.55) 80%, rgba(2,1,10,0.88) 100%);
          pointer-events: none;
          z-index: 1;
        }

        /* Scanlines */
        .hero-scanlines {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(0,0,0,0.018) 3px, rgba(0,0,0,0.018) 4px
          );
          pointer-events: none; z-index: 2;
        }

        /* Content sits above vignette */
        .hero-content {
          position: relative; z-index: 10;
          width: 100%; max-width: 1000px;
          margin: 0 auto; padding: 0 24px;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
        }

        .hero-eyebrow {
          font-size: 11px; font-weight: 400;
          letter-spacing: 5px; text-transform: uppercase;
          color: rgba(139,92,246,0.85);
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .hero-eyebrow::before,
        .hero-eyebrow::after {
          content: ''; display: block;
          width: 28px; height: 1px;
          background: rgba(139,92,246,0.4);
        }

        .hero-name {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(56px, 10vw, 112px);
          line-height: 1; color: #fff;
          margin-bottom: 16px; letter-spacing: -2px;
        }
        .hero-name-accent {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: hueShift 8s ease-in-out infinite;
        }
        @keyframes hueShift { 0%,100%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(25deg)} }

        .hero-subtitle {
          font-size: clamp(16px, 3vw, 22px); font-weight: 300;
          color: rgba(200,200,230,0.7);
          margin-bottom: 24px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          letter-spacing: 0.3px;
        }
        .typewriter-wrap { display: inline-flex; align-items: center; gap: 2px; }
        .cursor-blink {
          display: inline-block; color: #a78bfa;
          animation: blink 1s step-end infinite;
          font-weight: 300; margin-left: 1px;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .hero-desc {
          font-size: clamp(14px, 2vw, 16px); font-weight: 300;
          color: rgba(180,180,210,0.5); max-width: 480px;
          line-height: 1.8; margin-bottom: 44px; letter-spacing: 0.1px;
        }

        .social-row { display: flex; gap: 14px; margin-bottom: 48px; }

        .social-icon {
          position: relative; display: flex; align-items: center; justify-content: center;
          width: 46px; height: 46px; border-radius: 14px;
          border: 1px solid rgba(139,92,246,0.2);
          background: rgba(10,5,28,0.4);
          backdrop-filter: blur(12px);
          color: rgba(200,200,240,0.7); text-decoration: none;
          transition: border-color 0.25s, color 0.25s, background 0.25s;
          overflow: hidden;
        }
        .social-icon:hover {
          border-color: rgba(139,92,246,0.55);
          background: rgba(139,92,246,0.14);
          color: #a78bfa;
        }
        .social-sheen {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%); transition: transform 0.5s ease;
        }
        .social-icon:hover .social-sheen { transform: translateX(100%); }
        .social-tooltip {
          position: absolute; bottom: calc(100% + 8px); left: 50%;
          transform: translateX(-50%);
          background: rgba(10,5,28,0.95); color: rgba(200,200,240,0.9);
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          padding: 5px 10px; border-radius: 6px;
          border: 1px solid rgba(139,92,246,0.2);
          pointer-events: none; opacity: 0; transition: opacity 0.2s; white-space: nowrap;
        }
        .social-icon:hover .social-tooltip { opacity: 1; }

        .scroll-btn {
          position: relative; width: 48px; height: 48px; border-radius: 50%;
          border: 1px solid rgba(139,92,246,0.25);
          background: rgba(10,5,28,0.35);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(200,200,240,0.5);
          transition: border-color 0.25s, color 0.25s, background 0.25s;
          overflow: hidden;
        }
        .scroll-btn:hover { border-color: rgba(139,92,246,0.6); color: #a78bfa; background: rgba(139,92,246,0.12); }
        .scroll-btn::before {
          content: ''; position: absolute; inset: -2px; border-radius: 50%;
          border: 1px solid rgba(139,92,246,0.15);
          animation: ringPulse 2.5s ease-in-out infinite;
        }
        @keyframes ringPulse { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.7);opacity:0} }
        .scroll-btn svg { animation: arrowBounce 2s ease-in-out infinite; }
        @keyframes arrowBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }

        .live-badge {
          position: absolute; top: 28px; right: 28px; z-index: 20;
          display: flex; align-items: center; gap: 7px;
          padding: 7px 14px; border-radius: 100px;
          border: 1px solid rgba(139,92,246,0.18);
          background: rgba(10,5,28,0.5);
          backdrop-filter: blur(12px);
        }
        .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #a78bfa; animation: dotPulse 2s ease-in-out infinite; }
        @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        .live-text { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: rgba(167,139,250,0.6); }

        .hero-statusbar {
          position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 28px;
          z-index: 20; opacity: 0; animation: fadeIn 0.7s ease 1.8s forwards;
        }
        .status-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .status-val {
          font-family: 'Instrument Serif', serif; font-size: 28px;
          background: linear-gradient(135deg, #a78bfa, #818cf8, #38bdf8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          line-height: 1;
        }
        .status-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: rgba(180,180,220,0.35); }
        .status-divider { width: 1px; height: 36px; background: rgba(139,92,246,0.15); }
        @keyframes fadeIn { to { opacity: 1; } }

        @media (max-width: 640px) {
          .hero-eyebrow { font-size: 10px; letter-spacing: 3px; }
          .hero-eyebrow::before, .hero-eyebrow::after { width: 18px; }
          .hero-desc { margin-bottom: 32px; }
          .social-row { gap: 10px; margin-bottom: 36px; }
          .social-icon { width: 42px; height: 42px; }
          .live-badge { top: 16px; right: 16px; padding: 5px 10px; }
          .hero-statusbar { gap: 16px; bottom: 20px; }
          .status-val { font-size: 22px; }
        }
        @media (max-width: 380px) {
          .status-item:nth-child(5) { display: none; }
          .status-divider:nth-last-child(2) { display: none; }
        }
      `}</style>

      <section id="hero-section">
        {/* Subtle scanlines */}
        <div className="hero-scanlines" />

        {/* Live badge */}
        <motion.div
          className="live-badge"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <div className="live-dot" />
          <span className="live-text">Available</span>
        </motion.div>

        {/* Main content */}
        <motion.div
          className="hero-content"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div className="hero-eyebrow" variants={fadeUp}>
            Portfolio 2025
          </motion.div>

          <motion.h1 className="hero-name" variants={fadeUp}>
            Shanjid <span className="hero-name-accent">Ahmad</span>
          </motion.h1>

          <motion.div className="hero-subtitle" variants={fadeUp}>
            <Typewriter />
          </motion.div>

          <motion.p className="hero-desc" variants={fadeUp}>
            I build exceptional digital experiences with modern web
            technologies. Passionate about clean code, thoughtful UX, and
            solving complex problems.
          </motion.p>

          <motion.div className="social-row" variants={stagger}>
            {socialLinks.map((link, i) => (
              <SocialIcon key={link.label} {...link} index={i} />
            ))}
          </motion.div>

          <motion.button
            className="scroll-btn"
            variants={fadeUp}
            onClick={scrollToAbout}
            aria-label="Scroll to about"
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
          >
            <ArrowDown size={18} />
          </motion.button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="hero-statusbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <div className="status-item">
            <span className="status-val">2+</span>
            <span className="status-label">Years</span>
          </div>
          <div className="status-divider" />
          <div className="status-item">
            <span className="status-val">30+</span>
            <span className="status-label">Projects</span>
          </div>
          <div className="status-divider" />
          <div className="status-item">
            <span className="status-val">MERN</span>
            <span className="status-label">Stack</span>
          </div>
          <div className="status-divider" />
          <div className="status-item">
            <span className="status-val">∞</span>
            <span className="status-label">Curiosity</span>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
