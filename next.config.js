/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para WebSocket/HMR
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
  // FORZAR RENDERIZADO DINÁMICO - NO STATIC
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./prisma/schema.prisma'],
    },
  },
  // Deshabilitar generación estática completamente
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig


