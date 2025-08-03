import React from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("hero");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
      setActiveSection(sectionId);
    }
  };

  const navItems = [
    { label: "Home", id: "hero" },
    { label: "About", id: "about" },
    { label: "Projects", id: "projects" },
    { label: "Contact", id: "contact" },
  ];

  // Advanced spring configuration for buttery smooth animations
  const springConfig = {
    type: "spring",
    stiffness: 400,
    damping: 25,
    mass: 0.8,
  };

  const iconVariants = {
    initial: {
      rotate: -180,
      scale: 0,
      opacity: 0,
      filter: "blur(4px)",
    },
    animate: {
      rotate: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        ...springConfig,
        filter: { duration: 0.3 },
      },
    },
    exit: {
      rotate: 180,
      scale: 0,
      opacity: 0,
      filter: "blur(4px)",
      transition: {
        duration: 0.2,
        filter: { duration: 0.2 },
      },
    },
    hover: {
      rotate: [0, -5, 5, 0],
      scale: 1.1,
      transition: {
        rotate: {
          duration: 0.5,
          ease: "easeInOut",
        },
        scale: {
          duration: 0.2,
        },
      },
    },
  };

  const menuIconVariants = {
    initial: {
      rotate: 180,
      scale: 0,
      opacity: 0,
    },
    animate: {
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: springConfig,
    },
    exit: {
      rotate: -180,
      scale: 0,
      opacity: 0,
      transition: { duration: 0.15 },
    },
    hover: {
      scale: 1.1,
      rotate: [0, 10, -10, 0],
      transition: {
        scale: { duration: 0.2 },
        rotate: { duration: 0.4, ease: "easeInOut" },
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  const glowVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      rotate: 0,
    },
    hover: {
      opacity: 1,
      scale: 1,
      rotate: 360,
      transition: {
        duration: 0.3,
        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut", // use a valid string easing
      },
    },
  };

  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: {
      x: "100%",
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut",
      },
    },
  };

  // SA Logo Component
  const SALogo = () => (
    <motion.div
      className="relative flex items-center justify-center w-12 h-12 cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => scrollToSection("hero")}
    >
      {/* Background gradient circle */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#6b21a8] to-[#581c87] shadow-lg"
        whileHover={{
          boxShadow: "0 10px 30px rgba(107, 33, 168, 0.3)",
          rotate: [0, -5, 5, 0],
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-br from-[#6b21a8] via-transparent to-[#581c87] bg-clip-border"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Inner glow effect */}
      <motion.div className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* SA Text */}
      <motion.span
        className="relative z-10 text-white font-black text-lg tracking-tight"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        whileHover={{
          textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
        }}
      >
        SA
      </motion.span>

      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/60 rounded-full"
          style={{
            left: `${20 + i * 10}%`,
            top: `${30 + i * 15}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo with Name */}
          <motion.div
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <SALogo />
            <motion.span
              className="text-2xl font-black text-gray-900 dark:text-white tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Shanjid Ahmad
            </motion.span>
          </motion.div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-[#6b21a8] dark:hover:text-[#6b21a8] transition-colors font-semibold rounded-xl group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Active indicator */}
                {activeSection === item.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#6b21a8]/10 to-[#581c87]/10 rounded-xl"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Hover effect */}
                <motion.div className="absolute inset-0 bg-gradient-to-r from-[#6b21a8]/5 to-[#581c87]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <span className="relative z-10">{item.label}</span>

                {/* Underline effect */}
                <motion.div className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#6b21a8] to-[#581c87] group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300" />
              </motion.button>
            ))}
          </nav>

          {/* ULTRA-ENHANCED CONTROLS */}
          <div className="flex items-center space-x-3">
            {/* Ultra-Enhanced Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="relative p-3 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-300 group overflow-hidden"
              aria-label="Toggle theme"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#6b21a8]/20 to-[#581c87]/20 rounded-xl"
                variants={glowVariants}
                initial="initial"
                whileHover="hover"
              />

              {/* Pulsing backdrop */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 rounded-xl"
                // @ts-expect-error variant error
                variants={pulseVariants}
                animate="animate"
              />

              {/* Shimmer effect */}
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  // @ts-expect-error variant error
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>

              {/* Morphing border */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-transparent"
                animate={{
                  borderColor: isDark
                    ? [
                        "rgba(139, 92, 246, 0)",
                        "rgba(139, 92, 246, 0.5)",
                        "rgba(139, 92, 246, 0)",
                      ]
                    : [
                        "rgba(245, 158, 11, 0)",
                        "rgba(245, 158, 11, 0.5)",
                        "rgba(245, 158, 11, 0)",
                      ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    // @ts-expect-error variant error
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover="hover"
                    className="relative z-10"
                  >
                    <Sun className="w-5 h-5 text-amber-500 drop-shadow-sm" />
                    {/* Sun rays effect */}
                    <motion.div
                      className="absolute inset-0 w-5 h-5"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-0.5 h-1 bg-amber-400/50 rounded-full"
                          style={{
                            top: "-2px",
                            left: "50%",
                            transformOrigin: "50% 12px",
                            transform: `translateX(-50%) rotate(${i * 45}deg)`,
                          }}
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    // @ts-expect-error variant error
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover="hover"
                    className="relative z-10"
                  >
                    <Moon className="w-5 h-5 text-indigo-600 drop-shadow-sm" />
                    {/* Stars effect */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-indigo-400 rounded-full"
                        style={{
                          top: `${10 + i * 5}px`,
                          left: `${15 + i * 3}px`,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Ultra-Enhanced Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative p-3 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-300 group overflow-hidden"
              aria-label="Toggle menu"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              {/* Dynamic background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl"
                animate={{
                  opacity: isMenuOpen ? [0.1, 0.3, 0.1] : [0, 0.2, 0],
                  scale: isMenuOpen ? [1, 1.1, 1] : [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Ripple effect on click */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#6b21a8]/30 to-[#581c87]/30 rounded-xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  isMenuOpen
                    ? {
                        scale: [0, 1.2, 0],
                        opacity: [0, 0.6, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.6 }}
              />

              {/* Particle effects */}
              {isMenuOpen &&
                [...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-purple-400 rounded-full"
                    initial={{
                      x: 10,
                      y: 10,
                      opacity: 1,
                      scale: 0,
                    }}
                    animate={{
                      x: [10, 10 + (i % 2 ? 15 : -15)],
                      y: [10, 10 + (i < 2 ? -15 : 15)],
                      opacity: [1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                ))}

              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    // @ts-expect-error variant error
                    variants={menuIconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover="hover"
                    className="relative z-10"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300 drop-shadow-sm" />
                    {/* Rotating border for X */}
                    <motion.div
                      className="absolute inset-0 border border-red-400/30 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    // @ts-expect-error variant error
                    variants={menuIconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover="hover"
                    className="relative z-10"
                  >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300 drop-shadow-sm" />
                    {/* Menu lines animation */}
                    <div className="absolute inset-0">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-3 h-0.5 bg-gradient-to-r from-purple-400/40 to-pink-400/40 rounded-full"
                          style={{
                            top: `${6 + i * 2}px`,
                            left: "4px",
                          }}
                          animate={{
                            width: [8, 12, 8],
                            opacity: [0.4, 0.8, 0.4],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                className="py-6 border-t border-gray-200/50 dark:border-gray-800/50"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="relative text-left px-6 py-4 text-gray-600 dark:text-gray-300 hover:text-[#6b21a8] dark:hover:text-[#6b21a8] transition-colors font-semibold rounded-xl group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-[#6b21a8]/5 to-[#581c87]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <motion.div className="absolute left-2 top-1/2 w-1 h-8 bg-gradient-to-b from-[#6b21a8] to-[#581c87] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-1/2" />

                      <span className="relative z-10">{item.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
