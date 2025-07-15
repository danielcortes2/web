const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const { RateLimiterMemory } = require('rate-limiter-flexible');
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
    const { nombre, email, servicio, presupuesto, mensaje, telefono } = req.body;

    // Validación básica
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Aquí integrarías con tu servicio de email preferido
    // Por ejemplo: SendGrid, Nodemailer, etc.
    
    console.log('Nuevo mensaje de contacto:', {
      nombre,
      email,
      servicio,
      presupuesto,
      mensaje: mensaje.slice(0, 500),
      telefono,
      timestamp: new Date().toISOString()
    });

    // Simular envío exitoso
    res.json({ 
      success: true, 
      message: 'Mensaje enviado correctamente. Te contactaremos pronto.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Error al enviar el mensaje' });
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
