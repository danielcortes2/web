require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Cargar servicio de email SendGrid
const emailService = require('./utils/emailService-sendgrid');

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Rate limiting simple
const requests = new Map();
const rateLimitMiddleware = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 10;

    if (!requests.has(ip)) {
        requests.set(ip, []);
    }

    const userRequests = requests.get(ip);
    const recentRequests = userRequests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
        return res.status(429).json({ error: 'Demasiadas solicitudes' });
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);
    next();
};

// Endpoint principal para formulario de contacto
app.post('/api/contact', rateLimitMiddleware, async (req, res) => {
    try {
        const { nombre, email, servicio, presupuesto, mensaje, telefono, empresa, timeline, priority } = req.body;

        // Validación básica
        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        console.log('📝 Processing contact form:', { nombre, email, servicio });

        // Datos normalizados
        const formData = {
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
        let pdfGenerated = false;
        let emailSent = false;
        let emailServiceUsed = null;

        // Generar PDF
        try {
            const { createContactPDF } = require('./utils/pdfGenerator');
            pdfBuffer = await createContactPDF(formData);
            pdfGenerated = !!pdfBuffer;
            console.log(`📄 PDF generated: ${pdfGenerated} (${pdfBuffer ? pdfBuffer.length : 0} bytes)`);
        } catch (error) {
            console.error('❌ PDF generation failed:', error.message);
        }

        // Enviar email con PDF adjunto
        try {
            const result = await emailService.sendContactFormEmail(formData, pdfBuffer);
            emailSent = true;
            emailServiceUsed = result.service;
            console.log(`📧 Email sent via ${emailServiceUsed}`);
        } catch (error) {
            console.error('❌ Email failed:', error.message);
        }

        res.json({
            success: true,
            message: 'Formulario enviado correctamente',
            details: {
                pdfGenerated,
                emailSent,
                emailService: emailServiceUsed
            }
        });

    } catch (error) {
        console.error('❌ Contact form error:', error);
        res.status(500).json({ error: 'Error al procesar formulario' });
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
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`📧 SendGrid: ${process.env.SENDGRID_API_KEY ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`📄 PDF: ✅ Habilitado`);
    console.log(`🌍 URL: http://localhost:${PORT}`);
    console.log('');
});
