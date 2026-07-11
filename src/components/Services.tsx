// src/components/Services.tsx
import React, { useRef, useState } from "react";
import {
  Layers,
  Server,
  ShoppingCart,
  PackageOpen,
  ArrowUpRight,
} from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Service {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly deliverables: readonly string[];
  readonly icon: React.ElementType;
  readonly accent: string;
  readonly glow: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES: readonly Service[] = [
  {
    id: 1,
    title: "Full-Stack Web Applications",
    description:
      "End-to-end products built on React, Next.js, and the MERN stack — from architecture and data modeling to pixel-level UI and animation.",
    deliverables: [
      "React / Next.js frontends",
      "Type-safe APIs (Node.js, NestJS)",
      "Auth, payments, and data layers",
    ],
    icon: Layers,
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.15)",
  },
  {
    id: 2,
    title: "API Architecture & Backend Systems",
    description:
      "REST and WebSocket APIs designed for real production load — modular error handling, validation, and clean separation of concerns from day one.",
    deliverables: [
      "Express / NestJS backends",
      "MongoDB & Mongoose modeling",
      "Zod/Joi validation, JWT auth",
    ],
    icon: Server,
    accent: "#34d399",
    glow: "rgba(52,211,153,0.15)",
  },
  {
    id: 3,
    title: "E-commerce Platforms",
    description:
      "Multi-app commerce ecosystems — storefront, admin ERP, and backend working off one shared product and order pipeline.",
    deliverables: [
      "Storefront + checkout flows",
      "Admin dashboards & inventory",
      "Order/payment sync across apps",
    ],
    icon: ShoppingCart,
    accent: "#f472b6",
    glow: "rgba(244,114,182,0.15)",
  },
  {
    id: 4,
    title: "Open-Source Tooling",
    description:
      "Developer-facing tools that remove setup friction — CLIs, scaffolding generators, and internal packages built for real teams to depend on.",
    deliverables: [
      "CLI tools (npm-published)",
      "Project scaffolding & generators",
      "Documentation & CI/CD publishing",
    ],
    icon: PackageOpen,
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
  },
] as const;

// ─── Variants ─────────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
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
  hidden: { opacity: 0, y: 44, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
  }),
};

// ─── Service Card ─────────────────────────────────────────────────────────────

const ServiceCard: React.FC<{ service: Service; index: number }> = ({
  service,
  index,
}) => {
  const [hovered, setHovered] = useState(false);
  const Icon = service.icon;

  return (
    <motion.article
      variants={cardVariant}
      custom={index}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      style={{
        position: "relative",
        padding: "30px 26px",
        borderRadius: 20,
        overflow: "hidden",
        border: `1px solid ${hovered ? service.accent + "45" : "rgba(255,255,255,0.07)"}`,
        background: hovered
          ? `radial-gradient(circle at 20% 0%, ${service.accent}10, rgba(5,3,15,0.55))`
          : "rgba(5,3,15,0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        transition: "border-color 0.3s, background 0.3s",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {/* Top glow line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "12%",
          right: "12%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${service.accent}99, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.35s",
        }}
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 15,
          background: `${service.accent}14`,
          border: `1px solid ${service.accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.35s",
          transform: hovered ? "scale(1.08) rotate(-3deg)" : "scale(1)",
        }}
      >
        <Icon size={22} color={service.accent} />
      </div>

      {/* Title + description */}
      <div>
        <h3
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 21,
            fontWeight: 400,
            color: "#fff",
            letterSpacing: "-0.3px",
            margin: "0 0 10px",
            lineHeight: 1.25,
          }}
        >
          {service.title}
        </h3>
        <p
          style={{
            fontSize: 13,
            fontWeight: 300,
            lineHeight: 1.75,
            color: "rgba(190,190,220,0.5)",
            margin: 0,
          }}
        >
          {service.description}
        </p>
      </div>

      {/* Deliverables list */}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 9,
          flex: 1,
        }}
      >
        {service.deliverables.map((item) => (
          <li
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontSize: 12,
              color: "rgba(200,200,230,0.6)",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: service.accent,
                boxShadow: `0 0 5px ${service.accent}`,
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>

      {/* CTA row */}
      <button
        onClick={() =>
          document
            .getElementById("contact-section")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: 0,
          border: "none",
          background: "none",
          cursor: "pointer",
          fontSize: 12.5,
          fontWeight: 500,
          color: hovered ? service.accent : "rgba(200,200,240,0.5)",
          fontFamily: "'Outfit',sans-serif",
          transition: "color 0.25s",
          alignSelf: "flex-start",
        }}
      >
        Discuss a project
        <ArrowUpRight
          size={13}
          style={{
            transform: hovered ? "translate(2px,-2px)" : "translate(0,0)",
            transition: "transform 0.25s",
          }}
        />
      </button>
    </motion.article>
  );
};

// ─── Services Section ─────────────────────────────────────────────────────────

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        #services-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          padding: 140px 0 120px;
          background: transparent;
          overflow: visible;
        }
        #services-section::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent);
          pointer-events: none;
        }

        .svc-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 7px 16px; border-radius: 100px;
          border: 1px solid rgba(139,92,246,0.2);
          background: rgba(5,3,15,0.5);
          backdrop-filter: blur(12px);
          font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(167,139,250,0.85); margin-bottom: 20px;
        }
        .svc-eyebrow::before {
          content: ''; display: block; width: 20px; height: 1px;
          background: rgba(139,92,246,0.5);
        }

        .svc-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(44px, 7vw, 76px);
          line-height: 1.05; color: #fff; letter-spacing: -1.5px;
        }
        .svc-title-accent {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: svcHue 8s ease-in-out infinite;
        }
        @keyframes svcHue { 0%,100%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(25deg)} }

        .svc-divider {
          width: 64px; height: 1px; margin: 24px auto 0;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
          position: relative;
        }
        .svc-divider::after {
          content: ''; position: absolute; top: -2px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 8px #a78bfa;
        }

        .svc-desc {
          font-size: 15px; font-weight: 300;
          color: rgba(190,190,220,0.45); max-width: 520px;
          line-height: 1.8; margin: 20px auto 0;
        }

        .svc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }

        @media (max-width: 768px) {
          #services-section { padding: 100px 0 80px; }
        }
      `}</style>

      <section id="services-section" ref={sectionRef}>
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
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <motion.div variants={fadeUp}>
              <div className="svc-eyebrow">What I Offer</div>
            </motion.div>
            <motion.h2 className="svc-title" variants={fadeUp}>
              Services & <span className="svc-title-accent">Expertise</span>
            </motion.h2>
            <motion.div variants={fadeUp}>
              <div className="svc-divider" />
            </motion.div>
            <motion.p className="svc-desc" variants={fadeUp}>
              From single applications to multi-app ecosystems — full ownership
              of the stack, or a focused piece of a larger team.
            </motion.p>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="svc-grid"
          >
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Services;
