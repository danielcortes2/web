import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Privacy = () => {
  return (
    <>
      <Navbar />
      <div className="privacy-page" style={{ paddingTop: '100px', minHeight: '70vh' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link to="/" style={{ color: 'var(--primary-color)', marginBottom: '2rem', display: 'inline-block' }}>
            ← Volver al inicio
          </Link>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Política de Privacidad</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>1. Información que Recopilamos</h2>
            <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
              En Stratek, recopilamos únicamente la información necesaria para proporcionar nuestros servicios y mejorar la experiencia del usuario:
            </p>
            <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
              <li><strong>Datos de contacto:</strong> Nombre, email, teléfono (cuando nos contactas a través del formulario)</li>
              <li><strong>Datos de navegación:</strong> Dirección IP, navegador, páginas visitadas (mediante Google Analytics)</li>
              <li><strong>Cookies:</strong> Utilizamos cookies para mejorar la funcionalidad del sitio</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>2. Uso de la Información</h2>
            <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
              Utilizamos tu información para:
            </p>
            <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
              <li>Responder a tus consultas y solicitudes de presupuesto</li>
              <li>Mejorar nuestros servicios y la experiencia del usuario</li>
              <li>Enviar comunicaciones relacionadas con proyectos (con tu consentimiento)</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>3. Protección de Datos</h2>
            <p style={{ lineHeight: '1.8' }}>
              Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos personales contra acceso no autorizado, 
              pérdida, alteración o divulgación. Todos los datos se almacenan de forma segura y se transmiten mediante conexiones cifradas (HTTPS).
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>4. Compartir Información</h2>
            <p style={{ lineHeight: '1.8' }}>
              No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto:
            </p>
            <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
              <li>Cuando sea requerido por ley</li>
              <li>Con proveedores de servicios que nos ayudan a operar nuestro sitio (ej: hosting, analytics)</li>
              <li>Con tu consentimiento explícito</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>5. Tus Derechos</h2>
            <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
              De acuerdo con el RGPD (Reglamento General de Protección de Datos), tienes derecho a:
            </p>
            <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
              <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
              <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado</li>
              <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
            </ul>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              Para ejercer cualquiera de estos derechos, contacta con nosotros en: <a href="mailto:danielcortescasadas6@gmail.com" style={{ color: 'var(--primary-color)' }}>danielcortescasadas6@gmail.com</a>
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>6. Cookies</h2>
            <p style={{ lineHeight: '1.8' }}>
              Utilizamos cookies para mejorar la experiencia del usuario. Puedes configurar tu navegador para rechazar cookies, 
              aunque esto puede afectar la funcionalidad del sitio. Para más información, consulta nuestra política de cookies.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>7. Cambios en esta Política</h2>
            <p style={{ lineHeight: '1.8' }}>
              Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. 
              Te notificaremos sobre cambios significativos mediante un aviso en nuestro sitio web.
            </p>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>8. Contacto</h2>
            <p style={{ lineHeight: '1.8' }}>
              Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en:
            </p>
            <ul style={{ marginLeft: '2rem', lineHeight: '2', listStyle: 'none' }}>
              <li><i className="fas fa-envelope" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}></i> 
                <a href="mailto:danielcortescasadas6@gmail.com" style={{ color: 'var(--primary-color)' }}>danielcortescasadas6@gmail.com</a>
              </li>
              <li><i className="fas fa-phone" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}></i> +34 611 87 00 10</li>
              <li><i className="fas fa-map-marker-alt" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}></i> Barcelona, España</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Privacy