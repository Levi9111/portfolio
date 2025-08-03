import React from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Hero: React.FC = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={elementRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-1000 ${
            hasIntersected
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Alex{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Morgan
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 font-light">
            Full-Stack Developer specializing in the MERN stack
          </p>
          
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            I build exceptional digital experiences with modern web technologies. 
            Passionate about clean code, user experience, and solving complex problems.
          </p>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-16">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors group"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </a>
            <a
              href="mailto:alex@example.com"
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors group"
              aria-label="Email"
            >
              <Mail className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </a>
          </div>

          {/* Scroll Indicator */}
          <button
            onClick={scrollToAbout}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 transition-colors group animate-bounce"
            aria-label="Scroll to about section"
          >
            <ArrowDown className="w-5 h-5 text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;