// JavaScript principal para el sitio web

// Configuración y estado global
const AppState = {
    isMenuOpen: false,
    activeFilter: 'all',
    conversationHistory: [] // Añadir historial de conversación
};

// Inicialización cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initPortfolioFilters();
    initContactForm();
    initMobileMenu();
    initScrollEffects();
    initAnimations();
    initTypingEffect();
    
    // Inicializar chatbot de forma simple y directa
    initChatbotSimple();
}

// === INICIALIZACIÓN SIMPLE DEL CHATBOT ===
function initChatbotSimple() {
    console.log('� Inicializando chatbot de forma simple...');
    
    // Crear botón del chatbot inmediatamente
    setTimeout(() => {
        if (!document.getElementById('chatbotTrigger')) {
            createSimpleChatbot();
        }
    }, 1000);
}

function createSimpleChatbot() {
    console.log('🤖 Creando chatbot simple...');
    
    // Crear el botón flotante
    const trigger = document.createElement('div');
    trigger.id = 'chatbotTrigger';
    trigger.className = 'chatbot-trigger';
    trigger.innerHTML = `
        <i class="fas fa-comments"></i>
        <span class="chatbot-badge">1</span>
    `;
    
    // Estilos del botón
    trigger.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        color: white;
        font-size: 1.5rem;
        transition: all 0.3s ease;
    `;
    
    // Crear el contenedor del chat
    const container = document.createElement('div');
    container.id = 'chatbotContainer';
    container.className = 'chatbot-container';
    container.innerHTML = `
        <div class="chatbot-header">
            <div class="chatbot-header-info">
                <div class="chatbot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="chatbot-info">
                    <h4>Asistente Virtual</h4>
                    <span class="chatbot-status">
                        <i class="fas fa-circle online"></i>
                        En línea
                    </span>
                </div>
            </div>
            <div class="chatbot-controls">
                <button class="chatbot-close" onclick="closeChatbot()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        
        <div class="chatbot-messages" id="chatbotMessages">
            <div class="chatbot-message bot visible">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">
                        ¡Hola! 👋 <strong>¿En qué puedo ayudarte?</strong><br><br>
                        
                        Puedo proporcionarte información sobre:<br>
                        • 💼 <strong>Servicios y precios</strong> de desarrollo web<br>
                        • 🛠️ <strong>Consultas técnicas</strong> sobre tecnologías<br>
                        • 📞 <strong>Contacto directo</strong> con Daniel<br>
                        • 🚀 <strong>Presupuestos personalizados</strong> para tu proyecto<br><br>
                        ¿Qué te interesa saber?
                    </div>
                </div>
            </div>
        </div>
        
        <div class="chatbot-input-container">
            <div class="chatbot-suggestions" id="chatbotSuggestions">
                <button class="suggestion-btn" onclick="sendQuickMessage('¿Qué servicios ofreces?')">
                    ¿Qué servicios ofreces?
                </button>
                <button class="suggestion-btn" onclick="sendQuickMessage('¿Cuánto cuesta un sitio web?')">
                    ¿Cuánto cuesta un sitio web?
                </button>
                <button class="suggestion-btn" onclick="sendQuickMessage('¿Trabajas con IA?')">
                    ¿Trabajas con IA?
                </button>
                <button class="suggestion-btn" onclick="sendQuickMessage('¿Cómo puedo contactarte?')">
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
                    onkeypress="if(event.key==='Enter') sendChatMessage()"
                >
                <button class="chatbot-send" onclick="sendChatMessage()">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    // Estilos del contenedor
    container.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 380px;
        height: 500px;
        background: var(--bg-primary, #0f172a);
        border: 1px solid var(--bg-tertiary, #334155);
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        display: none;
        flex-direction: column;
        z-index: 1000;
        overflow: hidden;
    `;
    
    // Añadir eventos
    trigger.addEventListener('click', toggleChatbot);
    trigger.addEventListener('mouseenter', () => {
        trigger.style.transform = 'scale(1.1) translateY(-2px)';
    });
    trigger.addEventListener('mouseleave', () => {
        trigger.style.transform = 'scale(1) translateY(0)';
    });
    
    // Añadir al DOM
    document.body.appendChild(trigger);
    document.body.appendChild(container);
    
    console.log('✅ Chatbot simple creado correctamente');
}

// Funciones globales para el chatbot
window.toggleChatbot = function() {
    const container = document.getElementById('chatbotContainer');
    const trigger = document.getElementById('chatbotTrigger');
    
    if (container.style.display === 'none' || !container.style.display) {
        container.style.display = 'flex';
        trigger.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        trigger.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        container.style.display = 'none';
        trigger.style.background = 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)';
        trigger.innerHTML = '<i class="fas fa-comments"></i><span class="chatbot-badge">1</span>';
    }
};

window.closeChatbot = function() {
    const container = document.getElementById('chatbotContainer');
    const trigger = document.getElementById('chatbotTrigger');
    
    container.style.display = 'none';
    trigger.style.background = 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)';
    trigger.innerHTML = '<i class="fas fa-comments"></i><span class="chatbot-badge">1</span>';
};

window.sendQuickMessage = function(message) {
    document.getElementById('chatbotInput').value = message;
    sendChatMessage();
};

window.sendChatMessage = function() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Añadir mensaje del usuario
    addChatMessage(message, 'user');
    input.value = '';
    
    // Ocultar sugerencias después del primer mensaje
    const suggestions = document.getElementById('chatbotSuggestions');
    if (suggestions) {
        suggestions.style.display = 'none';
    }
    
    // Mostrar mensaje de "escribiendo..." con nombre personalizado
    const typingMessage = addTypingMessage();
    
    // Intentar respuesta con OpenAI primero
    sendToOpenAI(message)
        .then(response => {
            removeTypingMessage(typingMessage);
            addChatMessage(response, 'bot');
        })
        .catch(error => {
            console.warn('Error con OpenAI, usando respuesta local:', error);
            removeTypingMessage(typingMessage);
            
            // Solo usar fallback si hay un error real con la API
            setTimeout(() => {
                const fallbackResponse = getChatbotResponse(message);
                addChatMessage(fallbackResponse + '<br><br><em>💡 Nota: Respuesta local (OpenAI no disponible)</em>', 'bot');
            }, 500);
        });
};

function addChatMessage(message, type) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${type} visible`;
    
    const time = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Agregar al historial de conversación
    AppState.conversationHistory.push({
        type: type,
        content: message,
        timestamp: Date.now()
    });
    
    if (type === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${message}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getChatbotResponse(message) {
    const msg = message.toLowerCase();
    
    // Respuestas para saludos
    if (msg.includes('hola') || msg.includes('buenos') || msg.includes('buenas') || msg.includes('hey')) {
        return `¡Hola! 😊<br><br>¿En qué puedo ayudarte hoy?`;
    }
    
    if (msg.includes('servicio') || msg.includes('qué haces') || msg.includes('ofreces')) {
        return `<strong>Servicios profesionales de Daniel:</strong><br><br>
        
        🖥️ <strong>Desarrollo Web</strong><br>
        • Sitios web modernos y responsivos<br>
        • Desde <strong>€800</strong><br><br>
        
        🤖 <strong>Integración de IA</strong><br>
        • Chatbots y automatización<br>
        • Desde <strong>€1,200</strong><br><br>
        
        📱 <strong>Apps Web Progresivas</strong><br>
        • Aplicaciones instalables<br>
        • Desde <strong>€1,500</strong><br><br>
        
        🛒 <strong>E-commerce</strong><br>
        • Tiendas online completas<br>
        • Desde <strong>€2,000</strong><br><br>
        
        💼 <strong>Consultoría Digital</strong><br>
        • Auditorías y estrategias<br>
        • Desde <strong>€400/día</strong><br><br>
        
        🔧 <strong>Soporte & Mantenimiento</strong><br>
        • Soporte técnico 24/7<br>
        • Desde <strong>€150/mes</strong><br><br>
        
        ¿Te interesa algún servicio en particular?`;
    }
    
    if (msg.includes('precio') || msg.includes('cuesta') || msg.includes('coste')) {
        return `💰 <strong>Información de precios:</strong><br><br>
        
        <strong>• Desarrollo Web básico:</strong><br>
        &nbsp;&nbsp;&nbsp;€800 - €2,000<br><br>
        
        <strong>• Integración de IA:</strong><br>
        &nbsp;&nbsp;&nbsp;€1,200 - €3,000<br><br>
        
        <strong>• E-commerce completo:</strong><br>
        &nbsp;&nbsp;&nbsp;€2,000 - €5,000<br><br>
        
        <strong>• Apps Web Progresivas:</strong><br>
        &nbsp;&nbsp;&nbsp;€1,500 - €4,000<br><br>
        
        <strong>• Consultoría Digital:</strong><br>
        &nbsp;&nbsp;&nbsp;€400/día<br><br>
        
        <strong>• Soporte mensual:</strong><br>
        &nbsp;&nbsp;&nbsp;€150/mes<br><br>
        
        Los precios varían según la complejidad del proyecto.<br><br>
        
        ¿Te gustaría un <strong>presupuesto personalizado</strong>?`;
    }
    
    if (msg.includes('ia') || msg.includes('inteligencia artificial') || msg.includes('ai')) {
        return `🤖 <strong>Especialización en Inteligencia Artificial:</strong><br><br>
        
        <strong>Servicios de IA disponibles:</strong><br><br>
        
        ✅ <strong>Chatbots inteligentes</strong><br>
        &nbsp;&nbsp;&nbsp;Como este que estás usando<br><br>
        
        ✅ <strong>Análisis de datos automatizado</strong><br>
        &nbsp;&nbsp;&nbsp;Procesamiento y insights automáticos<br><br>
        
        ✅ <strong>Procesamiento de lenguaje natural</strong><br>
        &nbsp;&nbsp;&nbsp;Análisis de texto y contenido<br><br>
        
        ✅ <strong>Integración con GPT y otros LLMs</strong><br>
        &nbsp;&nbsp;&nbsp;Conexión con APIs de IA<br><br>
        
        <strong>Tecnologías utilizadas:</strong><br>
        <strong>OpenAI • Python • TensorFlow • Node.js</strong><br><br>
        
        ¿Tienes algún <strong>proyecto de IA</strong> en mente?`;
    }
    
    if (msg.includes('contacto') || msg.includes('contactar') || msg.includes('como') && msg.includes('pongo') || msg.includes('email') || msg.includes('teléfono')) {
        return `📞 <strong>Información de contacto:</strong><br><br>
        
        <strong>📧 Email:</strong><br>
        danielcortescasadas6@gmail.com<br><br>
        
        <strong>📱 Teléfono:</strong><br>
        +34 611 870 010<br><br>
        
        <strong>📍 Ubicación:</strong><br>
        Barcelona, España<br><br>
        
        <strong>🕐 Horario de atención:</strong><br>
        Lunes a Viernes: 9:00 - 18:00<br><br>
        
        <strong>💬 Otras opciones:</strong><br>
        • Formulario de contacto en esta página<br>
        • Respuesta garantizada en 24h<br>
        • Consulta inicial gratuita<br><br>
        
        ¡Daniel estará encantado de ayudarte con tu proyecto!`;
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

// === NAVEGACIÓN ===
function scrollToContact() {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
        contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function scrollToPortfolio() {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
        portfolioSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// === PORTFOLIO FILTERS ===
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            AppState.activeFilter = filter;
            
            // Actualizar botones activos
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filtrar proyectos con animación
            filterProjects(projects, filter);
        });
    });
}

function filterProjects(projects, filter) {
    projects.forEach((project, index) => {
        const categories = project.getAttribute('data-category') || '';
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        if (shouldShow) {
            project.style.display = 'block';
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'scale(1) translateY(0)';
            }, index * 100);
        } else {
            project.style.opacity = '0';
            project.style.transform = 'scale(0.8) translateY(20px)';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
}

// === FORMULARIO DE CONTACTO ===
function initContactForm() {
    console.log('🔧 Initializing contact form...');
    const form = document.getElementById('contactForm');
    if (!form) {
        console.log('❌ Contact form not found!');
        return;
    }
    
    console.log('✅ Contact form found:', form);
    form.addEventListener('submit', handleFormSubmit);
    console.log('✅ Submit event listener added');
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea, select');
    console.log('📝 Found inputs:', inputs.length);
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    console.log('✅ Contact form initialization complete');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('🚀 handleFormSubmit called');
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    console.log('📝 Form data:', data);
    
    // Validar formulario
    if (!validateForm(data)) {
        console.log('❌ Form validation failed');
        return;
    }
    
    console.log('✅ Form validation passed');
    console.log('✅ Form validation passed');
    
    // Mostrar loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    console.log('📡 Sending request to /api/contact...');
    
    try {
        // Enviar al endpoint real de contacto
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
        
        const result = await response.json();
        console.log('📡 Response data:', result);
        
        if (response.ok && result.success) {
            // Mostrar éxito con detalles
            let successMessage = '¡Mensaje enviado correctamente! Te contactaré pronto.';
            
            if (result.details) {
                if (result.details.emailSent) {
                    const emailService = result.details.emailService || 'email';
                    successMessage += ` ✅ Email enviado via ${emailService}.`;
                }
                
                if (result.details.pdfGenerated) {
                    successMessage += ' 📄 PDF generado.';
                }
                
                if (result.details.errors && result.details.errors.length > 0) {
                    successMessage += ' ⚠️ Algunas características avanzadas no están disponibles.';
                }
            }
            
            showNotification(successMessage, 'success');
            form.reset();
        } else {
            throw new Error(result.error || 'Error al procesar el formulario');
        }
        
    } catch (error) {
        console.error('❌ Error al enviar formulario:', error);
        console.error('❌ Error details:', error.message, error.stack);
        
        // Mostrar error específico
        let errorMessage = 'Error al enviar el mensaje. ';
        if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage += 'Problema de conexión. Verifica que el servidor esté ejecutándose.';
        } else {
            errorMessage += error.message || 'Por favor, intenta de nuevo.';
        }
        
        showNotification(errorMessage, 'error');
    } finally {
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function validateForm(data) {
    let isValid = true;
    
    // Validar campos requeridos
    const requiredFields = ['nombre', 'email', 'servicio', 'mensaje'];
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'Este campo es requerido');
            isValid = false;
        }
    });
    
    // Validar email
    if (data.email && !isValidEmail(data.email)) {
        showFieldError('email', 'Por favor, ingresa un email válido');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Limpiar errores previos
    clearFieldError(e);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field.name, 'Este campo es requerido');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field.name, 'Por favor, ingresa un email válido');
        return false;
    }
    
    return true;
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    
    field.classList.add('error');
    
    // Remover mensaje de error previo
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Agregar nuevo mensaje de error
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// === NOTIFICACIONES ===
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentNode.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// === MENÚ MÓVIL ===
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        AppState.isMenuOpen = !AppState.isMenuOpen;
        navLinks.classList.toggle('active');
        toggle.innerHTML = AppState.isMenuOpen ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    });

    // Cerrar menú al hacer click en enlaces
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            AppState.isMenuOpen = false;
            toggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// === EFECTOS DE SCROLL ===
