"use client";

import React, { useState, useRef } from "react";
import {
  ExternalLink,
  Github,
  Globe,
  Zap,
  Building2,
  User,
  ArrowUpRight,
} from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";

// ─── Re-use shared data from Desktop file ─────────────────────────────────────
// In your project: import { PROJECTS, STATUS_STYLES } from "./ProjectsDesktop";
// Duplicated here so the file is self-contained.

type ProjectStatus = "live" | "in-progress" | "agency";

interface Project {
  readonly id: number;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly url: string;
  readonly githubUrl?: string;
  readonly technologies: readonly string[];
  readonly accent: string;
  readonly glow: string;
  readonly status: ProjectStatus;
  readonly statusLabel: string;
  readonly icon: React.ElementType;
  readonly role: string;
  readonly visual: "crypto" | "agency" | "rent" | "portfolio";
}

const PROJECTS: readonly Project[] = [
  {
    id: 1,
    title: "Texor",
    subtitle: "texor.cloud",
    description:
      "A full-featured crypto platform with real-time market data, wallet integration, and secure trading infrastructure. Built for performance under high-concurrency financial workloads.",
    url: "https://texor.cloud",
    technologies: ["React", "Node.js", "MongoDB", "WebSocket", "JWT", "Redis"],
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.15)",
    status: "live",
    statusLabel: "Live",
    icon: Zap,
    role: "Lead Full-Stack Engineer",
    visual: "crypto",
  },
  {
    id: 2,
    title: "UIX Design Lab",
    subtitle: "uixdesignlab.com",
    description:
      "Agency website — a showcase of design and development excellence with stunning animations, micro-interactions, and production-grade performance.",
    url: "https://uixdesignlab.com",
    technologies: [
      "Next.js",
      "TypeScript",
      "Framer Motion",
      "Tailwind CSS",
      "GSAP",
    ],
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.15)",
    status: "agency",
    statusLabel: "Agency",
    icon: Building2,
    role: "Co-Founder & Developer",
    visual: "agency",
  },
  {
    id: 3,
    title: "Rentezzi",
    subtitle: "rentezzi.com",
    description:
      "A modern online rent management platform — handling tenants, payments, lease tracking, and maintenance requests in one dashboard. Currently in active production development.",
    url: "https://rentezzi.com",
    technologies: [
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Stripe",
      "Docker",
      "AWS",
    ],
    accent: "#34d399",
    glow: "rgba(52,211,153,0.15)",
    status: "in-progress",
    statusLabel: "In Production",
    icon: Globe,
    role: "Full-Stack Architect",
    visual: "rent",
  },
  {
    id: 4,
    title: "Tahsin Ahmad",
    subtitle: "tahsinahmad.com",
    description:
      "Portfolio website for the co-founder and UI/UX designer of UIX Design Lab. A cinematic, design-forward experience that showcases his process and creative vision.",
    url: "https://tahsinahmad.com",
    technologies: ["React", "Framer Motion", "TypeScript", "Tailwind CSS"],
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
    status: "live",
    statusLabel: "Live",
    icon: User,
    role: "Developer",
    visual: "portfolio",
  },
] as const;

const STATUS_STYLES: Record<
  ProjectStatus,
  { bg: string; border: string; color: string; dot: string }
> = {
  live: {
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.3)",
    color: "#34d399",
    dot: "#34d399",
  },
  "in-progress": {
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.3)",
    color: "#fbbf24",
    dot: "#fbbf24",
  },
  agency: {
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.3)",
    color: "#a78bfa",
    dot: "#a78bfa",
  },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 },
  }),
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ─── Mobile Card ──────────────────────────────────────────────────────────────
// Horizontal layout: accent strip left | content right
// Collapses to full vertical on very small screens

