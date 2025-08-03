import React from "react";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            © 2025 Shanjid Ahmad. All rights reserved.
          </p>
          <p className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
            Made with{" "}
            <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" /> using
            React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
