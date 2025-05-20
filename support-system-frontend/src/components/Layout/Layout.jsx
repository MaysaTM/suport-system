import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { 
  FiHome, 
  FiUsers, 
  FiMessageSquare, // Substituindo FiTicket por FiMessageSquare
  FiSettings,
  FiUser,
  FiMenu
} from 'react-icons/fi';
import './Layout.scss';

const Layout = () => {
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <Navbar expand="lg" className="app-navbar">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            <span className="brand-name">Support System</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="main-nav" className="navbar-toggle">
            <FiMenu className="toggle-icon" />
          </Navbar.Toggle>
          
          <Navbar.Collapse id="main-nav">
            <Nav className="main-nav">
              <Nav.Link as={Link} to="/" className="nav-link">
                <FiHome className="nav-icon" />
                <span className="nav-text">Home</span>
              </Nav.Link>
              
              <Nav.Link as={Link} to="/clientes" className="nav-link">
                <FiUsers className="nav-icon" />
                <span className="nav-text">Clientes</span>
              </Nav.Link>
              
              <Nav.Link as={Link} to="/tickets" className="nav-link">
                <FiMessageSquare className="nav-icon" />
                <span className="nav-text">Tickets</span>
              </Nav.Link>
              
              <Nav.Link as={Link} to="/configuracoes" className="nav-link">
                <FiSettings className="nav-icon" />
                <span className="nav-text">Configurações</span>
              </Nav.Link>
            </Nav>
            
            <div className="user-section ms-auto">
              <Button variant="outline-light" size="sm" className="user-btn">
                <FiUser className="user-icon" />
                <span className="user-name">Admin</span>
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="app-content">
        <Container fluid>
          <Outlet />
        </Container>
      </main>
    </div>
  );
};

export default Layout;