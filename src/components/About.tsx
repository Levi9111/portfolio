import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, Variants } from "framer-motion";
import {
  Code,
  Zap,
  Rocket,
  Heart,
  Trophy,
  Target,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// ─── Variants ──────────────────────────────────────────────────────────────────

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
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const skills = [
  {
    category: "Frontend",
    icon: Code,
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
    category: "Tools",
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
];

const achievements = [
  { number: "4+", label: "Years Experience", icon: Trophy, accent: "#a78bfa" },
  {
    number: "50+",
    label: "Projects Completed",
    icon: Target,
    accent: "#60a5fa",
  },
  {
    number: "99%",
    label: "Client Satisfaction",
    icon: Sparkles,
    accent: "#34d399",
  },
];

const story = [
  {
    accent: "#a78bfa",
    bold: "4 years of experience",
    text: "in full-stack development. I specialize in building modern web applications using the MERN stack. My journey began with a fascination for how things work, which naturally led me to programming.",
  },
  {
    accent: "#60a5fa",
    bold: "clean, maintainable code",
    text: "and creating intuitive user experiences. When I'm not coding, you'll find me exploring new technologies or sharing knowledge with the developer community.",
  },
  {
    accent: "#34d399",
    bold: "scalable applications",
    text: "with a focus on web performance optimization and modern JavaScript frameworks. Every project is an opportunity to push the craft further.",
  },
];

// ─── Skill Tag ─────────────────────────────────────────────────────────────────

const SkillTag: React.FC<{
  label: string;
  accent: string;
  glow: string;
  delay: number;
}> = ({ label, accent, glow, delay }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.span
      variants={scaleIn}
      custom={delay}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.08, y: -2 }}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 14px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 400,
        letterSpacing: "0.2px",
        cursor: "default",
        border: `1px solid ${hovered ? accent + "55" : "rgba(255,255,255,0.07)"}`,
        background: hovered ? glow : "rgba(255,255,255,0.03)",
        color: hovered ? accent : "rgba(200,200,230,0.6)",
        transition: "border-color 0.25s, background 0.25s, color 0.25s",
        backdropFilter: "blur(6px)",
        boxShadow: hovered ? `0 0 18px ${glow}` : "none",
      }}
    >
      {label}
    </motion.span>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  number: string;
  label: string;
  icon: React.ElementType;
  accent: string;
  index: number;
}> = ({ number, label, icon: Icon, accent, index }) => {
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
        border: `1px solid ${hovered ? accent + "44" : "rgba(255,255,255,0.06)"}`,
        background: hovered
          ? `radial-gradient(circle at 50% 0%, ${accent}10, rgba(255,255,255,0.02))`
          : "rgba(255,255,255,0.025)",
        backdropFilter: "blur(12px)",
        textAlign: "center",
        transition: "border-color 0.3s, background 0.3s",
        cursor: "default",
        overflow: "hidden",
      }}
    >
      {/* Top glow line */}
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
          background: `${accent}15`,
          border: `1px solid ${accent}25`,
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
          color: "#fff",
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

