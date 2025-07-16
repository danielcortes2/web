# 📧 Configuración del Sistema de Email y PDF

## ⚙️ Configuración Requerida

### 1. Configurar Gmail App Password

Para que el sistema pueda enviar emails, necesitas configurar una contraseña de aplicación de Gmail:

1. **Ir a tu cuenta de Google**: https://myaccount.google.com/
2. **Seguridad** → **Verificación en dos pasos** (debe estar activada)
3. **Contraseñas de aplicaciones** → **Seleccionar app**: Mail
4. **Seleccionar dispositivo**: Otro (nombre personalizado) → "Stratek Portfolio"
5. **Copiar la contraseña generada** (16 caracteres)

### 2. Actualizar el archivo .env

```bash
# Reemplaza estos valores en tu archivo .env
EMAIL_USER=danielcortescasadas6@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion_aqui  # La contraseña de 16 caracteres generada
EMAIL_FROM=danielcortescasadas6@gmail.com
EMAIL_TO=danielcortescasadas6@gmail.com
```

### 3. Probar la configuración

Ejecuta el servidor y prueba el formulario de contacto:

```bash
npm run dev
```

## 📋 Funcionalidades Implementadas

### ✅ Formulario de Contacto con PDF
- **Genera PDF automáticamente** con todos los datos del formulario
- **Diseño profesional** con branding de Stratek
- **Información estructurada** del cliente y proyecto
- **Alertas de prioridad** para solicitudes urgentes

### ✅ Sistema de Email Automatizado
- **Email al administrador** (danielcortescasadas6@gmail.com) con PDF adjunto
- **Diseño HTML responsivo** para emails
- **Botones de acción rápida** (responder, llamar)
- **Información prioritizada** según urgencia

### ✅ Generador de Presupuestos (Bonus)
- **Endpoint `/api/quote`** para generar presupuestos automáticos
- **Cálculo inteligente** basado en tipo de servicio
- **PDF de presupuesto** con desglose detallado
- **Email al cliente y administrador** con presupuesto

## 🔧 Endpoints Disponibles

### POST `/api/contact`
Procesa formulario de contacto y genera PDF + email

**Body esperado:**
```json
{
  "nombre": "Nombre del cliente",
  "email": "cliente@email.com",
  "telefono": "+34 600 000 000",
  "empresa": "Empresa SL",
  "servicio": "Desarrollo Web",
  "presupuesto": "€1,000 - €2,000",
  "timeline": "2-4 semanas",
  "priority": "Alta",
  "mensaje": "Descripción del proyecto..."
}
```

### POST `/api/quote`
Genera presupuesto automático con PDF

**Body esperado:**
```json
{
  "nombre": "Nombre del cliente",
  "email": "cliente@email.com",
  "servicio": "Integración de IA",
  "presupuesto": "€2,000 - €5,000"
}
```

## 📁 Archivos Creados

- `utils/pdfGenerator.js` - Generación de PDFs profesionales
- `utils/emailService.js` - Servicio de envío de emails
- Templates HTML para PDFs y emails
- Configuración de endpoints actualizados

## 🚨 Importante

⚠️ **No olvides configurar la contraseña de aplicación de Gmail antes de hacer push**

⚠️ **Añade `EMAIL_PASS` a `.gitignore` para mantener la seguridad**

## 🎨 Características de los PDFs

- **Diseño profesional** con branding de Stratek
- **Información estructurada** en secciones
- **Alertas visuales** para prioridades altas
- **Información de contacto** y próximos pasos
- **Metadatos** con fecha y hora de generación

## 📧 Características de los Emails

- **HTML responsivo** con diseño atractivo
- **Adjunto PDF automático** con toda la información
- **Botones de acción** para respuesta rápida
- **Copia al cliente** en presupuestos
- **Alertas visuales** según prioridad

---

¡El sistema está listo para recibir y procesar solicitudes de contacto profesionalmente! 🚀
