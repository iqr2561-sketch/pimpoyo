import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'

const inter = Inter({ subsets: ['latin'] })

// Forzar renderizado dinámico en toda la aplicación
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Venta Rápida - Pimpoyo',
  description: 'Sistema de venta y facturación móvil rápido',
  manifest: '/manifest.json',
  themeColor: '#4f46e5',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Venta Rápida',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Venta Rápida" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        {/* SessionProvider reactivado para evitar errores - funciona sin sesión en modo demo */}
        <SessionProvider>
          <ToastProvider>
            {children}
            <PWAInstallPrompt />
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}


