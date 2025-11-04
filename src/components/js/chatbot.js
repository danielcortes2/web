// Chatbot principal
class PortfolioChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.conversationHistory = [];
        this.config = window.chatbotConfig;
        this.apiAvailable = false;
        
        // Inicializar inmediatamente
        this.initSync();
        // Verificar API en segundo plano
        this.checkApiAvailability();
    }

    initSync() {
        this.createChatbotHTML();
        this.bindEvents();
        this.loadConversationHistory();
        
        // Solo cargar mensaje de bienvenida si no hay historial
        if (this.conversationHistory.length === 0) {
            this.loadWelcomeMessage();
        } else {
            // Si hay historial, restaurar los mensajes
            this.restoreConversationMessages();
        }
    }

    async checkApiAvailability() {
        try {
            const response = await fetch('/api/config');
            if (response.ok) {
                const config = await response.json();
                this.apiAvailable = config.hasApiKey;
                
                // Actualizar configuración del chatbot
                if (this.config) {
                    this.config.hasApiAccess = this.apiAvailable;
                }
                
                console.log(`Chatbot API status: ${this.apiAvailable ? 'Available' : 'Unavailable (using local responses)'}`);
            }
        } catch (error) {
            console.warn('Could not check API availability:', error);
            this.apiAvailable = false;
        }
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <!-- Botón flotante del chatbot -->
            <div class="chatbot-trigger" id="chatbotTrigger">
                <i class="fas fa-comments"></i>
                <span class="chatbot-badge" id="chatbotBadge">1</span>
            </div>

            <!-- Ventana del chatbot -->
            <div class="chatbot-container" id="chatbotContainer">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="chatbot-info">
                            <h4>Asistente IA</h4>
                            <span class="chatbot-status">
                                <i class="fas fa-circle online"></i>
                                En línea
                            </span>
                        </div>
                    </div>
                    <div class="chatbot-controls">
                        <button class="chatbot-minimize" id="chatbotMinimize">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="chatbot-close" id="chatbotClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div class="chatbot-messages" id="chatbotMessages">
                    <!-- Los mensajes se insertan aquí dinámicamente -->
                </div>

                <div class="chatbot-input-container">
                    <div class="chatbot-suggestions" id="chatbotSuggestions">
                        <button class="suggestion-btn" data-message="¿Qué servicios ofreces?">
                            ¿Qué servicios ofreces?
                        </button>
                        <button class="suggestion-btn" data-message="¿Cuánto cuesta un sitio web?">
                            ¿Cuánto cuesta un sitio web?
                        </button>
                        <button class="suggestion-btn" data-message="¿Trabajas con IA?">
                            ¿Trabajas con IA?
                        </button>
                        <button class="suggestion-btn" data-message="¿Cómo puedo contactarte?">
                            ¿Cómo puedo contactarte?
                        </button>
                    </div>
                    
                    <div class="chatbot-input-wrapper">
                        <input 
                            type="text" 
                            class="chatbot-input" 
                            id="chatbotInput" 
                            placeholder="Escribe tu mensaje..."
                            maxlength="500"
                        >
                        <button class="chatbot-send" id="chatbotSend">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    
                    <div class="chatbot-typing-indicator" id="chatbotTyping">
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span>El asistente está escribiendo...</span>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    bindEvents() {
        // Abrir/cerrar chatbot
        document.getElementById('chatbotTrigger').addEventListener('click', () => {
            this.toggleChatbot();
        });

        document.getElementById('chatbotClose').addEventListener('click', () => {
            this.closeChatbot();
        });

        document.getElementById('chatbotMinimize').addEventListener('click', () => {
            this.minimizeChatbot();
        });

        // Enviar mensaje
        document.getElementById('chatbotSend').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('chatbotInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Sugerencias rápidas
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-btn')) {
                const message = e.target.dataset.message;
                this.sendMessage(message);
            }
        });

        // Auto-resize del input
        const input = document.getElementById('chatbotInput');
        input.addEventListener('input', () => {
            this.adjustInputHeight();
        });
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        this.isOpen = true;
        const container = document.getElementById('chatbotContainer');
        const trigger = document.getElementById('chatbotTrigger');
        const badge = document.getElementById('chatbotBadge');
        
        container.classList.add('open');
        trigger.classList.add('active');
        badge.style.display = 'none';
        
        // Focus en el input
        setTimeout(() => {
            document.getElementById('chatbotInput').focus();
        }, 300);

        // Scroll to bottom
        this.scrollToBottom();
    }

    closeChatbot() {
        this.isOpen = false;
        const container = document.getElementById('chatbotContainer');
        const trigger = document.getElementById('chatbotTrigger');
        
        container.classList.remove('open');
        trigger.classList.remove('active');
    }

    minimizeChatbot() {
        this.closeChatbot();
    }

    loadWelcomeMessage() {
        const aiStatus = this.apiAvailable ? '🤖 **Powered by OpenAI**' : '🔧 **Modo Local**';
        
        const welcomeMessage = {
            type: 'bot',
            content: `¡Hola! 👋 ${aiStatus}

Puedo ayudarte con información sobre Daniel Cortés:
• 💼 **Servicios y precios** de desarrollo web
• 🛠️ **Consultas técnicas** sobre tecnologías
• 📞 **Información de contacto** y disponibilidad
• 🚀 **Presupuestos personalizados** para tu proyecto

¿En qué puedo ayudarte hoy?`,
            timestamp: Date.now()
        };

        this.addMessage(welcomeMessage);
    }

    async sendMessage(messageText = null) {
        const input = document.getElementById('chatbotInput');
        const message = messageText || input.value.trim();
        
        if (!message) return;

        // Limpiar input
        if (!messageText) {
            input.value = '';
            this.adjustInputHeight();
        }

        // Ocultar sugerencias
        this.hideSuggestions();

        // Agregar mensaje del usuario
        const userMessage = {
            type: 'user',
            content: message,
            timestamp: Date.now()
        };

        this.addMessage(userMessage);
        this.saveMessage(userMessage);

        // Mostrar indicador de escritura
        this.showTypingIndicator();

        try {
            // Generar respuesta del bot
            const botResponse = await this.generateBotResponse(message);
            
            // Ocultar indicador de escritura
            this.hideTypingIndicator();

            // Agregar respuesta del bot
            const botMessage = {
                type: 'bot',
                content: botResponse,
                timestamp: Date.now()
            };

            this.addMessage(botMessage);
            this.saveMessage(botMessage);

        } catch (error) {
            console.error('Error generating bot response:', error);
            this.hideTypingIndicator();
            
            const errorMessage = {
                type: 'bot',
                content: 'Lo siento, he tenido un problema técnico. ¿Podrías intentar de nuevo? Si el problema persiste, puedes contactar directamente a Daniel en danielcortescasadas6@gmail.com o al +34 611 87 00 10.',
                timestamp: Date.now()
            };

            this.addMessage(errorMessage);
        }
    }

    async generateBotResponse(userMessage) {
        // Intentar usar la API de OpenAI primero
        if (this.config && this.config.hasApiAccess) {
            try {
                return await this.callOpenAI(userMessage);
            } catch (error) {
                console.warn('OpenAI API failed, falling back to local responses:', error);
                // Fallback a respuestas locales si la API falla
                return this.getLocalResponse(userMessage);
            }
        }
        
        // Usar respuestas locales como fallback
        return this.getLocalResponse(userMessage);
    }

    async callOpenAI(userMessage) {
        const response = await fetch(this.config.apiEndpoint || '/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                conversationHistory: this.messages
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            
            if (response.status === 429) {
                throw new Error(`Rate limit exceeded. Please wait ${errorData.retryAfter || 60} seconds.`);
            } else if (response.status === 503 && errorData.fallback) {
                throw new Error('API service temporarily unavailable');
            } else {
                throw new Error(`API error: ${errorData.error || 'Unknown error'}`);
            }
        }

        const data = await response.json();
        
        if (data.isLocal) {
            console.log('Using local fallback response');
        }

        return data.response || 'Lo siento, no pude generar una respuesta adecuada.';
    }

    getLocalResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Respuestas locales basadas en palabras clave
        if (message.includes('servicio') || message.includes('qué haces') || message.includes('ofreces')) {
            return `Ofrezco los siguientes servicios profesionales:

🖥️ **Desarrollo Web** - Desde €800
Sitios modernos, responsivos y optimizados

🤖 **Integración de IA** - Desde €1,200
Chatbots, automatización y análisis de datos

📱 **Apps Web Progresivas** - Desde €1,500
Aplicaciones que funcionan como apps nativas

🛒 **E-commerce** - Desde €2,000
Tiendas online completas con gestión

💼 **Consultoría Digital** - Desde €400
Auditorías y estrategias de crecimiento

🔧 **Soporte & Mantenimiento** - Desde €150/mes
Mantenimiento continuo y soporte 24/7

¿Te interesa algún servicio en particular?`;
        }

        if (message.includes('precio') || message.includes('cuesta') || message.includes('coste') || message.includes('tarifa')) {
            return `💰 **Precios de servicios:**

• **Desarrollo Web básico**: €800 - €2,000
• **Integración de IA**: €1,200 - €3,000
• **E-commerce completo**: €2,000 - €5,000
• **Apps Web Progresivas**: €1,500 - €4,000
• **Consultoría por hora**: €50 - €100
• **Mantenimiento mensual**: €150 - €500

Los precios varían según la complejidad del proyecto. ¿Te gustaría recibir un presupuesto personalizado?`;
        }

        if (message.includes('ia') || message.includes('inteligencia artificial') || message.includes('ai') || message.includes('chatbot')) {
            return `🤖 **Sí, me especializo en Inteligencia Artificial:**

✅ **Chatbots inteligentes** como este
✅ **Análisis de datos automatizado**
✅ **Procesamiento de lenguaje natural**
✅ **Machine Learning personalizado**
✅ **Integración con GPT y otros LLMs**
✅ **Automatización de procesos**

Tecnologías que uso:
• OpenAI GPT-4, Claude, Llama
• Python, TensorFlow, PyTorch
• APIs de IA (OpenAI, Anthropic, Google)
• Node.js para integraciones

¿Tienes algún proyecto de IA en mente?`;
        }

        if (message.includes('contacto') || message.includes('contactar') || message.includes('hablar')) {
            return `📞 **¿Listo para empezar tu proyecto?**

**Email**: danielcortescasadas6@gmail.com
**Teléfono**: +34 611 87 00 10
**Ubicación**: Barcelona, España
**Horario**: Lun-Vie 9:00-18:00

**Redes sociales:**
• LinkedIn: linkedin.com/in/danielcortes
• GitHub: github.com/danielcortes

También puedes usar el formulario de contacto en la página para recibir una respuesta en menos de 2 horas. ¡Conversemos sobre tu proyecto!`;
        }

        if (message.includes('portfolio') || message.includes('proyectos') || message.includes('trabajos')) {
            return `🎯 **Mi experiencia:**

**50+ proyectos completados**
**98% satisfacción del cliente**
**24/7 soporte técnico**

**Algunos proyectos destacados:**
• Plataformas de e-commerce con IA
• Aplicaciones web con chatbots
• Sistemas de análisis de datos
• Apps móviles progresivas

**Tecnologías principales:**
• Frontend: React, Vue.js, Next.js
• Backend: Node.js, Python, FastAPI
• Bases de datos: PostgreSQL, MongoDB
• Cloud: AWS, Google Cloud, Vercel

¿Te gustaría ver algún proyecto específico o conocer más detalles?`;
        }

        if (message.includes('experiencia') || message.includes('sobre ti') || message.includes('quien eres')) {
            return `👨‍💻 **Sobre Daniel Cortés:**

Daniel es un desarrollador web full-stack especializado en integrar inteligencia artificial en soluciones digitales modernas. 

**Su enfoque:**
• Transformar ideas en experiencias digitales excepcionales
• Desarrollo de alto rendimiento y escalable
• Integración nativa de IA generativa
• Soluciones que hacen crecer negocios

**Especialidades:**
• React, Node.js, Python
• OpenAI, Claude, Llama
• AWS, Google Cloud
• E-commerce y automatización

Ubicado en Barcelona, trabaja con clientes de toda España y Europa. ¿Te gustaría conocer cómo puede ayudar con tu proyecto?`;
        }

        // Respuesta por defecto
        return `Gracias por tu mensaje. Puedo ayudarte con información sobre:

• 🛠️ **Servicios y precios**
• 🤖 **Integración de IA**
• 💼 **Portfolio y experiencia**
• 📞 **Información de contacto**
• 🚀 **Consulta de proyectos**

¿Hay algo específico en lo que te pueda ayudar? También puedes contactar directamente:
📧 danielcortescasadas6@gmail.com
📱 +34 611 87 00 10`;
    }

    addMessage(message, saveToHistory = true) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageElement = this.createMessageElement(message);
        
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();

        // Animación de entrada
        setTimeout(() => {
            messageElement.classList.add('visible');
        }, 100);

        // Solo guardar en historial si se especifica
        if (saveToHistory) {
            this.messages.push(message);
        }
    }

    createMessageElement(message) {
        const div = document.createElement('div');
        div.className = `chatbot-message ${message.type}`;
        
        const time = new Date(message.timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });

        if (message.type === 'bot') {
            div.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">${this.formatMessage(message.content)}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${this.escapeHtml(message.content)}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;
        }

        return div;
    }

    formatMessage(content) {
        // Convertir markdown básico a HTML
        let formatted = this.escapeHtml(content);
        
        // Negrita
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Enlaces
        formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        
        // Saltos de línea
        formatted = formatted.replace(/\n/g, '<br>');
        
        // Emojis y bullets
        formatted = formatted.replace(/•/g, '•');
        
        return formatted;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showTypingIndicator() {
        this.isTyping = true;
        const typingIndicator = document.getElementById('chatbotTyping');
        typingIndicator.classList.add('visible');
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('chatbotTyping');
        typingIndicator.classList.remove('visible');
    }

    hideSuggestions() {
        const suggestions = document.getElementById('chatbotSuggestions');
        if (this.messages.length === 0) {
            suggestions.style.display = 'none';
        }
    }

    adjustInputHeight() {
        const input = document.getElementById('chatbotInput');
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    saveMessage(message) {
        this.conversationHistory.push(message);
        
        // Mantener solo los últimos 50 mensajes
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }

        // Guardar en localStorage
        try {
            localStorage.setItem('chatbot_history', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.warn('Could not save conversation to localStorage:', error);
        }
    }

    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('chatbot_history');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Could not load conversation from localStorage:', error);
            this.conversationHistory = [];
        }
    }

    restoreConversationMessages() {
        // Restaurar los últimos mensajes del historial para mostrar en el chat
        const recentMessages = this.conversationHistory.slice(-10); // Últimos 10 mensajes
        
        recentMessages.forEach(msg => {
            if (msg.type === 'user' || msg.type === 'bot') {
                this.addMessage(msg, false); // false para no guardar en historial nuevamente
            }
        });
    }

    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('chatbot_history');
        
        // Limpiar mensajes visuales
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.innerHTML = '';
        
        // Recargar mensaje de bienvenida
        this.loadWelcomeMessage();
        
        // Mostrar sugerencias
        document.getElementById('chatbotSuggestions').style.display = 'flex';
    }
}

// NO inicializar aquí - se inicializa desde main.js
