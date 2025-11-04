import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar menú al hacer click en un enlace
  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  // Prevenir scroll cuando el menú está abierto en móvil
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('menu-open')
    } else {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('menu-open')
    }
    
    return () => {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('menu-open')
    }
  }, [isMenuOpen])

  // Función para scroll suave a secciones
  const scrollToSection = (e, sectionId) => {
    e.preventDefault()
    if (!isHome) {
      // Si no estamos en home, navegar a home primero
      window.location.href = `/#${sectionId}`
    } else {
      const element = document.querySelector(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    handleLinkClick()
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="logo" onClick={handleLinkClick}>
          <i className="fas fa-code"></i>
          <span>Stratek</span>
        </Link>
        
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#inicio" onClick={(e) => scrollToSection(e, '#inicio')}>Inicio</a></li>
          <li><a href="#servicios" onClick={(e) => scrollToSection(e, '#servicios')}>Servicios</a></li>
          <li><a href="#sobre-mi" onClick={(e) => scrollToSection(e, '#sobre-mi')}>Sobre Mí</a></li>
          <li><a href="#contacto" onClick={(e) => scrollToSection(e, '#contacto')}>Contacto</a></li>
          
          {/* CTA para móvil dentro del menú */}
          <li className="mobile-cta">
            <a href="#contacto" className="cta-btn" onClick={(e) => scrollToSection(e, '#contacto')}>
              <i className="fas fa-rocket"></i>
              Empezar Proyecto
            </a>
          </li>
        </ul>
        
        <div className="nav-right">
          <a href="#contacto" className="cta-btn desktop-cta" onClick={(e) => scrollToSection(e, '#contacto')}>
            <i className="fas fa-rocket"></i>
            Empezar Proyecto
          </a>
        </div>
        
        <button 
          className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      {/* Overlay para cerrar el menú al hacer click fuera */}
      {isMenuOpen && (
        <div 
          className={`menu-overlay ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
  )
}

export default Navbar