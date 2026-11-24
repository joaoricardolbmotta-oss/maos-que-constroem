#!/bin/bash

# 🚀 SCRIPT ÚNICO - FAZ TUDO AUTOMATICAMENTE
# Copie e cole isto no terminal do seu computador
# bash GO.sh

set -e

echo "🚀 Iniciando Mãos que Constroem no Floot..."
echo ""

# 1️⃣ Build Next.js
echo "1️⃣ Build da app..."
npm run build
echo "✅ Build OK"
echo ""

# 2️⃣ Iniciar Docker
echo "2️⃣ Iniciando Docker..."
docker-compose up --build -d
echo "✅ Docker iniciado"
echo ""

# 3️⃣ Aguardar
echo "⏳ Aguardando PocketBase (10s)..."
sleep 10
echo "✅ Pronto"
echo ""

# 4️⃣ Setup collections
echo "3️⃣ Criando collections..."
npm run setup:pocketbase
echo "✅ Collections criadas"
echo ""

# 5️⃣ Resumo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ TUDO PRONTO! ✨"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Acesse:"
echo ""
echo "  🌐 App:              http://localhost:3000"
echo "  🔧 PocketBase Admin: http://localhost:8090/_/"
echo "    - Email:    admin@localhost"
echo "    - Password: admin123"
echo ""
echo "📊 Testar API:"
echo ""
echo "  curl http://localhost:3000/api/campanhas"
echo ""
echo "🛑 Para parar:"
echo ""
echo "  docker-compose down"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
