/**
 * Script para verificar e corrigir problemas comuns no projeto
 * 
 * Execute este script com: node fix-errors.js
 */

const fs = require('fs');
const path = require('path');

console.log('Iniciando verificação e correção de problemas...');

// Verificar se o arquivo .env.local existe
if (!fs.existsSync(path.join(__dirname, '.env.local'))) {
  console.log('Criando arquivo .env.local...');
  
  const envContent = `# Configurações do aplicativo
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Configurações de autenticação
NEXT_PUBLIC_AUTH_ENABLED=true

# Configurações de idioma
NEXT_PUBLIC_DEFAULT_LANGUAGE=pt-BR

# Configurações de tema
NEXT_PUBLIC_DEFAULT_THEME=light
`;
  
  fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
  console.log('Arquivo .env.local criado com sucesso!');
}

// Verificar se o diretório node_modules existe
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('Diretório node_modules não encontrado. Execute "npm install" antes de iniciar o aplicativo.');
}

// Verificar se o arquivo next.config.js está configurado corretamente
const nextConfigPath = path.join(__dirname, 'next.config.mjs');
if (fs.existsSync(nextConfigPath)) {
  console.log('Verificando next.config.mjs...');
  
  let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  let modified = false;
  
  // Verificar se a configuração de imagens está presente
  if (!nextConfig.includes('images:')) {
    console.log('Adicionando configuração de imagens...');
    
    // Adicionar configuração de imagens
    nextConfig = nextConfig.replace(
      'const nextConfig = {',
      `const nextConfig = {
  images: {
    domains: ['localhost', 'placehold.co', 'images.unsplash.com'],
  },`
    );
    
    modified = true;
  }
  
  // Verificar se a configuração de webpack para SVG está presente
  if (!nextConfig.includes('webpack(')) {
    console.log('Adicionando configuração de webpack para SVG...');
    
    // Adicionar configuração de webpack
    nextConfig = nextConfig.replace(
      '};',
      `  // Configuração para permitir SVG como componentes React
  webpack(config) {
    config.module.rules.push({
      test: /\\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};`
    );
    
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(nextConfigPath, nextConfig);
    console.log('Arquivo next.config.mjs atualizado com sucesso!');
  } else {
    console.log('Arquivo next.config.mjs já está configurado corretamente.');
  }
}

console.log('Verificação e correção de problemas concluída!');
console.log('Você pode iniciar o aplicativo com "npm run dev".');
