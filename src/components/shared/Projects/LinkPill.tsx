// src/components/shared/Projects/LinkPill.tsx
import React, { useState } from "react";
import {
  Github,
  Smartphone,
  Server,
  LayoutDashboard,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ProjectLink } from "../../../data/projects";

const ICON_MAP = {
  client: Globe,
  server: Server,
  admin: LayoutDashboard,
  mobile: Smartphone,
  github: Github,
  npm: Github,
} as const;

interface LinkPillProps {
  link: ProjectLink;
  accent: string;
  glow: string;
}

const LinkPill: React.FC<LinkPillProps> = ({ link, accent, glow }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = ICON_MAP[link.type];

  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.96 }}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 13px",
        borderRadius: 10,
        border: `1px solid ${hovered ? accent + "60" : "rgba(255,255,255,0.09)"}`,
        background: hovered ? glow : "rgba(255,255,255,0.03)",
        color: hovered ? accent : "rgba(200,200,240,0.6)",
        fontSize: 12,
        fontWeight: 400,
        textDecoration: "none",
        overflow: "hidden",
        transition: "border-color 0.25s, background 0.25s, color 0.25s",
      }}
    >
      {/* Sheen sweep on hover */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(105deg, transparent 40%, ${accent}22 50%, transparent 60%)`,
          transform: hovered ? "translateX(100%)" : "translateX(-100%)",
          transition: "transform 0.6s ease",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <Icon size={13} style={{ position: "relative", zIndex: 1 }} />
      <span style={{ position: "relative", zIndex: 1 }}>{link.label}</span>
      <ArrowUpRight
        size={11}
        style={{
          position: "relative",
          zIndex: 1,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translate(0,0)" : "translate(-3px,3px)",
          transition: "opacity 0.2s, transform 0.2s",
        }}
      />
    </motion.a>
  );
};

export default LinkPill;
