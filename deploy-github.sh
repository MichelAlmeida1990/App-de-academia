#!/bin/bash

echo "🚀 Iniciando deploy para GitHub Pages..."

# Build da aplicação
echo "📦 Fazendo build da aplicação..."
npm run build

# Deploy para GitHub Pages
echo "🌐 Fazendo deploy para GitHub Pages..."
npm run deploy

echo "✅ Deploy concluído!"
echo "🔗 Site disponível em: https://michelalmeida1990.github.io/App-de-academia/"
echo ""
echo "⏱️  Aguarde alguns minutos para a propagação..." 