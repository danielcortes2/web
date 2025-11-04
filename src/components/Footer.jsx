import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Columna 1: Brand + Redes Sociales */}
          <div className="footer-section footer-brand">
            <Link to="/" className="footer-logo">
              <i className="fas fa-code"></i>
              <span>Stratek</span>
            </Link>
            <p>Soluciones web innovadoras que impulsan tu negocio.</p>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/daniel-cort%C3%A9s-890423324/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
              <a href="https://github.com/danielcortes2" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos (Servicios + Empresa) */}
          <div className="footer-section footer-links-section">
            <h3>Enlaces</h3>
            <div className="footer-links-grid">
              <ul>
                <li><a href="/#servicios">Servicios</a></li>
                <li><a href="/#sobre-mi">Sobre Mí</a></li>
                <li><a href="/#contacto">Contacto</a></li>
              </ul>
            </div>
          </div>

          {/* Columna 3: Contacto compacto */}
          <div className="footer-section footer-contact">
            <h3>Contacto</h3>
            <div className="contact-info-compact">
              <a href="mailto:danielcortescasadas6@gmail.com">
                <i className="fas fa-envelope"></i> 
                <span>danielcortescasadas6@gmail.com</span>
              </a>
              <a href="tel:+34611870010">
                <i className="fas fa-phone"></i> 
                <span>+34 611 87 00 10</span>
              </a>
              <p>
                <i className="fas fa-map-marker-alt"></i> 
                <span>Barcelona, España</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer bottom más compacto */}
        <div className="footer-bottom">
          <p>&copy; 2025 Stratek. Todos los derechos reservados.</p>
          <div className="footer-legal">
            <Link to="/privacidad">Privacidad</Link>
            <span className="separator">•</span>
            <a href="#">Términos</a>
            <span className="separator">•</span>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer