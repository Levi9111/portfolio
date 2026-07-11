// src/data/projects.ts
import {
  Building2,
  ShoppingBag,
  TerminalSquare,
  ListChecks,
  type LucideIcon,
} from "lucide-react";

export type LinkType =
  | "client"
  | "server"
  | "admin"
  | "mobile"
  | "github"
  | "npm";

export interface ProjectLink {
  readonly label: string; // "Client Repo", "Server Repo", "Admin Dashboard", "Mobile App"
  readonly href: string;
  readonly type: LinkType;
}

export type ProjectCategory = "agency" | "ecommerce" | "cli" | "taskflow";

export interface Project {
  readonly id: number;
  readonly title: string;
  readonly subtitle: string; // domain or npm package name
  readonly description: string;
  readonly liveUrl?: string; // omit for code-only projects
  readonly npmPackage?: string; // e.g. "create-express-modular" — triggers install-snippet CTA
  readonly links: readonly ProjectLink[];
  readonly technologies: readonly string[];
  readonly accent: string;
  readonly glow: string;
  readonly statusLabel: string;
  readonly icon: LucideIcon;
  readonly role: string;
  readonly category: ProjectCategory;
}

export const PROJECTS: readonly Project[] = [
  {
    id: 1,
    title: "UIX Design Lab",
    subtitle: "uixdesignlab.com",
    description:
      "A comprehensive agency portal — a client-facing web app, an admin ERP for managing portfolios and analytics, and a REST API backend powering both.",
    liveUrl: "https://www.uixdesignlab.com/",
    links: [
      {
        label: "Client Repo",
        href: "https://github.com/levi9111/uix-client",
        type: "client",
      },
      {
        label: "Server Repo",
        href: "https://github.com/levi9111/uix-server",
        type: "server",
      },
    ],
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS",
    ],
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.15)",
    statusLabel: "Agency",
    icon: Building2,
    role: "Co-Founder & Developer",
    category: "agency",
  },
  {
    id: 2,
    title: "Subaashghor",
    subtitle: "subaashghor.com",
    description:
      "A luxury e-commerce ecosystem — web storefront, REST API backend, admin ERP, and a native mobile application, all sharing one product and order pipeline.",
    liveUrl: "https://subaashghor.com",
    links: [
      {
        label: "Web Client",
        href: "https://github.com/levi9111/subaashghor-client",
        type: "client",
      },
      {
        label: "Server",
        href: "https://github.com/levi9111/subaashghor-server",
        type: "server",
      },
      {
        label: "Admin Dashboard",
        href: "https://github.com/levi9111/subaashghor-admin",
        type: "admin",
      },
      {
        label: "Mobile App",
        href: "https://github.com/levi9111/subaashghor-mobile",
        type: "mobile",
      },
    ],
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Framer Motion",
      "React Native",
    ],
    accent: "#f472b6",
    glow: "rgba(244,114,182,0.15)",
    statusLabel: "Live",
    icon: ShoppingBag,
    role: "Full-Stack Developer",
    category: "ecommerce",
  },
  {
    id: 3,
    title: "create-express-modular",
    subtitle: "npm i -g create-express-modular",
    description:
      "An open-source CLI that scaffolds production-ready Express + TypeScript backends — database abstraction (Mongoose, Prisma, Drizzle), validation engines (Zod, Joi), and modular error handling, automated.",
    npmPackage: "create-express-modular",
    links: [
      {
        label: "GitHub Repo",
        href: "https://github.com/levi9111/create-express-modular",
        type: "github",
      },
    ],
    technologies: [
      "TypeScript",
      "Node.js",
      "Commander.js",
      "Mongoose",
      "Prisma",
      "Zod",
    ],
    accent: "#34d399",
    glow: "rgba(52,211,153,0.15)",
    statusLabel: "Open Source",
    icon: TerminalSquare,
    role: "Author & Maintainer",
    category: "cli",
  },
  {
    id: 4,
    title: "TaskFlow",
    subtitle: "Experimental task management ecosystem",
    description:
      "A REST + WebSocket API on NestJS 11 with real-time event distribution and secure auth, paired with a React 19 SPA — Redux Toolkit, React Query, and GSAP animations.",
    links: [
      {
        label: "Backend API",
        href: "https://github.com/levi9111/taskflow-backend",
        type: "server",
      },
      {
        label: "Web Client",
        href: "https://github.com/levi9111/taskflow-client",
        type: "client",
      },
    ],
    technologies: [
      "NestJS 11",
      "React 19",
      "Redux Toolkit",
      "React Query",
      "WebSocket",
      "GSAP",
    ],
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
    statusLabel: "In Progress",
    icon: ListChecks,
    role: "Full-Stack Developer",
    category: "taskflow",
  },
] as const;

export const LINK_TYPE_META: Record<LinkType, { short: string }> = {
  client: { short: "Client" },
  server: { short: "Server" },
  admin: { short: "Admin" },
  mobile: { short: "Mobile" },
  github: { short: "Code" },
  npm: { short: "npm" },
};
