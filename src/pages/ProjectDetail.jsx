import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ProjectDetail = () => {
  const { id } = useParams()

  // Datos de ejemplo de proyectos
  const projects = {
    'elearning-ia': {
      title: 'Plataforma E-learning con IA',
      description: 'Plataforma educativa completa que utiliza inteligencia artificial para personalizar el aprendizaje y generar contenido adaptativo según el progreso de cada estudiante.',
      image: '/img/imagengato.jpg',
      technologies: ['React', 'Node.js', 'OpenAI', 'MongoDB', 'Socket.io', 'Express'],
      features: [
        'Sistema de autenticación y roles (estudiante, profesor, admin)',
        'Generación de contenido personalizado con IA',
        'Seguimiento de progreso en tiempo real',
        'Chat en vivo con soporte de IA',
        'Evaluaciones automáticas adaptativas',
        'Dashboard analítico para profesores',
        'Recomendaciones de contenido basadas en ML'
      ],
      results: [
        '500+ usuarios activos en los primeros 3 meses',
        '40% aumento en engagement comparado con plataformas tradicionales',
        '95% tasa de satisfacción de estudiantes',
        'Reducción del 60% en tiempo de corrección para profesores'
      ],
      challenges: [
        'Integración de modelos de IA con respuestas en tiempo real',
        'Optimización de costos de API de OpenAI',
        'Escalabilidad para múltiples usuarios simultáneos',
        'Diseño de algoritmos de recomendación efectivos'
      ],
      duration: '6 meses',
      client: 'EdTech Startup',
      year: '2024',
      url: '#'
    },
    'tienda-online': {
      title: 'Tienda Online Premium',
      description: 'E-commerce completo con sistema de pagos integrado, gestión de inventario en tiempo real y dashboard administrativo avanzado con analíticas.',
      image: '/img/imagengato.jpg',
      technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis', 'Docker', 'Tailwind CSS'],
      features: [
        'Pasarela de pagos con Stripe',
        'Gestión de inventario en tiempo real',
        'Sistema de cupones y promociones',
        'Panel admin con métricas avanzadas',
        'Sistema de reviews y valoraciones',
        'Carrito persistente',
        'Notificaciones por email automáticas'
      ],
      results: [
        '€50k+ en ventas en los primeros 6 meses',
        '98% uptime',
        '2.5 segundos tiempo de carga promedio',
        '35% tasa de conversión'
      ],
      challenges: [
        'Integración segura con múltiples métodos de pago',
        'Sincronización de inventario entre múltiples almacenes',
        'Optimización de imágenes y performance',
        'Implementación de sistema de caché efectivo'
      ],
      duration: '4 meses',
      client: 'Retail Fashion Brand',
      year: '2024',
      url: '#'
    },
    'analisis-predictivo': {
      title: 'Sistema de Análisis Predictivo',
      description: 'Dashboard analítico empresarial que utiliza machine learning para predecir tendencias de ventas y optimizar gestión de inventarios.',
      image: '/img/imagengato.jpg',
      technologies: ['Python', 'TensorFlow', 'D3.js', 'FastAPI', 'AWS', 'PostgreSQL'],
      features: [
        'Predicción de ventas con ML',
        'Visualizaciones interactivas con D3.js',
        'Detección de anomalías en datos',
        'Recomendaciones automáticas de stock',
        'Exportación de reportes PDF',
        'Integración con sistemas ERP',
        'API REST para terceros'
      ],
      results: [
        '85% precisión en predicciones',
        '30% reducción en costos de inventario',
        '25% aumento en eficiencia operativa',
        'ROI recuperado en 4 meses'
      ],
      challenges: [
        'Limpieza y normalización de datos históricos',
        'Entrenamiento de modelos con datos limitados',
        'Integración con sistemas legacy',
        'Visualización de datos complejos de forma simple'
      ],
      duration: '5 meses',
      client: 'Empresa de Logística',
      year: '2023',
      url: '#'
    }
  }

  const project = projects[id]

  if (!project) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Proyecto no encontrado</h1>
          <Link to="/" style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}>Volver al inicio</Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="project-detail-page" style={{ paddingTop: '100px' }}>
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ marginBottom: '2rem', opacity: 0.7 }}>
            <Link to="/" style={{ color: 'var(--primary-color)' }}>Inicio</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <Link to="/#portfolio" style={{ color: 'var(--primary-color)' }}>Portfolio</Link>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <span>{project.title}</span>
          </div>

          {/* Hero del proyecto */}
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {project.title}
            </h1>
            <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {project.description}
            </p>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <div>
                <strong>Cliente:</strong> {project.client}
              </div>
              <div>
                <strong>Duración:</strong> {project.duration}
              </div>
              <div>
                <strong>Año:</strong> {project.year}
              </div>
            </div>
          </div>

          {/* Imagen principal */}
          <div style={{ marginBottom: '3rem', borderRadius: '1rem', overflow: 'hidden' }}>
            <img src={project.image} alt={project.title} style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }} />
          </div>

          {/* Tecnologías */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Tecnologías Utilizadas</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {project.technologies.map((tech, index) => (
                <span key={index} style={{ background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--primary-color)' }}>
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Características */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Características Principales</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {project.features.map((feature, index) => (
                <li key={index} style={{ marginBottom: '1rem', paddingLeft: '2rem', position: 'relative' }}>
                  <i className="fas fa-check-circle" style={{ position: 'absolute', left: 0, color: 'var(--primary-color)' }}></i>
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          {/* Desafíos */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Desafíos Superados</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {project.challenges.map((challenge, index) => (
                <li key={index} style={{ marginBottom: '1rem', paddingLeft: '2rem', position: 'relative' }}>
                  <i className="fas fa-lightbulb" style={{ position: 'absolute', left: 0, color: 'var(--accent-color)' }}></i>
                  {challenge}
                </li>
              ))}
            </ul>
          </section>

          {/* Resultados */}
          <section style={{ marginBottom: '3rem', background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '1rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Resultados Obtenidos</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {project.results.map((result, index) => (
                <div key={index} style={{ textAlign: 'center', padding: '1rem' }}>
                  <i className="fas fa-chart-line" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
                  <p style={{ fontSize: '1.1rem' }}>{result}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section style={{ textAlign: 'center', padding: '3rem 0' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¿Interesado en un proyecto similar?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              Conversemos sobre cómo puedo ayudarte a alcanzar tus objetivos
            </p>
            <Link to="/#contacto" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
              <i className="fas fa-envelope"></i> Contactar
            </Link>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ProjectDetail