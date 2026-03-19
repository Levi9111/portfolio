import React, { useState, useEffect } from "react";
import { Menu, X, Terminal, Zap } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  Variants,
} from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  readonly label: string;
  readonly id: string;
  readonly accent: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", id: "hero", accent: "#a78bfa" },
  { label: "About", id: "about", accent: "#60a5fa" },
  { label: "Projects", id: "projects", accent: "#34d399" },
  { label: "Contact", id: "contact", accent: "#f472b6" },
] as const;

// ─── Variants ─────────────────────────────────────────────────────────────────

const menuItemVariant: Variants = {
  hidden: { opacity: 0, x: -16, filter: "blur(4px)" },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 },
  }),
  exit: (i: number) => ({
    opacity: 0,
    x: -12,
    filter: "blur(2px)",
    transition: { duration: 0.25, delay: i * 0.03 },
  }),
};

// ─── SA Logo ──────────────────────────────────────────────────────────────────

interface SALogoProps {
  onClick: () => void;
}

const SALogo: React.FC<SALogoProps> = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      aria-label="Go to top"
      style={{
        position: "relative",
        width: 44,
        height: 44,
        borderRadius: 13,
        flexShrink: 0,
        cursor: "pointer",
        background: "none",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 13,
          background:
            "linear-gradient(135deg, rgba(109,40,217,0.85), rgba(88,28,135,0.9))",
          boxShadow: hovered
            ? "0 0 28px rgba(139,92,246,0.5), 0 0 60px rgba(139,92,246,0.15)"
            : "0 0 14px rgba(139,92,246,0.25)",
          transition: "box-shadow 0.3s",
        }}
      />

      {/* Spinning border ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: 14,
          background:
            "conic-gradient(from 0deg, transparent 0%, rgba(167,139,250,0.6) 25%, transparent 50%, rgba(167,139,250,0.3) 75%, transparent 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: 1,
        }}
      />

      {/* Inner shimmer */}
      <div
        style={{
          position: "absolute",
          inset: 2,
          borderRadius: 11,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15), transparent)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* SA text */}
      <motion.span
        animate={{
          textShadow: hovered ? "0 0 16px rgba(255,255,255,0.6)" : "none",
        }}
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "0.02em",
          userSelect: "none",
        }}
      >
        SA
      </motion.span>

      {/* Floating particles */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ scale: [0, 1, 0], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: i * 0.55,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.7)",
            left: `${22 + i * 8}%`,
            top: `${28 + i * 14}%`,
          }}
          aria-hidden="true"
        />
      ))}
    </motion.button>
  );
};

// ─── Nav Pill (desktop) ───────────────────────────────────────────────────────

