/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Desabilitar geração estática
  trailingSlash: false,
  // Configuração experimental simplificada
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Otimizações para reduzir uso de memória
    optimizePackageImports: ['react-icons'],
    optimizeCss: true,
  },
  serverExternalPackages: ['bcryptjs'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  poweredByHeader: false,
  compress: true,
  // Otimizações de webpack para reduzir uso de memória
  webpack: (config, { dev, isServer }) => {
    // Otimizações apenas para produção
    if (!dev) {
      // Otimizar tamanho do bundle
      config.optimization.minimize = true;

      // Dividir chunks para melhor cache e menor uso de memória
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 10,
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      };

      // Reduzir uso de memória durante o build
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
    }

    return config;
  },
};

module.exports = nextConfig;
