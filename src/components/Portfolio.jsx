import React from 'react'
import { Link } from 'react-router-dom'

const Portfolio = () => {
  return (
    <section id="portfolio" className="projects">
      <div className="container">
        <h2 className="section-title">Portfolio de Proyectos</h2>
        <p className="section-subtitle">Algunos de mis trabajos más destacados</p>

        <div className="project-filters">
          <button className="filter-btn active" data-filter="all">Todos</button>
          <button className="filter-btn" data-filter="web">Desarrollo Web</button>
          <button className="filter-btn" data-filter="ai">Inteligencia Artificial</button>
          <button className="filter-btn" data-filter="ecommerce">E-commerce</button>
          <button className="filter-btn" data-filter="mobile">Apps Móviles</button>
        </div>

        <div className="projects-grid">
          <div className="project-card" data-category="web ai">
            <div className="project-image-container">
              <img 
                src="/img/imagengato.jpg" 
                alt="Plataforma E-learning con IA" 
                className="project-image"
                loading="lazy"
                decoding="async"
              />
              <div className="project-overlay">
                <div className="project-links">
                  <Link to="/proyecto/elearning-ia" className="project-link">
                    <i className="fas fa-eye"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="project-info">
              <h3>Plataforma E-learning con IA</h3>
              <p>Plataforma educativa que utiliza IA para personalizar el aprendizaje y generar contenido adaptativo según el progreso del estudiante.</p>
              <div className="tags">
                <span className="tag">React</span>
                <span className="tag">Node.js</span>
                <span className="tag">OpenAI</span>
                <span className="tag">MongoDB</span>
                <span className="tag">Socket.io</span>
              </div>
              <div className="project-metrics">
                <span className="metric"><i className="fas fa-users"></i> 500+ usuarios</span>
                <span className="metric"><i className="fas fa-chart-line"></i> 40% más engagement</span>
              </div>
              <Link to="/proyecto/elearning-ia" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>
                Ver detalles →
              </Link>
            </div>
          </div>

          <div className="project-card" data-category="ecommerce web">
            <div className="project-image-container">
              <img 
                src="/img/imagengato.jpg" 
                alt="Tienda Online Premium" 
                className="project-image"
                loading="lazy"
                decoding="async"
              />
              <div className="project-overlay">
                <div className="project-links">
                  <Link to="/proyecto/tienda-online" className="project-link">
                    <i className="fas fa-eye"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="project-info">
              <h3>Tienda Online Premium</h3>
              <p>E-commerce completo con sistema de pagos, gestión de inventario en tiempo real y dashboard administrativo avanzado.</p>
              <div className="tags">
                <span className="tag">Next.js</span>
                <span className="tag">Stripe</span>
                <span className="tag">PostgreSQL</span>
                <span className="tag">Redis</span>
                <span className="tag">Docker</span>
              </div>
              <div className="project-metrics">
                <span className="metric"><i className="fas fa-euro-sign"></i> €50k+ ventas</span>
                <span className="metric"><i className="fas fa-clock"></i> 98% uptime</span>
              </div>
              <Link to="/proyecto/tienda-online" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>
                Ver detalles →
              </Link>
            </div>
          </div>

          <div className="project-card" data-category="ai web">
            <div className="project-image-container">
              <img 
                src="/img/imagengato.jpg" 
                alt="Sistema de Análisis Predictivo" 
                className="project-image"
                loading="lazy"
                decoding="async"
              />
              <div className="project-overlay">
                <div className="project-links">
                  <Link to="/proyecto/analisis-predictivo" className="project-link">
                    <i className="fas fa-eye"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="project-info">
              <h3>Sistema de Análisis Predictivo</h3>
              <p>Dashboard analítico que utiliza machine learning para predecir tendencias de ventas y optimizar inventarios.</p>
              <div className="tags">
                <span className="tag">Python</span>
                <span className="tag">TensorFlow</span>
                <span className="tag">D3.js</span>
                <span className="tag">FastAPI</span>
                <span className="tag">AWS</span>
              </div>
              <div className="project-metrics">
                <span className="metric"><i className="fas fa-percentage"></i> 85% precisión</span>
                <span className="metric"><i className="fas fa-money-bill-wave"></i> 30% ahorro costos</span>
              </div>
              <Link to="/proyecto/analisis-predictivo" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-block', textDecoration: 'none' }}>
                Ver detalles →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Portfolio