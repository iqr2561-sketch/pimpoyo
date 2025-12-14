'use client'

import React, { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detectar si es iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(iOS)

    // Detectar si ya está instalada
    const standalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(standalone)

    // Si ya está instalada, no mostrar el prompt
    if (standalone) {
      return
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Mostrar prompt después de un delay en móvil
    if (iOS || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      const timer = setTimeout(() => {
        if (!standalone && !deferredPrompt) {
          setShowPrompt(true)
        }
      }, 3000)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [deferredPrompt])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setShowPrompt(false)
      }
      
      setDeferredPrompt(null)
    } else if (isIOS) {
      // Instrucciones para iOS
      alert('Para instalar en iOS:\n1. Toca el botón Compartir\n2. Selecciona "Agregar a pantalla de inicio"')
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Guardar en localStorage para no mostrar de nuevo hoy
    localStorage.setItem('pwa-install-dismissed', new Date().toDateString())
  }

  // No mostrar si ya está instalada o si fue descartado hoy
  if (isStandalone || !showPrompt) {
    return null
  }

  const dismissedToday = localStorage.getItem('pwa-install-dismissed') === new Date().toDateString()
  if (dismissedToday && !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80 animate-in slide-in-from-bottom-5">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white mb-1">
              Instalar App
            </h3>
            <p className="text-xs text-slate-400">
              Instala la app para acceso rápido y uso sin conexión
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-2 p-1 text-slate-500 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleInstallClick}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Instalar Ahora</span>
        </button>
        {isIOS && (
          <p className="text-[10px] text-slate-500 mt-2 text-center">
            Toca el botón Compartir y selecciona "Agregar a pantalla de inicio"
          </p>
        )}
      </div>
    </div>
  )
}
