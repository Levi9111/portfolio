"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { ExternalLink, Github, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useInView, AnimatePresence, Variants } from "framer-motion";
import { PROJECTS } from "../../../data/projects";
import LinkPill from "./LinkPill";
import InstallSnippet from "./InstallSnippet";

// ─── Variants ─────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// Carousel slide directions
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "60%" : "-60%",
    opacity: 0,
    filter: "blur(8px)",
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "60%" : "-60%",
    opacity: 0,
    filter: "blur(8px)",
    scale: 0.95,
    transition: { duration: 0.35, ease: [0.7, 0, 1, 0.3] },
  }),
};

// ─── Mobile Card ──────────────────────────────────────────────────────────────

const MobileCard: React.FC<{ project: (typeof PROJECTS)[number] }> = ({ project }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = project.icon;

  return (
    <motion.article
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "relative", borderRadius: 18, overflow: "hidden",
        border: `1px solid ${hovered ? project.accent + "40" : "rgba(255,255,255,0.08)"}`,
        background: "rgba(5,3,15,0.6)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: hovered ? `0 16px 48px ${project.glow}` : "none",
        display: "flex", flexDirection: "column",
        width: "100%",
      }}
      aria-label={`${project.title} project`}
    >
      <div
        style={{
          position: "absolute", top: 0, left: "5%", right: "5%", height: 1, zIndex: 10,
          background: `linear-gradient(90deg, transparent, ${project.accent}cc, transparent)`,
          opacity: hovered ? 1 : 0, transition: "opacity 0.35s",
        }}
        aria-hidden="true"
      />

      {/* ── Header row ── */}
      <div style={{ display: "flex", alignItems: "stretch", minHeight: 80 }}>
        <div
          style={{ width: 4, flexShrink: 0, background: `linear-gradient(to bottom, ${project.accent}, ${project.accent}55)` }}
          aria-hidden="true"
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: "50%", background: `${project.accent}18`,
              border: `1px solid ${project.accent}35`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <Icon size={18} color={project.accent} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h3
                style={{
                  fontFamily: "'Instrument Serif', serif", fontSize: 18, fontWeight: 400,
                  color: hovered ? project.accent : "#fff", letterSpacing: "-0.2px",
                  margin: 0, transition: "color 0.25s", whiteSpace: "nowrap",
                }}
              >
                {project.title}
              </h3>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 100,
                  background: `${project.accent}18`, border: `0.5px solid ${project.accent}40`, flexShrink: 0,
                }}
              >
                <span
                  style={{ width: 4, height: 4, borderRadius: "50%", background: project.accent, display: "block", boxShadow: `0 0 5px ${project.accent}` }}
                  aria-hidden="true"
                />
                <span style={{ fontSize: 8, fontWeight: 600, color: project.accent, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.5px" }}>
                  {project.statusLabel}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 11, color: `${project.accent}77`, margin: "2px 0 0", fontFamily: "'DM Sans',sans-serif" }}>
              {project.subtitle}
            </p>
            <p style={{ fontSize: 11, color: "rgba(200,200,240,0.4)", margin: "3px 0 0", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.2px" }}>
              {project.role}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div style={{ borderTop: `0.5px solid ${project.accent}20`, padding: "20px 22px 22px" }}>
        <p style={{ fontSize: 13.5, fontWeight: 300, lineHeight: 1.8, color: "rgba(190,190,220,0.55)", marginBottom: 16 }}>
          {project.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {project.technologies.map((tech) => (
            <span
              key={tech}
              style={{
                display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 8,
                fontSize: 11, fontWeight: 400, border: `1px solid ${project.accent}28`,
                background: project.glow, color: project.accent,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Repo links */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: project.npmPackage ? 12 : 16 }}>
          {project.links.map((link) => (
            <LinkPill key={link.href} link={link} accent={project.accent} glow={project.glow} />
          ))}
        </div>

        {project.npmPackage && (
          <div style={{ marginBottom: 16 }}>
            <InstallSnippet packageName={project.npmPackage} accent={project.accent} />
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 11,
                border: `1px solid ${project.accent}55`, background: `${project.accent}18`, color: project.accent,
                fontSize: 13, fontWeight: 500, textDecoration: "none", flex: 1, justifyContent: "center",
              }}
            >
              <ExternalLink size={15} /> Visit Site
            </a>
          )}
          <a
            href="https://github.com/levi9111"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", width: 42, height: 42,
              borderRadius: 11, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
              color: "rgba(200,200,240,0.5)", textDecoration: "none", flexShrink: 0,
            }}
          >
            <Github size={16} />
          </a>
        </div>
      </div>

      <div
        style={{
          position: "absolute", inset: 0, borderRadius: 18, pointerEvents: "none",
          background: `radial-gradient(circle at 0% 50%, ${project.accent}06, transparent 55%)`,
          opacity: hovered ? 1 : 0, transition: "opacity 0.4s",
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
      display: "flex", gap: 0, marginBottom: 36, borderRadius: 16, overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.07)", background: "rgba(5,3,15,0.4)", backdropFilter: "blur(12px)",
    }}
  >
    {[
      { num: "4", label: "Ecosystems built", accent: "#a78bfa" },
      { num: "10+", label: "Repos shipped", accent: "#34d399" },
      { num: "1", label: "NPM package", accent: "#f59e0b" },
    ].map((s, i) => (
      <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "18px 12px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: s.accent, letterSpacing: "-0.04em", lineHeight: 1 }}>
          {s.num}
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.04em" }}>
          {s.label}
        </div>
      </div>
    ))}
  </div>
);

