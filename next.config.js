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
  // DESHABILITAR COMPLETAMENTE LA GENERACIÓN ESTÁTICA
  output: 'standalone',
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./prisma/schema.prisma'],
    },
  },
  // Configuración para build en Vercel
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig


