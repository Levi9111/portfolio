import React, { useState, useRef, useEffect, useCallback } from "react";
import { ExternalLink, Github, Star } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  Variants,
} from "framer-motion";

// ─── Variants ──────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 48, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 },
  }),
};

// ─── Project Data ──────────────────────────────────────────────────────────────

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  accent: string;
  glow: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, payment processing, inventory management, and admin dashboard.",
    image:
      "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe", "JWT"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.12)",
  },
  {
    id: 2,
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, drag-and-drop functionality, and full team collaboration features.",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
    technologies: ["React", "TypeScript", "Socket.io", "Node.js", "PostgreSQL"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.12)",
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description:
      "A responsive weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics powered by live APIs.",
    image:
      "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800",
    technologies: ["React", "D3.js", "Weather API", "Tailwind CSS", "Chart.js"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    accent: "#34d399",
    glow: "rgba(52,211,153,0.12)",
  },
  {
    id: 4,
    title: "Social Media Analytics",
    description:
      "A comprehensive social media analytics platform with data visualization, sentiment analysis, and automated reporting features.",
    image:
      "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800",
    technologies: ["Next.js", "Python", "TensorFlow", "MongoDB", "D3.js"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    accent: "#f472b6",
    glow: "rgba(244,114,182,0.12)",
  },
];

// ─── Particle Canvas — exact Hero engine ───────────────────────────────────────

const ParticleCanvas: React.FC<{ mouseX: number; mouseY: number }> = ({
  mouseX,
  mouseY,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0,
      H = 0;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const COLORS = [
      "rgba(139,92,246,",
      "rgba(99,102,241,",
      "rgba(59,130,246,",
      "rgba(34,211,238,",
      "rgba(255,255,255,",
    ];

    const mkP = (init = false) => ({
      x: Math.random() * W,
      y: init ? Math.random() * H : H + 10,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.1 + Math.random() * 0.45),
      r: 0.4 + Math.random() * 1.6,
      life: 0,
      maxLife: 200 + Math.random() * 350,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
    });

    const particles = Array.from({ length: 160 }, () => mkP(true));
    let time = 0;

    const draw = () => {
      time++;
      ctx.clearRect(0, 0, W, H);

      // Nebula blobs — same as Hero
      [
        { x: W * 0.75, y: H * 0.3, r: 260, c: "rgba(109,40,217,", a: 0.055 },
        { x: W * 0.15, y: H * 0.65, r: 200, c: "rgba(29,78,216,", a: 0.05 },
        { x: W * 0.5, y: H * 0.2, r: 180, c: "rgba(139,92,246,", a: 0.04 },
      ].forEach((b, i) => {
        const ox = Math.sin(time * 0.0004 + i) * 35;
        const oy = Math.cos(time * 0.0005 + i) * 25;
        const g = ctx.createRadialGradient(
          b.x + ox,
          b.y + oy,
          0,
          b.x + ox,
          b.y + oy,
          b.r,
        );
        g.addColorStop(0, b.c + b.a + ")");
        g.addColorStop(1, b.c + "0)");
        ctx.beginPath();
        ctx.arc(b.x + ox, b.y + oy, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      // Grid — same as Hero
      ctx.strokeStyle = "rgba(139,92,246,0.04)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Particles — same as Hero
      particles.forEach((p) => {
        p.life++;
        if (p.life > p.maxLife) {
          Object.assign(p, mkP(false));
          return;
        }
        const dx = mouseX - p.x,
          dy = mouseY - p.y,
          dist = Math.hypot(dx, dy);
        if (dist < 130 && dist > 0) {
          p.vx += (dx / dist) * 0.018;
          p.vy += (dy / dist) * 0.018;
        }
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.035;
        const t = p.life / p.maxLife;
        const alpha = (t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1) * 0.7;
        const pr = p.r * (0.85 + Math.sin(p.pulse) * 0.15);
        ctx.beginPath();
        ctx.arc(p.x, p.y, pr, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha + ")";
        ctx.fill();
      });

      // Cursor glow — same as Hero
      if (mouseX && mouseY) {
        const g = ctx.createRadialGradient(
          mouseX,
          mouseY,
          0,
          mouseX,
          mouseY,
          110,
        );
        g.addColorStop(0, "rgba(139,92,246,0.07)");
        g.addColorStop(1, "rgba(139,92,246,0)");
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 110, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
};

// ─── Project Card ──────────────────────────────────────────────────────────────

const ProjectCard: React.FC<{ project: Project; index: number }> = ({
  project,
  index,
}) => {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.article
      variants={cardVariant}
      custom={index}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        border: `1px solid ${hovered ? project.accent + "40" : "rgba(255,255,255,0.07)"}`,
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(12px)",
        transition: "border-color 0.3s",
        cursor: "none",
      }}
    >
      {/* Top accent line on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: 1,
          zIndex: 10,
          background: `linear-gradient(90deg, transparent, ${project.accent}99, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.35s",
        }}
      />

      {/* Featured badge */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "5px 12px",
          borderRadius: 100,
          background: `linear-gradient(135deg, ${project.accent}cc, ${project.accent}88)`,
          backdropFilter: "blur(8px)",
          fontSize: 11,
          fontWeight: 500,
          color: "#fff",
          letterSpacing: "0.5px",
        }}
      >
        <Star size={10} fill="currentColor" />
        Featured
      </div>

      {/* Image */}
      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.7s ease",
            opacity: imgLoaded ? 1 : 0,
          }}
        />
        {/* Dark gradient over image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, rgba(5,3,15,0.85) 0%, rgba(5,3,15,0.3) 50%, transparent 100%)`,
            opacity: hovered ? 1 : 0.6,
            transition: "opacity 0.4s",
          }}
        />

        {/* Image hover links */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.3s, transform 0.3s",
          }}
        >
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              textDecoration: "none",
              transition: "background 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.25)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <Github size={19} />
          </a>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: project.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              textDecoration: "none",
              transition: "opacity 0.2s, transform 0.2s",
              boxShadow: `0 0 20px ${project.glow}`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.85";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <ExternalLink size={19} />
          </a>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "22px 24px 24px" }}>
        <h3
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 22,
            fontWeight: 400,
            lineHeight: 1.25,
            color: hovered ? project.accent : "#fff",
            marginBottom: 10,
            letterSpacing: "-0.3px",
            transition: "color 0.3s",
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontSize: 13.5,
            fontWeight: 300,
            lineHeight: 1.8,
            color: "rgba(190,190,220,0.5)",
            marginBottom: 18,
          }}
        >
          {project.description}
        </p>

        {/* Tech tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 7,
            marginBottom: 22,
          }}
        >
          {project.technologies.map((tech) => (
            <span
              key={tech}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 11px",
                borderRadius: 8,
                fontSize: 11.5,
                fontWeight: 400,
                letterSpacing: "0.2px",
                border: `1px solid ${project.accent}30`,
                background: hovered ? project.glow : "rgba(255,255,255,0.03)",
                color: hovered ? project.accent : "rgba(200,200,230,0.55)",
                transition: "background 0.3s, color 0.3s, border-color 0.3s",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Bottom links */}
        <div style={{ display: "flex", gap: 10 }}>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="proj-link-ghost"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 18px",
              borderRadius: 11,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(200,200,240,0.6)",
              fontSize: 13,
              fontWeight: 400,
              textDecoration: "none",
              transition: "all 0.22s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = project.accent + "55";
              el.style.background = project.glow;
              el.style.color = project.accent;
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.08)";
              el.style.background = "rgba(255,255,255,0.03)";
              el.style.color = "rgba(200,200,240,0.6)";
              el.style.transform = "none";
            }}
          >
            <Github size={15} />
            Code
          </a>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 18px",
              borderRadius: 11,
              border: `1px solid ${project.accent}55`,
              background: `${project.accent}15`,
              color: project.accent,
              fontSize: 13,
              fontWeight: 400,
              textDecoration: "none",
              transition: "all 0.22s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = `${project.accent}25`;
              el.style.borderColor = `${project.accent}88`;
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = `0 6px 20px ${project.glow}`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = `${project.accent}15`;
              el.style.borderColor = `${project.accent}55`;
              el.style.transform = "none";
              el.style.boxShadow = "none";
            }}
          >
            <ExternalLink size={15} />
            Live Demo
          </a>
        </div>
      </div>

      {/* Inner glow bloom on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,
          pointerEvents: "none",
          background: `radial-gradient(circle at 50% 0%, ${project.accent}08, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s",
        }}
      />
    </motion.article>
  );
};

// ─── Projects ──────────────────────────────────────────────────────────────────

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  // ── Cursor state — mirrors Hero exactly ──────────────────────────────────────
  // fixedMouse  → position: fixed dot (instantaneous, e.clientX/Y)
  // relMouse    → canvas-relative coords for particle attraction
  // cursorActive→ fade in/out when entering/leaving section
  const [fixedMouse, setFixedMouse] = useState({ x: 0, y: 0 });
  const [relMouse, setRelMouse] = useState({ x: 0, y: 0 });
  const [cursorActive, setCursorActive] = useState(false);

  // Spring ring — stiffness/damping/mass identical to Hero
  const springCfg = { stiffness: 120, damping: 22, mass: 0.8 };
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const ringX = useSpring(cursorX, springCfg);
  const ringY = useSpring(cursorY, springCfg);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Dot: fixed coords (e.clientX / e.clientY)
      setFixedMouse({ x: e.clientX, y: e.clientY });
      // Canvas: relative to section
      setRelMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      // Spring ring: also fixed coords — same as Hero
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    },
    [cursorX, cursorY],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const enter = () => setCursorActive(true);
    const leave = () => setCursorActive(false);
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [handleMouseMove]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&display=swap');

        #projects-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          padding: 120px 0 110px;
          background: #05030f;
          overflow: hidden;
          cursor: none;
        }

        /* Seamless top separator */
        #projects-section::before {
          content: '';
          position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent);
        }

        /* Vignette — identical to Hero */
        #projects-section::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(5,3,15,0.88) 100%);
          pointer-events: none;
          z-index: 2;
        }

        /* Scanlines — identical to Hero */
        .proj-scanlines {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(0,0,0,0.035) 3px, rgba(0,0,0,0.035) 4px
          );
          pointer-events: none; z-index: 3;
        }

        /*
         * Cursor dot — position: fixed, same as Hero
         * Positioned with left/top from e.clientX/Y (viewport coords)
         * mix-blend-mode: difference for the invert effect
         */
        .proj-cursor-dot {
          position: fixed;
          width: 10px; height: 10px;
          background: #fff;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          mix-blend-mode: difference;
          transition: opacity 0.2s;
        }

        /*
         * Cursor ring — position: fixed, same as Hero
         * Positioned via framer-motion spring (x/y MotionValues)
         * translateX/Y: -50% centers it on the coords
         */
        .proj-cursor-ring {
          position: fixed;
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(139,92,246,0.5);
          pointer-events: none;
          z-index: 9998;
          /* DO NOT set transform here — framer-motion controls x/y */
        }

        .proj-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 7px 16px; border-radius: 100px;
          border: 1px solid rgba(139,92,246,0.2);
          background: rgba(139,92,246,0.06);
          font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(167,139,250,0.8); margin-bottom: 20px;
        }
        .proj-eyebrow::before {
          content: ''; display: block; width: 20px; height: 1px;
          background: rgba(139,92,246,0.5);
        }

        .proj-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(44px, 7vw, 76px);
          line-height: 1.05; color: #fff; letter-spacing: -1.5px;
        }
        .proj-title-accent {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: projHue 8s ease-in-out infinite;
        }
        @keyframes projHue { 0%,100%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(25deg)} }

        .proj-divider {
          width: 64px; height: 1px; margin: 24px auto 0;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
          position: relative;
        }
        .proj-divider::after {
          content: ''; position: absolute; top: -2px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 8px #a78bfa;
        }

        .proj-desc {
          font-size: 15px; font-weight: 300;
          color: rgba(190,190,220,0.45); max-width: 480px;
          line-height: 1.8; margin: 20px auto 0;
        }

        @media (max-width: 640px) {
          #projects-section { padding: 80px 0 70px; cursor: auto; }
          .proj-cursor-dot, .proj-cursor-ring { display: none; }
        }
      `}</style>

      {/*
       * ── CURSOR ELEMENTS ──────────────────────────────────────────────────────
       * These are rendered OUTSIDE <section> so position:fixed works correctly.
       * They are only visible (opacity:1) when the mouse is inside the section.
       * Exact mirror of Hero's cursor implementation.
       */}
      <div
        className="proj-cursor-dot"
        style={{
          left: fixedMouse.x,
          top: fixedMouse.y,
          opacity: cursorActive ? 1 : 0,
        }}
      />
      <motion.div
        className="proj-cursor-ring"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: cursorActive ? 1 : 0,
        }}
      />

      <section id="projects-section" ref={sectionRef}>
        {/* Live canvas — same particle engine as Hero */}
        <ParticleCanvas mouseX={relMouse.x} mouseY={relMouse.y} />

        {/* Scanlines */}
        <div className="proj-scanlines" />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* ── Header ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{ textAlign: "center", marginBottom: 68 }}
          >
            <motion.div variants={fadeUp}>
              <div className="proj-eyebrow">My Work</div>
            </motion.div>
            <motion.h2 className="proj-title" variants={fadeUp}>
              Featured <span className="proj-title-accent">Projects</span>
            </motion.h2>
            <motion.div variants={fadeUp}>
              <div className="proj-divider" />
            </motion.div>
            <motion.p className="proj-desc" variants={fadeUp}>
              Recent work showcasing my skills across full-stack development,
              real-time systems, and data visualization.
            </motion.p>
          </motion.div>

          {/* ── Project Grid ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))",
              gap: 24,
            }}
          >
            {PROJECTS.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Projects;
