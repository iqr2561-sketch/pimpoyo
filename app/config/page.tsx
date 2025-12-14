'use client'

import React, { useState, useEffect } from 'react'
import { Save, Settings, Phone, FileText } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getConfig, saveConfig, getDefaultConfig, AppConfig } from '@/lib/storage'
import AuthGuard from '@/components/auth/AuthGuard'

export default function ConfigPage() {
  const [config, setConfig] = useState<AppConfig>(getDefaultConfig())
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = getConfig()
    if (stored) {
      setConfig(stored)
    }
  }, [])

  const handleSave = () => {
    saveConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateAfip = (field: keyof AppConfig['afip'], value: string) => {
    setConfig((prev) => ({
      ...prev,
      afip: {
        ...prev.afip,
        [field]: value,
      },
    }))
  }

  const updateWhatsapp = (field: keyof AppConfig['whatsapp'], value: string) => {
    setConfig((prev) => ({
      ...prev,
      whatsapp: {
        ...prev.whatsapp,
        [field]: value,
      },
    }))
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center space-x-2">
            <Settings className="w-6 h-6" />
            <span>Configuración</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Configura la API de AFIP y WhatsApp para facturación
          </p>
        </div>

        <div className="space-y-6">
          {/* Configuración AFIP */}
          <div className="bg-slate-800/40 rounded-lg p-6 border border-slate-700/30">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Configuración AFIP</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="CUIT"
                type="text"
                placeholder="20-12345678-9"
                value={config.afip.cuit}
                onChange={(e) => updateAfip('cuit', e.target.value)}
              />
              <Input
                label="Ruta del Certificado"
                type="text"
                placeholder="/ruta/al/certificado.crt"
                value={config.afip.certPath}
                onChange={(e) => updateAfip('certPath', e.target.value)}
              />
              <Input
                label="Ruta de la Clave Privada"
                type="text"
                placeholder="/ruta/a/la/clave.key"
                value={config.afip.keyPath}
                onChange={(e) => updateAfip('keyPath', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Ambiente
                </label>
                <select
                  value={config.afip.environment}
                  onChange={(e) => updateAfip('environment', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                >
                  <option value="testing">Testing</option>
                  <option value="production">Producción</option>
                </select>
              </div>
              <Input
                label="Punto de Venta"
                type="text"
                placeholder="1"
                value={config.afip.pointOfSale}
                onChange={(e) => updateAfip('pointOfSale', e.target.value)}
              />
            </div>
          </div>

          {/* Configuración WhatsApp */}
          <div className="bg-slate-800/40 rounded-lg p-6 border border-slate-700/30">
            <div className="flex items-center space-x-2 mb-4">
              <Phone className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Configuración WhatsApp</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Número de WhatsApp"
                type="tel"
                placeholder="5491123456789"
                value={config.whatsapp.number}
                onChange={(e) => updateWhatsapp('number', e.target.value)}
                helperText="Formato: código de país + código de área + número (sin espacios ni guiones)"
              />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Plantilla de Mensaje
                </label>
                <textarea
                  value={config.whatsapp.messageTemplate}
                  onChange={(e) => updateWhatsapp('messageTemplate', e.target.value)}
                  placeholder="Hola! Tu factura está lista. Total: {total}"
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all min-h-[100px] resize-y"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Variables disponibles: {'{total}'}, {'{clientName}'}, {'{invoiceNumber}'}
                </p>
              </div>
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleSave}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saved ? 'Guardado!' : 'Guardar Configuración'}</span>
            </Button>
          </div>
        </div>
      </div>
      </div>
    </AuthGuard>
  )
}
