import React, { useState, useRef, useEffect } from "react";
import { ExternalLink, Github, Code, Star } from "lucide-react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
}

const Projects: React.FC = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Mouse tracking for parallax effects
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
      section.addEventListener("mousemove", handleMouseMove);
      return () => section.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  const projects: Project[] = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description:
        "A full-featured e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, payment processing, inventory management, and admin dashboard.",
      image:
        "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe", "JWT"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      featured: true,
    },
    {
      id: 2,
      title: "Task Management App",
      description:
        "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      image:
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: [
        "React",
        "TypeScript",
        "Socket.io",
        "Node.js",
        "PostgreSQL",
      ],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      featured: true,
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description:
        "A responsive weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.",
      image:
        "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: [
        "React",
        "D3.js",
        "Weather API",
        "Tailwind CSS",
        "Chart.js",
      ],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      featured: true,
    },
    {
      id: 4,
      title: "Social Media Analytics",
      description:
        "A comprehensive social media analytics platform with data visualization, sentiment analysis, and automated reporting features.",
      image:
        "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Next.js", "Python", "TensorFlow", "MongoDB", "D3.js"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      featured: true,
    },
  ];

  return (
    <section
      id="projects"
      ref={(el) => {
        // @ts-expect-error: elementRef.current is readonly, but we need to assign for intersection observer
        elementRef.current = el;
        sectionRef.current = el;
      }}
      className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient blobs */}
        <div
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-400/6 to-blue-400/6 rounded-full blur-3xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.2}px, ${
              mousePosition.y * 0.2
            }px)`,
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-400/8 to-cyan-400/8 rounded-full blur-3xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${
              mousePosition.y * -0.3
            }px)`,
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-r from-pink-400/5 to-purple-400/5 rounded-full blur-2xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.4}px, ${
              mousePosition.y * 0.4
            }px)`,
            animationDelay: "1s",
          }}
        />

        {/* Floating geometric shapes */}
        <div
          className="absolute top-1/4 right-1/4 w-20 h-20 border-2 border-purple-300/10 rotate-45 animate-spin-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${
              mousePosition.y * 0.5
            }px) rotate(45deg)`,
          }}
        />
        <div
          className="absolute bottom-1/3 left-1/5 w-16 h-16 bg-blue-300/8 rounded-full animate-bounce-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.4}px, ${
              mousePosition.y * -0.4
            }px)`,
          }}
        />
        <div
          className="absolute top-2/3 right-1/3 w-12 h-24 bg-gradient-to-b from-cyan-300/12 to-transparent animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${
              mousePosition.y * 0.3
            }px)`,
            animationDelay: "1.5s",
          }}
        />
        <div
          className="absolute top-1/6 left-1/4 w-24 h-24 border border-gray-200/8 dark:border-gray-700/8 rounded-full animate-spin-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.2}px, ${
              mousePosition.y * -0.2
            }px)`,
            animationDelay: "3s",
          }}
        />

        {/* Grid patterns */}
        <div
          className="absolute top-3/4 left-2/3 w-32 h-32 border border-purple-200/8 dark:border-purple-700/8 rotate-12 animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.6}px, ${
              mousePosition.y * 0.6
            }px) rotate(12deg)`,
            animationDelay: "0.5s",
          }}
        />

        {/* Floating dots */}
        <div
          className="absolute top-1/3 right-1/5 w-5 h-5 bg-purple-400/15 rounded-full animate-bounce-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.7}px, ${
              mousePosition.y * 0.7
            }px)`,
            animationDelay: "0.8s",
          }}
        />
        <div
          className="absolute bottom-2/5 left-2/5 w-4 h-4 bg-blue-400/20 rounded-full animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * -0.5}px, ${
              mousePosition.y * -0.5
            }px)`,
            animationDelay: "1.8s",
          }}
        />
        <div
          className="absolute top-1/5 right-2/5 w-3 h-3 bg-cyan-400/25 rounded-full animate-bounce-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.8}px, ${
              mousePosition.y * 0.8
            }px)`,
            animationDelay: "2.5s",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-1000 ${
            hasIntersected
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 backdrop-blur-sm mb-6">
              <Code className="w-4 h-4 text-purple-500 animate-pulse" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                My Work
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 animate-gradient-x">
                Projects
              </span>
            </h2>

            <div className="flex justify-center mb-8">
              <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
              </div>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Here are some of my recent projects that showcase my skills in
              full-stack development
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-500/50 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 ${
                  hasIntersected
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 z-20">
                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  </div>
                )}

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Project Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Hover overlay with links */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex space-x-4">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white transition-all duration-300 hover:scale-110"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-purple-600 backdrop-blur-sm rounded-full text-white hover:bg-purple-700 transition-all duration-300 hover:scale-110"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="relative p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Enhanced Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={tech}
                        className="relative px-3 py-1 bg-gray-100/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-500/50 transition-all duration-300 hover:scale-110 cursor-default overflow-hidden group/tech"
                        style={{
                          animationDelay: `${techIndex * 0.1}s`,
                        }}
                      >
                        <span className="relative z-10">{tech}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover/tech:opacity-100 transition-opacity duration-300" />
                        {hoveredProject === project.id && (
                          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                        )}
                      </span>
                    ))}
                  </div>

                  {/* Enhanced Project Links */}
                  <div className="flex space-x-4">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link relative flex items-center space-x-2 px-4 py-2 bg-gray-100/70 dark:bg-gray-800/70 backdrop-blur-sm hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300 rounded-xl transition-all duration-300 font-medium border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-500/50 hover:scale-105 overflow-hidden"
                    >
                      <Github className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Code</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link relative flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-medium hover:scale-105 overflow-hidden"
                    >
                      <ExternalLink className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Live Demo</span>
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/link:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                    </a>
                  </div>
                </div>

                {/* Shimmer effect on hover */}
                {hoveredProject === project.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
