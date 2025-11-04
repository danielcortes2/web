import React from 'react'

const Hero = () => {
  return (
    <header id="inicio" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="gradient-text">Desarrollo Web</span> que Impulsa tu Negocio
          </h1>
          <p className="hero-subtitle">Especialista en soluciones web modernas e inteligencia artificial</p>
          <p className="hero-description">
            Transformo ideas en experiencias digitales excepcionales. Desarrollo aplicaciones web de alto rendimiento,
            integro IA generativa y creo soluciones que hacen crecer tu negocio.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Proyectos Completados</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfacción Cliente</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Soporte Técnico</span>
            </div>
          </div>
          <div className="hero-buttons">
            <a href="#contacto" className="btn-primary">
              <i className="fas fa-rocket"></i>
              Iniciar Proyecto
            </a>
            <a href="#servicios" className="btn-secondary">
              <i className="fas fa-briefcase"></i>
              Ver Servicios
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-elements">
            <div className="floating-card">
              <i className="fab fa-react"></i>
              <span>React</span>
            </div>
            <div className="floating-card">
              <i className="fab fa-node-js"></i>
              <span>Node.js</span>
            </div>
            <div className="floating-card">
              <i className="fas fa-robot"></i>
              <span>AI</span>
            </div>
            <div className="floating-card">
              <i className="fab fa-python"></i>
              <span>Python</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero