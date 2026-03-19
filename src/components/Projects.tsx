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
// import ProjectsWidget from "./shared/ProjectsWidget";
import DevProcess from "./shared/DevProcess";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Data ─────────────────────────────────────────────────────────────────────

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
      "My own agency website — a showcase of design and development excellence with stunning animations, micro-interactions, and production-grade performance. Built with obsessive attention to craft.",
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
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.13 },
  }),
};

// ─── Project Visual (replaces image) ─────────────────────────────────────────
// Each project gets a unique animated canvas-style visual

interface VisualProps {
  visual: Project["visual"];
  accent: string;
  hovered: boolean;
}

const CryptoVisual: React.FC<{ accent: string; hovered: boolean }> = ({
  accent,
  hovered,
}) => {
  const bars = [42, 68, 55, 80, 62, 91, 74, 58, 85, 70, 95, 77];
  console.log(hovered);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${25 * i}%`,
            height: "1px",
            background: `${accent}12`,
          }}
        />
      ))}
      {/* Price header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 1,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: `${accent}88`,
              marginBottom: 4,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            BTC / USDT
          </div>
          <div
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
            }}
          >
            $67,842
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#34d399",
              marginTop: 2,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            ▲ +2.43%
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "1px",
              marginBottom: 4,
            }}
          >
            24H VOL
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "'Syne',sans-serif",
            }}
          >
            $2.4B
          </div>
        </div>
      </div>
      {/* Bar chart */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
          height: 60,
          zIndex: 1,
        }}
      >
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              borderRadius: "2px 2px 0 0",
              background: i === bars.length - 1 ? accent : `${accent}55`,
              transition: "height 0.4s ease",
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>
      {/* Bottom row */}
      <div style={{ display: "flex", gap: 8, zIndex: 1 }}>
        {(["Market", "Wallet", "Trade"] as const).map((label, i) => (
          <div
            key={label}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "6px 0",
              borderRadius: 8,
              background: i === 2 ? accent : `${accent}15`,
              border: `0.5px solid ${accent}${i === 2 ? "ff" : "30"}`,
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.5px",
              color: i === 2 ? "#fff" : `${accent}cc`,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

const AgencyVisual: React.FC<{ accent: string; hovered: boolean }> = ({
  accent,
  hovered,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 14,
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Nav bar mock */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: 13,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.02em",
        }}
      >
        UIX Design Lab
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["Work", "Process", "Contact"].map((n) => (
          <div
            key={n}
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.35)",
              fontFamily: "'DM Sans',sans-serif",
              letterSpacing: "1px",
            }}
          >
            {n}
          </div>
        ))}
      </div>
    </div>
    {/* Hero text mock */}
    <div>
      <div
        style={{
          height: 10,
          borderRadius: 5,
          background: "rgba(255,255,255,0.12)",
          width: "85%",
          marginBottom: 8,
        }}
      />
      <div
        style={{
          height: 10,
          borderRadius: 5,
          background: "rgba(255,255,255,0.07)",
          width: "60%",
          marginBottom: 14,
        }}
      />
      {/* CTA */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 16px",
          borderRadius: 100,
          background: accent,
          fontSize: 9,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "0.5px",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        See Our Work <ArrowUpRight size={10} />
      </div>
    </div>
    {/* Project card previews */}
    <div style={{ display: "flex", gap: 8, flex: 1 }}>
      {[accent, "#60a5fa", "#f472b6"].map((c, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            borderRadius: 10,
            background: `${c}15`,
            border: `0.5px solid ${c}30`,
            transition: "transform 0.3s",
            transform: hovered ? `translateY(-${(i + 1) * 2}px)` : "none",
          }}
        />
      ))}
    </div>
  </div>
);

const RentVisual: React.FC<{ accent: string; hovered: boolean }> = ({
  accent,
}) => {
  const stats = [
    { label: "Units", value: "128", change: "+4" },
    { label: "Collected", value: "$48k", change: "+12%" },
    { label: "Occupancy", value: "94%", change: "+2%" },
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          Rent Dashboard
        </div>
        <div
          style={{
            padding: "3px 9px",
            borderRadius: 100,
            background: `${accent}20`,
            border: `0.5px solid ${accent}40`,
            fontSize: 8,
            color: accent,
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          BETA
        </div>
      </div>
      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              padding: "10px 8px",
              borderRadius: 10,
              background: `${accent}10`,
              border: `0.5px solid ${accent}25`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 14,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 8,
                color: accent,
                letterSpacing: "1px",
                margin: "2px 0",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: 8,
                color: "#34d399",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {s.change}
            </div>
          </div>
        ))}
      </div>
      {/* Tenant list mock */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 8px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: `${accent}30`,
              border: `0.5px solid ${accent}50`,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: 5,
                borderRadius: 3,
                background: "rgba(255,255,255,0.12)",
                width: `${60 + i * 12}%`,
              }}
            />
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: "rgba(255,255,255,0.06)",
                width: "40%",
                marginTop: 4,
              }}
            />
          </div>
          <div
            style={{
              width: 32,
              height: 5,
              borderRadius: 3,
              background: `${accent}40`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

const PortfolioVisual: React.FC<{ accent: string; hovered: boolean }> = ({
  accent,
  hovered,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {/* Avatar ring */}
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${accent}, #a78bfa)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 ${hovered ? "40px" : "20px"} ${accent}44`,
        transition: "box-shadow 0.4s",
        position: "relative",
      }}
    >
      <span
        style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: 20,
          fontWeight: 800,
          color: "#fff",
        }}
      >
        T
      </span>
      <div
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: "50%",
          border: `1px solid ${accent}40`,
          animation: "none",
        }}
      />
    </div>
    {/* Name */}
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 16,
          fontStyle: "italic",
          color: "#fff",
          marginBottom: 4,
        }}
      >
        Tahsin Ahmad
      </div>
      <div
        style={{
          fontSize: 9,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "rgba(200,200,240,0.4)",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        UI/UX Designer
      </div>
    </div>
    {/* Tags */}
    <div
      style={{
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {["Figma", "Motion", "Branding"].map((t) => (
        <div
          key={t}
          style={{
            padding: "4px 10px",
            borderRadius: 100,
            background: `${accent}15`,
            border: `0.5px solid ${accent}35`,
            fontSize: 9,
            color: accent,
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          {t}
        </div>
      ))}
    </div>
    {/* Bottom decoration */}
    <div style={{ display: "flex", gap: 8, width: "100%" }}>
      {[1, 2].map((i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 36,
            borderRadius: 10,
            background: `${accent}12`,
            border: `0.5px solid ${accent}25`,
          }}
        />
      ))}
    </div>
  </div>
);

const ProjectVisual: React.FC<VisualProps> = ({ visual, accent, hovered }) => {
  switch (visual) {
    case "crypto":
      return <CryptoVisual accent={accent} hovered={hovered} />;
    case "agency":
      return <AgencyVisual accent={accent} hovered={hovered} />;
    case "rent":
      return <RentVisual accent={accent} hovered={hovered} />;
    case "portfolio":
      return <PortfolioVisual accent={accent} hovered={hovered} />;
  }
};

// ─── Project Card ─────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [hovered, setHovered] = useState(false);
  const statusStyle = STATUS_STYLES[project.status];
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
        position: "relative",
        borderRadius: 22,
        overflow: "hidden",
        border: `1px solid ${hovered ? project.accent + "45" : "rgba(255,255,255,0.07)"}`,
        background: "rgba(5,3,15,0.5)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        transition: "border-color 0.3s",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
      }}
      aria-label={`${project.title} project`}
    >
      {/* Top accent glow line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: 1,
          zIndex: 10,
          background: `linear-gradient(90deg, transparent, ${project.accent}bb, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s",
        }}
        aria-hidden="true"
      />

      {/* ── Visual area ────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          height: 230,
          overflow: "hidden",
          background: `radial-gradient(ellipse at 50% -10%, ${project.accent}18 0%, rgba(5,3,15,0.8) 70%)`,
          borderBottom: `0.5px solid ${hovered ? project.accent + "30" : "rgba(255,255,255,0.05)"}`,
          transition: "border-color 0.3s",
          flexShrink: 0,
        }}
      >
        {/* Decorative grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.35,
            backgroundImage: `linear-gradient(${project.accent}18 1px, transparent 1px), linear-gradient(90deg, ${project.accent}18 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />

        <ProjectVisual
          visual={project.visual}
          accent={project.accent}
          hovered={hovered}
        />

        {/* Status badge */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 11px",
            borderRadius: 100,
            background: statusStyle.bg,
            border: `0.5px solid ${statusStyle.border}`,
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: statusStyle.dot,
              display: "block",
              boxShadow: `0 0 6px ${statusStyle.dot}`,
            }}
            aria-hidden="true"
          />
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.5px",
              color: statusStyle.color,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {project.statusLabel}
          </span>
        </div>

        {/* Role badge */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 14,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 6,
            background: "rgba(5,3,15,0.75)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Icon size={10} color={project.accent} />
          <span
            style={{
              fontSize: 9,
              color: "rgba(200,200,240,0.6)",
              fontFamily: "'DM Sans',sans-serif",
              letterSpacing: "0.3px",
            }}
          >
            {project.role}
          </span>
        </div>
      </div>

      {/* ── Card body ──────────────────────────────────── */}
      <div
        style={{
          padding: "22px 24px 24px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Title + URL */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 22,
                fontWeight: 400,
                lineHeight: 1.2,
                color: hovered ? project.accent : "#fff",
                letterSpacing: "-0.3px",
                transition: "color 0.3s",
                margin: 0,
              }}
            >
              {project.title}
            </h3>
            <p
              style={{
                fontSize: 11,
                color: `${project.accent}88`,
                marginTop: 2,
                fontFamily: "'DM Sans',sans-serif",
                letterSpacing: "0.3px",
              }}
            >
              {project.subtitle}
            </p>
          </div>
          {/* External link icon */}
          <motion.a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${project.title}`}
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.12, rotate: 12 }}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1px solid ${project.accent}35`,
              background: `${project.accent}10`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: project.accent,
              textDecoration: "none",
              flexShrink: 0,
              transition: "background 0.25s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                `${project.accent}22`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                `${project.accent}10`;
            }}
          >
            <ArrowUpRight size={16} />
          </motion.a>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 13.5,
            fontWeight: 300,
            lineHeight: 1.8,
            color: "rgba(190,190,220,0.5)",
            marginBottom: 18,
            flex: 1,
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
            marginBottom: 20,
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
                border: `1px solid ${project.accent}28`,
                background: hovered ? project.glow : "rgba(255,255,255,0.03)",
                color: hovered ? project.accent : "rgba(200,200,230,0.55)",
                transition: "background 0.3s, color 0.3s, border-color 0.3s",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10 }}>
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
          )}
          <a
            href={project.url}
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
              flex: project.githubUrl ? "0 0 auto" : "1",
              justifyContent: project.githubUrl ? "flex-start" : "center",
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
          {/* GitHub profile link for all */}
          <a
            href="https://github.com/levi9111"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 42,
              height: 42,
              borderRadius: 11,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(200,200,240,0.5)",
              textDecoration: "none",
              transition: "all 0.22s",
              flexShrink: 0,
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

      {/* Inner bloom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          pointerEvents: "none",
          background: `radial-gradient(circle at 50% 0%, ${project.accent}06, transparent 55%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s",
        }}
        aria-hidden="true"
      />
    </motion.article>
  );
};

// ─── Projects Section ─────────────────────────────────────────────────────────

const Projects: React.FC = () => {
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
          background: rgba(5,3,15,0.5);
          backdrop-filter: blur(12px);
          font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(167,139,250,0.85); margin-bottom: 20px;
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
          color: rgba(190,190,220,0.45); max-width: 520px;
          line-height: 1.8; margin: 20px auto 0;
        }

        @media (max-width: 768px) {
          #projects-section { padding: 100px 0 80px; }
        }
      `}</style>

      <section id="projects-section" ref={sectionRef}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* Header */}
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
              Live products and production builds — from crypto platforms to
              agency sites, every one shipped with full-stack ownership.
            </motion.p>
          </motion.div>

          {/* ── Layout: widget + grid ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: 24,
              alignItems: "start",
            }}
            className="proj-layout"
          >
            {/* Widget on the left */}
            {/* <ProjectsWidget /> */}
            <DevProcess />
            {/* Project cards on the right */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))",
                gap: 28,
              }}
            >
              {PROJECTS.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          </div>

          {/* GitHub CTA */}
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
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 32px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(200,200,240,0.7)",
                fontSize: 14,
                fontWeight: 400,
                textDecoration: "none",
                backdropFilter: "blur(12px)",
                transition: "all 0.25s",
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
       .proj-layout {
         grid-template-columns: 1fr;
           }
          .proj-layout > *:last-child {
              max-width: 360px;
           margin: 0 auto;
         }
        }
        `}</style>
      </section>
    </>
  );
};

export default Projects;
