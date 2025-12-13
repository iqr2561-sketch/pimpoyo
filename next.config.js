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
  // Deshabilitar static optimization para páginas con autenticación
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./prisma/schema.prisma'],
    },
  },
}

module.exports = nextConfig


