import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header: React.FC = () => {
  return (
    <Navbar 
      expand="lg" 
      variant="dark" 
      sticky="top"
      style={{ backgroundColor: 'var(--bs-primary)' }}
    >
      <Container fluid>
        <Navbar.Brand href="/" style={{ padding: 0 }}>
          <div style={{ 
            padding: 0, 
            borderRadius: '25%', 
            display: 'inline-flex' 
          }}>
            <img 
              src="/images/logo/logo_dark_transparent.png" 
              height="50" 
              alt="The Village CC Logo"
            />
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarCollapse" />
        <Navbar.Collapse id="navbarCollapse">
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Link href="/awards" className="text-white">
              <span className="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                    style={{ textAlign: 'center', fontSize: '24px' }}>
                info
              </span>
              <div className="d-inline">About</div>
            </Nav.Link>
            <Nav.Link href="/fixtures" className="text-white">
              <span className="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                    style={{ textAlign: 'center', fontSize: '24px' }}>
                calendar_month
              </span>
              <div className="d-inline">Fixtures</div>
            </Nav.Link>
            <Nav.Link href="/results" className="text-white">
              <span className="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                    style={{ textAlign: 'center', fontSize: '24px' }}>
                scoreboard
              </span>
              <div className="d-inline">Results</div>
            </Nav.Link>
            <Nav.Link href="/Stats.aspx" className="text-white">
              <span className="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                    style={{ textAlign: 'center', fontSize: '24px' }}>
                bar_chart
              </span>
              <div className="d-inline">Stats</div>
            </Nav.Link>
            <Nav.Link href="/committee" className="text-white">
              <span className="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                    style={{ textAlign: 'center', fontSize: '24px' }}>
                groups
              </span>
              <div className="d-inline">Committee</div>
            </Nav.Link>
            <Nav.Link href="/Tours.aspx" className="text-white">
              <span className="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                    style={{ textAlign: 'center', fontSize: '24px' }}>
                flight_takeoff
              </span>
              <div className="d-inline">Tours</div>
            </Nav.Link>
            <Nav.Link href="/f7/index.html" className="text-white">
              <span className="material-icons-outlined bi d-inline d-lg-none mx-auto mb-1"
                    style={{ textAlign: 'center', fontSize: '24px' }}>
                settings
              </span>
              <div className="d-inline">Admin</div>
            </Nav.Link>
          </Nav>
          <Nav className="ms-lg-auto">
            <Nav.Link 
              href="https://teamwear.nxt-sports.com/shop/the-village-cc" 
              target="_blank"
              rel="noopener"
              className="text-white"
            >
              <span className="material-icons-outlined bi d-inline d-lg-block mx-auto mb-1"
                    style={{ textAlign: 'center', fontSize: '24px', verticalAlign: 'text-bottom' }}>
                shopping_cart
              </span>
              <div className="d-inline d-lg-none" style={{ marginLeft: '18px' }}>
                Club Shop
              </div>
            </Nav.Link>
            <Nav.Link 
              href="https://twitter.com/villagecc" 
              target="_blank"
              rel="noopener"
              className="text-white"
              title="Twitter"
            >
              <span className="material-icons-outlined bi d-inline d-lg-block mx-auto mb-1"
                    style={{ textAlign: 'center', fontSize: '24px', verticalAlign: 'text-bottom' }}>
                chat_bubble_outline
              </span>
              <div className="d-inline d-lg-none" style={{ marginLeft: '18px' }}>
                Twitter
              </div>
            </Nav.Link>
            <Nav.Link 
              href="https://www.instagram.com/thevillagecc_london/"
              target="_blank"
              rel="noopener"
              className="text-white"
              title="Instagram"
            >
              <span className="material-icons-outlined bi d-inline d-lg-block mx-auto mb-1"
                    style={{ textAlign: 'center', fontSize: '24px', verticalAlign: 'text-bottom' }}>
                photo_camera
              </span>
              <div className="d-inline d-lg-none" style={{ marginLeft: '20px' }}>
                Instagram
              </div>
            </Nav.Link>
            <Nav.Link 
              href="mailto:thevillagecc@gmail.com"
              target="_blank"
              rel="noopener"
              className="text-white"
            >
              <span className="material-icons-outlined bi d-inline d-lg-block mx-auto mb-1"
                    style={{ textAlign: 'center', fontSize: '24px', verticalAlign: 'text-bottom' }}>
                email
              </span>
              <div className="d-inline d-lg-none">
                Contact Us
              </div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
