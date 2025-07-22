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

        const priorityStyles = {
            'Alta': 'background: #fee2e2; color: #dc2626; border-left: 4px solid #ef4444;',
            'Media': 'background: #fef3c7; color: #f59e0b; border-left: 4px solid #f59e0b;',
            'Baja': 'background: #dcfce7; color: #16a34a; border-left: 4px solid #22c55e;'
        };

        const priorityText = formData.priority || 'Media';
        const priorityStyle = priorityStyles[priorityText] || priorityStyles['Media'];

        const html = `
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
                    background: linear-gradient(135deg, #6366f1, #06b6d4);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                    margin-bottom: 0;
                }
                .content {
                    background: #f8fafc;
                    padding: 30px 20px;
                    border-radius: 0 0 8px 8px;
                    margin-top: 0;
                }
                .client-info, .project-info {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .priority-alert {
                    ${priorityStyle}
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                    font-weight: bold;
                    text-align: center;
                }
                .message-box {
                    background: #e0f2fe;
                    border-left: 4px solid #0284c7;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 0 8px 8px 0;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    padding: 8px 0;
                    border-bottom: 1px solid #e2e8f0;
                }
                .info-label {
                    font-weight: bold;
                    color: #4a5568;
                    width: 40%;
                }
                .info-value {
                    color: #2d3748;
                    width: 60%;
                    text-align: right;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    color: #666;
                    font-size: 0.9em;
                    border-top: 2px solid #e2e8f0;
                    padding-top: 20px;
                }
                h1, h2, h3 {
                    margin-top: 0;
                }
                h3 {
                    color: #4a5568;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 5px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🚀 Solicitud de Contacto</h1>
                <p style="margin: 0; font-size: 1.1em;">Stratek - Desarrollo Web Profesional</p>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">${currentDate}</p>
            </div>

            <div class="content">
                ${formData.priority === 'Alta' ? `
                <div class="priority-alert">
                    ⚡ SOLICITUD PRIORITARIA - Se requiere respuesta inmediata
                </div>
                ` : ''}

                <div class="client-info">
                    <h3>👤 Información del Cliente</h3>
                    <div class="info-row">
                        <span class="info-label">Nombre:</span>
                        <span class="info-value">${formData.name || 'No especificado'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${formData.email || 'No especificado'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Teléfono:</span>
                        <span class="info-value">${formData.phone || 'No especificado'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Empresa:</span>
                        <span class="info-value">${formData.company || 'No especificado'}</span>
                    </div>
                </div>

                <div class="project-info">
                    <h3>💼 Detalles del Proyecto</h3>
                    <div class="info-row">
                        <span class="info-label">Servicio:</span>
                        <span class="info-value">${formData.service || 'No especificado'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Presupuesto:</span>
                        <span class="info-value">${formData.budget || 'No especificado'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Timeline:</span>
                        <span class="info-value">${formData.timeline || 'No especificado'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Prioridad:</span>
                        <span class="info-value">${priorityText}</span>
                    </div>
                </div>

                ${formData.message ? `
                <div class="message-box">
                    <h4 style="margin-top: 0; color: #0284c7;">💬 Mensaje del Cliente:</h4>
                    <p style="margin-bottom: 0;">${formData.message.replace(/\n/g, '<br>')}</p>
                </div>
                ` : ''}

                <div class="footer">
                    <p><strong>Stratek</strong> - Transformando ideas en soluciones digitales</p>
                    <p>📧 danielcortescasadas6@gmail.com | 📱 +34 611 87 00 10</p>
                    <p style="font-size: 0.8em; margin-top: 15px;">
                        Documento generado automáticamente el ${currentDate}
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;

        try {
            const file = { content: html };
            const pdfBuffer = await pdf.generatePdf(file, this.options);
            console.log('✅ PDF generado correctamente');
            return pdfBuffer;
        } catch (error) {
            console.error('❌ Error generando PDF:', error);
            throw error;
        }
    }

    async createQuotePDF(formData) {
        // Implementación del PDF de presupuesto
        const currentDate = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const html = `
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
                    background: linear-gradient(135deg, #10b981, #06b6d4);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }
                .content {
                    background: #f8fafc;
                    padding: 30px 20px;
                    border-radius: 0 0 8px 8px;
                }
                .quote-highlight {
                    background: linear-gradient(135deg, #6366f1, #06b6d4);
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 8px;
                    margin: 20px 0;
                    font-size: 1.5em;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>💰 Presupuesto de Proyecto</h1>
                <p>Para: ${formData.name}</p>
                <p>${currentDate}</p>
            </div>

            <div class="content">
                <div class="quote-highlight">
                    Presupuesto Estimado: ${formData.budget || 'A consultar'}
                </div>
                
                <h3>📋 Detalles del Proyecto</h3>
                <p><strong>Cliente:</strong> ${formData.name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Servicio:</strong> ${formData.service}</p>
                <p><strong>Presupuesto:</strong> ${formData.budget}</p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p><strong>Stratek</strong> - Desarrollo Web Profesional</p>
                    <p>📧 danielcortescasadas6@gmail.com | 📱 +34 611 87 00 10</p>
                </div>
            </div>
        </body>
        </html>
        `;

        try {
            const file = { content: html };
            const pdfBuffer = await pdf.generatePdf(file, this.options);
            console.log('✅ Quote PDF generado correctamente');
            return pdfBuffer;
        } catch (error) {
            console.error('❌ Error generando Quote PDF:', error);
            throw error;
        }
    }
}

// Exportar funciones individuales para compatibilidad
const pdfGenerator = new PDFGenerator();

async function createContactPDF(formData) {
    return await pdfGenerator.createContactPDF(formData);
}

async function createQuotePDF(formData) {
    return await pdfGenerator.createQuotePDF(formData);
}

// Función legacy para compatibilidad
async function generateContactFormPDF(formData) {
    return await createContactPDF(formData);
}

module.exports = {
    PDFGenerator,
    createContactPDF,
    createQuotePDF,
    generateContactFormPDF
};
