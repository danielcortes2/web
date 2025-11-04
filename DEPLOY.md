# Guía de Despliegue en Hostinger

## Problema: Página en blanco después del despliegue

### Causa
React Router utiliza rutas del lado del cliente (SPA). Cuando accedes a una ruta como `/proyecto/1`, el servidor busca ese archivo físicamente y no lo encuentra, devolviendo un error 404 o página en blanco.

### Solución
El archivo `.htaccess` configurado redirige todas las solicitudes al `index.html`, permitiendo que React Router maneje las rutas.

---

## Pasos para Desplegar

### 1. Configurar Variables de Entorno (si aplica)

Crea un archivo `.env.production.local` con tus variables de producción:

```bash
VITE_API_BASE_URL=http://TU_IP_BACKEND/api/v1
```

**IMPORTANTE:** Nunca subas archivos `.env` con credenciales reales a Git.

### 2. Construir el Proyecto

```bash
npm run build
```

Esto generará una carpeta `dist/` con todos los archivos estáticos optimizados.

### 3. Verificar el Build Local

```bash
npm run preview
```

Abre `http://localhost:4173` y verifica que todo funcione correctamente.

### 4. Subir a Hostinger

#### Opción A: Usando File Manager (Panel de Control)

1. Accede al panel de control de Hostinger
2. Ve a **Files** → **File Manager**
3. Navega a `public_html/` (o el directorio de tu dominio)
4. **IMPORTANTE:** Elimina todo el contenido existente en ese directorio
5. Sube **TODO** el contenido de la carpeta `dist/`:
   - `index.html`
   - `.htaccess` ← **MUY IMPORTANTE**
   - Carpeta `assets/`
   - Cualquier otro archivo/carpeta en `dist/`

#### Opción B: Usando FTP/SFTP

```bash
# Conectar con FileZilla o similar
Host: ftp.tudominio.com
Usuario: tu_usuario_hostinger
Contraseña: tu_contraseña
Puerto: 21 (FTP) o 22 (SFTP)

# Sube el contenido de dist/ a public_html/
```

#### Opción C: Usando Git (si Hostinger tiene SSH habilitado)

```bash
# En el servidor (SSH)
git pull origin main
npm install
npm run build
cp -r dist/* public_html/
```

### 5. Verificar Permisos

Asegúrate de que los archivos tengan los permisos correctos:

- Archivos: `644` (rw-r--r--)
- Directorios: `755` (rwxr-xr-x)

En File Manager de Hostinger, puedes cambiar permisos haciendo clic derecho → **Permissions**.

### 6. Verificar el .htaccess

Verifica que el archivo `.htaccess` esté en el directorio raíz (`public_html/`) y que contenga:

```apache
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### 7. Probar el Sitio

Visita tu dominio y verifica:
- ✅ La página principal carga correctamente
- ✅ Las rutas internas funcionan (ej: `/proyecto/1`)
- ✅ El menú de navegación funciona
- ✅ Los assets (imágenes, CSS, JS) cargan correctamente
- ✅ El formulario de contacto envía datos al backend

---

## Problemas Comunes y Soluciones

### 1. Página en blanco

**Causas posibles:**
- Falta el archivo `.htaccess`
- El `.htaccess` no tiene los permisos correctos
- Los archivos no están en el directorio raíz correcto

**Solución:**
```bash
# Verificar que .htaccess está en public_html/
# Permisos: 644
# Contenido: debe incluir RewriteRule . /index.html [L]
```

### 2. Error 404 en rutas

**Causa:** `.htaccess` no está funcionando.

**Solución:**
- Verifica que `mod_rewrite` esté habilitado en tu hosting
- Contacta a soporte de Hostinger para habilitar `mod_rewrite`

### 3. Assets (imágenes/CSS) no cargan

**Causa:** Rutas incorrectas o archivos faltantes.

**Solución:**
- Verifica que TODOS los archivos de `dist/` se subieron
- Verifica que las rutas en el código usen `/` (ruta absoluta desde root)
- Verifica que `base: '/'` esté configurado en `vite.config.js`

### 4. Error CORS en formulario

**Causa:** El backend no permite solicitudes desde tu dominio.

**Solución:**
Configura CORS en tu backend FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "https://tudominio.com",
    "https://www.tudominio.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 5. Variables de entorno no funcionan

**Causa:** Variables no definidas o no compiladas en el build.

**Solución:**
- Crea `.env.production.local` ANTES de hacer `npm run build`
- Las variables deben empezar con `VITE_`
- Reinicia el proceso de build

---

## Checklist de Despliegue

Antes de subir a producción:

- [ ] Ejecutar `npm run build` sin errores
- [ ] Probar con `npm run preview` localmente
- [ ] Verificar que `.htaccess` existe en `public_html/`
- [ ] Verificar que `.env.production.local` tiene las URLs correctas
- [ ] Subir TODO el contenido de `dist/` a `public_html/`
- [ ] Verificar permisos de archivos (644) y carpetas (755)
- [ ] Probar todas las rutas del sitio
- [ ] Probar el formulario de contacto
- [ ] Verificar que las imágenes cargan
- [ ] Verificar en consola del navegador (F12) que no hay errores

---

## Optimizaciones Adicionales

### Habilitar compresión gzip

Ya está configurado en `.htaccess`, pero verifica que funciona:

```bash
curl -H "Accept-Encoding: gzip" -I https://tudominio.com
# Debe incluir: Content-Encoding: gzip
```

### Habilitar HTTPS

En el panel de Hostinger:
1. Ve a **SSL** → **Manage SSL**
2. Activa el certificado SSL gratuito
3. Descomenta las líneas de redirección HTTPS en `.htaccess`

### CDN (Opcional)

Para mejor rendimiento global, considera usar Cloudflare CDN (gratis).

---

## Soporte

Si sigues teniendo problemas:

1. **Verifica la consola del navegador** (F12 → Console)
2. **Revisa los logs del servidor** en Hostinger
3. **Contacta al soporte de Hostinger** si el problema es de configuración del servidor

---

## Comandos Rápidos

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Limpiar y rebuild
rm -rf dist node_modules
npm install
npm run build
```

---

## Notas Importantes

- **NUNCA** subas la carpeta `node_modules/` al servidor
- **NUNCA** subas archivos `.env` con credenciales reales
- Siempre haz backup antes de reemplazar archivos en producción
- Usa `.env.production.local` para credenciales de producción
- Mantén un repositorio Git actualizado como respaldo

---

## Estructura Final en Hostinger

```
public_html/
├── .htaccess          ← CRÍTICO: debe estar presente
├── index.html         ← Punto de entrada
├── favicon.svg
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [otros assets]
└── img/
    └── [imágenes del sitio]
```

✅ Con esta configuración, tu sitio React + React Router funcionará correctamente en Hostinger.
