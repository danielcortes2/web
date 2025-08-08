#!/bin/bash

# Script de inicio para producción
echo "🚀 Iniciando Stratek en modo producción..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

# Verificar que las dependencias estén instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Usar configuración de producción
export NODE_ENV=production
export PORT=3001

# Copiar configuración de producción si existe
if [ -f ".env.production" ]; then
    echo "🔧 Usando configuración de producción..."
    cp .env.production .env
fi

# Iniciar servidor
echo "🌐 Iniciando servidor en puerto $PORT..."
node server.js

echo "✅ Servidor iniciado en https://stratek.es"
