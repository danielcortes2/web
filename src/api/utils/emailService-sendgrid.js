const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

class EmailServiceSendGrid {
    constructor() {
        this.sendgridConfigured = false;
        this.mailgunConfigured = false;
        this.transporter = null;
        
        // Configurar SendGrid
        if (process.env.SENDGRID_API_KEY) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            this.sendgridConfigured = true;
            console.log('✅ SendGrid configured');
        } else {
            console.log('⚠️ SendGrid API key not found');
        }
        
        // Configurar Mailgun
        if (process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD) {
            this.mailgunTransporter = nodemailer.createTransport({
                host: process.env.MAIL_SERVER || 'smtp.mailgun.org',
                port: parseInt(process.env.MAIL_PORT) || 587,
                secure: process.env.MAIL_SSL_TLS === 'True',
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD
                },
                tls: {
                    ciphers: 'SSLv3',
                    rejectUnauthorized: false
                }
            });
            this.mailgunConfigured = true;
            console.log('✅ Mailgun configured');
        } else {
            console.log('⚠️ Mailgun credentials not found');
        }
        
        // Configurar Gmail como backup
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            console.log('✅ Gmail backup configured');
        }
    }

    async sendContactFormEmail(formData, pdfBuffer = null) {
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

        const emailContent = this.getContactEmailHTML(formData, currentDate);
        const subject = `${emoji} Nueva solicitud de contacto - ${formData.name || 'Cliente'} | Stratek`;

        // Intentar enviar con SendGrid primero
        if (this.sendgridConfigured) {
            try {
                console.log('📧 Attempting to send via SendGrid...');
                
                const mailOptions = {
                    to: process.env.SENDGRID_TO_EMAIL || process.env.EMAIL_TO,
                    from: {
                        email: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM,
                        name: 'Stratek Portfolio'
                    },
                    subject: subject,
                    html: emailContent
                };

                // Agregar PDF si existe
                if (pdfBuffer) {
                    mailOptions.attachments = [{
                        content: pdfBuffer.toString('base64'),
                        filename: `Solicitud_Contacto_${formData.name?.replace(/\s+/g, '_') || 'Cliente'}_${new Date().toISOString().split('T')[0]}.pdf`,
                        type: 'application/pdf',
                        disposition: 'attachment'
                    }];
                }

                const result = await sgMail.send(mailOptions);
                console.log('✅ Email sent successfully via SendGrid');
                return { service: 'sendgrid', messageId: result[0].headers['x-message-id'] };
                
            } catch (error) {
                console.error('❌ SendGrid failed:', error.message);
                console.log('🔄 Trying Mailgun...');
            }
        }

        // Intentar enviar con Mailgun
        if (this.mailgunConfigured) {
            try {
                console.log('📧 Attempting to send via Mailgun...');
                
                const mailOptions = {
                    from: process.env.MAIL_FROM,
                    to: process.env.ADMIN_EMAIL || process.env.EMAIL_TO,
                    subject: subject,
                    html: emailContent
                };

                // Agregar PDF si existe
                if (pdfBuffer) {
                    mailOptions.attachments = [{
                        filename: `Solicitud_Contacto_${formData.name?.replace(/\s+/g, '_') || 'Cliente'}_${new Date().toISOString().split('T')[0]}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }];
                }

                const result = await this.mailgunTransporter.sendMail(mailOptions);
                console.log('✅ Email sent successfully via Mailgun');
                return { service: 'mailgun', messageId: result.messageId };
                
            } catch (error) {
                console.error('❌ Mailgun failed:', error.message);
                console.log('🔄 Trying Gmail backup...');
            }
        }

        // Fallback a Gmail si otros servicios fallan
        if (this.transporter) {
            try {
                console.log('📧 Attempting to send via Gmail...');
                
                const mailOptions = {
                    from: process.env.EMAIL_FROM,
                    to: process.env.EMAIL_TO,
                    subject: subject,
                    html: emailContent
                };

                // Agregar PDF si existe
                if (pdfBuffer) {
                    mailOptions.attachments = [{
                        filename: `Solicitud_Contacto_${formData.name?.replace(/\s+/g, '_') || 'Cliente'}_${new Date().toISOString().split('T')[0]}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }];
                }

                const result = await this.transporter.sendMail(mailOptions);
                console.log('✅ Email sent successfully via Gmail backup');
                return { service: 'gmail', messageId: result.messageId };
                
            } catch (error) {
                console.error('❌ Gmail backup also failed:', error.message);
                throw new Error('All email services failed');
            }
        }

        throw new Error('No email service configured');
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

                <div style="text-align: center; margin-top: 30px; color: #666; font-size: 0.9em;">
                    <p>📎 Se adjunta el PDF completo con todos los detalles</p>
                    <p><strong>Stratek</strong> - Transformando ideas en soluciones digitales</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}

module.exports = new EmailServiceSendGrid();
