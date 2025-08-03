import React from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock theme context - replace with your actual theme context

const useTheme = () => {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = React.useCallback(() => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  return { isDark, toggleTheme };
};

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('hero');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
      setActiveSection(sectionId);
    }
  };

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ];

  // SA Logo Component
  const SALogo = () => (
    <motion.div
      className="relative flex items-center justify-center w-12 h-12 cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => scrollToSection('hero')}
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
      <motion.div
        className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      
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
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#6b21a8]/5 to-[#581c87]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                <span className="relative z-10">{item.label}</span>
                
                {/* Underline effect */}
                <motion.div
                  className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#6b21a8] to-[#581c87] group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"
                />
              </motion.button>
            ))}
          </nav>

          {/* Enhanced Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="relative p-3 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-300 group overflow-hidden"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#6b21a8]/10 to-[#581c87]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun className="w-5 h-5 text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon className="w-5 h-5 text-indigo-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Enhanced Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative p-3 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-all duration-300 group overflow-hidden"
              aria-label="Toggle menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#6b21a8]/10 to-[#581c87]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
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
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#6b21a8]/5 to-[#581c87]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      
                      <motion.div
                        className="absolute left-2 top-1/2 w-1 h-8 bg-gradient-to-b from-[#6b21a8] to-[#581c87] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-1/2"
                      />
                      
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