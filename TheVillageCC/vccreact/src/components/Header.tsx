import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#2e8b57] text-white sticky top-0 z-50">
      <div className="max-w-[1320px] mx-auto px-4">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center py-2">
            <div className="inline-flex p-0 rounded-[25%]">
              <img
                src="/images/logo/logo_dark_transparent.png"
                height="50"
                alt="The Village CC Logo"
                className="h-[50px]"
              />
            </div>
          </a>
          
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            aria-controls="navbarCollapse"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div 
            id="navbarCollapse"
            className={`${isMenuOpen ? 'block' : 'hidden'} lg:flex lg:items-center w-full lg:w-auto`}
            aria-hidden={!isMenuOpen}
          >
            <ul className="flex flex-col lg:flex-row lg:space-x-4 lg:mr-auto mb-0">
              <li>
                <a href="/awards" className="nav-link block py-2 px-2 text-white hover:border-b-2 hover:border-white lg:border-b-2 lg:border-[#2e8b57] transition-all font-['Source_Sans_Pro'] font-bold text-lg">
                  <span className="material-icons-outlined inline lg:hidden text-2xl align-middle mr-2">
                    info
                  </span>
                  <span className="inline">About</span>
                </a>
              </li>
              <li>
                <a href="/fixtures" className="nav-link block py-2 px-2 text-white hover:border-b-2 hover:border-white lg:border-b-2 lg:border-[#2e8b57] transition-all font-['Source_Sans_Pro'] font-bold text-lg">
                  <span className="material-icons-outlined inline lg:hidden text-2xl align-middle mr-2">
                    calendar_month
                  </span>
                  <span className="inline">Fixtures</span>
                </a>
              </li>
              <li>
                <a href="/results" className="nav-link block py-2 px-2 text-white hover:border-b-2 hover:border-white lg:border-b-2 lg:border-[#2e8b57] transition-all font-['Source_Sans_Pro'] font-bold text-lg">
                  <span className="material-icons-outlined inline lg:hidden text-2xl align-middle mr-2">
                    scoreboard
                  </span>
                  <span className="inline">Results</span>
                </a>
              </li>
              <li>
                <a href="/stats" className="nav-link block py-2 px-2 text-white hover:border-b-2 hover:border-white lg:border-b-2 lg:border-[#2e8b57] transition-all font-['Source_Sans_Pro'] font-bold text-lg">
                  <span className="material-icons-outlined inline lg:hidden text-2xl align-middle mr-2">
                    bar_chart
                  </span>
                  <span className="inline">Stats</span>
                </a>
              </li>
              <li>
                <a href="/committee" className="nav-link block py-2 px-2 text-white hover:border-b-2 hover:border-white lg:border-b-2 lg:border-[#2e8b57] transition-all font-['Source_Sans_Pro'] font-bold text-lg">
                  <span className="material-icons-outlined inline lg:hidden text-2xl align-middle mr-2">
                    groups
                  </span>
                  <span className="inline">Committee</span>
                </a>
              </li>
              <li>
                <a href="/Tours.aspx" className="nav-link block py-2 px-2 text-white hover:border-b-2 hover:border-white lg:border-b-2 lg:border-[#2e8b57] transition-all font-['Source_Sans_Pro'] font-bold text-lg">
                  <span className="material-icons-outlined inline lg:hidden text-2xl align-middle mr-2">
                    flight_takeoff
                  </span>
                  <span className="inline">Tours</span>
                </a>
              </li>
              <li>
                <a href="/f7/index.html" className="nav-link block py-2 px-2 text-white hover:border-b-2 hover:border-white lg:border-b-2 lg:border-[#2e8b57] transition-all font-['Source_Sans_Pro'] font-bold text-lg">
                  <span className="material-icons-outlined inline lg:hidden text-2xl align-middle mr-2">
                    settings
                  </span>
                  <span className="inline">Admin</span>
                </a>
              </li>
            </ul>
            
            <ul className="flex flex-col lg:flex-row lg:space-x-2 lg:ml-auto mb-0">
              <li>
                <a
                  href="https://teamwear.nxt-sports.com/shop/the-village-cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link block py-2 px-2 text-white hover:border-b-2 hover:border-white lg:border-b-2 lg:border-[#2e8b57] transition-all font-['Source_Sans_Pro'] font-bold text-lg"
                >
                  <span className="material-icons-outlined inline lg:block text-2xl align-text-bottom mx-auto text-center">
                    shopping_cart
                  </span>
                  <span className="inline lg:hidden ml-4">Club Shop</span>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/villagecc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link block py-2 px-2 text-white hover:border-b-2 hover:border-white lg:border-b-2 lg:border-[#2e8b57] transition-all font-['Source_Sans_Pro'] font-bold text-lg"
                  title="Twitter"
                >
                  <span className="material-icons-outlined inline lg:block text-2xl align-text-bottom mx-auto text-center">
                    chat_bubble_outline
                  </span>
                  <span className="inline lg:hidden ml-4">Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/thevillagecc_london/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link block py-2 px-2 text-white hover:border-b-2 hover:border-white lg:border-b-2 lg:border-[#2e8b57] transition-all font-['Source_Sans_Pro'] font-bold text-lg"
                  title="Instagram"
                >
                  <span className="material-icons-outlined inline lg:block text-2xl align-text-bottom mx-auto text-center">
                    photo_camera
                  </span>
                  <span className="inline lg:hidden ml-5">Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:thevillagecc@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link block py-2 px-2 text-white hover:border-b-2 hover:border-white lg:border-b-2 lg:border-[#2e8b57] transition-all font-['Source_Sans_Pro'] font-bold text-lg"
                >
                  <span className="material-icons-outlined inline lg:block text-2xl align-text-bottom mx-auto text-center">
                    email
                  </span>
                  <span className="inline lg:hidden">Contact Us</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
