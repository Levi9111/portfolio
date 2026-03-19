import React, { useState, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import {
  Code2,
  Zap,
  Rocket,
  Heart,
  Trophy,
  Target,
  Sparkles,
  ArrowRight,
  GitBranch,
  Globe,
  Star,
} from "lucide-react";
import ActivityWidget from "./shared/ActivityWidget";
import DevDashboard from "./shared/DevDashboard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Skill {
  readonly category: string;
  readonly icon: React.ElementType;
  readonly items: readonly string[];
  readonly accent: string;
  readonly glow: string;
}

interface Achievement {
  readonly number: string;
  readonly label: string;
  readonly icon: React.ElementType;
  readonly accent: string;
}

interface StoryItem {
  readonly accent: string;
  readonly bold: string;
  readonly text: string;
}

// ─── Variants ─────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -28, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILLS: readonly Skill[] = [
  {
    category: "Frontend",
    icon: Code2,
    items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "HTML5", "CSS3"],
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
  },
  {
    category: "Backend",
    icon: Zap,
    items: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "REST APIs",
      "Nest.js",
    ],
    accent: "#34d399",
    glow: "rgba(52,211,153,0.15)",
  },
  {
    category: "Tools & DevOps",
    icon: Rocket,
    items: ["Git", "Vercel", "Jest", "Webpack", "Docker", "AWS"],
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.15)",
  },
  {
    category: "Design & UX",
    icon: Heart,
    items: ["Figma", "Responsive Design", "Accessibility", "User Research"],
    accent: "#f472b6",
    glow: "rgba(244,114,182,0.15)",
  },
] as const;

const ACHIEVEMENTS: readonly Achievement[] = [
  { number: "5+", label: "Years Experience", icon: Trophy, accent: "#a78bfa" },
  { number: "60+", label: "Projects Shipped", icon: Target, accent: "#60a5fa" },
  {
    number: "99%",
    label: "Client Satisfaction",
    icon: Sparkles,
    accent: "#34d399",
  },
] as const;

const STORY: readonly StoryItem[] = [
  {
    accent: "#a78bfa",
    bold: "5 years of full-stack mastery",
    text: "building production-grade web applications. From small startups to scaling platforms, I've led end-to-end development using the MERN stack — architecting systems that handle real users and real data.",
  },
  {
    accent: "#60a5fa",
    bold: "performance-first engineering",
    text: "is at the core of everything I write. I care deeply about clean architecture, type safety, and code that the next developer will actually thank you for. TDD, code reviews, and documentation aren't afterthoughts — they're the baseline.",
  },
  {
    accent: "#34d399",
    bold: "shipping at speed without breaking things",
    text: "is the real skill. CI/CD pipelines, Docker containers, cloud deployments on AWS and Vercel — I own the full lifecycle from local dev to production, and I keep iteration cycles tight.",
  },
] as const;

// ─── SkillTag ─────────────────────────────────────────────────────────────────

interface SkillTagProps {
  label: string;
  accent: string;
  glow: string;
}

