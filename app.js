require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());
app.use(express.static('.'));

// Importar servicios
const emailService = require('./utils/emailService-sendgrid');

console.log('🚀 Stratek Server - Production Ready');
console.log(`📧 SendGrid: ${process.env.SENDGRID_API_KEY ? '✅ Configured' : '❌ Missing'}`);
console.log(`📄 PDF Generation: ✅ Enabled`);

// Endpoint principal para formulario de contacto
app.post('/api/contact', async (req, res) => {
    try {
        const formData = req.body;
        const { nombre, email, servicio, presupuesto, mensaje, telefono, empresa, timeline, priority } = formData;

        // Validación básica
        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ error: 'Faltan campos requeridos: nombre, email y mensaje' });
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        console.log(`📝 Processing contact form: ${nombre} (${email})`);

        // Normalizar datos para el PDF y email
        const normalizedData = {
            name: nombre,
            email,
            phone: telefono,
            company: empresa,
            service: servicio,
            budget: presupuesto,
            timeline,
            priority,
            message: mensaje
        };

        let pdfBuffer = null;
        let emailSent = false;
        let emailResult = null;

        // 1. Generar PDF
        try {
            console.log('📄 Generating PDF...');
            const { createContactPDF } = require('./utils/pdfGenerator');
            pdfBuffer = await createContactPDF(normalizedData);
            console.log(`✅ PDF generated: ${pdfBuffer ? pdfBuffer.length : 0} bytes`);
        } catch (pdfError) {
            console.error('❌ PDF generation failed:', pdfError.message);
        }

        // 2. Enviar email con PDF adjunto
        try {
            console.log('📧 Sending email...');
            emailResult = await emailService.sendContactFormEmail(normalizedData, pdfBuffer);
            emailSent = true;
            console.log(`✅ Email sent via ${emailResult.service}`);
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError.message);
            // No fallar si el email falla, el formulario se envió
        }

        // Respuesta exitosa
        res.json({
            success: true,
            message: 'Formulario enviado correctamente. Te contactaremos pronto.',
            details: {
                pdfGenerated: !!pdfBuffer,
                emailSent: emailSent,
                emailService: emailResult?.service || null
            }
        });

    } catch (error) {
        console.error('❌ Contact form error:', error);
        res.status(500).json({ 
            error: 'Error al procesar la solicitud',
            message: 'Inténtalo de nuevo más tarde'
        });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🌍 Server running on http://localhost:${PORT}`);
    console.log('📧 Email service ready');
    console.log('📄 PDF generation enabled');
    console.log('🎯 Ready for production use');
});
