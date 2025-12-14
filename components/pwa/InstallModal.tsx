'use client'

import React, { useState, useEffect } from 'react'
import { Download, X, Smartphone, Share2 } from 'lucide-react'
import { Button } from '../ui/Button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallModalProps {
  isOpen: boolean
  onClose: () => void
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    // Detectar si es iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(iOS)

    // Detectar si ya está instalada
    const standalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(standalone)

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [isOpen])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        onClose()
      }
      
      setDeferredPrompt(null)
    }
  }

  if (!isOpen || isStandalone) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-md border border-slate-700 shadow-xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Instalar App
                </h2>
                <p className="text-sm text-slate-400">
                  Para acceso rápido y uso sin conexión
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {isIOS ? (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Share2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white mb-2">
                      Instrucciones para iOS:
                    </p>
                    <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
                      <li>Toca el botón <strong>Compartir</strong> en la barra inferior</li>
                      <li>Selecciona <strong>"Agregar a pantalla de inicio"</strong></li>
                      <li>Confirma la instalación</li>
                    </ol>
                  </div>
                </div>
              </div>
            ) : deferredPrompt ? (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  Haz clic en el botón de abajo para instalar la aplicación en tu dispositivo.
                </p>
              </div>
            ) : (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  Tu navegador no soporta la instalación automática. Busca la opción de "Instalar" en el menú de tu navegador.
                </p>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                variant="ghost"
                onClick={onClose}
                className="flex-1"
              >
                Más tarde
              </Button>
              {deferredPrompt && !isIOS && (
                <Button
                  variant="primary"
                  onClick={handleInstallClick}
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar Ahora</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
