const htmlPdf = require('html-pdf-node');

class PDFGenerator {
    constructor() {
        this.options = {
            format: 'A4',
            border: {
                top: '1cm',
                right: '1cm',
                bottom: '1cm',
                left: '1cm'
            },
            timeout: 30000
        };
    }

    generateContactFormPDF(formData) {
        const html = this.getContactFormHTML(formData);
        return htmlPdf.generatePdf({ content: html }, this.options);
    }

    generateQuotePDF(formData, calculatedQuote) {
        const html = this.getQuoteHTML(formData, calculatedQuote);
        return htmlPdf.generatePdf({ content: html }, this.options);
    }

    getContactFormHTML(data) {
        const currentDate = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #6366f1;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .logo {
                    font-size: 2em;
                    font-weight: bold;
                    color: #6366f1;
                    margin-bottom: 10px;
                }
                .subtitle {
                    color: #666;
                    font-size: 1.1em;
                }
                .form-section {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .form-section h3 {
                    color: #6366f1;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }
                .form-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    align-items: center;
                }
                .form-label {
                    font-weight: bold;
                    color: #4a5568;
                    width: 30%;
                }
                .form-value {
                    color: #2d3748;
                    width: 65%;
                    background: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    border: 1px solid #e2e8f0;
                }
                .message-section {
                    background: white;
                    padding: 20px;
                    border-left: 4px solid #6366f1;
                    border-radius: 0 8px 8px 0;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #e2e8f0;
                    color: #666;
                    font-size: 0.9em;
                }
                .contact-info {
                    background: #6366f1;
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                }
                .urgent {
                    background: #fee2e2;
                    border-left: 4px solid #ef4444;
                    padding: 15px;
                    border-radius: 0 8px 8px 0;
                    margin: 20px 0;
                }
                .priority-high {
                    color: #dc2626;
                    font-weight: bold;
                }
                .priority-medium {
                    color: #f59e0b;
                    font-weight: bold;
                }
                .priority-low {
                    color: #10b981;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">🚀 STRATEK</div>
                <div class="subtitle">Solicitud de Contacto - ${currentDate}</div>
            </div>

            <div class="form-section">
                <h3>📋 Información del Cliente</h3>
                <div class="form-row">
                    <span class="form-label">Nombre Completo:</span>
                    <span class="form-value">${data.name || 'No especificado'}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">Email:</span>
                    <span class="form-value">${data.email || 'No especificado'}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">Teléfono:</span>
                    <span class="form-value">${data.phone || 'No especificado'}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">Empresa:</span>
                    <span class="form-value">${data.company || 'No especificado'}</span>
                </div>
            </div>

            <div class="form-section">
                <h3>💼 Detalles del Proyecto</h3>
                <div class="form-row">
                    <span class="form-label">Tipo de Servicio:</span>
                    <span class="form-value">${data.service || 'No especificado'}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">Presupuesto:</span>
                    <span class="form-value">${data.budget || 'No especificado'}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">Timeline:</span>
                    <span class="form-value">${data.timeline || 'No especificado'}</span>
                </div>
                ${data.priority ? `
                <div class="form-row">
                    <span class="form-label">Prioridad:</span>
                    <span class="form-value priority-${data.priority.toLowerCase()}">${data.priority.toUpperCase()}</span>
                </div>
                ` : ''}
            </div>

            ${data.message ? `
            <div class="form-section">
                <h3>💬 Mensaje del Cliente</h3>
                <div class="message-section">
                    ${data.message.replace(/\n/g, '<br>')}
                </div>
            </div>
            ` : ''}

            ${data.priority === 'Alta' ? `
            <div class="urgent">
                ⚡ <strong>SOLICITUD PRIORITARIA</strong> - Se requiere respuesta en 2-4 horas
            </div>
            ` : ''}

            <div class="contact-info">
                <h4>🎯 Próximos Pasos</h4>
                <p>Daniel se pondrá en contacto en las próximas 24 horas para discutir los detalles del proyecto.</p>
                <p><strong>📧</strong> danielcortescasadas6@gmail.com | <strong>📱</strong> +34 611 87 00 10</p>
            </div>

            <div class="footer">
                <p><strong>Stratek - Desarrollo Web Profesional</strong></p>
                <p>Barcelona, España | www.stratek.dev</p>
                <p>Documento generado automáticamente el ${currentDate}</p>
            </div>
        </body>
        </html>
        `;
    }

    getQuoteHTML(data, quote) {
        const currentDate = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #6366f1;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .logo {
                    font-size: 2em;
                    font-weight: bold;
                    color: #6366f1;
                    margin-bottom: 10px;
                }
                .quote-total {
                    background: linear-gradient(135deg, #6366f1, #06b6d4);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 1.5em;
                    margin: 20px 0;
                }
                .breakdown {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .breakdown-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #e2e8f0;
                }
                .terms {
                    background: #fee2e2;
                    border-left: 4px solid #ef4444;
                    padding: 15px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">🚀 STRATEK</div>
                <div class="subtitle">Presupuesto de Proyecto - ${currentDate}</div>
            </div>

            <div class="quote-total">
                💰 PRESUPUESTO ESTIMADO: €${quote.total}
            </div>

            <div class="breakdown">
                <h3>📊 Desglose del Presupuesto</h3>
                ${quote.items.map(item => `
                    <div class="breakdown-item">
                        <span>${item.name}</span>
                        <span>€${item.price}</span>
                    </div>
                `).join('')}
            </div>

            <div class="terms">
                <h4>📋 Términos y Condiciones</h4>
                <ul>
                    <li>Este presupuesto es válido por 30 días</li>
                    <li>Incluye 2 revisiones sin costo adicional</li>
                    <li>Pago: 50% al inicio, 50% al finalizar</li>
                    <li>Tiempo de entrega: ${data.timeline || '2-4 semanas'}</li>
                </ul>
            </div>

            <div class="footer">
                <p><strong>Stratek - Desarrollo Web Profesional</strong></p>
                <p>Barcelona, España | www.stratek.dev</p>
                <p>Daniel Cortés | danielcortescasadas6@gmail.com | +34 611 87 00 10</p>
            </div>
        </body>
        </html>
        `;
    }
}

module.exports = new PDFGenerator();