function initScrollEffects() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar background on scroll
        if (scrollTop > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        // Auto-hide navbar on scroll down
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar?.classList.add('navbar-hidden');
        } else {
            navbar?.classList.remove('navbar-hidden');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Intersection Observer para animaciones
    initIntersectionObserver();
}

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .project-card, .testimonial-card, .contact-card'
    );
    
    elementsToAnimate.forEach(el => observer.observe(el));
}

// === ANIMACIONES ===
function initAnimations() {
    // Animación de contadores
    initCounterAnimation();
    
    // Parallax suave para elementos flotantes
    initParallax();
}

function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = counter.textContent.replace(/\d+/, target);
                clearInterval(timer);
            } else {
                counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
            }
        }, 16);
    });
}

function initParallax() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        floatingCards.forEach((card, index) => {
            const offset = rate * (index + 1) * 0.1;
            card.style.transform = `translateY(${offset}px)`;
        });
    });
}

// === EFECTO DE ESCRITURA ===
function initTypingEffect() {
    const typingElement = document.querySelector('.hero-title .gradient-text');
    if (!typingElement) return;
    
    const text = typingElement.textContent;
    typingElement.textContent = '';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 100);
}

// === UTILIDADES ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// === LAZY LOADING DE IMÁGENES ===
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// === PERFORMANCE MONITORING ===
function initPerformanceMonitoring() {
    // Web Vitals básicos
    if ('web-vital' in window) {
        window.webVitals.getCLS(console.log);
        window.webVitals.getFID(console.log);
        window.webVitals.getLCP(console.log);
    }
}

