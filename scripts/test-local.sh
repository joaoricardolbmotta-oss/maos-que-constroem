#!/bin/bash

# Script para testar localmente com Docker
# Uso: bash scripts/test-local.sh

set -e

echo "🚀 Iniciando Mãos que Constroem com PocketBase..."
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instale docker-compose primeiro."
    exit 1
fi

echo "📦 Build e start dos containers..."
docker-compose up --build -d

echo ""
echo "⏳ Aguardando PocketBase iniciar..."
sleep 10

echo "✅ Containers iniciados!"
echo ""

echo "📍 URLs para testar:"
echo ""
echo "  🌐 App:              http://localhost:3000"
echo "  🔧 PocketBase Admin: http://localhost:8090/_/"
echo "    - Email: admin@localhost"
echo "    - Password: admin123"
echo ""

echo "📋 Próximos passos:"
echo ""
echo "  1. Acesse http://localhost:8090/_/"
echo "  2. Faça login com admin@localhost / admin123"
echo "  3. Crie as 9 collections (veja FASE2_QUICKSTART.md)"
echo "  4. Teste a app em http://localhost:3000"
echo ""

echo "🛑 Para parar: docker-compose down"
echo "📊 Logs PocketBase: docker-compose logs -f pocketbase"
echo "📊 Logs App: docker-compose logs -f app"
echo ""

echo "✨ Pronto! Acesse as URLs acima para começar."
