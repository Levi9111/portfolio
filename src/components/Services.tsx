// src/components/Services.tsx
import React, { useRef } from "react";
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
  const Icon = service.icon;

  return (
    <motion.article
      variants={cardVariant}
      custom={index}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="svc-card"
      style={{
        "--svc-accent": service.accent,
        "--svc-accent-border": `${service.accent}45`,
        "--svc-accent-border-subtle": `${service.accent}30`,
        "--svc-accent-bg": `${service.accent}14`,
        "--svc-glow": service.glow,
      } as React.CSSProperties}
    >
      {/* Top glow line */}
      <div className="svc-card-glow-line" aria-hidden="true" />

      {/* Icon */}
      <div className="svc-card-icon-wrapper">
        <Icon size={22} color={service.accent} />
      </div>

      {/* Title + description */}
      <div>
        <h3 className="svc-card-title">{service.title}</h3>
        <p className="svc-card-desc">{service.description}</p>
      </div>

      {/* Deliverables list */}
      <ul className="svc-card-list">
        {service.deliverables.map((item) => (
          <li key={item} className="svc-card-list-item">
            <span className="svc-card-dot" aria-hidden="true" />
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
        className="svc-card-cta"
      >
        Discuss a project
        <ArrowUpRight size={13} className="svc-card-cta-icon" />
      </button>
    </motion.article>
  );
};

// ─── Services Section ─────────────────────────────────────────────────────────

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section id="services-section" ref={sectionRef}>
      <div className="svc-container">
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="svc-header"
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
  );
};

export default Services;
