// === ESTADO DE LA APLICACIÓN ===
const AppState = {
    formInitialized: false,
    isSubmitting: false,
    isMenuOpen: false,
    notificationTimeout: null
};

// === INICIALIZACIÓN DE LA APP ===
document.addEventListener('DOMContentLoaded', () => {
    try {
        App.init();
    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
    }
});

const App = {
    init() {
        initContactForm();
        initSmoothScrolling();
        initMobileMenu();
        initAnimations();
    }
};

// === GESTIÓN DEL FORMULARIO ===
function initContactForm() {
    if (AppState.formInitialized) {
        return;
    }
    
    const form = document.getElementById('contact-form');
    if (!form) {
        return;
    }

    form.addEventListener('submit', handleFormSubmit);

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', handleInputChange);
    });

    AppState.formInitialized = true;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    if (!validateForm(data)) return;

    setSubmitting(true);

    try {
        const isProd = location.hostname === 'stratek.es' || location.hostname === 'www.stratek.es';
        const configuredBase = window.__API_BASE_URL__ || (document.querySelector('meta[name="api-base"]')?.getAttribute('content')) || null;
        const endpoints = configuredBase
            ? [`${configuredBase.replace(/\/$/, '')}/contact`]
            : (isProd
                ? ['/api/contact']
                : ['http://localhost:3001/api/contact', '/api/contact']);

        let response = null;
        for (const url of endpoints) {
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                if (res && res.ok) {
                    response = res;
                    break;
                }
            } catch (err) {
                console.warn('Fallo al contactar endpoint:', url, err);
            }
        }

        if (response) {
            let result = null;
            const ct = response.headers.get('Content-Type') || '';
            if (ct.includes('application/json')) {
                const txt = await response.text();
                if (txt && txt.trim()) result = JSON.parse(txt);
            }
            const ok = result ? !!result.success : false;
            showNotification((result && (result.message || result.error)) || (ok ? 'Mensaje enviado correctamente.' : 'No se pudo enviar el mensaje.'), ok ? 'success' : 'error');
            if (ok) document.getElementById('contact-form').reset();
        } else {
            showNotification('No se pudo contactar con el servidor. Inténtalo más tarde.', 'error');
        }
    } catch (err) {
        console.error('Error inesperado durante el envío:', err);
        showNotification('Error inesperado. Inténtalo más tarde.', 'error');
    } finally {
        setSubmitting(false);
    }
}

function validateForm(data) {
    clearErrors();
    let isValid = true;
    
    if (!data.nombre || data.nombre.trim().length < 2) {
        showError('nombre', 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showError('email', 'Por favor, introduce un email válido');
        isValid = false;
    }
    
    if (!data.mensaje || data.mensaje.trim().length < 10) {
        showError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
    field.classList.add('error');
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function handleInputChange(e) {
    if (e.target.classList.contains('error')) {
        e.target.classList.remove('error');
        const errorMsg = e.target.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
}

function setSubmitting(isSubmitting) {
    AppState.isSubmitting = isSubmitting;
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    
    if (isSubmitting) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
    } else {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
        submitBtn.disabled = false;
    }
}

function showNotification(message, type = 'info') {
    // Limpiar notificación anterior
    if (AppState.notificationTimeout) {
        clearTimeout(AppState.notificationTimeout);
    }
    
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentNode.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-ocultar después de 5 segundos
    AppState.notificationTimeout = setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// === NAVEGACIÓN SUAVE ===
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Cerrar menú móvil si está abierto
                if (AppState.isMenuOpen) {
                    const navLinks = document.querySelector('.nav-links');
                    const menuToggle = document.querySelector('.mobile-menu-toggle');
                    const body = document.body;
                    const scrollY = body.style.top;
                    
                    AppState.isMenuOpen = false;
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    
                    // Restaurar scroll antes de la navegación
                    body.style.position = '';
                    body.style.top = '';
                    body.style.width = '';
                    body.classList.remove('menu-open');
                    
                    const currentScrollY = parseInt(scrollY || '0') * -1;
                    window.scrollTo(0, currentScrollY);
                    
                    // Pequeño delay para que se complete la restauración
                    setTimeout(() => {
                        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }, 50);
                } else {
                    // Navegación normal sin menú móvil
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// === ANIMACIONES ===
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos con animación
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// === MENÚ MÓVIL ===
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            AppState.isMenuOpen = !AppState.isMenuOpen;
            navLinks.classList.toggle('active', AppState.isMenuOpen);
            menuToggle.classList.toggle('active', AppState.isMenuOpen);

            if (AppState.isMenuOpen) {
                const scrollY = window.scrollY;
                body.style.position = 'fixed';
                body.style.top = `-${scrollY}px`;
                body.style.width = '100%';
                body.classList.add('menu-open');
            } else {
                const scrollY = body.style.top;
                body.style.position = '';
                body.style.top = '';
                body.style.width = '';
                body.classList.remove('menu-open');
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        });

        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (AppState.isMenuOpen) {
                    AppState.isMenuOpen = false;
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    body.style.position = '';
                    body.style.top = '';
                    body.style.width = '';
                    body.classList.remove('menu-open');
                }
            });
        });
    }
}

// Initialize the mobile menu

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

// === MANEJO DE ERRORES GLOBAL ===
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rechazada:', e.reason);
});

// === FUNCIONES AUXILIARES DE NAVEGACIÓN ===
function scrollToContact() {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
        const offsetTop = contactSection.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function scrollToPortfolio() {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
        const offsetTop = portfolioSection.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Hacer las funciones globales para compatibilidad
window.scrollToContact = scrollToContact;
window.scrollToPortfolio = scrollToPortfolio;