// ─── Mobile Projects Carousel ─────────────────────────────────────────────────

const MobileProjectsCarousel: React.FC<{ isInView: boolean }> = ({ isInView }) => {
  const [[activeIndex, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const paginate = useCallback((newDirection: number) => {
    setPage(([current]) => {
      const next = (current + newDirection + PROJECTS.length) % PROJECTS.length;
      return [next, newDirection];
    });
  }, []);

  const goTo = useCallback((index: number) => {
    setPage(([current]) => [index, index > current ? 1 : -1]);
  }, []);

  useEffect(() => {
    if (!isInView || isPaused) return;

    const intervalTime = 50; // update every 50ms
    const step = (intervalTime / 5000) * 100; // 5000ms total duration

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          paginate(1);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isInView, isPaused, paginate]);

  useEffect(() => {
    setProgress(0);
  }, [activeIndex]);

  const project = PROJECTS[activeIndex];

  return (
    <div
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}
    >
      {/* Card stage */}
      <div style={{ position: "relative", minHeight: 460, overflow: "hidden" }}>
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ position: "absolute", inset: 0, width: "100%", willChange: "transform, opacity" }}
          >
            <MobileCard project={project} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar loader */}
      <div
        style={{
          width: "100%",
          height: 3,
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          marginTop: 4,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(90deg, transparent, ${project.accent}, ${project.accent}, transparent)`,
            boxShadow: `0 0 10px ${project.accent}`,
            transition: "width 0.05s linear",
          }}
        />
      </div>

      {/* Controls row: prev · dots · next */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
        }}
      >
        {/* Prev */}
        <motion.button
          onClick={() => paginate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous project"
          style={{
            width: 38, height: 38, borderRadius: 10,
            border: "1px solid rgba(167,139,250,0.2)",
            background: "rgba(167,139,250,0.06)",
            backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(167,139,250,0.75)", cursor: "pointer",
          }}
        >
          <ChevronLeft size={16} />
        </motion.button>

        {/* Dot indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }} role="tablist" aria-label="Project navigation">
          {PROJECTS.map((p, i) => {
            const isActive = i === activeIndex;
            return (
              <motion.button
                key={p.id}
                onClick={() => goTo(i)}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to ${p.title}`}
                animate={{
                  width: isActive ? 24 : 6,
                  background: isActive ? p.accent : "rgba(255,255,255,0.18)",
                  boxShadow: isActive ? `0 0 6px ${p.accent}80` : "none",
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: 6, borderRadius: 3, border: "none",
                  cursor: "pointer", padding: 0, flexShrink: 0,
                }}
              />
            );
          })}
        </div>

        {/* Next */}
        <motion.button
          onClick={() => paginate(1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next project"
          style={{
            width: 38, height: 38, borderRadius: 10,
            border: "1px solid rgba(167,139,250,0.2)",
            background: "rgba(167,139,250,0.06)",
            backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(167,139,250,0.75)", cursor: "pointer",
          }}
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>

      {/* Counter label */}
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            color: "rgba(167,139,250,0.5)",
            letterSpacing: "0.08em",
          }}
        >
          <span style={{ color: "rgba(167,139,250,0.85)", fontWeight: 600 }}>{activeIndex + 1}</span>
          {" / "}
          {PROJECTS.length}
        </span>
      </div>
    </div>
  );
};

// ─── Mobile Section ───────────────────────────────────────────────────────────

const ProjectsMobile: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-8%" });

  return (
    <section className="pm-section" ref={sectionRef}>
      <div className="pm-inner">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="pm-header-wrap"
        >
          <motion.div variants={fadeUp}>
            <div className="pm-eyebrow">My Work</div>
          </motion.div>
          <motion.h2 className="pm-title" variants={fadeUp}>
            Featured <span className="pm-title-accent">Projects</span>
          </motion.h2>
          <motion.p className="pm-desc" variants={fadeUp}>
            Multi-app ecosystems, an open-source CLI, and experimental builds — each shipped
            with full-stack ownership across client, server, and beyond.
          </motion.p>
          <motion.div variants={fadeUp}>
            <StatsStrip />
          </motion.div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="pm-carousel-wrap"
        >
          <MobileProjectsCarousel isInView={isInView} />
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? "show" : "hidden"}>
          <a href="https://github.com/levi9111" target="_blank" rel="noopener noreferrer" className="pm-cta">
            <Github size={16} /> View All on GitHub — @levi9111 <ArrowUpRight size={14} className="pm-cta-arrow" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsMobile;