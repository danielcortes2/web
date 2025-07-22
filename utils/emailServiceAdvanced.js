const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

class EmailServiceAdvanced {
    constructor() {
        this.sendgridAvailable = false;
        this.nodemailerAvailable = false;
        this.transporter = null;
        
        this.initializeServices();
    }

    initializeServices() {
        // Intentar inicializar SendGrid primero
        this.initializeSendGrid();
        
        // Backup con Nodemailer (Gmail)
        this.initializeNodemailer();
        
        console.log(`📧 Email service status:`);
        console.log(`   SendGrid: ${this.sendgridAvailable ? '✅ Ready' : '❌ Not configured'}`);
        console.log(`   Gmail: ${this.nodemailerAvailable ? '✅ Ready' : '❌ Not configured'}`);
    }

    initializeSendGrid() {
        if (!process.env.SENDGRID_API_KEY) {
            console.log('⚠️ SENDGRID_API_KEY not configured');
            return;
        }

        try {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            this.sendgridAvailable = true;
            console.log('✅ SendGrid initialized successfully');
        } catch (error) {
            console.log('❌ SendGrid initialization failed:', error.message);
        }
    }

    initializeNodemailer() {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('⚠️ Gmail credentials not configured');
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

        // Verificar conexión con timeout
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Gmail connection timeout')), 5000);
        });

        const verifyPromise = new Promise((resolve, reject) => {
            this.transporter.verify((error, success) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(success);
                }
            });
        });

        Promise.race([verifyPromise, timeoutPromise])
            .then(() => {
                this.nodemailerAvailable = true;
                console.log('✅ Gmail backup service ready');
            })
            .catch((error) => {
                console.log('❌ Gmail backup failed:', error.message);
                this.transporter = null;
            });
    }

    async sendContactFormEmail(formData, pdfBuffer = null) {
        // Intentar SendGrid primero
        if (this.sendgridAvailable) {
            try {
                return await this.sendWithSendGrid(formData, pdfBuffer);
            } catch (error) {
                console.log('❌ SendGrid failed, trying backup:', error.message);
            }
        }

        // Fallback a Gmail
        if (this.nodemailerAvailable) {
            try {
                return await this.sendWithNodemailer(formData, pdfBuffer);
            } catch (error) {
                console.log('❌ Gmail backup also failed:', error.message);
                throw error;
            }
        }

        throw new Error('No email service available');
    }

    async sendWithSendGrid(formData, pdfBuffer) {
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

        const msg = {
            to: process.env.EMAIL_TO || process.env.SENDGRID_TO_EMAIL,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM,
                name: 'Stratek Portfolio'
            },
            subject: `${emoji} Nueva solicitud de contacto - ${formData.name || 'Cliente'} | Stratek`,
            html: this.getContactEmailHTML(formData, currentDate)
        };

        // Agregar PDF como adjunto si existe
        if (pdfBuffer) {
            msg.attachments = [
                {
                    content: pdfBuffer.toString('base64'),
                    filename: `Solicitud_Contacto_${formData.name?.replace(/\s+/g, '_') || 'Cliente'}_${new Date().toISOString().split('T')[0]}.pdf`,
                    type: 'application/pdf',
                    disposition: 'attachment'
                }
            ];
        }

        const result = await sgMail.send(msg);
        console.log('✅ Email sent via SendGrid:', result[0].statusCode);
        return { messageId: result[0].headers['x-message-id'], service: 'SendGrid' };
    }

    async sendWithNodemailer(formData, pdfBuffer) {
        if (!this.transporter) {
            throw new Error('Nodemailer not configured');
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
            html: this.getContactEmailHTML(formData, currentDate)
        };

        // Agregar PDF como adjunto si existe
        if (pdfBuffer) {
            mailOptions.attachments = [
                {
                    filename: `Solicitud_Contacto_${formData.name?.replace(/\s+/g, '_') || 'Cliente'}_${new Date().toISOString().split('T')[0]}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ];
        }

        const result = await this.transporter.sendMail(mailOptions);
        console.log('✅ Email sent via Gmail:', result.messageId);
        return { messageId: result.messageId, service: 'Gmail' };
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                .email-container {
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background: linear-gradient(135deg, #6366f1, #06b6d4);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 30px 20px;
                }
                .info-section {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #6366f1;
                }
                .info-section h3 {
                    margin-top: 0;
                    color: #4338ca;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    padding: 8px 0;
                    border-bottom: 1px solid #e2e8f0;
                }
                .info-row:last-child {
                    border-bottom: none;
                }
                .info-label {
                    font-weight: bold;
                    color: #4a5568;
                    flex: 1;
                }
                .info-value {
                    color: #2d3748;
                    flex: 2;
                    text-align: right;
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
                    background: #e0f7fa;
                    border-left: 4px solid #00bcd4;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 0 8px 8px 0;
                }
                .message-box h4 {
                    margin-top: 0;
                    color: #006064;
                }
                .action-buttons {
                    text-align: center;
                    margin: 30px 0;
                }
                .btn {
                    display: inline-block;
                    background: #6366f1;
                    color: white !important;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 0 10px 10px 0;
                    font-weight: bold;
                    transition: background-color 0.3s;
                }
                .btn:hover {
                    background: #4f46e5;
                }
                .footer {
                    background: #f8fafc;
                    padding: 20px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 0.9em;
                }
                @media (max-width: 600px) {
                    .info-row {
                        flex-direction: column;
                    }
                    .info-value {
                        text-align: left;
                        margin-top: 5px;
                    }
                    .btn {
                        display: block;
                        margin: 10px 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
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

                    <div class="info-section">
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

                    <div class="info-section">
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
                        <a href="mailto:${data.email}?subject=Re:%20Tu%20solicitud%20de%20proyecto%20en%20Stratek" class="btn">
                            📧 Responder al Cliente
                        </a>
                        ${data.phone ? `<a href="tel:${data.phone}" class="btn">📱 Llamar</a>` : ''}
                    </div>
                </div>

                <div class="footer">
                    <p>📎 ${data.attachmentNote || 'Solicitud procesada correctamente'}</p>
                    <p><strong>Stratek</strong> - Transformando ideas en soluciones digitales</p>
                    <p>📧 danielcortescasadas6@gmail.com | 📱 +34 611 87 00 10</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    // Método para verificar qué servicios están disponibles
    getAvailableServices() {
        return {
            sendgrid: this.sendgridAvailable,
            gmail: this.nodemailerAvailable,
            hasAnyService: this.sendgridAvailable || this.nodemailerAvailable
        };
    }
}

module.exports = new EmailServiceAdvanced();
