// API endpoint para el chatbot que usa variables de entorno de forma segura
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000', 'https://daniel-cortes.es'],
    credentials: true
}));
app.use(express.json());

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static('../'));

// Sistema de prompts para el chatbot
const SYSTEM_PROMPT = `Eres el asistente virtual profesional de Stratek, la marca de Daniel Cortés, desarrollador web especializado en Barcelona, España. 

IMPORTANTE: 
- NUNCA te presentes como "Soy el asistente virtual de Daniel" en tus respuestas
- NO repitas introducciones en cada mensaje
- Actúa como un asistente virtual experto que ya está en conversación
- Solo saluda brevemente cuando sea apropiado
- Ve directo al punto de la pregunta del usuario

PERSONALIDAD:
- Profesional, útil y directo
- Experto en tecnología pero explicas de forma simple
- Eficiente y no redundante
- Conversacional pero eficiente

SERVICIOS QUE OFRECE STRATEK:
🛠️ Desarrollo Web Frontend/Backend - Desde €800
🤖 Integración de Inteligencia Artificial - Desde €1,200  
📱 Apps Web Progresivas (PWA) - Desde €1,500
🛒 E-commerce y tiendas online - Desde €2,000
💼 Consultoría digital - €400/día
🔧 Soporte y mantenimiento - Desde €150/mes

TECNOLOGÍAS PRINCIPALES:
Frontend: React, Vue.js, HTML5, CSS3, JavaScript
Backend: Node.js, Python, PHP, Express
Bases de datos: MySQL, MongoDB, PostgreSQL
IA: OpenAI, ChatGPT, TensorFlow, Machine Learning
Cloud: AWS, Google Cloud, Digital Ocean

CONTACTO DE DANIEL:
📧 Email: danielcortescasadas6@gmail.com
📱 Teléfono: +34 611 870 010
📍 Ubicación: Barcelona, España
🕐 Horario: Lunes a Viernes 9:00-18:00

INSTRUCCIONES IMPORTANTES PARA FORMATO:
- Responde como asistente virtual de Daniel, no como si fueras Daniel
- JAMÁS te presentes o digas "Soy el asistente virtual" en las respuestas
- Ve directo al punto sin introducciones repetitivas
- Solo saluda si el usuario saluda primero
- Usa emojis moderadamente
- SIEMPRE resalta información importante usando <strong>texto</strong> para negritas
- Destaca precios, servicios, tecnologías y datos de contacto en negrita
- Utiliza saltos de línea HTML (<br><br>) para separar secciones y mejorar legibilidad
- Estructura las respuestas con espacios entre párrafos usando <br><br>
- Agrupa información similar y sepárala visualmente
- Usa listas cuando sea apropiado con bullets (•) 
- Si no sabes algo específico, ofrece contacto directo con Daniel
- Sé conversacional pero eficiente
- Menciona tecnologías específicas cuando sea relevante
- Mantén respuestas bien estructuradas y fáciles de leer
- Si preguntan sobre precios, da rangos pero sugiere presupuesto personalizado
- Siempre mantén el enfoque en ayudar al usuario de forma directa
- ENFÓCATE solo en responder la pregunta específica del usuario`;

// Endpoint para el chatbot
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Mensaje requerido' });
        }

        // Verificar que existe la API key
        if (!process.env.OPENAI_API_KEY) {
            console.log('API key no encontrada, usando respuesta local');
            return res.json({ 
                response: getLocalResponse(message),
                isLocal: true 
            });
        }

        // Construir contexto de conversación
        let messages = [{ role: 'system', content: SYSTEM_PROMPT }];
        
        // Agregar historial de conversación si existe (limitado a últimos 10 mensajes para eficiencia)
        if (conversationHistory && Array.isArray(conversationHistory)) {
            const recentHistory = conversationHistory.slice(-10);
            recentHistory.forEach(msg => {
                if (msg.type === 'user') {
                    messages.push({ role: 'user', content: msg.content });
                } else if (msg.type === 'bot') {
                    messages.push({ role: 'assistant', content: msg.content });
                }
            });
        }
        
        // Agregar el mensaje actual
        messages.push({ role: 'user', content: message });

        // Llamada a OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: process.env.CHATBOT_MODEL || 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: parseInt(process.env.CHATBOT_MAX_TOKENS) || 1000,
                temperature: parseFloat(process.env.CHATBOT_TEMPERATURE) || 0.7
            })
        });

        if (!response.ok) {
            console.log('Error con OpenAI, usando respuesta local');
            return res.json({ 
                response: getLocalResponse(message),
                isLocal: true 
            });
        }

        const data = await response.json();
        res.json({ 
            response: data.choices[0].message.content,
            isLocal: false 
        });

    } catch (error) {
        console.error('Error en chatbot:', error);
        res.json({ 
            response: getLocalResponse(req.body.message),
            isLocal: true 
        });
    }
});