// ─── About ─────────────────────────────────────────────────────────────────────

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [relMouse, setRelMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setRelMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 28,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 28,
    });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&display=swap');

        #about-section {
          font-family: 'Outfit', sans-serif;
          position: relative;
          padding: 120px 0 100px;
          background: #07051a;
          overflow: hidden;
        }

        /* Separator line from hero */
        #about-section::before {
          content: '';
          position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent);
        }

        .about-grid-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(139,92,246,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .about-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(7,5,26,0.85) 100%);
        }

        .about-nebula {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }

        .about-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 7px 16px; border-radius: 100px;
          border: 1px solid rgba(139,92,246,0.2);
          background: rgba(139,92,246,0.06);
          font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(167,139,250,0.8);
          margin-bottom: 20px;
        }

        .about-eyebrow::before {
          content: ''; display: block;
          width: 20px; height: 1px;
          background: rgba(139,92,246,0.5);
        }

        .about-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(48px, 7vw, 80px);
          line-height: 1.05; color: #fff;
          letter-spacing: -1.5px;
          margin-bottom: 0;
        }

        .about-title-accent {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-divider {
          width: 64px; height: 1px; margin: 24px auto 0;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
          position: relative;
        }

        .about-divider::after {
          content: '';
          position: absolute; top: -2px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 8px #a78bfa;
        }

        /* Story paragraphs */
        .story-item {
          position: relative;
          padding-left: 24px;
          font-size: 15px; font-weight: 300;
          color: rgba(190,190,220,0.55);
          line-height: 1.85;
        }

        .story-dot {
          position: absolute; left: 0; top: 9px;
          width: 8px; height: 8px; border-radius: 50%;
        }

        .story-dot::after {
          content: '';
          position: absolute; inset: -4px; border-radius: 50%;
          border: 1px solid currentColor;
          opacity: 0.25;
          animation: dotring 2s ease-in-out infinite;
        }

        @keyframes dotring {
          0%,100%{transform:scale(1);opacity:.25}
          50%{transform:scale(1.6);opacity:0}
        }

        /* CTA Button */
        .about-cta {
          position: relative;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; border-radius: 14px;
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.3);
          color: rgba(200,180,255,0.9);
          font-family: 'Outfit', sans-serif;
          font-size: 14px; font-weight: 400; letter-spacing: 0.3px;
          cursor: pointer;
          transition: background 0.25s, border-color 0.25s, color 0.25s, transform 0.2s, box-shadow 0.25s;
          overflow: hidden;
        }

        .about-cta:hover {
          background: rgba(139,92,246,0.2);
          border-color: rgba(139,92,246,0.6);
          color: #c4b5fd;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(139,92,246,0.2);
        }

        .about-cta .sheen {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .about-cta:hover .sheen { transform: translateX(100%); }

        /* Skill group */
        .skill-group {
          padding: 20px 24px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(8px);
          transition: border-color 0.3s, background 0.3s;
        }

        .skill-group:hover {
          border-color: rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
        }

        .skill-cat-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .skill-cat-name {
          font-size: 13px; font-weight: 500;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(200,200,240,0.5);
        }

        /* Responsive */
        @media (max-width: 768px) {
          #about-section { padding: 80px 0 70px; }
          .about-title { letter-spacing: -0.5px; }
        }
      `}</style>

      <section id="about-section" ref={sectionRef}>
        {/* Background layers */}
        <div className="about-grid-overlay" />
        <div className="about-vignette" />

        {/* Nebula blobs */}
        <div
          className="about-nebula"
          style={{
            width: 480,
            height: 480,
            top: "-80px",
            left: "-100px",
            background:
              "radial-gradient(circle, rgba(109,40,217,0.18), transparent 70%)",
            transform: `translate(${relMouse.x * 0.4}px, ${relMouse.y * 0.4}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
        <div
          className="about-nebula"
          style={{
            width: 400,
            height: 400,
            bottom: "-60px",
            right: "-80px",
            background:
              "radial-gradient(circle, rgba(29,78,216,0.15), transparent 70%)",
            transform: `translate(${relMouse.x * -0.3}px, ${relMouse.y * -0.3}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
        <div
          className="about-nebula"
          style={{
            width: 300,
            height: 300,
            top: "40%",
            right: "20%",
            background:
              "radial-gradient(circle, rgba(244,114,182,0.08), transparent 70%)",
            transform: `translate(${relMouse.x * 0.5}px, ${relMouse.y * 0.5}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* ── Section Header ── */}
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

          {/* ── Stat Cards ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 80,
            }}
          >
            {achievements.map((a, i) => (
              <StatCard key={a.label} {...a} index={i} />
            ))}
          </motion.div>

          {/* ── Two-Column Body ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 64,
              alignItems: "start",
            }}
          >
            {/* Left — Story */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
            >
              <motion.h3
                variants={fadeUp}
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: "#fff",
                  marginBottom: 32,
                  letterSpacing: "-0.5px",
                }}
              >
                Crafting Digital{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Experiences
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
                {story.map(({ accent, bold, text }, i) => (
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

              <motion.div variants={fadeUp}>
                <button
                  className="about-cta"
                  onClick={() =>
                    document
                      .getElementById("contact")
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

            {/* Right — Skills */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
            >
              <motion.h3
                variants={fadeUp}
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(24px, 3vw, 34px)",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: "#fff",
                  marginBottom: 28,
                  letterSpacing: "-0.5px",
                }}
              >
                Skills &{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    background: "linear-gradient(135deg, #34d399, #60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Technologies
                </span>
              </motion.h3>

              <motion.div
                variants={stagger}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {skills.map((group, gi) => {
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
                            background: `${group.accent}15`,
                            border: `1px solid ${group.accent}30`,
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
                        {group.items.map((skill, si) => (
                          <SkillTag
                            key={skill}
                            label={skill}
                            accent={group.accent}
                            glow={group.glow}
                            delay={gi * 0.1 + si * 0.04}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
