import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const About: React.FC = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  const skills = [
    { category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3'] },
    { category: 'Backend', items: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'REST APIs', 'GraphQL'] },
    { category: 'Tools & Technologies', items: ['Git', 'Docker', 'AWS', 'Vercel', 'Jest', 'Webpack'] },
    { category: 'Design & UX', items: ['Figma', 'Adobe XD', 'Responsive Design', 'Accessibility', 'User Research'] },
  ];

  return (
    <section
      id="about"
      ref={elementRef}
      className="py-20 lg:py-32 bg-white dark:bg-gray-900 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-1000 delay-200 ${
            hasIntersected
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-8"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* About Text */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Crafting Digital Experiences
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  With over 4 years of experience in full-stack development, I specialize in building 
                  modern web applications using the MERN stack. My journey began with a fascination 
                  for how things work, which naturally led me to programming.
                </p>
                <p>
                  I believe in writing clean, maintainable code and creating intuitive user experiences. 
                  When I'm not coding, you'll find me exploring new technologies, contributing to 
                  open-source projects, or sharing knowledge with the developer community.
                </p>
                <p>
                  Currently, I'm focused on building scalable applications and exploring the latest 
                  in web performance optimization and modern JavaScript frameworks.
                </p>
              </div>
            </div>

            {/* Skills Grid */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Skills & Technologies
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {skills.map((skillGroup, index) => (
                  <div
                    key={skillGroup.category}
                    className={`transition-all duration-500 ${
                      hasIntersected
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      {skillGroup.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;