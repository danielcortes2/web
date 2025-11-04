import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Blog = () => {
  // Artículos de ejemplo
  const articles = [
    {
      id: 1,
      slug: 'integracion-ia-aplicaciones-web',
      title: 'Integración de IA en Aplicaciones Web: Guía Completa 2024',
      excerpt: 'Descubre cómo integrar inteligencia artificial en tus aplicaciones web con OpenAI, Claude y otras herramientas modernas.',
      date: '2024-03-15',
      author: 'Daniel Cortés',
      category: 'Inteligencia Artificial',
      image: '/img/imagengato.jpg',
      readTime: '8 min'
    },
    {
      id: 2,
      slug: 'react-mejores-practicas',
      title: 'React 18: Mejores Prácticas y Nuevas Características',
      excerpt: 'Explora las nuevas características de React 18 y aprende las mejores prácticas para desarrollar aplicaciones modernas.',
      date: '2024-03-10',
      author: 'Daniel Cortés',
      category: 'Desarrollo Web',
      image: '/img/imagengato.jpg',
      readTime: '6 min'
    },
    {
      id: 3,
      slug: 'optimizacion-rendimiento-web',
      title: 'Optimización de Rendimiento Web: De 5s a 1s de Carga',
      excerpt: 'Técnicas avanzadas para optimizar el rendimiento de tu sitio web y mejorar la experiencia del usuario.',
      date: '2024-03-05',
      author: 'Daniel Cortés',
      category: 'Performance',
      image: '/img/imagengato.jpg',
      readTime: '10 min'
    }
  ]

  return (
    <>
      <Navbar />
      <div className="blog-page" style={{ paddingTop: '100px', minHeight: '70vh' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Blog
            </h1>
            <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)' }}>
              Artículos sobre desarrollo web, inteligencia artificial y tecnología
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
            {articles.map(article => (
              <article key={article.id} style={{ background: 'var(--bg-secondary)', borderRadius: '1rem', overflow: 'hidden', transition: 'transform 0.3s ease', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img src={article.image} alt={article.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    {article.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {article.excerpt}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--bg-tertiary)' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {new Date(article.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                      Próximamente →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Mensaje de próximamente */}
          <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '1rem' }}>
            <i className="fas fa-pen-nib" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Más artículos próximamente</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Estoy preparando contenido de calidad sobre desarrollo web, IA y tecnología
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Blog