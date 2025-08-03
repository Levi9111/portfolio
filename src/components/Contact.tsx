import React from 'react';
import { Mail, MapPin, Phone, Github, Linkedin, Twitter } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Contact: React.FC = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'alex.morgan@example.com',
      href: 'mailto:alex.morgan@example.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'San Francisco, CA',
      href: 'https://maps.google.com/?q=San Francisco, CA',
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com',
      color: 'hover:text-gray-900 dark:hover:text-white',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      color: 'hover:text-blue-600',
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://twitter.com',
      color: 'hover:text-blue-400',
    },
  ];

  return (
    <section
      id="contact"
      ref={elementRef}
      className="py-20 lg:py-32 bg-white dark:bg-gray-900 transition-colors"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-1000 ${
            hasIntersected
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Let's Connect
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              I'm always interested in hearing about new opportunities and connecting with fellow developers. 
              Let's build something amazing together!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Get In Touch
              </h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 group ${
                      hasIntersected
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <item.icon className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {item.label}
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social Links */}
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
                      className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 ${social.color} transition-all duration-300 hover:scale-110 ${
                        hasIntersected
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-75'
                      }`}
                      style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                hasIntersected
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Send a Message
              </h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white transition-colors"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white transition-colors resize-none"
                    placeholder="Tell me about your project or just say hello!"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                >
                  Send Message
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