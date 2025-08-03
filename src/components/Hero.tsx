import React, { useState, useRef, useEffect } from "react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut" } },
};

const socialLinks = [
  { href: "https://github.com/levi9111", icon: Github, label: "GitHub" },
  {
    href: "www.linkedin.com/in/shanjid-ahmad-b77b5427b",
    icon: Linkedin,
    label: "LinkedIn",
  },
  { href: "mailto:shanjidahmad502@gmail.com", icon: Mail, label: "Email" },
];

const Hero: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      return () => section.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Explicitly type event handler
  const scrollToAbout = (): void => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors"
    >
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Original gradient blobs with mouse tracking */}
        <div
          className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full bg-purple-500 opacity-25 blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.4}px, ${
              mousePosition.y * 0.4
            }px)`,
          }}
        />
        <div
          className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-blue-500 opacity-25 blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${
              mousePosition.y * -0.3
            }px)`,
            animationDelay: "2s",
          }}
        />

        {/* Additional gradient blobs */}
        <div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/12 to-blue-400/12 rounded-full blur-2xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${
              mousePosition.y * 0.5
            }px)`,
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute bottom-1/3 left-1/5 w-96 h-96 bg-gradient-to-r from-pink-400/8 to-purple-400/8 rounded-full blur-3xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.4}px, ${
              mousePosition.y * -0.4
            }px)`,
            animationDelay: "3s",
          }}
        />

        {/* Floating geometric shapes */}
        <div
          className="absolute top-1/5 left-1/3 w-12 h-12 border-2 border-purple-300/20 rotate-45 animate-spin-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.7}px, ${
              mousePosition.y * 0.7
            }px) rotate(45deg)`,
          }}
        />
        <div
          className="absolute top-2/3 right-1/3 w-16 h-16 border-2 border-blue-300/15 rounded-full animate-spin-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.5}px, ${
              mousePosition.y * -0.5
            }px)`,
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/6 w-10 h-10 bg-blue-300/15 rounded-full animate-bounce-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.6}px, ${
              mousePosition.y * -0.6
            }px)`,
          }}
        />
        <div
          className="absolute top-3/4 right-1/5 w-6 h-20 bg-gradient-to-b from-purple-300/20 to-transparent animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.4}px, ${
              mousePosition.y * 0.4
            }px)`,
            animationDelay: "1.5s",
          }}
        />
        <div
          className="absolute top-1/6 right-1/6 w-8 h-24 bg-gradient-to-b from-cyan-300/15 to-transparent animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${
              mousePosition.y * 0.3
            }px)`,
            animationDelay: "2.5s",
          }}
        />

        {/* Grid patterns and lines */}
        <div
          className="absolute top-1/2 left-1/2 w-24 h-24 border border-gray-200/15 dark:border-gray-700/15 rotate-12 animate-pulse-slow"
          style={{
            transform: `translate(-50%, -50%) translate(${
              mousePosition.x * -0.3
            }px, ${mousePosition.y * -0.3}px) rotate(12deg)`,
            animationDelay: "0.5s",
          }}
        />
        <div
          className="absolute top-1/4 left-2/3 w-20 h-20 border border-purple-200/10 dark:border-purple-700/10 rotate-45 animate-spin-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.2}px, ${
              mousePosition.y * 0.2
            }px) rotate(45deg)`,
            animationDelay: "4s",
          }}
        />

        {/* Floating dots */}
        <div
          className="absolute top-1/3 left-1/4 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.8}px, ${
              mousePosition.y * 0.8
            }px)`,
            animationDelay: "0.8s",
          }}
        />
        <div
          className="absolute bottom-2/5 right-2/5 w-4 h-4 bg-blue-400/25 rounded-full animate-bounce-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.7}px, ${
              mousePosition.y * -0.7
            }px)`,
            animationDelay: "1.8s",
          }}
        />
        <div
          className="absolute top-3/5 left-1/5 w-2 h-2 bg-cyan-400/35 rounded-full animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.9}px, ${
              mousePosition.y * 0.9
            }px)`,
            animationDelay: "2.2s",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
      >
        <motion.h1
          variants={fadeUp}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
        >
          Shanjid{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 animate-gradient">
            Ahmad
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 font-light"
        >
          Full-Stack Developer specializing in the MERN stack
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          I build exceptional digital experiences with modern web technologies.
          Passionate about clean code, user experience, and solving complex
          problems.
        </motion.p>

        {/* Enhanced Social Icons */}
        <motion.div
          variants={fadeUp}
          className="flex justify-center space-x-6 mb-16"
        >
          {socialLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-500/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden"
                aria-label={link.label}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              </a>
            );
          })}
        </motion.div>

        {/* Enhanced Scroll Button */}
        <motion.button
          variants={fadeUp}
          onClick={scrollToAbout}
          className="group relative inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300/70 dark:border-gray-600/70 backdrop-blur-sm hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:scale-110 overflow-hidden"
          aria-label="Scroll to about section"
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="absolute inset-0 animate-ping bg-purple-500/10 rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          <ArrowDown className="relative z-10 w-5 h-5 text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors animate-bounce-subtle" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
