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

// CORS para desarrollo y producción
const allowedOrigins = [
    'https://stratek.es',
    'https://www.stratek.es',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5501',
    'http://127.0.0.1:5502'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    } else {
        res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

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
        const { nombre, email, servicio, presupuesto, mensaje, telefono, timeline } = req.body;

        // Validación básica
        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, error: 'Email inválido' });
        }

        console.log('📝 Processing contact form:', { nombre, email, servicio });

        // Datos normalizados
        const formData = {
            name: nombre,
            email,
            phone: telefono,
            service: servicio,
            budget: presupuesto,
            timeline,
            message: mensaje
        };

        let pdfBuffer = null;
        let pdfGenerated = false;
        let emailSent = false;
        let emailServiceUsed = null;
        let errorMessage = null;

        // Generar PDF
        console.log('📄 Iniciando generación de PDF...');
        try {
            const { createContactPDF } = require('./utils/pdfGenerator');
            pdfBuffer = await createContactPDF(formData);
            pdfGenerated = !!pdfBuffer;
            console.log(`✅ PDF generated successfully: ${pdfGenerated} (${pdfBuffer ? pdfBuffer.length : 0} bytes)`);
        } catch (error) {
            errorMessage = 'No se pudo generar el PDF';
            console.error('❌ PDF generation failed:', error.message);
            console.error('❌ PDF error stack:', error.stack);
        }

        // Enviar email con PDF adjunto
        console.log('📧 Iniciando envío de email...');
        try {
            const result = await emailService.sendContactFormEmail(formData, pdfBuffer);
            if (result && result.service) {
                emailSent = true;
                emailServiceUsed = result.service;
                console.log(`✅ Email sent successfully via ${emailServiceUsed}`);
                console.log(`📧 Email details:`, {
                    service: emailServiceUsed,
                    to: process.env.EMAIL_TO || process.env.SENDGRID_TO_EMAIL,
                    pdfAttached: !!pdfBuffer
                });
            } else {
                errorMessage = result && result.error ? result.error : 'No se pudo enviar el email';
                emailSent = false;
                console.error('❌ Email sending failed - no result or service');
            }
        } catch (error) {
            errorMessage = error.message || 'No se pudo enviar el email';
            emailSent = false;
            console.error('❌ Email sending failed with error:', error.message);
            console.error('❌ Email error stack:', error.stack);
        }

        // Siempre responder con JSON válido
        const responseData = {
            success: emailSent,
            message: emailSent ? 'Formulario enviado correctamente' : (errorMessage || 'Error al enviar'),
            details: {
                pdfGenerated,
                emailSent,
                emailService: emailServiceUsed,
                errors: errorMessage ? [errorMessage] : []
            }
        };

        // Usar status 200 siempre para que el frontend pueda leer el JSON
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(responseData);

    } catch (error) {
        console.error('❌ Contact form error:', error);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ 
            success: false, 
            error: error.message || 'Error al procesar formulario',
            details: {
                pdfGenerated: false,
                emailSent: false,
                emailService: null,
                errors: [error.message || 'Error interno del servidor']
            }
        });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Healthcheck endpoint para producción
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        env: process.env.NODE_ENV || 'development',
        port: PORT,
        email: {
            sendgridConfigured: !!process.env.SENDGRID_API_KEY,
            gmailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
            to: process.env.SENDGRID_TO_EMAIL || process.env.EMAIL_TO || null,
            from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM || null
        },
        time: new Date().toISOString()
    });
});

// Manejo de errores 404

// Manejo de errores 404 (si la ruta no existe, responde JSON)
app.use((req, res, next) => {
    if (req.accepts('json')) {
        res.status(404).json({ success: false, error: 'Ruta no encontrada' });
    } else {
        res.status(404).sendFile(path.join(__dirname, 'index.html'));
    }
});

// Middleware global de manejo de errores (si ocurre cualquier error, responde JSON)
app.use((err, req, res, next) => {
    console.error('❌ Error global:', err);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`📧 SendGrid: ${process.env.SENDGRID_API_KEY ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`📄 PDF: ✅ Habilitado`);
    console.log(`🌍 URL: http://localhost:${PORT}`);
    console.log('');
});
