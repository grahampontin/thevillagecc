import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img
            src={'/images/logo/logo_dark_transparent.png'}
            alt="The Village CC"
            className="h-12 object-contain"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="/about" className="text-gray-700 hover:text-villageGreen transition">About</a>
          <a href="/fixtures" className="text-gray-700 hover:text-villageGreen transition">Fixtures</a>
          <a href="/results" className="text-gray-700 hover:text-villageGreen transition">Results</a>
          <a href="/stats" className="text-gray-700 hover:text-villageGreen transition">Stats</a>
          <a href="/players" className="text-gray-700 hover:text-villageGreen transition">Players</a>
          <a href="/committee" className="text-gray-700 hover:text-villageGreen transition">Committee</a>
          <a href="/awards" className="text-gray-700 hover:text-villageGreen transition">Awards</a>
          <a href="/tours" className="text-gray-700 hover:text-villageGreen transition">Tours</a>
          <a href="/teams" className="text-gray-700 hover:text-villageGreen transition">Teams</a>
          <a href="/venues" className="text-gray-700 hover:text-villageGreen transition">Venues</a>
          <a
            href="/admin"
            className="border border-villageGreen text-villageGreen px-3 py-1.5 rounded-md text-xs uppercase tracking-wide hover:bg-villageGreen hover:text-white transition"
          >
            Admin
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-sm font-medium text-villageGreen"
          aria-label="Open menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          Menu
        </button>
      </div>

      {/* Mobile Nav */}
      <nav className={`md:hidden border-t border-gray-200 bg-white ${isMobileMenuOpen ? '' : 'hidden'}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 text-sm font-medium">
          <a href="/about" className="py-1 text-gray-700 hover:text-villageGreen transition">About</a>
          <a href="/fixtures" className="py-1 text-gray-700 hover:text-villageGreen transition">Fixtures</a>
          <a href="/results" className="py-1 text-gray-700 hover:text-villageGreen transition">Results</a>
          <a href="/stats" className="py-1 text-gray-700 hover:text-villageGreen transition">Stats</a>
          <a href="/players" className="py-1 text-gray-700 hover:text-villageGreen transition">Players</a>
          <a href="/committee" className="py-1 text-gray-700 hover:text-villageGreen transition">Committee</a>
          <a href="/awards" className="py-1 text-gray-700 hover:text-villageGreen transition">Awards</a>
          <a href="/tours" className="py-1 text-gray-700 hover:text-villageGreen transition">Tours</a>
          <a href="/teams" className="py-1 text-gray-700 hover:text-villageGreen transition">Teams</a>
          <a href="/venues" className="py-1 text-gray-700 hover:text-villageGreen transition">Venues</a>
          <a
            href="/admin"
            className="mt-1 inline-flex items-center justify-center border border-villageGreen text-villageGreen px-3 py-1.5 rounded-md text-xs uppercase tracking-wide hover:bg-villageGreen hover:text-white transition w-max"
          >
            Admin
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
