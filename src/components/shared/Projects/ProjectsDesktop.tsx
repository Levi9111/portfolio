import React, { useState, useRef } from "react";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";
import DevProcess from "../DevProcess";
import { PROJECTS } from "../../../data/projects";
import ProjectVisual from "./ProjectVisuals";
import LinkPill from "./LinkPill";
import InstallSnippet from "./InstallSnippet";

// ─── Variants ─────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 48, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.13 },
  }),
};

// ─── Project Card ─────────────────────────────────────────────────────────────

const ProjectCard: React.FC<{ project: (typeof PROJECTS)[number]; index: number }> = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = project.icon;

  return (
    <motion.article
      variants={cardVariant}
      custom={index}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -10, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      style={{
        position: "relative", borderRadius: 22, overflow: "hidden",
        border: `1px solid ${hovered ? project.accent + "45" : "rgba(255,255,255,0.07)"}`,
        background: "rgba(5,3,15,0.5)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        transition: "border-color 0.3s", display: "flex", flexDirection: "column",
      }}
      aria-label={`${project.title} project`}
    >
      <div
        style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 1, zIndex: 10,
          background: `linear-gradient(90deg, transparent, ${project.accent}bb, transparent)`,
          opacity: hovered ? 1 : 0, transition: "opacity 0.4s",
        }}
        aria-hidden="true"
      />

      {/* ── Visual area ── */}
      <div
        style={{
          position: "relative", height: 230, overflow: "hidden",
          background: `radial-gradient(ellipse at 50% -10%, ${project.accent}18 0%, rgba(5,3,15,0.8) 70%)`,
          borderBottom: `0.5px solid ${hovered ? project.accent + "30" : "rgba(255,255,255,0.05)"}`,
          transition: "border-color 0.3s", flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0, opacity: 0.35,
            backgroundImage: `linear-gradient(${project.accent}18 1px, transparent 1px), linear-gradient(90deg, ${project.accent}18 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />

        <ProjectVisual category={project.category} accent={project.accent} hovered={hovered} />

        {/* Status badge */}
        <div
          style={{
            position: "absolute", top: 14, right: 14, zIndex: 20, display: "flex", alignItems: "center", gap: 5,
            padding: "5px 11px", borderRadius: 100, background: `${project.accent}18`,
            border: `0.5px solid ${project.accent}40`, backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{ width: 5, height: 5, borderRadius: "50%", background: project.accent, display: "block", boxShadow: `0 0 6px ${project.accent}` }}
            aria-hidden="true"
          />
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.5px", color: project.accent, fontFamily: "'DM Sans',sans-serif" }}>
            {project.statusLabel}
          </span>
        </div>

        {/* Role badge */}
        <div
          style={{
            position: "absolute", bottom: 14, left: 14, zIndex: 20, display: "flex", alignItems: "center", gap: 5,
            padding: "4px 10px", borderRadius: 6, background: "rgba(5,3,15,0.75)",
            border: "0.5px solid rgba(255,255,255,0.1)", backdropFilter: "blur(6px)",
          }}
        >
          <Icon size={10} color={project.accent} />
          <span style={{ fontSize: 9, color: "rgba(200,200,240,0.6)", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.3px" }}>
            {project.role}
          </span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <h3
              style={{
                fontFamily: "'Instrument Serif', serif", fontSize: 22, fontWeight: 400, lineHeight: 1.2,
                color: hovered ? project.accent : "#fff", letterSpacing: "-0.3px", transition: "color 0.3s", margin: 0,
              }}
            >
              {project.title}
            </h3>
            <p style={{ fontSize: 11, color: `${project.accent}88`, marginTop: 2, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.3px" }}>
              {project.subtitle}
            </p>
          </div>
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.title}`}
              whileHover={{ scale: 1.12, rotate: 12 }}
              style={{
                width: 36, height: 36, borderRadius: "50%", border: `1px solid ${project.accent}35`,
                background: `${project.accent}10`, display: "flex", alignItems: "center", justifyContent: "center",
                color: project.accent, textDecoration: "none", flexShrink: 0,
              }}
            >
              <ArrowUpRight size={16} />
            </motion.a>
          )}
        </div>

        <p style={{ fontSize: 13.5, fontWeight: 300, lineHeight: 1.8, color: "rgba(190,190,220,0.5)", marginBottom: 18, flex: 1 }}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
          {project.technologies.map((tech) => (
            <span
              key={tech}
              style={{
                display: "inline-flex", alignItems: "center", padding: "4px 11px", borderRadius: 8,
                fontSize: 11.5, fontWeight: 400, letterSpacing: "0.2px", border: `1px solid ${project.accent}28`,
                background: hovered ? project.glow : "rgba(255,255,255,0.03)",
                color: hovered ? project.accent : "rgba(200,200,230,0.55)",
                transition: "background 0.3s, color 0.3s, border-color 0.3s",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Repo links — every button, inline */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: project.npmPackage ? 12 : 16 }}>
          {project.links.map((link) => (
            <LinkPill key={link.href} link={link} accent={project.accent} glow={project.glow} />
          ))}
        </div>

        {/* npm install snippet */}
        {project.npmPackage && (
          <div style={{ marginBottom: 16 }}>
            <InstallSnippet packageName={project.npmPackage} accent={project.accent} />
          </div>
        )}

        {/* Visit Site + GitHub profile */}
        <div style={{ display: "flex", gap: 10 }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 11,
                border: `1px solid ${project.accent}55`, background: `${project.accent}15`, color: project.accent,
                fontSize: 13, fontWeight: 400, textDecoration: "none", transition: "all 0.22s", flex: 1, justifyContent: "center",
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
              Visit Site
            </a>
          )}
          <a
            href="https://github.com/levi9111"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", width: 42, height: 42,
              borderRadius: 11, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
              color: "rgba(200,200,240,0.5)", textDecoration: "none", transition: "all 0.22s", flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.2)";
              el.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.08)";
              el.style.color = "rgba(200,200,240,0.5)";
            }}
          >
            <Github size={16} />
          </a>
        </div>
      </div>

      <div
        style={{
          position: "absolute", inset: 0, borderRadius: 22, pointerEvents: "none",
          background: `radial-gradient(circle at 50% 0%, ${project.accent}06, transparent 55%)`,
          opacity: hovered ? 1 : 0, transition: "opacity 0.4s",
        }}
        aria-hidden="true"
      />
    </motion.article>
  );
};