interface NavPillProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const NavPill: React.FC<NavPillProps> = ({
  item,
  isActive,
  onClick,
  index,
}) => {
  const [hovered, setHovered] = useState(false);
  const active = isActive || hovered;

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.08 * index,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: "relative",
        padding: "8px 18px",
        borderRadius: 100,
        border: `1px solid ${isActive ? item.accent + "44" : active ? item.accent + "28" : "rgba(255,255,255,0.06)"}`,
        background: isActive
          ? `rgba(5,3,15,0.7)`
          : active
            ? "rgba(5,3,15,0.5)"
            : "transparent",
        backdropFilter: active ? "blur(12px)" : "none",
        cursor: "pointer",
        transition: "border-color 0.25s, background 0.25s",
        display: "flex",
        alignItems: "center",
        gap: 7,
      }}
    >
      {/* Active dot */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            key="dot"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: item.accent,
              boxShadow: `0 0 6px ${item.accent}`,
              display: "block",
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: isActive ? 600 : 400,
          letterSpacing: "0.3px",
          color: isActive
            ? "#fff"
            : active
              ? "rgba(220,220,245,0.85)"
              : "rgba(200,200,240,0.55)",
          transition: "color 0.25s, font-weight 0.2s",
        }}
      >
        {item.label}
      </span>

      {/* Bottom glow line */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              bottom: 4,
              left: "25%",
              right: "25%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${item.accent}99, transparent)`,
              transformOrigin: "center",
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

interface MobileDrawerProps {
  isOpen: boolean;
  navItems: readonly NavItem[];
  activeSection: string;
  onNavigate: (id: string) => void;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  navItems,
  activeSection,
  onNavigate,
  onClose,
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "rgba(2,1,10,0.7)",
            backdropFilter: "blur(4px)",
          }}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <motion.div
          key="drawer"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: 280,
            zIndex: 50,
            background: "rgba(5,3,15,0.92)",
            border: "0.5px solid rgba(139,92,246,0.18)",
            borderRight: "none",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Drawer top radial */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at 80% 0%, rgba(139,92,246,0.12), transparent 60%)",
            }}
            aria-hidden="true"
          />

          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 20px 16px",
              borderBottom: "0.5px solid rgba(255,255,255,0.06)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Terminal size={14} color="rgba(167,139,250,0.7)" />
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "rgba(167,139,250,0.6)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                }}
              >
                Navigation
              </span>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "0.5px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(200,200,240,0.6)",
              }}
              aria-label="Close menu"
            >
              <X size={15} />
            </motion.button>
          </div>

          {/* Nav items */}
          <nav
            style={{
              padding: "20px 16px",
              flex: 1,
              position: "relative",
              zIndex: 1,
            }}
          >
            {navItems.map((item, i) => {
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  custom={i}
                  variants={menuItemVariant}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  onClick={() => onNavigate(item.id)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "14px 16px",
                    borderRadius: 12,
                    marginBottom: 6,
                    border: `0.5px solid ${isActive ? item.accent + "40" : "rgba(255,255,255,0.05)"}`,
                    background: isActive
                      ? `${item.accent}0d`
                      : "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "border-color 0.25s, background 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.borderColor =
                        `${item.accent}28`;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.05)";
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Color bar */}
                  <span
                    style={{
                      width: 3,
                      height: 20,
                      borderRadius: 2,
                      background: isActive
                        ? item.accent
                        : "rgba(255,255,255,0.12)",
                      boxShadow: isActive ? `0 0 8px ${item.accent}` : "none",
                      display: "block",
                      flexShrink: 0,
                      transition: "background 0.25s",
                    }}
                    aria-hidden="true"
                  />

                  <span
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 15,
                      fontWeight: isActive ? 500 : 300,
                      color: isActive ? "#fff" : "rgba(200,200,240,0.6)",
                      flex: 1,
                      transition: "color 0.25s",
                    }}
                  >
                    {item.label}
                  </span>

                  {isActive && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: item.accent,
                        boxShadow: `0 0 6px ${item.accent}`,
                        display: "block",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Drawer footer */}
          <div
            style={{
              padding: "16px 20px",
              borderTop: "0.5px solid rgba(255,255,255,0.06)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Zap size={11} color="#34d399" />
              <span
                style={{
                  fontSize: 10,
                  color: "rgba(200,200,240,0.3)",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.5px",
                }}
              >
                Shanjid Ahmad · Full-Stack Developer
              </span>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ─── Header ───────────────────────────────────────────────────────────────────

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Background opacity based on scroll
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 0.12]);

  // Track scroll position for active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Find which section is currently visible
      const ids = NAV_ITEMS.map((n) => n.id);
      let current = "hero";
      for (const id of ids) {
        const el = document.getElementById(
          id === "hero" ? "hero-section" : `${id}-section`,
        );
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100) current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    const sectionId = id === "hero" ? "hero-section" : `${id}-section`;
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500&family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      {/* Mobile drawer rendered outside header */}
      <MobileDrawer
        isOpen={isMenuOpen}
        navItems={NAV_ITEMS}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onClose={() => setIsMenuOpen(false)}
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "12px 0",
        }}
      >
        {/* Scrolled glass background */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(5,3,15,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            opacity: bgOpacity,
          }}
          aria-hidden="true"
        />

        {/* Bottom border */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            left: "5%",
            right: "5%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)",
            opacity: borderOpacity,
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 56,
          }}
        >
          {/* ── Logo + name ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SALogo onClick={() => scrollToSection("hero")} />
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.25,
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <p
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                Shanjid Ahmad
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: "rgba(167,139,250,0.6)",
                  margin: "3px 0 0",
                }}
              >
                Full-Stack Dev
              </p>
            </motion.div>
          </div>

          {/* ── Desktop nav ── */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 6px",
              borderRadius: 100,
              border: "0.5px solid rgba(255,255,255,0.07)",
              background: scrolled ? "rgba(255,255,255,0.025)" : "transparent",
              backdropFilter: scrolled ? "blur(8px)" : "none",
              transition: "background 0.3s",
            }}
            aria-label="Main navigation"
            className="header-desktop-nav"
          >
            {NAV_ITEMS.map((item, i) => (
              <NavPill
                key={item.id}
                item={item}
                isActive={activeSection === item.id}
                onClick={() => scrollToSection(item.id)}
                index={i}
              />
            ))}
          </nav>

          {/* ── Right: status + mobile toggle ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Availability pill (desktop only) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 13px",
                borderRadius: 100,
                border: "0.5px solid rgba(52,211,153,0.25)",
                background: "rgba(52,211,153,0.07)",
                backdropFilter: "blur(8px)",
              }}
              className="header-avail-pill"
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#34d399",
                  boxShadow: "0 0 6px rgba(52,211,153,0.7)",
                  display: "block",
                  animation: "headerDotPulse 2s ease-in-out infinite",
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "1px",
                  color: "#34d399",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Available
              </span>
            </motion.div>

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setIsMenuOpen((o) => !o)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                border: "0.5px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(8px)",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(200,200,240,0.7)",
                transition: "border-color 0.25s, color 0.25s",
              }}
              className="header-mobile-btn"
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(167,139,250,0.4)";
                el.style.color = "#a78bfa";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.1)";
                el.style.color = "rgba(200,200,240,0.7)";
              }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex" }}
                  >
                    <X size={16} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex" }}
                  >
                    <Menu size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Responsive styles */}
        <style>{`
          @keyframes headerDotPulse {
            0%,100%{opacity:1;transform:scale(1)}
            50%{opacity:.4;transform:scale(1.5)}
          }

          @media (max-width: 768px) {
            .header-desktop-nav { display: none !important; }
            .header-avail-pill  { display: none !important; }
            .header-mobile-btn  { display: flex !important; }
          }
        `}</style>
      </motion.header>
    </>
  );
};

export default Header;
