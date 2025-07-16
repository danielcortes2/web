const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const pdfGenerator = require('./utils/pdfGenerator');
const emailService = require('./utils/emailService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 60 seconds
});

const chatLimiter = new RateLimiterMemory({
  points: 20, // 20 chat messages
  duration: 300, // per 5 minutes
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com"]
    }
  }
}));

app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://danielcortes.dev', 'https://www.danielcortes.dev'] 
    : ['http://localhost:3000', 'http://127.0.0.1:5500'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.static('.', {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.endsWith('.js') || path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Rate limiting middleware
const rateLimitMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000)
    });
  }
};

const chatLimitMiddleware = async (req, res, next) => {
  try {
    await chatLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'Chat rate limit exceeded. Please wait before sending more messages.',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000)
    });
  }
};

// Configuración de OpenAI
let openai = null;
if (process.env.OPENAI_API_KEY) {
  const { OpenAI } = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Rutas de API
app.get('/api/config', rateLimitMiddleware, (req, res) => {
  res.json({
    hasApiKey: !!process.env.OPENAI_API_KEY,
    model: process.env.CHATBOT_MODEL || 'gpt-3.5-turbo',
    appName: process.env.APP_NAME || 'Stratek Portfolio'
  });
});

app.post('/api/chat', chatLimitMiddleware, async (req, res) => {
  try {
    const { messages, model = 'gpt-3.5-turbo' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!openai) {
      return res.status(503).json({ 
        error: 'OpenAI service not available',
        fallback: true 
      });
    }

    // Validar que no haya demasiados mensajes
    if (messages.length > 50) {
      return res.status(400).json({ error: 'Too many messages in conversation' });
    }

    // Filtrar mensajes para seguridad
    const filteredMessages = messages.map(msg => ({
      role: ['system', 'user', 'assistant'].includes(msg.role) ? msg.role : 'user',
      content: typeof msg.content === 'string' ? msg.content.slice(0, 2000) : ''
    }));

    const completion = await openai.chat.completions.create({
      model: model,
      messages: filteredMessages,
      max_tokens: parseInt(process.env.CHATBOT_MAX_TOKENS) || 1000,
      temperature: parseFloat(process.env.CHATBOT_TEMPERATURE) || 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    res.json({
      message: completion.choices[0].message.content,
      usage: completion.usage
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error.code === 'insufficient_quota') {
      res.status(503).json({ 
        error: 'API quota exceeded', 
        fallback: true 
      });
    } else if (error.code === 'rate_limit_exceeded') {
      res.status(429).json({ 
        error: 'API rate limit exceeded', 
        retryAfter: 60 
      });
    } else {
      res.status(500).json({ 
        error: 'Internal server error', 
        fallback: true 
      });
    }
  }
});

// Endpoint para formulario de contacto
app.post('/api/contact', rateLimitMiddleware, async (req, res) => {
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

    console.log('📝 Processing contact form submission:', {
      nombre,
      email,
      servicio,
      timestamp: new Date().toISOString()
    });

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
    let errors = [];

    try {
      // Generar PDF
      console.log('📄 Generating PDF...');
      pdfBuffer = await pdfGenerator.generateContactFormPDF(normalizedData);
      console.log('✅ PDF generated successfully');
    } catch (pdfError) {
      console.error('❌ PDF generation failed:', pdfError);
      errors.push('Error generating PDF');
    }

    try {
      // Enviar email con PDF adjunto
      if (emailService.transporter && pdfBuffer) {
        console.log('📧 Sending email...');
        await emailService.sendContactFormEmail(normalizedData, pdfBuffer);
        emailSent = true;
        console.log('✅ Email sent successfully');
      } else {
        console.log('⚠️ Email service not configured or PDF not available');
        errors.push('Email service not configured');
      }
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      errors.push('Error sending email');
    }

    // Respuesta exitosa (incluso si falla PDF o email)
    res.json({
      success: true,
      message: 'Formulario enviado correctamente. Te contactaremos pronto.',
      details: {
        pdfGenerated: !!pdfBuffer,
        emailSent: emailSent,
        timestamp: new Date().toISOString(),
        errors: errors.length > 0 ? errors : undefined
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

// Endpoint para generar presupuesto en PDF
app.post('/api/quote', rateLimitMiddleware, async (req, res) => {
  try {
    const formData = req.body;
    const { nombre, email, servicio, presupuesto, mensaje, telefono } = formData;

    // Validación básica
    if (!nombre || !email || !servicio) {
      return res.status(400).json({ error: 'Faltan campos requeridos para el presupuesto' });
    }

    console.log('💰 Processing quote request:', { nombre, email, servicio });

    // Calcular presupuesto basado en el servicio
    const quoteData = calculateQuote(servicio, formData);
    
    const normalizedData = {
      name: nombre,
      email,
      phone: telefono,
      service: servicio,
      budget: presupuesto,
      message: mensaje
    };

    let pdfBuffer = null;
    let emailSent = false;

    try {
      // Generar PDF del presupuesto
      console.log('📄 Generating quote PDF...');
      pdfBuffer = await pdfGenerator.generateQuotePDF(normalizedData, quoteData);
      console.log('✅ Quote PDF generated successfully');

      // Enviar email con presupuesto
      if (emailService.transporter) {
        console.log('📧 Sending quote email...');
        await emailService.sendQuoteEmail(normalizedData, pdfBuffer, quoteData);
        emailSent = true;
        console.log('✅ Quote email sent successfully');
      }
    } catch (error) {
      console.error('❌ Error processing quote:', error);
    }

    res.json({
      success: true,
      message: 'Presupuesto generado correctamente',
      quote: quoteData,
      details: {
        pdfGenerated: !!pdfBuffer,
        emailSent: emailSent,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Quote generation error:', error);
    res.status(500).json({ 
      error: 'Error al generar el presupuesto' 
    });
  }
});

// Función para calcular presupuestos
function calculateQuote(servicio, formData) {
  const baseQuotes = {
    'Desarrollo Web': {
      base: 800,
      items: [
        { name: 'Diseño y maquetación', price: 300 },
        { name: 'Desarrollo frontend', price: 400 },
        { name: 'Optimización SEO', price: 100 }
      ]
    },
    'Integración de IA': {
      base: 1200,
      items: [
        { name: 'Análisis de requerimientos', price: 200 },
        { name: 'Integración de API IA', price: 600 },
        { name: 'Entrenamiento y configuración', price: 400 }
      ]
    },
    'Apps Web Progresivas': {
      base: 1500,
      items: [
        { name: 'Desarrollo PWA', price: 800 },
        { name: 'Service Worker', price: 300 },
        { name: 'Configuración offline', price: 200 },
        { name: 'Notificaciones push', price: 200 }
      ]
    },
    'E-commerce': {
      base: 2000,
      items: [
        { name: 'Desarrollo tienda online', price: 1000 },
        { name: 'Pasarela de pagos', price: 400 },
        { name: 'Panel administrativo', price: 400 },
        { name: 'Sistema de inventario', price: 200 }
      ]
    },
    'Consultoría Digital': {
      base: 400,
      items: [
        { name: 'Auditoría técnica', price: 200 },
        { name: 'Informe detallado', price: 100 },
        { name: 'Sesión de consultoría', price: 100 }
      ]
    }
  };

  const quote = baseQuotes[servicio] || baseQuotes['Desarrollo Web'];
  
  // Ajustes basados en presupuesto
  let multiplier = 1;
  if (formData.presupuesto === 'Más de €5,000') {
    multiplier = 1.3;
  } else if (formData.presupuesto === '€2,000 - €5,000') {
    multiplier = 1.1;
  }

  const adjustedItems = quote.items.map(item => ({
    ...item,
    price: Math.round(item.price * multiplier)
  }));

  const total = adjustedItems.reduce((sum, item) => sum + item.price, 0);

  return {
    service: servicio,
    items: adjustedItems,
    total: total,
    basePrice: quote.base,
    multiplier: multiplier,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')
  };
}

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Chatbot: ${openai ? 'OpenAI Connected' : 'Local Mode'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