// ─── Projects Section ─────────────────────────────────────────────────────────

const ProjectsDesktop: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        #projects-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          padding: 140px 0 120px;
          background: transparent;
          overflow: visible;
        }
        #projects-section::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent);
          pointer-events: none;
        }
        .proj-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 7px 16px; border-radius: 100px;
          border: 1px solid rgba(139,92,246,0.2);
          background: rgba(5,3,15,0.5); backdrop-filter: blur(12px);
          font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(167,139,250,0.85); margin-bottom: 20px;
        }
        .proj-eyebrow::before { content: ''; display: block; width: 20px; height: 1px; background: rgba(139,92,246,0.5); }
        .proj-title { font-family: 'Instrument Serif', serif; font-size: clamp(44px, 7vw, 76px); line-height: 1.05; color: #fff; letter-spacing: -1.5px; }
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
          width: 4px; height: 4px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 8px #a78bfa;
        }
        .proj-desc { font-size: 15px; font-weight: 300; color: rgba(190,190,220,0.45); max-width: 520px; line-height: 1.8; margin: 20px auto 0; }
        @media (max-width: 768px) { #projects-section { padding: 100px 0 80px; } }
      `}</style>

      <section id="projects-section" ref={sectionRef}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{ textAlign: "center", marginBottom: 72 }}
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
              Multi-app ecosystems, an open-source CLI, and experimental builds — each shipped
              with full-stack ownership across client, server, and beyond.
            </motion.p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }} className="proj-layout">
            <DevProcess />
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: 28 }}
            >
              {PROJECTS.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{ textAlign: "center", marginTop: 56 }}
          >
            <a
              href="https://github.com/levi9111"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                color: "rgba(200,200,240,0.7)", fontSize: 14, fontWeight: 400, textDecoration: "none",
                backdropFilter: "blur(12px)", transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(167,139,250,0.4)";
                el.style.background = "rgba(167,139,250,0.08)";
                el.style.color = "#a78bfa";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.1)";
                el.style.background = "rgba(255,255,255,0.04)";
                el.style.color = "rgba(200,200,240,0.7)";
                el.style.transform = "none";
              }}
            >
              <Github size={18} />
              View All on GitHub — @levi9111
              <ArrowUpRight size={16} style={{ opacity: 0.6 }} />
            </a>
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 1100px) {
            .proj-layout { grid-template-columns: 1fr; }
            .proj-layout > *:last-child { max-width: 360px; margin: 0 auto; }
          }
        `}</style>
      </section>
    </>
  );
};

export default ProjectsDesktop;