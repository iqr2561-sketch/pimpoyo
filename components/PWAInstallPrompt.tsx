'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Verificar si ya está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // Verificar si ya se instaló antes
    if (localStorage.getItem('pwa-dismissed')) {
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Mostrar el prompt después de 3 segundos
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('PWA instalada')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-dismissed', 'true')
  }

  if (!showPrompt || !deferredPrompt) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center p-0 sm:p-4 pointer-events-none">
      <div 
        className="fixed inset-0 bg-black/50 pointer-events-auto animate-fade-in"
        onClick={handleDismiss}
      />
      <div className="relative w-full sm:max-w-md pointer-events-auto animate-slide-up">
        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 rounded-t-3xl sm:rounded-3xl shadow-2xl border-t-4 sm:border-4 border-white/20 overflow-hidden">
          {/* Header con icono grande */}
          <div className="bg-white/10 p-6 text-center border-b border-white/10">
            <div className="text-7xl mb-2 animate-bounce-slow">📱</div>
            <h3 className="text-2xl font-black text-white mb-1">
              ¡Instala Venta Rápida!
            </h3>
            <p className="text-sm text-indigo-100">
              Acceso ultra rápido desde tu inicio
            </p>
          </div>
          
          {/* Contenido */}
          <div className="p-6 space-y-4">
            {/* Beneficios */}
            <div className="space-y-2 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-emerald-300">✓</span>
                <span>Abre en 1 segundo desde tu pantalla</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-300">✓</span>
                <span>Funciona sin conexión a internet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-300">✓</span>
                <span>Ocupa menos de 1 MB de espacio</span>
              </div>
            </div>
            
            {/* Botones */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleInstall}
                className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black text-lg py-4 rounded-xl shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span className="text-2xl">✓</span>
                <span>Instalar App Ahora</span>
              </button>
              <button
                onClick={handleDismiss}
                className="w-full text-white/80 hover:text-white font-semibold text-base py-3 active:scale-95 transition-all"
              >
                Quizás más tarde
              </button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-white/5 px-6 py-3 text-center border-t border-white/10">
            <p className="text-xs text-white/60">
              Gratis • Sin anuncios • 100% seguro
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

