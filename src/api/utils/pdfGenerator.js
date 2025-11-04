const pdf = require('html-pdf-node');

class PDFGenerator {
    constructor() {
        this.options = {
            format: 'A4',
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            },
            printBackground: true,
            type: 'pdf'
        };
    }

    async createContactPDF(formData) {
        const currentDate = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const priorityText = formData.priority || 'Media';

        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                @page {
                    margin: 2cm;
                    size: A4;
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #2c3e50;
                    max-width: 100%;
                    margin: 0;
                    padding: 0;
                    background: #ffffff;
                    font-size: 11pt;
                }
                
                /* CABECERA CORPORATIVA */
                .letterhead {
                    border-bottom: 4px solid #1e40af;
                    padding-bottom: 25px;
                    margin-bottom: 35px;
                    position: relative;
                    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                    padding: 30px 25px 25px 25px;
                    border-radius: 8px 8px 0 0;
                }
                .company-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 20px;
                }
                .company-branding {
                    flex: 1;
                }
                .company-logo {
                    font-size: 28pt;
                    font-weight: 700;
                    color: #1e40af;
                    margin-bottom: 5px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                }
                .company-tagline {
                    font-size: 12pt;
                    color: #64748b;
                    font-weight: 500;
                    margin-bottom: 8px;
                }
                .company-contact {
                    text-align: right;
                    font-size: 9pt;
                    color: #475569;
                    line-height: 1.4;
                }
                .document-header {
                    text-align: center;
                    background: #1e40af;
                    color: white;
                    padding: 15px;
                    margin: 20px -25px -25px -25px;
                    border-radius: 0 0 8px 8px;
                }
                .document-title {
                    font-size: 16pt;
                    font-weight: 600;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .document-subtitle {
                    font-size: 10pt;
                    margin: 5px 0 0 0;
                    opacity: 0.9;
                }
                
                /* INFORMACIÓN DEL DOCUMENTO */
                .document-info {
                    background: #f1f5f9;
                    border: 1px solid #cbd5e1;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 6px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .doc-ref {
                    font-weight: 600;
                    color: #1e293b;
                }
                .doc-date {
                    color: #64748b;
                    font-size: 10pt;
                }
                
                /* SECCIONES */
                .section {
                    margin: 30px 0;
                    page-break-inside: avoid;
                }
                .section-header {
                    background: #1e40af;
                    color: white;
                    padding: 12px 20px;
                    margin: 0 0 1px 0;
                    font-size: 12pt;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .section-content {
                    background: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-top: none;
                    padding: 25px;
                }
                
                /* DATOS DEL CLIENTE */
                .client-data {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 25px;
                    margin: 20px 0;
                }
                .data-group {
                    background: #f8fafc;
                    padding: 18px;
                    border-radius: 6px;
                    border-left: 4px solid #3b82f6;
                }
                .data-label {
                    font-weight: 600;
                    color: #374151;
                    font-size: 10pt;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 6px;
                }
                .data-value {
                    color: #1f2937;
                    font-size: 11pt;
                    font-weight: 500;
                }
                
                /* PROYECTO */
                .project-summary {
                    background: #f0f9ff;
                    border: 2px solid #0ea5e9;
                    padding: 25px;
                    margin: 20px 0;
                    border-radius: 8px;
                }
                .project-title {
                    color: #0c4a6e;
                    font-size: 14pt;
                    font-weight: 600;
                    margin: 0 0 15px 0;
                    text-align: center;
                }
                .project-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin: 20px 0;
                }
                .project-item {
                    background: white;
                    padding: 15px;
                    border-radius: 4px;
                    border-left: 3px solid #0ea5e9;
                }
                
                /* PRIORIDAD */
                .priority-badge {
                    display: inline-block;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 10pt;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    ${priorityText === 'Alta' ? 'background: #dc2626; color: white;' : 
                      priorityText === 'Media' ? 'background: #f59e0b; color: white;' : 
                      'background: #16a34a; color: white;'}
                }
                
                /* MENSAJE */
                .message-container {
                    background: #fefefe;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 25px;
                    margin: 20px 0;
                    position: relative;
                }
                .message-container::before {
                    content: '"';
                    font-size: 60pt;
                    color: #d1d5db;
                    position: absolute;
                    top: 10px;
                    left: 20px;
                    font-family: Georgia, serif;
                }
                .message-content {
                    font-style: italic;
                    color: #374151;
                    line-height: 1.8;
                    margin-left: 40px;
                    font-size: 11pt;
                    text-align: justify;
                }
                
                /* PIE CORPORATIVO */
                .footer {
                    margin-top: 50px;
                    padding-top: 25px;
                    border-top: 3px solid #1e40af;
                    page-break-inside: avoid;
                }
                .footer-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 20px;
                }
                .footer-section h4 {
                    color: #1e40af;
                    font-size: 11pt;
                    font-weight: 600;
                    margin: 0 0 10px 0;
                    text-transform: uppercase;
                }
                .footer-section p {
                    font-size: 9pt;
                    color: #475569;
                    margin: 3px 0;
                    line-height: 1.4;
                }
                .confidential {
                    background: #fef2f2;
                    border: 1px solid #fca5a5;
                    color: #dc2626;
                    padding: 15px;
                    text-align: center;
                    font-size: 9pt;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-top: 20px;
                }
                
                /* UTILITIES */
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .mb-0 { margin-bottom: 0; }
                .mt-20 { margin-top: 20px; }
            </style>
        </head>
        <body>
            <!-- CABECERA CORPORATIVA -->
            <div class="letterhead">
                <div class="company-header">
                    <div class="company-branding">
                        <div class="company-logo">STRATEK</div>
                        <div class="company-tagline">Desarrollo Web Profesional & Consultoría Digital</div>
                    </div>
                    <div class="company-contact">
                        <strong>Daniel Cortés Casadas</strong><br>
                        📧 danielcortescasadas6@gmail.com<br>
                        📱 +34 611 87 00 10<br>
                        📍 Barcelona, España
                    </div>
                </div>
                <div class="document-header">
                    <h1 class="document-title">Solicitud de Servicios Profesionales</h1>
                    <p class="document-subtitle">Consulta de Desarrollo Web & Soluciones Digitales</p>
                </div>
            </div>

            <!-- INFORMACIÓN DEL DOCUMENTO -->
            <div class="document-info">
                <div>
                    <span class="doc-ref">REF: SOL-${Date.now().toString().slice(-6)}</span>
                </div>
                <div class="text-right">
                    <span class="doc-date">Fecha: ${currentDate}</span><br>
                    <span class="priority-badge">Prioridad: ${priorityText}</span>
                </div>
            </div>

            <!-- DATOS DEL CLIENTE -->
            <div class="section">
                <div class="section-header">Información del Cliente</div>
                <div class="section-content">
                    <div class="client-data">
                        <div class="data-group">
                            <div class="data-label">Nombre Completo</div>
                            <div class="data-value">${formData.name || 'No proporcionado'}</div>
                        </div>
                        <div class="data-group">
                            <div class="data-label">Correo Electrónico</div>
                            <div class="data-value">${formData.email || 'No proporcionado'}</div>
                        </div>
                        <div class="data-group">
                            <div class="data-label">Teléfono de Contacto</div>
                            <div class="data-value">${formData.phone || 'No proporcionado'}</div>
                        </div>
                        <div class="data-group">
                            <div class="data-label">Empresa / Organización</div>
                            <div class="data-value">${formData.company || 'No especificada'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- DETALLES DEL PROYECTO -->
            <div class="section">
                <div class="section-header">Especificaciones del Proyecto</div>
                <div class="section-content">
                    <div class="project-summary">
                        <h3 class="project-title">Resumen de Servicios Solicitados</h3>
                        <div class="project-details">
                            <div class="project-item">
                                <div class="data-label">Tipo de Servicio</div>
                                <div class="data-value">${this.getServiceName(formData.service)}</div>
                            </div>
                            <div class="project-item">
                                <div class="data-label">Presupuesto Estimado</div>
                                <div class="data-value">${this.getBudgetText(formData.budget)}</div>
                            </div>
                            <div class="project-item">
                                <div class="data-label">Cronograma Deseado</div>
                                <div class="data-value">${this.getTimelineText(formData.timeline)}</div>
                            </div>
                            <div class="project-item">
                                <div class="data-label">Nivel de Prioridad</div>
                                <div class="data-value">${priorityText}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MENSAJE DEL CLIENTE -->
            <div class="section">
                <div class="section-header">Descripción Detallada del Proyecto</div>
                <div class="section-content">
                    <div class="message-container">
                        <div class="message-content">
                            ${formData.message || 'No se proporcionó descripción adicional.'}
                        </div>
                    </div>
                </div>
            </div>

            <!-- PIE CORPORATIVO -->
            <div class="footer">
                <div class="footer-content">
                    <div class="footer-section">
                        <h4>Próximos Pasos</h4>
                        <p>✓ Análisis de requerimientos técnicos</p>
                        <p>✓ Elaboración de propuesta personalizada</p>
                        <p>✓ Reunión de definición de alcance</p>
                        <p>✓ Presentación de cronograma y presupuesto</p>
                    </div>
                    <div class="footer-section">
                        <h4>Tiempo de Respuesta</h4>
                        <p><strong>Consulta inicial:</strong> 2-4 horas</p>
                        <p><strong>Propuesta técnica:</strong> 24-48 horas</p>
                        <p><strong>Reunión comercial:</strong> Según disponibilidad</p>
                        <p><strong>Inicio del proyecto:</strong> Según acuerdo</p>
                    </div>
                </div>
                
                <div class="confidential">
                    Este documento contiene información comercial confidencial. 
                    Uso exclusivo para la evaluación de servicios profesionales de Stratek.
                </div>
            </div>
        </body>
        </html>
        `;

        const file = { content: html };

        try {
            const pdfBuffer = await pdf.generatePdf(file, this.options);
            console.log('✅ PDF generado exitosamente');
            return pdfBuffer;
        } catch (error) {
            console.error('❌ Error generating PDF:', error);
            throw error;
        }
    }

    // Métodos auxiliares para formatear datos
    getServiceName(service) {
        const services = {
            'desarrollo-web': 'Desarrollo Web Completo',
            'integracion-ia': 'Integración de Inteligencia Artificial',
            'ecommerce': 'Desarrollo de E-commerce',
            'pwa': 'Aplicación Web Progresiva (PWA)',
            'consultoria': 'Consultoría Digital',
            'mantenimiento': 'Soporte y Mantenimiento'
        };
        return services[service] || 'Servicio Personalizado';
    }

    getBudgetText(budget) {
        const budgets = {
            '500-1000': '€500 - €1,000',
            '1000-2000': '€1,000 - €2,000',
            '2000-5000': '€2,000 - €5,000',
            '5000-10000': '€5,000 - €10,000',
            '10000+': 'Más de €10,000'
        };
        return budgets[budget] || 'A consultar';
    }

    getTimelineText(timeline) {
        const timelines = {
            '1-mes': '1 Mes',
            '2-meses': '2 Meses',
            '3-meses': '3 Meses',
            '6-meses': '6 Meses',
            'sin-prisa': 'Sin prisa específica'
        };
        return timelines[timeline] || 'A definir';
    }
}

// Función exportada para crear un PDF
async function createContactPDF(formData) {
    const generator = new PDFGenerator();
    return await generator.createContactPDF(formData);
}

module.exports = { PDFGenerator, createContactPDF };