// Respuestas locales de fallback
function getLocalResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('hola') || msg.includes('buenos') || msg.includes('buenas') || msg.includes('hey')) {
        return `¡Hola! 😊 <strong>¿En qué puedo ayudarte?</strong><br><br>
        
        Puedo proporcionarte información sobre:<br><br>
        
        • 🛠️ <strong>Servicios de desarrollo web</strong><br>
        • 💰 <strong>Precios y presupuestos</strong><br>
        • 📞 <strong>Contacto directo con Daniel</strong><br><br>
        
        ¿Qué te interesa saber?`;
    }
    
    if (msg.includes('servicio') || msg.includes('qué haces') || msg.includes('ofreces')) {
        return `<strong>Servicios de desarrollo web que ofrece Daniel:</strong><br><br>
        
        🛠️ <strong>Desarrollo Web</strong> - Desde €800<br>
        &nbsp;&nbsp;&nbsp;• Frontend (React, Vue.js)<br>
        &nbsp;&nbsp;&nbsp;• Backend (Node.js, Python)<br><br>
        
        🤖 <strong>Integración de IA</strong> - Desde €1,200<br>
        &nbsp;&nbsp;&nbsp;• Chatbots inteligentes<br>
        &nbsp;&nbsp;&nbsp;• Automatización<br><br>
        
        📱 <strong>Apps Web Progresivas</strong> - Desde €1,500<br>
        🛒 <strong>E-commerce</strong> - Desde €2,000<br>
        💼 <strong>Consultoría</strong> - €400/día<br><br>
        
        ¿Te interesa algún servicio en particular?`;
    }
    
    if (msg.includes('precio') || msg.includes('cuesta') || msg.includes('coste')) {
        return `<strong>Rangos de precios orientativos:</strong><br><br>
        
        💰 <strong>Desarrollo Web básico:</strong> €800 - €2,000<br>
        💰 <strong>Integración de IA:</strong> €1,200 - €3,000<br>
        💰 <strong>E-commerce completo:</strong> €2,000 - €5,000<br>
        💰 <strong>Apps Web Progresivas:</strong> €1,500 - €4,000<br><br>
        
        <strong>Nota:</strong> Los precios varían según:<br>
        • Complejidad del proyecto<br>
        • Funcionalidades requeridas<br>
        • Tiempo de desarrollo<br><br>
        
        <strong>¿Te gustaría un presupuesto personalizado?</strong><br><br>
        
        📧 danielcortescasadas6@gmail.com<br>
        📱 +34 611 870 010`;
    }
    
    if (msg.includes('contacto') || msg.includes('contactar') || msg.includes('como') && msg.includes('pongo') || msg.includes('email') || msg.includes('teléfono')) {
        return `<strong>Información de contacto de Daniel:</strong><br><br>
        
        📧 <strong>Email:</strong> danielcortescasadas6@gmail.com<br>
        📱 <strong>Teléfono:</strong> +34 611 870 010<br>
        📍 <strong>Ubicación:</strong> Barcelona, España<br>
        🕐 <strong>Horario:</strong> Lunes a Viernes 9:00-18:00<br><br>
        
        <strong>¿Cómo prefieres contactar?</strong><br><br>
        
        • <strong>Email</strong> para consultas detalladas<br>
        • <strong>Teléfono</strong> para conversación directa<br>
        • <strong>Formulario web</strong> en la página<br><br>
        
        ¡Daniel responde en menos de 24 horas! 😊`;
    }
    
    return `<strong>Puedo ayudarte con información sobre:</strong><br><br>
    
    • 🛠️ <strong>Servicios y precios</strong><br>
    &nbsp;&nbsp;&nbsp;Desarrollo web, IA, e-commerce<br><br>
    
    • 🤖 <strong>Integración de IA</strong><br>
    &nbsp;&nbsp;&nbsp;Chatbots y automatización<br><br>
    
    • 💼 <strong>Portfolio y experiencia</strong><br>
    &nbsp;&nbsp;&nbsp;Proyectos anteriores y tecnologías<br><br>
    
    • 📞 <strong>Información de contacto</strong><br>
    &nbsp;&nbsp;&nbsp;Email, teléfono y horarios<br><br>
    
    ¿Hay algo específico en lo que te pueda ayudar?<br><br>
    
    <strong>Contacto directo:</strong><br>
    📧 danielcortescasadas6@gmail.com<br>
    📱 +34 611 870 010`;
}

// Servir archivos estáticos en desarrollo
if (process.env.NODE_ENV === 'development') {
    app.use(express.static('.'));
}

app.listen(PORT, () => {
    console.log(`🚀 Servidor del chatbot ejecutándose en puerto ${PORT}`);
    console.log(`🔑 API Key configurada: ${process.env.OPENAI_API_KEY ? 'Sí' : 'No'}`);
});

module.exports = app;
