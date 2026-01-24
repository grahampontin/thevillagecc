import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} The Village Cricket Club</p>
        <div className="flex items-center gap-4">
          <a href="https://twitter.com/villagecc" className="hover:text-white transition">Twitter</a>
          <a href="https://www.instagram.com/thevillagecc_london/" className="hover:text-white transition">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
