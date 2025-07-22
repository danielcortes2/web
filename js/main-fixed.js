// JavaScript principal para el sitio web - VERSION CORREGIDA

// Configuración y estado global
const AppState = {
    isMenuOpen: false,
    activeFilter: 'all',
    conversationHistory: [],
    formInitialized: false // Flag para evitar múltiples inicializaciones
};

// Inicialización cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing app...');
    initializeApp();
});

function initializeApp() {
    try {
        initPortfolioFilters();
        initContactForm(); // Solo inicializar una vez
        initMobileMenu();
        initScrollEffects();
        initAnimations();
        initTypingEffect();
        
        console.log('✅ App initialization complete');
    } catch (error) {
        console.error('❌ Error during app initialization:', error);
    }
}

// === FORMULARIO DE CONTACTO === (VERSIÓN CORREGIDA)
function initContactForm() {
    // Prevenir múltiples inicializaciones
    if (AppState.formInitialized) {
        console.log('⚠️ Contact form already initialized');
        return;
    }
    
    console.log('🔧 Initializing contact form...');
    const form = document.getElementById('contactForm');
    if (!form) {
        console.log('❌ Contact form not found!');
        return;
    }
    
    console.log('✅ Contact form found:', form);
    
    // Remover cualquier listener previo para evitar duplicados
    form.removeEventListener('submit', handleFormSubmit);
    
    // Añadir el listener
    form.addEventListener('submit', handleFormSubmit);
    console.log('✅ Submit event listener added');
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea, select');
    console.log('📝 Found inputs:', inputs.length);
    inputs.forEach(input => {
        input.removeEventListener('blur', validateField);
        input.removeEventListener('input', clearFieldError);
        
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    AppState.formInitialized = true;
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
                    successMessage += ' 📄 PDF generado y adjunto.';
                } else {
                    successMessage += ' ⚠️ PDF no generado.';
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
    // Remover notificación anterior si existe
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Añadir estilos inline si no existen
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = '#d4edda';
        notification.style.color = '#155724';
        notification.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        notification.style.background = '#f8d7da';
        notification.style.color = '#721c24';
        notification.style.border = '1px solid #f5c6cb';
    } else {
        notification.style.background = '#e3f2fd';
        notification.style.color = '#0d47a1';
        notification.style.border = '1px solid #bbdefb';
    }
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
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

// === MENÚ MÓVIL ===
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            AppState.isMenuOpen = !AppState.isMenuOpen;
            nav.classList.toggle('nav-open', AppState.isMenuOpen);
            menuToggle.classList.toggle('active', AppState.isMenuOpen);
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                AppState.isMenuOpen = false;
                nav.classList.remove('nav-open');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// === EFECTOS DE SCROLL ===
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos con animación
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));
}

// === ANIMACIONES ===
function initAnimations() {
    // Animación de números (contadores)
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const start = Date.now();
    const startValue = 0;

    function updateCounter() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(startValue + (target - startValue) * progress);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

// === EFECTO DE TYPING ===
function initTypingEffect() {
    const typingElement = document.querySelector('[data-typing]');
    if (!typingElement) return;

    const texts = typingElement.getAttribute('data-typing').split('|');
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const fullText = texts[currentIndex];
        
        if (isDeleting) {
            currentText = fullText.substring(0, currentText.length - 1);
            typeSpeed = 50;
        } else {
            currentText = fullText.substring(0, currentText.length + 1);
            typeSpeed = 100;
        }
        
        typingElement.textContent = currentText;
        
        if (!isDeleting && currentText === fullText) {
            typeSpeed = 2000; // Pausa antes de borrar
            isDeleting = true;
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % texts.length;
            typeSpeed = 500; // Pausa antes de escribir nueva palabra
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// Exportar funciones globales necesarias para el HTML
window.scrollToContact = scrollToContact;
window.scrollToPortfolio = scrollToPortfolio;

console.log('🎯 Main.js corregido cargado exitosamente');
