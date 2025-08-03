import React, { useState, useRef, useEffect } from "react";
import { Heart, ArrowUp, Github, Linkedin, Mail, Code2 } from "lucide-react";

const Footer: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);

  // Mouse tracking for subtle parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = footerRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 15,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 15,
        });
      }
    };

    const footer = footerRef.current;
    if (footer) {
      footer.addEventListener("mousemove", handleMouseMove);
      return () => footer.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Intersection observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <footer
      ref={footerRef}
      className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200/50 dark:border-gray-700/50 transition-colors overflow-hidden"
    >
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-400/5 to-blue-400/5 rounded-full blur-2xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${
              mousePosition.y * 0.3
            }px)`,
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-full blur-xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.2}px, ${
              mousePosition.y * -0.2
            }px)`,
            animationDelay: "1s",
          }}
        />

        {/* Floating geometric elements */}
        <div
          className="absolute top-6 right-12 w-8 h-8 border border-gray-300/10 dark:border-gray-600/10 rotate-45 animate-spin-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.4}px, ${
              mousePosition.y * 0.4
            }px) rotate(45deg)`,
          }}
        />
        <div
          className="absolute bottom-8 left-16 w-4 h-4 bg-purple-400/15 rounded-full animate-bounce-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.5}px, ${
              mousePosition.y * -0.5
            }px)`,
            animationDelay: "2s",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back to top button */}
        <div
          className={`flex justify-center mb-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={scrollToTop}
            className="group relative p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-500/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          </button>
        </div>

        {/* Social links */}
        <div
          className={`flex justify-center space-x-6 mb-12 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
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
        </div>

        {/* Main content */}
        <div
          className={`text-center transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Copyright */}
          <div className="relative inline-block mb-6">
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium relative z-10">
              © 2025 Shanjid Ahmad. All rights reserved.
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Made with love section */}
          <div className="relative inline-block">
            <p className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm group cursor-default">
              <Code2 className="w-4 h-4 mr-2 text-blue-500 animate-pulse" />
              Made with{" "}
              <Heart className="w-4 h-4 mx-2 text-red-500 fill-current animate-heartbeat" />
              using React & Tailwind CSS
            </p>
          </div>

          {/* Decorative line */}
          <div
            className={`flex justify-center mt-8 transition-all duration-1000 delay-600 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          >
            <div className="relative w-24 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-blue-500/50 animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Tech stack showcase (optional) */}
        <div
          className={`flex justify-center items-center mt-8 space-x-8 transition-all duration-1000 delay-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>React</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
            <div
              className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <span>TypeScript</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
            <div
              className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <span>Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
