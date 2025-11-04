import React from 'react'

const Testimonials = () => {
  return (
    <section id="testimonios" className="testimonials">
      <div className="container">
        <h2 className="section-title">Lo que Dicen Mis Clientes</h2>
        <p className="section-subtitle">Testimonios reales de proyectos exitosos</p>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p>"Daniel transformó completamente nuestra presencia online. El nuevo sitio web aumentó nuestras ventas en un 150% en solo 3 meses."</p>
            </div>
            <div className="testimonial-author">
              <img 
                src="/img/default-user.png" 
                alt="María González" 
                className="author-image"
                loading="lazy"
                decoding="async"
              />
              <div className="author-info">
                <h4>María González</h4>
                <span>CEO, TechStartup</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p>"La integración de IA que desarrolló nos ahorra 20 horas semanales de trabajo manual. ROI increíble y soporte excepcional."</p>
            </div>
            <div className="testimonial-author">
              <img 
                src="/img/default-user.png" 
                alt="Carlos Ruiz" 
                className="author-image"
                loading="lazy"
                decoding="async"
              />
              <div className="author-info">
                <h4>Carlos Ruiz</h4>
                <span>Director, LogisticsPro</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p>"Profesional, puntual y con una calidad técnica excepcional. Definitivamente volveremos a trabajar con él en futuros proyectos."</p>
            </div>
            <div className="testimonial-author">
              <img 
                src="/img/default-user.png" 
                alt="Ana Martín" 
                className="author-image"
                loading="lazy"
                decoding="async"
              />
              <div className="author-info">
                <h4>Ana Martín</h4>
                <span>Fundadora, DesignStudio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials