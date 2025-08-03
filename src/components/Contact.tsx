import React, { useState, useRef, useEffect } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Send,
  Sparkles,
} from "lucide-react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAIL_JS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY;
const AUTO_REPLY_TEMPLATE_ID = import.meta.env
  .VITE_EMAIL_JS_AUTO_REPLY_TEMPLATE_ID;

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "shanjidahmad502@gmail.com",
    href: "mailto:shanjidahmad502@gmail.com",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+8801626974685",
    href: "https://wa.me/8801626974685",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Chattogram, Bangladesh",
    href: "https://maps.google.com/?q=Chattogram, BAN",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
  },
];

const Contact: React.FC = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = React.useState<null | "success" | "error">(null);
  const [loading, setLoading] = React.useState(false);

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/levi9111",
      color: "hover:text-gray-900 dark:hover:text-white",
      gradient: "from-gray-600 to-gray-800",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/shanjid-ahmad-b77b5427b",
      color: "hover:text-blue-600",
      gradient: "from-blue-600 to-blue-800",
    },
  ];

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 25,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 25,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      return () => section.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setLoading(false);
      return;
    }

    try {
      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        PUBLIC_KEY
      );

      // Send auto-reply email to the user
      await emailjs.send(
        SERVICE_ID,
        AUTO_REPLY_TEMPLATE_ID,
        {
          name: formData.name,
          title: formData.subject,
          to_email: formData.email,
        },
        PUBLIC_KEY
      );

      console.log("Email sent:", result.text);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      ref={(el) => {
        // @ts-expect-error: elementRef.current is readonly, but we need to assign for intersection observer
        elementRef.current = el;
        sectionRef.current = el;
      }}
      className="relative py-20 lg:py-32 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient blobs */}
        <div
          className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-purple-400/8 to-blue-400/8 rounded-full blur-3xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${
              mousePosition.y * 0.3
            }px)`,
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/8 to-cyan-400/8 rounded-full blur-3xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.2}px, ${
              mousePosition.y * -0.2
            }px)`,
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-pink-400/6 to-purple-400/6 rounded-full blur-2xl animate-pulse-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.4}px, ${
              mousePosition.y * 0.4
            }px)`,
            animationDelay: "1s",
          }}
        />

        {/* Floating geometric shapes */}
        <div
          className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-purple-300/15 rotate-45 animate-spin-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${
              mousePosition.y * 0.5
            }px) rotate(45deg)`,
          }}
        />
        <div
          className="absolute bottom-1/3 left-1/5 w-12 h-12 bg-blue-300/10 rounded-full animate-bounce-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.4}px, ${
              mousePosition.y * -0.4
            }px)`,
          }}
        />
        <div
          className="absolute top-2/3 right-1/3 w-8 h-20 bg-gradient-to-b from-cyan-300/15 to-transparent animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${
              mousePosition.y * 0.3
            }px)`,
            animationDelay: "1.5s",
          }}
        />
        <div
          className="absolute top-1/6 left-1/4 w-20 h-20 border border-gray-200/10 dark:border-gray-700/10 rounded-full animate-spin-slow"
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${
              mousePosition.y * -0.3
            }px)`,
            animationDelay: "3s",
          }}
        />

        {/* Floating dots */}
        <div
          className="absolute top-1/3 right-1/5 w-4 h-4 bg-purple-400/20 rounded-full animate-bounce-slow"
          style={{
            transform: `translate(${mousePosition.x * 0.6}px, ${
              mousePosition.y * 0.6
            }px)`,
            animationDelay: "0.8s",
          }}
        />
        <div
          className="absolute bottom-2/5 left-2/5 w-3 h-3 bg-blue-400/25 rounded-full animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * -0.5}px, ${
              mousePosition.y * -0.5
            }px)`,
            animationDelay: "1.8s",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Let's collaborate
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Let's{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 animate-gradient-x">
                Connect
              </span>
            </h2>

            <div className="flex justify-center mb-8">
              <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
              </div>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              I'm always interested in hearing about new opportunities and
              connecting with fellow developers. Let's build something amazing
              together!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Enhanced Contact Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Get In{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Touch
                </span>
              </h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`group relative flex items-center space-x-4 p-6 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden ${
                      hasIntersected
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div
                      className={`relative flex-shrink-0 p-3 rounded-xl ${item.bgColor} border border-purple-200/20 dark:border-purple-700/20 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                    </div>
                    <div className="relative">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {item.label}
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {item.value}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  </a>
                ))}
              </div>

              {/* Enhanced Social Links */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Follow Me
                </h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative p-4 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-500/50 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden ${
                        hasIntersected
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-75"
                      }`}
                      style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                      aria-label={social.label}
                    >
                      <social.icon className="relative z-10 w-6 h-6" />
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${social.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full`}
                      />
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Contact Form */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                hasIntersected
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Send a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Message
                </span>
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-300 hover:border-purple-300/50 dark:hover:border-purple-500/50"
                    placeholder="Your Name"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-300 hover:border-purple-300/50 dark:hover:border-purple-500/50"
                    placeholder="your.email@example.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Subject <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-300 hover:border-purple-300/50 dark:hover:border-purple-500/50"
                    placeholder="Project Idea / Inquiry Topic"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-300 hover:border-purple-300/50 dark:hover:border-purple-500/50 resize-none"
                    placeholder="Tell me about your project or just say hello!"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Enhanced Status Messages */}
                {status === "success" && (
                  <div className="relative p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-xl">
                    <p className="text-green-600 dark:text-green-400 text-center font-medium">
                      ✨ Message sent successfully! I will get back to you soon.
                    </p>
                  </div>
                )}
                {status === "error" && (
                  <div className="relative p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 text-center font-medium">
                      ❌ Oops! Something went wrong. Please try again.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
