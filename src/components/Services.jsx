import React from 'react'

const Services = () => {
  return (
    <section id="servicios" className="services">
      <div className="container">
        <h2 className="section-title">Servicios Profesionales</h2>
        <p className="section-subtitle">Soluciones completas para tu presencia digital</p>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-laptop-code"></i>
            </div>
            <h3>Desarrollo Web</h3>
            <p>Sitios web modernos, responsivos y optimizados para SEO. Desde landing pages hasta aplicaciones web complejas.</p>
            <ul className="service-features">
              <li><i className="fas fa-check"></i> Diseño responsivo</li>
              <li><i className="fas fa-check"></i> Optimización SEO</li>
              <li><i className="fas fa-check"></i> Velocidad optimizada</li>
            </ul>
            <div className="service-price">Desde €800</div>
          </div>

          <div className="service-card featured">
            <div className="service-badge">Más Popular</div>
            <div className="service-icon">
              <i className="fas fa-robot"></i>
            </div>
            <h3>Integración de IA</h3>
            <p>Implemento soluciones de inteligencia artificial para automatizar procesos y mejorar la experiencia del usuario.</p>
            <ul className="service-features">
              <li><i className="fas fa-check"></i> Chatbots inteligentes</li>
              <li><i className="fas fa-check"></i> Análisis de datos</li>
              <li><i className="fas fa-check"></i> Automatización</li>
            </ul>
            <div className="service-price">Desde €1,200</div>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h3>Apps Web Progresivas</h3>
            <p>Aplicaciones web que funcionan como apps nativas, con capacidades offline y notificaciones push.</p>
            <ul className="service-features">
              <li><i className="fas fa-check"></i> Funciona offline</li>
              <li><i className="fas fa-check"></i> Notificaciones push</li>
              <li><i className="fas fa-check"></i> Instalable</li>
            </ul>
            <div className="service-price">Desde €1,500</div>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h3>E-commerce</h3>
            <p>Tiendas online completas con gestión de inventario, pagos seguros y panel de administración.</p>
            <ul className="service-features">
              <li><i className="fas fa-check"></i> Pagos seguros</li>
              <li><i className="fas fa-check"></i> Gestión inventario</li>
              <li><i className="fas fa-check"></i> Panel admin</li>
            </ul>
            <div className="service-price">Desde €2,000</div>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Consultoría Digital</h3>
            <p>Auditorías técnicas, optimización de rendimiento y estrategias de crecimiento digital.</p>
            <ul className="service-features">
              <li><i className="fas fa-check"></i> Auditoría técnica</li>
              <li><i className="fas fa-check"></i> Optimización</li>
              <li><i className="fas fa-check"></i> Estrategia digital</li>
            </ul>
            <div className="service-price">Desde €400</div>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <i className="fas fa-headset"></i>
            </div>
            <h3>Soporte & Mantenimiento</h3>
            <p>Mantenimiento continuo, actualizaciones de seguridad y soporte técnico 24/7.</p>
            <ul className="service-features">
              <li><i className="fas fa-check"></i> Soporte 24/7</li>
              <li><i className="fas fa-check"></i> Actualizaciones</li>
              <li><i className="fas fa-check"></i> Backups automáticos</li>
            </ul>
            <div className="service-price">Desde €150/mes</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services