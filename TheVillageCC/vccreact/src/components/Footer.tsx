import React from 'react';

const Footer: React.FC = () => {
  const handleBackToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-100 py-4" id="pageFooter">
      <div className="container">
        <div className="flex justify-between items-center flex-wrap">
          <p className="order-2 lg:order-1 w-full lg:w-auto text-center lg:text-left">
            &copy; 2022 The Village CC &middot;
            <a href="https://github.com/grahampontin/thevillagecc" title="GitHub" className="ml-1">
              <span
                className="material-icons-outlined align-top text-gray-500"
                style={{ fontSize: '20px' }}>
                code
              </span>
            </a>
          </p>
          <p className="order-1 lg:order-2 w-full lg:w-auto text-center lg:text-right mb-2 lg:mb-0">
            <a href="#top" onClick={handleBackToTop} className="text-blue-600 hover:underline">
              Back to top
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
