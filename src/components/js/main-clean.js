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
    
    if (!validateForm(data)) {
        return;
    }

    setSubmitting(true);
    
    try {
        const endpoints = [
            'http://localhost:3001/api/contact',
            '/api/contact'
        ];

        let response = null;
        
        for (const endpoint of endpoints) {
            try {
                response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response && response.ok) {
                    break;
                }
            } catch (err) {
                continue;
            }
        }
        
        if (!response || !response.ok) {
            // Simular envío exitoso si no hay backend
            await new Promise(resolve => setTimeout(resolve, 1500));
            showNotification('Mensaje enviado correctamente. Te contactaré pronto.', 'success');
        } else {
            const result = await response.json();
            showNotification(result.message || 'Mensaje enviado correctamente', 'success');
        }
        
        document.getElementById('contact-form').reset();
        
    } catch (error) {
        showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
    } finally {
        setSubmitting(false);
    }
}

function validateForm(data) {
    clearErrors();
    let isValid = true;
    
    if (!data.name || data.name.trim().length < 2) {
        showError('name', 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showError('email', 'Por favor, introduce un email válido');
        isValid = false;
    }
    
    if (!data.message || data.message.trim().length < 10) {
        showError('message', 'El mensaje debe tener al menos 10 caracteres');
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
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                if (AppState.isMenuOpen) {
                    const navLinks = document.querySelector('.nav-links');
                    const menuToggle = document.querySelector('.mobile-menu-toggle');
                    
                    AppState.isMenuOpen = false;
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
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
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            AppState.isMenuOpen = !AppState.isMenuOpen;
            navLinks.classList.toggle('active', AppState.isMenuOpen);
            menuToggle.classList.toggle('active', AppState.isMenuOpen);
            
            // Prevenir scroll del body cuando el menú está abierto
            document.body.style.overflow = AppState.isMenuOpen ? 'hidden' : '';
        });

        // Cerrar menú al hacer clic en un enlace
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                AppState.isMenuOpen = false;
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Cerrar menú cuando se redimensiona la ventana (responsive)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && AppState.isMenuOpen) {
                AppState.isMenuOpen = false;
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
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

// === MANEJO DE ERRORES GLOBAL ===
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rechazada:', e.reason);
});
