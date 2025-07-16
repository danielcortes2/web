const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    initializeTransporter() {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('⚠️ Email credentials not configured. Email service disabled.');
            return;
        }

        this.transporter = nodemailer.createTransporter({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verificar conexión
        this.transporter.verify((error, success) => {
            if (error) {
                console.log('❌ Email service connection failed:', error.message);
                this.transporter = null;
            } else {
                console.log('✅ Email service ready');
            }
        });
    }

    async sendContactFormEmail(formData, pdfBuffer) {
        if (!this.transporter) {
            throw new Error('Email service not configured');
        }

        const currentDate = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const priorityEmoji = {
            'Alta': '🔴',
            'Media': '🟡',
            'Baja': '🟢'
        };

        const priorityText = formData.priority || 'Media';
        const emoji = priorityEmoji[priorityText] || '🟡';

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: `${emoji} Nueva solicitud de contacto - ${formData.name || 'Cliente'} | Stratek`,
            html: this.getContactEmailHTML(formData, currentDate),
            attachments: [
                {
                    filename: `Solicitud_Contacto_${formData.name?.replace(/\s+/g, '_') || 'Cliente'}_${new Date().toISOString().split('T')[0]}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        try {
            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully:', result.messageId);
            return result;
        } catch (error) {
            console.error('❌ Error sending email:', error);
            throw error;
        }
    }

    async sendQuoteEmail(formData, pdfBuffer, quoteData) {
        if (!this.transporter) {
            throw new Error('Email service not configured');
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            cc: formData.email, // Copia al cliente
            subject: `💰 Presupuesto para ${formData.name || 'Cliente'} - €${quoteData.total} | Stratek`,
            html: this.getQuoteEmailHTML(formData, quoteData),
            attachments: [
                {
                    filename: `Presupuesto_${formData.name?.replace(/\s+/g, '_') || 'Cliente'}_${new Date().toISOString().split('T')[0]}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        try {
            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Quote email sent successfully:', result.messageId);
            return result;
        } catch (error) {
            console.error('❌ Error sending quote email:', error);
            throw error;
        }
    }

    getContactEmailHTML(data, currentDate) {
        const priorityStyles = {
            'Alta': 'background: #fee2e2; color: #dc2626; border-left: 4px solid #ef4444;',
            'Media': 'background: #fef3c7; color: #f59e0b; border-left: 4px solid #f59e0b;',
            'Baja': 'background: #dcfce7; color: #16a34a; border-left: 4px solid #22c55e;'
        };

        const priorityText = data.priority || 'Media';
        const priorityStyle = priorityStyles[priorityText] || priorityStyles['Media'];

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
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #6366f1, #06b6d4);
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
                .client-info {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .project-info {
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
                }
                .message-box {
                    background: #e0f2fe;
                    border-left: 4px solid #0284c7;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 0 8px 8px 0;
                }
                .action-buttons {
                    text-align: center;
                    margin: 30px 0;
                }
                .btn {
                    display: inline-block;
                    background: #6366f1;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 0 10px;
                    font-weight: bold;
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
                }
                .info-value {
                    color: #2d3748;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🚀 Nueva Solicitud de Contacto</h1>
                <p>Stratek - Desarrollo Web Profesional</p>
                <p>${currentDate}</p>
            </div>

            <div class="content">
                ${data.priority === 'Alta' ? `
                <div class="priority-alert">
                    ⚡ SOLICITUD PRIORITARIA - Se requiere respuesta inmediata
                </div>
                ` : ''}

                <div class="client-info">
                    <h3>👤 Información del Cliente</h3>
                    <div class="info-row">
                        <span class="info-label">Nombre:</span>
                        <span class="info-value">${data.name || 'No especificado'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${data.email || 'No especificado'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Teléfono:</span>
                        <span class="info-value">${data.phone || 'No especificado'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Empresa:</span>
                        <span class="info-value">${data.company || 'No especificado'}</span>
                    </div>
                </div>

                <div class="project-info">
                    <h3>💼 Detalles del Proyecto</h3>
                    <div class="info-row">
                        <span class="info-label">Servicio:</span>
                        <span class="info-value">${data.service || 'No especificado'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Presupuesto:</span>
                        <span class="info-value">${data.budget || 'No especificado'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Timeline:</span>
                        <span class="info-value">${data.timeline || 'No especificado'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Prioridad:</span>
                        <span class="info-value">${priorityText}</span>
                    </div>
                </div>

                ${data.message ? `
                <div class="message-box">
                    <h4>💬 Mensaje del Cliente:</h4>
                    <p>${data.message.replace(/\n/g, '<br>')}</p>
                </div>
                ` : ''}

                <div class="action-buttons">
                    <a href="mailto:${data.email}?subject=Re: Tu solicitud de proyecto en Stratek" class="btn">
                        📧 Responder al Cliente
                    </a>
                    <a href="tel:${data.phone}" class="btn">
                        📱 Llamar
                    </a>
                </div>

                <div style="text-align: center; margin-top: 30px; color: #666; font-size: 0.9em;">
                    <p>📎 Se adjunta el PDF completo con todos los detalles</p>
                    <p><strong>Stratek</strong> - Transformando ideas en soluciones digitales</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    getQuoteEmailHTML(data, quoteData) {
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
                    max-width: 600px;
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
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>💰 Presupuesto de Proyecto</h1>
                <p>Para: ${data.name}</p>
            </div>

            <div class="content">
                <div class="quote-highlight">
                    Presupuesto Total: €${quoteData.total}
                </div>
                
                <p>Hola ${data.name},</p>
                <p>Se ha generado automáticamente un presupuesto para tu proyecto. Encontrarás todos los detalles en el PDF adjunto.</p>
                
                <p><strong>Próximos pasos:</strong></p>
                <ul>
                    <li>Revisa el presupuesto detallado en el PDF</li>
                    <li>Daniel se pondrá en contacto contigo en 24 horas</li>
                    <li>El presupuesto es válido por 30 días</li>
                </ul>

                <div style="text-align: center; margin-top: 30px;">
                    <p><strong>¿Tienes preguntas?</strong></p>
                    <p>📧 danielcortescasadas6@gmail.com | 📱 +34 611 87 00 10</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}

module.exports = new EmailService();