const MobileCard: React.FC<{ project: Project; index: number }> = ({
  project,
  index,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const statusStyle = STATUS_STYLES[project.status];
  const Icon = project.icon;

  return (
    <motion.article
      variants={cardVariant}
      custom={index}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${hovered || expanded ? project.accent + "40" : "rgba(255,255,255,0.08)"}`,
        background: "rgba(5,3,15,0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: hovered || expanded ? `0 16px 48px ${project.glow}` : "none",
      }}
      aria-label={`${project.title} project`}
    >
      {/* Top glow line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "5%",
          right: "5%",
          height: 1,
          zIndex: 10,
          background: `linear-gradient(90deg, transparent, ${project.accent}cc, transparent)`,
          opacity: hovered || expanded ? 1 : 0,
          transition: "opacity 0.35s",
        }}
        aria-hidden="true"
      />

      {/* ── Header row (always visible) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          cursor: "pointer",
          minHeight: 80,
        }}
        onClick={() => setExpanded((e) => !e)}
        role="button"
        aria-expanded={expanded}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded((ex) => !ex);
        }}
      >
        {/* Left accent stripe */}
        <div
          style={{
            width: 4,
            flexShrink: 0,
            background: `linear-gradient(to bottom, ${project.accent}, ${project.accent}55)`,
            borderRadius: "0 0 0 0",
          }}
          aria-hidden="true"
        />

        {/* Icon + meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 18px",
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Icon circle */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: `${project.accent}18`,
              border: `1px solid ${project.accent}35`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={18} color={project.accent} />
          </div>

          {/* Title block */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 18,
                  fontWeight: 400,
                  color: hovered || expanded ? project.accent : "#fff",
                  letterSpacing: "-0.2px",
                  margin: 0,
                  transition: "color 0.25s",
                  whiteSpace: "nowrap",
                }}
              >
                {project.title}
              </h3>
              {/* Status pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 8px",
                  borderRadius: 100,
                  background: statusStyle.bg,
                  border: `0.5px solid ${statusStyle.border}`,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: statusStyle.dot,
                    display: "block",
                    boxShadow: `0 0 5px ${statusStyle.dot}`,
                  }}
                  aria-hidden="true"
                />
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 600,
                    color: statusStyle.color,
                    fontFamily: "'DM Sans',sans-serif",
                    letterSpacing: "0.5px",
                  }}
                >
                  {project.statusLabel}
                </span>
              </div>
            </div>
            <p
              style={{
                fontSize: 11,
                color: `${project.accent}77`,
                margin: "2px 0 0",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {project.subtitle}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "rgba(200,200,240,0.4)",
                margin: "3px 0 0",
                fontFamily: "'DM Sans',sans-serif",
                letterSpacing: "0.2px",
              }}
            >
              {project.role}
            </p>
          </div>
        </div>

        {/* Chevron */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingRight: 16,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: `1px solid rgba(255,255,255,0.1)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s, border-color 0.3s, background 0.3s",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              background: expanded ? `${project.accent}15` : "transparent",
              borderColor: expanded
                ? `${project.accent}40`
                : "rgba(255,255,255,0.1)",
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 3.5L5 6.5L8 3.5"
                stroke={expanded ? project.accent : "rgba(255,255,255,0.4)"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Expanded content ── */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: expanded ? "600px" : "0",
          transition: "max-height 0.45s cubic-bezier(0.34,1.1,0.64,1)",
        }}
      >
        <div
          style={{
            borderTop: `0.5px solid ${project.accent}20`,
            padding: "20px 22px 22px",
          }}
        >
          {/* Description */}
          <p
            style={{
              fontSize: 13.5,
              fontWeight: 300,
              lineHeight: 1.8,
              color: "rgba(190,190,220,0.55)",
              marginBottom: 16,
            }}
          >
            {project.description}
          </p>

          {/* Tech tags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 18,
            }}
          >
            {project.technologies.map((tech) => (
              <span
                key={tech}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 10px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 400,
                  border: `1px solid ${project.accent}28`,
                  background: project.glow,
                  color: project.accent,
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "10px 18px",
                  borderRadius: 11,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(200,200,240,0.7)",
                  fontSize: 13,
                  fontWeight: 400,
                  textDecoration: "none",
                }}
              >
                <Github size={15} /> Code
              </a>
            )}
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "10px 20px",
                borderRadius: 11,
                border: `1px solid ${project.accent}55`,
                background: `${project.accent}18`,
                color: project.accent,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                flex: "1",
                justifyContent: "center",
              }}
            >
              <ExternalLink size={15} /> Visit Site
            </a>
            <a
              href="https://github.com/levi9111"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
                borderRadius: 11,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(200,200,240,0.5)",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <Github size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Inner bloom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          pointerEvents: "none",
          background: `radial-gradient(circle at 0% 50%, ${project.accent}06, transparent 55%)`,
          opacity: hovered || expanded ? 1 : 0,
          transition: "opacity 0.4s",
        }}
        aria-hidden="true"
      />
    </motion.article>
  );
};

// ─── Stats strip ──────────────────────────────────────────────────────────────

const StatsStrip: React.FC = () => (
  <div
    style={{
      display: "flex",
      gap: 0,
      marginBottom: 48,
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.07)",
      background: "rgba(5,3,15,0.4)",
      backdropFilter: "blur(12px)",
    }}
  >
    {[
      { num: "4", label: "Live products", accent: "#34d399" },
      { num: "2+", label: "Years shipping", accent: "#a78bfa" },
      { num: "6+", label: "Tech stacks", accent: "#f59e0b" },
    ].map((s, i) => (
      <div
        key={s.label}
        style={{
          flex: 1,
          textAlign: "center",
          padding: "18px 12px",
          borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 26,
            fontWeight: 800,
            color: s.accent,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {s.num}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
            marginTop: 4,
            fontFamily: "'DM Sans',sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          {s.label}
        </div>
      </div>
    ))}
  </div>
);

// ─── Mobile Section ───────────────────────────────────────────────────────────

const ProjectsMobile: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-8%" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .pm-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          padding: 80px 0 72px;
          background: transparent;
          overflow: visible;
        }
        .pm-section::before {
          content: '';
          position: absolute; top: 0; left: 5%; right: 5%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent);
          pointer-events: none;
        }
        .pm-inner {
          position: relative; z-index: 1;
          max-width: 640px; margin: 0 auto; padding: 0 20px;
        }
        .pm-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 13px; border-radius: 100px;
          border: 1px solid rgba(139,92,246,0.2);
          background: rgba(5,3,15,0.5); backdrop-filter: blur(12px);
          font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(167,139,250,0.85); margin-bottom: 16px;
        }
        .pm-eyebrow::before {
          content: ''; display: block;
          width: 16px; height: 1px; background: rgba(139,92,246,0.5);
        }
        .pm-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(36px, 9vw, 52px);
          line-height: 1.08; color: #fff;
          letter-spacing: -1px; margin: 0 0 12px;
        }
        .pm-title-accent {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: pmHue 8s ease-in-out infinite;
        }
        @keyframes pmHue { 0%,100%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(25deg)} }
        .pm-desc {
          font-size: 14px; font-weight: 300;
          color: rgba(190,190,220,0.4);
          line-height: 1.75; margin: 0 0 36px;
        }
        .pm-tap-hint {
          font-size: 11px; color: rgba(255,255,255,0.2);
          margin-bottom: 20px; letter-spacing: 0.03em;
          display: flex; align-items: center; gap: 6px;
        }
        .pm-tap-hint::before {
          content: ''; display: block;
          width: 16px; height: 1px;
          background: rgba(255,255,255,0.15);
        }
        .pm-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(200,200,240,0.7);
          font-size: 13px; font-weight: 400; text-decoration: none;
          backdrop-filter: blur(12px); transition: all 0.25s; width: 100%; justify-content: center;
        }
        .pm-cta:hover {
          border-color: rgba(167,139,250,0.4);
          background: rgba(167,139,250,0.08);
          color: #a78bfa;
        }

        @media (max-width: 480px) {
          .pm-section { padding: 64px 0 56px; }
          .pm-inner { padding: 0 14px; }
        }
      `}</style>

      <section className="pm-section" ref={sectionRef}>
        <div className="pm-inner">
          {/* Header */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{ marginBottom: 40 }}
          >
            <motion.div variants={fadeUp}>
              <div className="pm-eyebrow">My Work</div>
            </motion.div>
            <motion.h2 className="pm-title" variants={fadeUp}>
              Featured <span className="pm-title-accent">Projects</span>
            </motion.h2>
            <motion.p className="pm-desc" variants={fadeUp}>
              Live products and production builds — from crypto platforms to
              agency sites, every one shipped with full-stack ownership.
            </motion.p>
            <motion.div variants={fadeUp}>
              <StatsStrip />
            </motion.div>
            <motion.p className="pm-tap-hint" variants={fadeUp}>
              Tap any card to expand
            </motion.p>
          </motion.div>

          {/* Cards — vertical accordion stack */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 40,
            }}
          >
            {PROJECTS.map((project, i) => (
              <MobileCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>

          {/* GitHub CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
          >
            <a
              href="https://github.com/levi9111"
              target="_blank"
              rel="noopener noreferrer"
              className="pm-cta"
            >
              <Github size={16} /> View All on GitHub — @levi9111{" "}
              <ArrowUpRight size={14} style={{ opacity: 0.6 }} />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ProjectsMobile;