const SkillTag: React.FC<SkillTagProps> = ({ label, accent, glow }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.span
      variants={scaleIn}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.08, y: -2 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 14px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 400,
        letterSpacing: "0.2px",
        cursor: "default",
        border: `1px solid ${hovered ? accent + "55" : "rgba(255,255,255,0.08)"}`,
        background: hovered ? glow : "rgba(255,255,255,0.04)",
        color: hovered ? accent : "rgba(200,200,230,0.6)",
        transition: "border-color 0.25s, background 0.25s, color 0.25s",
        backdropFilter: "blur(10px)",
        boxShadow: hovered ? `0 0 18px ${glow}` : "none",
      }}
    >
      {label}
    </motion.span>
  );
};

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  number: string;
  label: string;
  icon: React.ElementType;
  accent: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({
  number,
  label,
  icon: Icon,
  accent,
  index,
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, scale: 1.03 }}
      style={{
        position: "relative",
        padding: "32px 24px",
        borderRadius: 20,
        textAlign: "center",
        cursor: "default",
        border: `1px solid ${hovered ? accent + "44" : "rgba(255,255,255,0.07)"}`,
        background: hovered
          ? `radial-gradient(circle at 50% 0%, ${accent}12, rgba(5,3,15,0.55))`
          : "rgba(5,3,15,0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        transition: "border-color 0.3s, background 0.3s",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: `${accent}14`,
          border: `1px solid ${accent}28`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          transition: "transform 0.3s",
          transform: hovered ? "scale(1.12) rotate(-4deg)" : "scale(1)",
        }}
      >
        <Icon size={24} color={accent} />
      </div>
      <div
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 42,
          lineHeight: 1,
          marginBottom: 8,
          background: `linear-gradient(135deg, #fff, ${accent})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontSize: 12,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "rgba(180,180,210,0.4)",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
};

// ─── About ────────────────────────────────────────────────────────────────────

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        #about-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          padding: 140px 0 120px;
          background: transparent;
          overflow: visible;
        }
        #about-section::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent);
          pointer-events: none;
        }

        .about-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 7px 16px; border-radius: 100px;
          border: 1px solid rgba(139,92,246,0.2);
          background: rgba(5,3,15,0.5);
          backdrop-filter: blur(12px);
          font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(167,139,250,0.85); margin-bottom: 20px;
        }
        .about-eyebrow::before {
          content: ''; display: block; width: 20px; height: 1px;
          background: rgba(139,92,246,0.5);
        }

        .about-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(48px, 7vw, 80px);
          line-height: 1.05; color: #fff; letter-spacing: -1.5px;
        }
        .about-title-accent {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: hueAbout 8s ease-in-out infinite;
        }
        @keyframes hueAbout { 0%,100%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(25deg)} }

        .about-divider {
          width: 64px; height: 1px; margin: 24px auto 0;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
          position: relative;
        }
        .about-divider::after {
          content: ''; position: absolute; top: -2px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: #a78bfa; box-shadow: 0 0 8px #a78bfa;
        }

        .story-item {
          position: relative; padding-left: 24px;
          font-size: 15px; font-weight: 300;
          color: rgba(190,190,220,0.55); line-height: 1.85;
        }
        .story-dot {
          position: absolute; left: 0; top: 9px;
          width: 8px; height: 8px; border-radius: 50%;
        }
        .story-dot::after {
          content: ''; position: absolute; inset: -4px; border-radius: 50%;
          border: 1px solid currentColor; opacity: 0.25;
          animation: dotring 2s ease-in-out infinite;
        }
        @keyframes dotring { 0%,100%{transform:scale(1);opacity:.25} 50%{transform:scale(1.6);opacity:0} }

        .about-cta {
          position: relative; display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; border-radius: 14px;
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.3);
          color: rgba(200,180,255,0.9);
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 400;
          cursor: default; overflow: hidden;
          transition: background 0.25s, border-color 0.25s, color 0.25s, transform 0.2s, box-shadow 0.25s;
          backdrop-filter: blur(12px);
        }
        .about-cta:hover {
          background: rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.6);
          color: #c4b5fd; transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(139,92,246,0.2);
        }
        .about-cta .sheen {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%);
          transform: translateX(-100%); transition: transform 0.6s ease;
        }
        .about-cta:hover .sheen { transform: translateX(100%); }

        .skill-group {
          padding: 20px 24px; border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(5,3,15,0.42);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: border-color 0.3s, background 0.3s;
        }
        .skill-group:hover {
          border-color: rgba(255,255,255,0.1);
          background: rgba(5,3,15,0.55);
        }
        .skill-cat-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .skill-cat-name {
          font-size: 13px; font-weight: 500;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(200,200,240,0.5);
        }

        .about-body-grid { grid-template-columns: 1fr 1fr 300px; }
        @media (max-width: 1100px) {
          .about-body-grid { grid-template-columns: 1fr 1fr !important; }
          .about-body-grid > *:last-child { grid-column: 1 / -1; max-width: 360px; margin: 0 auto; }
        }
        @media (max-width: 680px) {
          .about-body-grid { grid-template-columns: 1fr !important; }
          .about-body-grid > *:last-child { grid-column: auto; max-width: 100%; }
        }
        @media (max-width: 768px) {
          #about-section { padding: 100px 0 80px; }
        }
      `}</style>

      <section id="about-section" ref={sectionRef}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* ── Header ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{ textAlign: "center", marginBottom: 72 }}
          >
            <motion.div variants={fadeUp}>
              <div className="about-eyebrow">Get to know me</div>
            </motion.div>
            <motion.h2 className="about-title" variants={fadeUp}>
              About <span className="about-title-accent">Me</span>
            </motion.h2>
            <motion.div variants={fadeUp}>
              <div className="about-divider" />
            </motion.div>
          </motion.div>

          {/* ── Stat cards ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 88,
            }}
          >
            {ACHIEVEMENTS.map((a, i) => (
              <StatCard key={a.label} {...a} index={i} />
            ))}
          </motion.div>

          {/* ── Body: story | skills | widget ── */}
          <div
            style={{ display: "grid", gap: 40, alignItems: "start" }}
            className="about-body-grid"
          >
            {/* Story */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
            >
              <motion.h3
                variants={fadeUp}
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(26px, 3.5vw, 38px)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                  marginBottom: 32,
                }}
              >
                Five years of{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  shipping
                </span>
              </motion.h3>

              <motion.div
                variants={stagger}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  marginBottom: 40,
                }}
              >
                {STORY.map(({ accent, bold, text }, i) => (
                  <motion.div
                    key={i}
                    variants={fadeLeft}
                    className="story-item"
                  >
                    <div
                      className="story-dot"
                      style={{
                        background: accent,
                        color: accent,
                        boxShadow: `0 0 8px ${accent}`,
                      }}
                    />
                    <p>
                      With{" "}
                      <strong style={{ color: accent, fontWeight: 500 }}>
                        {bold}
                      </strong>{" "}
                      {text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Mini stats */}
              <motion.div
                variants={fadeUp}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 12,
                  marginBottom: 36,
                  padding: "16px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {(
                  [
                    {
                      icon: GitBranch,
                      value: "1.2k+",
                      label: "Commits",
                      color: "#a78bfa",
                    },
                    {
                      icon: Globe,
                      value: "8+",
                      label: "Countries",
                      color: "#60a5fa",
                    },
                    {
                      icon: Star,
                      value: "340+",
                      label: "GitHub ★",
                      color: "#fbbf24",
                    },
                  ] as const
                ).map(({ icon: Icon, value, label, color }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <Icon
                      size={14}
                      color={color}
                      style={{ margin: "0 auto 6px", display: "block" }}
                    />
                    <p
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 18,
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        margin: "0 0 2px",
                        background: `linear-gradient(135deg,#fff,${color})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {value}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "rgba(180,180,210,0.35)",
                        margin: 0,
                      }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <button
                  className="about-cta"
                  onClick={() =>
                    document
                      .getElementById("contact-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <span className="sheen" />
                  <Rocket size={16} />
                  Let's Work Together
                  <ArrowRight size={15} style={{ opacity: 0.6 }} />
                </button>
              </motion.div>
            </motion.div>

            {/* Skills */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
            >
              <motion.h3
                variants={fadeUp}
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(22px, 3vw, 32px)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                  marginBottom: 28,
                }}
              >
                Stack &{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    background: "linear-gradient(135deg,#34d399,#60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Tools
                </span>
              </motion.h3>

              <motion.div
                variants={stagger}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {SKILLS.map((group) => {
                  const Icon = group.icon;
                  return (
                    <motion.div
                      key={group.category}
                      variants={fadeUp}
                      className="skill-group"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 14,
                        }}
                      >
                        <div
                          className="skill-cat-icon"
                          style={{
                            background: `${group.accent}14`,
                            border: `1px solid ${group.accent}28`,
                          }}
                        >
                          <Icon size={18} color={group.accent} />
                        </div>
                        <span className="skill-cat-name">{group.category}</span>
                      </div>
                      <motion.div
                        variants={stagger}
                        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                      >
                        {group.items.map((skill) => (
                          <SkillTag
                            key={skill}
                            label={skill}
                            accent={group.accent}
                            glow={group.glow}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Activity Widget */}
            {/* <ActivityWidget /> */}
            <DevDashboard />
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
