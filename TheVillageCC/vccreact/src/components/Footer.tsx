import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const Footer: React.FC = () => {
  const handleBackToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Navbar className="bottom navbar-light bg-light" id="pageFooter">
      <Container fluid>
        <p className="float-end">
          <a href="#top" onClick={handleBackToTop}>Back to top</a>
        </p>
        <p>
          &copy; 2022 The Village CC &middot;
          <a href="https://github.com/grahampontin/thevillagecc" title="GitHub">
            <span
              className="material-icons-outlined mx-auto mb-1"
              style={{ textAlign: 'center', fontSize: '20px', verticalAlign: 'text-top', color: 'grey' }}>
              code
            </span>
          </a>
        </p>
      </Container>
    </Navbar>
  );
};

export default Footer;
