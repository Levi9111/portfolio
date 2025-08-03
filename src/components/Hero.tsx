
import React from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

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
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
};

// Define type for social links tuple
type SocialLink = [string, React.ComponentType<React.SVGProps<SVGSVGElement>>, string];

const socialLinks: SocialLink[] = [
  ['https://github.com/levi9111', Github, 'GitHub'],
  ['www.linkedin.com/in/shanjid-ahmad-b77b5427b', Linkedin, 'LinkedIn'],
  ['mailto:shanjidahmad502@gmail.com', Mail, 'Email'],
];

const Hero: React.FC = () => {
  // Explicitly type event handler
  const scrollToAbout = (): void => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors"
    >
      {/* Animated Background Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full bg-purple-500 opacity-20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-blue-500 opacity-20 blur-3xl pointer-events-none animate-pulse animation-delay-2000" />

      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
      >
        <motion.h1
          variants={fadeUp}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
        >
          Shanjid{' '}
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
          Passionate about clean code, user experience, and solving complex problems.
        </motion.p>

        {/* Social Icons */}
        <motion.div variants={fadeUp} className="flex justify-center space-x-6 mb-16">
          {socialLinks.map(([href, Icon, label], i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors group"
              aria-label={label}
            >
              <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </a>
          ))}
        </motion.div>

        {/* Scroll Button */}
        <motion.button
          variants={fadeUp}
          onClick={scrollToAbout}
          className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 transition-colors group relative overflow-hidden"
          aria-label="Scroll to about section"
          type="button" // good practice for buttons in forms
        >
          <span className="absolute inset-0 animate-ping bg-purple-500/10 rounded-full pointer-events-none" />
          <ArrowDown className="w-5 h-5 text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors z-10" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