// Inicializar lazy loading y performance monitoring después de la carga
window.addEventListener('load', () => {
    initLazyLoading();
    initPerformanceMonitoring();
});

// Manejar errores globales
window.addEventListener('error', (e) => {
    console.error('Error global capturado:', e.error);
    // Aquí podrías enviar el error a un servicio de logging
});

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registro falló: ', registrationError);
            });
    });
}

// === INTEGRACIÓN CON OPENAI API ===
// NOTA: API key movida a variables de entorno por seguridad
const OPENAI_CONFIG = {
    apiKey: '', // Se obtiene del backend o variables de entorno
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7
};

// Sistema de prompts profesional para el chatbot
const SYSTEM_PROMPT = `Eres el asistente virtual profesional de Daniel Cortés, desarrollador web especializado en Barcelona, España. 

IMPORTANTE: NO te presentes en cada mensaje, solo responde directamente a las preguntas del usuario.

PERSONALIDAD:
- Profesional, útil y directo
- Experto en tecnología pero explicas de forma simple
- Eficiente y no redundante
- Responde a saludos de forma natural pero breve

SERVICIOS QUE OFRECE DANIEL:
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
- NO te presentes en cada respuesta, ve directo al punto
- Saluda brevemente solo si es necesario
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
- Siempre mantén el enfoque en ayudar al usuario de forma directa`;

async function sendToOpenAI(userMessage) {
    console.log('🤖 Enviando mensaje al chatbot:', userMessage);
    
    try {
        // Usar la API del chatbot
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                message: userMessage,
                conversationHistory: AppState.conversationHistory
            })
        });

        if (!response.ok) {
            throw new Error('Backend no disponible');
        }

        const data = await response.json();
        
        if (data.isLocal) {
            console.log('📝 Respuesta local del servidor');
        } else {
            console.log('✅ Respuesta de OpenAI via servidor');
        }
        
        return data.response;
        
    } catch (error) {
        console.warn('❌ Error con el servidor, usando respuesta local del frontend:', error);
        throw error;
    }
}

function addTypingMessage() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot typing visible';
    typingDiv.id = 'typingMessage';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="message-text typing-animation">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return typingDiv;
}

function removeTypingMessage(typingMessage) {
    if (typingMessage && typingMessage.parentNode) {
        typingMessage.parentNode.removeChild(typingMessage);
    }
}

// === FUNCIONES DE RESPALDO LOCAL ===
