import  { useState, useRef, useEffect } from 'react';
import { Code, Lightbulb, Rocket, Zap, Trophy, Heart, Target, Sparkles } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);
  const skillsRef = useRef<Record<string, HTMLSpanElement | null>>({});

  const skills = [
    {
      category: 'Frontend',
      icon: Code,
      items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      category: 'Backend',
      icon: Zap,
      items: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST APIs', 'Nest.js'],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      category: 'Tools & Technologies',
      icon: Rocket,
      items: ['Git', 'Vercel', 'Jest', 'Webpack', 'Docker', 'AWS'],
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      category: 'Design & UX',
      icon: Heart,
      items: ['Figma', 'Responsive Design', 'Accessibility', 'User Research'],
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
    },
  ];

  const achievements = [
    { number: '4+', label: 'Years Experience', icon: Trophy },
    { number: '50+', label: 'Projects Completed', icon: Target },
    { number: '99%', label: 'Client Satisfaction', icon: Sparkles },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {


    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 30,
      });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          }}
        />
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
            animationDelay: '2s',
          }}
        />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-blue-300/20 rotate-45 animate-spin-slow" />
        <div className="absolute bottom-1/3 left-1/5 w-12 h-12 bg-purple-300/10 rounded-full animate-bounce-slow" />
        <div className="absolute top-2/3 right-1/3 w-8 h-20 bg-gradient-to-b from-pink-300/20 to-transparent animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
            <Lightbulb className="w-4 h-4 text-blue-500 animate-pulse" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Get to know me</span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">Me</span>
          </h2>
          
          <div className="flex justify-center mb-8">
            <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <div
                key={achievement.label}
                className="group relative p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tabular-nums">
                    {achievement.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {achievement.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Text Content */}
          <div 
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="sticky top-8">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                Crafting Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Experiences</span>
              </h3>
              
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                  <p>
                    With over <strong className="text-purple-600 dark:text-purple-400">4 years of experience</strong> in full-stack development, I specialize in building modern web applications using the MERN stack. My journey began with a fascination for how things work, which naturally led me to programming.
                  </p>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <p>
                    I believe in writing <strong className="text-purple-600 dark:text-purple-400">clean, maintainable code</strong> and creating intuitive user experiences. When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.
                  </p>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  <p>
                    Currently, I'm focused on building <strong className="text-purple-600 dark:text-purple-400">scalable applications</strong> and exploring the latest in web performance optimization and modern JavaScript frameworks.
                  </p>
                </div>
              </div>

              {/* Call to action */}
              <div className="mt-8">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                  <span className="relative z-10 flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Let's Work Together
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Skills Grid */}
          <div 
            className={`transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center lg:text-left">
              Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Technologies</span>
            </h3>
            
            <div className="space-y-8">
              {skills.map((group, groupIndex) => {
                const IconComponent = group.icon;
                return (
                  <div
                    key={group.category}
                    className={`group relative transition-all duration-500 delay-${groupIndex * 100} ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    }`}
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl ${group.bgColor} ${group.borderColor} border backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`w-6 h-6 bg-gradient-to-r ${group.color} bg-clip-text text-transparent`} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {group.category}
                      </h4>
                    </div>
                    
                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-3 ml-12">
                      {group.items.map((skill, skillIndex) => (
                        <span
                          key={skill}
                          ref={el => skillsRef.current[`${groupIndex}-${skillIndex}`] = el}
                          className={`relative px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-500/50 transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer group/skill overflow-hidden`}
                          onMouseEnter={() => setHoveredSkill(`${groupIndex}-${skillIndex}`)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          style={{
                            animationDelay: `${groupIndex * 0.1 + skillIndex * 0.05}s`,
                          }}
                        >
                          <span className="relative z-10">{skill}</span>
                          <div className={`absolute inset-0 bg-gradient-to-r ${group.color} opacity-0 group-hover/skill:opacity-10 transition-opacity duration-300`} />
                          <div className={`absolute inset-0 bg-gradient-to-r ${group.color} opacity-0 group-hover/skill:opacity-20 transition-opacity duration-300 blur-sm`} />
                          {hoveredSkill === `${groupIndex}-${skillIndex}` && (
                            <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default About;