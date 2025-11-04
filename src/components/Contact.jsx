import React, { useState } from 'react'
import { submitProjectInquiry } from '../api/apiClient'

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    presupuesto: '',
    timeline: '',
    mensaje: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const apiData = {
        full_name: formData.nombre,
        email: formData.email,
        project_description: formData.mensaje,
        ...(formData.telefono && { phone: formData.telefono }),
        ...(formData.presupuesto && { budget_estimate: formData.presupuesto }),
        ...(formData.timeline && { project_timeline: formData.timeline })
      }

      await submitProjectInquiry(apiData)
      setSubmitMessage('¡Mensaje enviado exitosamente! Me pondré en contacto contigo pronto.')
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        presupuesto: '',
        timeline: '',
        mensaje: ''
      })
    } catch (error) {
      setSubmitMessage(`Error al enviar el mensaje: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <section id="contacto" className="contact">
      <div className="container">
        <h2 className="section-title">¿Listo para Empezar tu Proyecto?</h2>
        <p className="section-subtitle">Conversemos sobre cómo puedo ayudarte a alcanzar tus objetivos</p>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-phone"></i>
              </div>
              <h3>Teléfono</h3>
              <p>+34 611 87 00 10</p>
              <span>Lun - Vie: 9:00 - 18:00</span>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Email</h3>
              <p>danielcortescasadas6@gmail.com</p>
              <span>Respuesta en 24h</span>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Ubicación</h3>
              <p>Barcelona, España</p>
              <span>Trabajo remoto disponible</span>
            </div>
          </div>

          <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo *</label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input 
                type="tel" 
                id="telefono" 
                name="telefono" 
                value={formData.telefono}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="presupuesto">Presupuesto Estimado</label>
              <select 
                id="presupuesto" 
                name="presupuesto"
                value={formData.presupuesto}
                onChange={handleInputChange}
              >
                <option value="">Selecciona un rango</option>
                <option value="500-1000">€500 - €1,000</option>
                <option value="1000-3000">€1,000 - €3,000</option>
                <option value="3000-5000">€3,000 - €5,000</option>
                <option value="5000+">€5,000+</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="timeline">Timeline del Proyecto</label>
              <select 
                id="timeline" 
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
              >
                <option value="">¿Cuándo necesitas el proyecto?</option>
                <option value="urgente">Urgente (1-2 semanas)</option>
                <option value="1-mes">1 mes</option>
                <option value="2-3-meses">2-3 meses</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mensaje">Describe tu Proyecto *</label>
              <textarea 
                id="mensaje" 
                name="mensaje" 
                rows="5" 
                value={formData.mensaje}
                onChange={handleInputChange}
                required 
                placeholder="Cuéntame sobre tu proyecto, objetivos y cualquier requisito específico..."
              ></textarea>
            </div>

            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                {submitMessage}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <i className="fas fa-paper-plane"></i>
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact