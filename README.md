# Stratek - Desarrollo Web Profesional

![Portfolio Banner](./img/banner.jpg)

## 🚀 Sobre Este Proyecto

Este es el sitio web profesional y portfolio de Stratek, diseñado para mostrar nuestros servicios como desarrolladores web full-stack especializados en inteligencia artificial y soluciones digitales modernas.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica y accesible
- **CSS3** - Diseño responsivo con CSS Grid y Flexbox
- **JavaScript ES6+** - Interactividad y funcionalidades avanzadas
- **Font Awesome** - Iconografía profesional
- **Google Fonts** - Tipografía moderna (Inter)

### Características Técnicas
- ✅ **Diseño Responsivo** - Adaptado para móviles, tablets y desktop
- ✅ **Navegación Suave** - Scroll behavior optimizado
- ✅ **Animaciones CSS** - Micro-interacciones y transiciones fluidas
- ✅ **Formulario de Contacto** - Validación cliente y preparado para backend
- ✅ **Portfolio Filtrable** - Sistema de filtros por categorías
- ✅ **SEO Optimizado** - Meta tags y estructura semántica
- ✅ **Performance** - Imágenes optimizadas y lazy loading
- ✅ **Accesibilidad** - ARIA labels y navegación por teclado
- ✅ **PWA Ready** - Preparado para Service Worker

## 🤖 Chatbot Inteligente

### Funcionalidades del Chatbot
- **IA Conversacional**: Powered by OpenAI GPT-3.5-turbo
- **Respuestas Inteligentes**: Información específica sobre servicios y precios
- **Modo Fallback**: Respuestas locales cuando la API no está disponible
- **Rate Limiting**: Protección contra spam y uso excesivo
- **Historial Persistente**: Conversaciones guardadas localmente
- **UI Responsiva**: Diseño adaptativo para móviles y desktop
- **Seguridad**: API keys protegidas en el servidor

### Configuración del Chatbot
El chatbot está configurado para responder consultas sobre:
- Servicios de desarrollo web
- Precios y presupuestos
- Tecnologías utilizadas
- Información de contacto
- Portfolio y experiencia
- Consultas técnicas

### Variables de Entorno Requeridas
```env
OPENAI_API_KEY=your_openai_api_key_here
CHATBOT_MODEL=gpt-3.5-turbo
CHATBOT_MAX_TOKENS=1000
CHATBOT_TEMPERATURE=0.7
```

### 1. Hero Section
- Presentación profesional impactante
- Estadísticas de rendimiento
- Call-to-actions estratégicos
- Elementos flotantes animados

### 2. Servicios
- **Desarrollo Web** - Sitios modernos y responsivos
- **Integración de IA** - Chatbots y automatización
- **Apps Web Progresivas** - Experiencias nativas
- **E-commerce** - Tiendas online completas
- **Consultoría Digital** - Auditorías y estrategia
- **Soporte & Mantenimiento** - Servicio continuo

### 3. Portfolio
- Proyectos destacados con métricas reales
- Sistema de filtros por tecnología
- Enlaces a demos y código fuente
- Casos de estudio detallados

### 4. Sobre Mí
- Historia profesional
- Stack tecnológico
- Certificaciones
- Perfil personal

### 5. Testimonios
- Reseñas de clientes reales
- Ratings visuales
- Casos de éxito cuantificados

### 6. Contacto
- Formulario de contacto inteligente
- Información de contacto
- Calculadora de presupuestos
- Respuesta automática

## 💼 Servicios Ofrecidos

### Desarrollo Web Full-Stack
```
- Frontend: React, Vue.js, Next.js
- Backend: Node.js, Python, FastAPI
- Bases de datos: PostgreSQL, MongoDB
- Cloud: AWS, Google Cloud, Vercel
- Precio: Desde €800
```

### Integración de Inteligencia Artificial
```
- Chatbots conversacionales
- Análisis de datos automatizado
- Procesamiento de lenguaje natural
- Machine Learning custom
- Precio: Desde €1,200
```

### E-commerce Completo
```
- Tienda online responsive
- Pasarela de pagos segura
- Gestión de inventario
- Panel administrativo
- Precio: Desde €2,000
```

## 📱 Diseño Responsivo

El sitio está optimizado para todos los dispositivos:

- **Desktop** (1200px+): Layout completo con todas las características
- **Tablet** (768px - 1199px): Adaptado para pantallas medianas
- **Mobile** (320px - 767px): Experiencia móvil optimizada

## 🎨 Paleta de Colores

```css
/* Colores del tema */
--primary-color: #6366f1     /* Indigo principal */
--secondary-color: #06b6d4   /* Cyan secundario */
--accent-color: #f59e0b      /* Amber acento */
--bg-primary: #0f172a        /* Fondo principal */
--bg-secondary: #1e293b      /* Fondo secundario */
--text-primary: #f1f5f9      /* Texto principal */
```

## 🚀 Optimizaciones de Rendimiento

### Técnicas Implementadas
- **Critical CSS** inlined para faster first paint
- **Lazy loading** de imágenes y contenido below-the-fold
- **Minificación** de CSS y JavaScript
- **Compresión** de imágenes con formatos modernos
- **Preload** de recursos críticos
- **Service Worker** para caching estratégico

### Métricas Objetivo
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **Performance Score**: 90+

## 📞 Contacto Profesional

### Información de Contacto
- **Email**: daniel@webdev.com
- **Teléfono**: +34 123 456 789
- **Ubicación**: Barcelona, España
- **Disponibilidad**: Lun-Vie 9:00-18:00

### Redes Sociales
- [LinkedIn](https://linkedin.com/in/danielcortes)
- [GitHub](https://github.com/danielcortes)
- [Twitter](https://twitter.com/danielcortes)

## 🔧 Instalación y Desarrollo

### Opción 1: Con Node.js (Recomendado para chatbot IA)

**Requisitos:**
- Node.js 18+ 
- npm o yarn

**Setup:**
```bash
# Clonar el repositorio
git clone https://github.com/danielcortes/web-portfolio.git

# Navegar al directorio
cd web-portfolio

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu API key de OpenAI

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
http://localhost:3000
```

### Opción 2: Solo Frontend (Sin chatbot IA)

**Requisitos:**
- Navegador web moderno
- Servidor web local (Live Server, Python, etc.)

**Setup:**
```bash
# Servir archivos estáticos
python -m http.server 8000
# o usar Live Server extension en VS Code

# Abrir en el navegador
http://localhost:8000
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# OpenAI Configuration
OPENAI_API_KEY=tu_api_key_aqui
CHATBOT_MODEL=gpt-3.5-turbo
CHATBOT_MAX_TOKENS=1500
CHATBOT_TEMPERATURE=0.7

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Estructura del Proyecto
```
web/
├── index.html          # Página principal
├── style/
│   └── style.css      # Estilos principales
├── js/
│   └── main.js        # JavaScript funcional
├── img/
│   └── imagengato.jpg # Imágenes del proyecto
├── README.md          # Documentación
└── CNAME             # Configuración dominio
```

## 🎯 Roadmap Futuro

### Próximas Características
- [ ] **Blog Técnico** - Artículos sobre desarrollo y IA
- [ ] **Calculadora de Presupuestos** - Tool interactiva
- [ ] **Chat en Vivo** - Integración con ChatBot IA
- [ ] **Portal Cliente** - Dashboard para proyectos
- [ ] **Marketplace** - Templates y recursos
- [ ] **Webinars** - Sesiones educativas online

### Mejoras Técnicas
- [ ] **CMS Integration** - Strapi o Contentful
- [ ] **Analytics Avanzado** - Google Analytics 4
- [ ] **A/B Testing** - Optimización conversiones
- [ ] **CDN Global** - Cloudflare integration
- [ ] **Monitoring** - Uptime y performance alerts

## 📊 Métricas de Negocio

### Objetivos 2025
- **Proyectos**: 100+ completados
- **Clientes**: 50+ empresas atendidas
- **Facturación**: €150k+ anuales
- **Satisfacción**: 98%+ rating promedio

### KPIs Tracking
- Conversión web-to-lead: 8%+
- Tiempo respuesta: < 2 horas
- Proyectos on-time: 95%+
- Clientes recurrentes: 70%+

## 📄 Licencia

Este proyecto es el portfolio profesional de Daniel Cortés. El código está disponible para referencia y aprendizaje bajo licencia MIT.

## 🤝 Colaboración

¿Interesado en colaborar o tienes un proyecto en mente?

**¡Contactemos y hagamos realidad tu visión digital!**

---

*Desarrollado con ❤️ por Daniel Cortés - Full Stack Developer & AI Specialist*

*Última actualización: Julio 2025*
